import mongoose from "mongoose";
import { Order } from "@/models/Order";
import { UserInfo } from "@/models/UserInfo";
import Pusher from "pusher";
import admin from "firebase-admin";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// Проверка обязательных Firebase env variables
const requiredFirebaseEnvs = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];
const missingEnvs = requiredFirebaseEnvs.filter((env) => !process.env[env]);
if (missingEnvs.length > 0) {
  console.error("Missing Firebase environment variables:", missingEnvs);
} else {
  console.log("All Firebase environment variables present");
  console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
  console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
  console.log(
    "FIREBASE_PRIVATE_KEY length:",
    process.env.FIREBASE_PRIVATE_KEY?.length
  );
  console.log(
    "FIREBASE_PRIVATE_KEY preview:",
    process.env.FIREBASE_PRIVATE_KEY?.slice(0, 50)
  );
}

// Инициализация Firebase Admin SDK
let firebaseInitialized = false;
if (missingEnvs.length === 0 && !admin.apps.length) {
  try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Уберем начальные и конечные кавычки, если есть
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }

    // Правильно заменяем экранированные переносы строк
    privateKey = privateKey.replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    firebaseInitialized = true;
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    firebaseInitialized = false;
  }
}

const stripe = require("stripe")(process.env.STRIPE_SK);

// Функция отправки пуш-уведомлений через Firebase
async function sendFirebaseNotifications(order, tokens) {
  console.log("sendFirebaseNotifications called with", tokens.length, "tokens");

  if (!firebaseInitialized) {
    console.error("Firebase not initialized, skipping notifications");
    return;
  }

  if (!tokens?.length) {
    console.log("No tokens provided, skipping notifications");
    return;
  }

  const message = {
    notification: {
      title: "Новый заказ",
      body: `Заказ №${order.orderNumber} ожидает обработки`,
    },
    data: {
      orderId: order._id.toString(),
    },
  };

  try {
    if (!admin.messaging) {
      console.error("Firebase messaging not available");
      return;
    }

    // Отфильтровываем корректные токены
    const validTokens = tokens.filter(
      (token) => token && typeof token === "string" && token.trim().length > 0
    );
    if (validTokens.length === 0) {
      console.log("No valid tokens found");
      return;
    }
    console.log(`Sending to ${validTokens.length} valid tokens`);

    if (typeof admin.messaging().sendEachForMulticast === "function") {
      const response = await admin.messaging().sendEachForMulticast({
        ...message,
        tokens: validTokens,
      });
      console.log(
        `Firebase push sent: ${response.successCount} messages sent successfully.`
      );
      if (response.failureCount > 0) {
        console.log(`${response.failureCount} messages failed to send`);
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.error(
              `Failed to send to token ${validTokens[idx].slice(0, 20)}...:`,
              resp.error?.code || resp.error
            );
          }
        });
      }
    } else if (typeof admin.messaging().sendMulticast === "function") {
      const response = await admin.messaging().sendMulticast({
        ...message,
        tokens: validTokens,
      });
      console.log(
        `Firebase push sent: ${response.successCount} messages sent successfully.`
      );
      if (response.failureCount > 0) {
        console.log(`${response.failureCount} messages failed to send`);
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.error(
              `Failed to send to token ${validTokens[idx].slice(0, 20)}...: `,
              resp.error?.code || resp.error
            );
          }
        });
      }
    } else {
      // fallback: отправка по одному токену
      console.log("Using individual send method");
      let successCount = 0;
      let failureCount = 0;
      for (const token of validTokens) {
        try {
          await admin.messaging().send({
            ...message,
            token,
          });
          successCount++;
          console.log(`Firebase push sent to token: ${token.slice(0, 20)}...`);
        } catch (err) {
          failureCount++;
          console.error(
            `Failed to send to token ${token.slice(0, 20)}...: `,
            err.code || err.message
          );
        }
      }
      console.log(
        `Individual send completed: ${successCount} success, ${failureCount} failures`
      );
    }
  } catch (error) {
    console.error("Error sending Firebase push:", error.code || error.message);
  }
}

export async function POST(req) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const sig = req.headers.get("stripe-signature");
    const signSecret = process.env.STRIPE_SIGN_SECRET;

    // raw body в buffer для Stripe webhook
    const reqBuffer = Buffer.from(await req.arrayBuffer());

    let event;
    try {
      event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
    } catch (e) {
      console.error("Stripe webhook verification failed:", e.message);
      return new Response(
        JSON.stringify({ error: e.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (event.type === "checkout.session.completed") {
      const orderId = event?.data?.object?.metadata?.orderId;
      const isPaid = event?.data?.object?.payment_status === "paid";
      const userEmail = event?.data?.object?.customer_details?.email;

      console.log("Processing checkout.session.completed:", {
        orderId,
        isPaid,
        userEmail,
      });

      if (!orderId || !userEmail) {
        console.error("Missing orderId or userEmail:", { orderId, userEmail });
        return new Response(
          JSON.stringify({ error: "Missing orderId or userEmail" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const user = await UserInfo.findOne({ email: userEmail });
      if (!user) {
        console.error("User not found:", userEmail);
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      const paymentAmount = event?.data?.object?.amount_total / 100;
      const pointsEarned = Math.floor(paymentAmount);

      if (isPaid) {
        await Order.updateOne({ _id: orderId }, { paid: true });
        await UserInfo.findOneAndUpdate(
          { _id: user._id },
          { $inc: { points: pointsEarned } },
          { new: true }
        );

        const updatedOrder = await Order.findById(orderId);
        console.log("Order updated successfully:", updatedOrder.orderNumber);

        try {
          await pusher.trigger("orders-channel", "order-paid", {
            order: updatedOrder,
          });
          console.log("Pusher notification sent successfully");
        } catch (err) {
          console.error("Pusher notification failed:", err.message);
        }

        try {
          const sellers = await UserInfo.find({
            seller: true,
            fcmTokens: { $exists: true, $ne: [] },
          });

          const allFcmTokens = sellers.flatMap((seller) => seller.fcmTokens || []);
          console.log(
            `Found ${sellers.length} sellers with ${allFcmTokens.length} total FCM tokens`
          );

          if (allFcmTokens.length > 0) {
            await sendFirebaseNotifications(updatedOrder, allFcmTokens);
          } else {
            console.log("No FCM tokens found, skipping Firebase notifications");
          }
        } catch (error) {
          console.error("Error in Firebase notification process:", error);
        }
      }
    }

    return new Response(
      JSON.stringify({ status: "ok" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const dynamic = "force-dynamic";
