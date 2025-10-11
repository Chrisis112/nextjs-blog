import { Order } from "@/models/Order";
import { UserInfo } from "@/models/UserInfo";
import Pusher from "pusher";
import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";



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
}

// Инициализация Firebase Admin SDK
let firebaseInitialized = false;
if (missingEnvs.length === 0 && !admin.apps.length) {
  try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
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
  if (!firebaseInitialized) {
    console.error("Firebase not initialized, skipping notifications");
    return;
  }

  if (!tokens?.length) {
    console.log("No tokens provided, skipping notifications");
    return;
  }

  const validTokens = tokens.filter(token => typeof token === "string" && token.trim().length > 0);

  if (validTokens.length === 0) {
    console.log("No valid tokens found");
    return;
  }

  const message = {
    tokens: validTokens,
    notification: {
      title: "Новый заказ",
      body: `Заказ №${order.orderNumber} ожидает обработки`,
    },
    data: {
      orderId: order._id.toString(),
      location: JSON.stringify(order.location),
    },
    android: {
      notification: {
        sound: 'default',
        click_action: 'FLUTTER_NOTIFICATION_CLICK', // или ваша логика
      },
    },
    webpush: {
      headers: {
        Urgency: 'high',
      },
      notification: {
        sound: 'default',
        requireInteraction: 'true',
      },
    },
  };

  try {
    const response = await getMessaging().sendEachForMulticast(message)

    console.log(`Firebase push sent: ${response.successCount} messages sent successfully.`);

    if (response.failureCount > 0) {
      const invalidTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code || "";
          console.error(`Failed to send to token ${validTokens[idx].slice(0, 20)}...:`, errorCode);

          if (
            errorCode === "messaging/registration-token-not-registered" ||
            errorCode === "messaging/invalid-registration-token" ||
            errorCode === "messaging/invalid-argument"
          ) {
            invalidTokens.push(validTokens[idx]);
          }
        }
      });

      if (invalidTokens.length > 0) {
        await UserInfo.updateMany(
          { fcmTokens: { $in: invalidTokens } },
          { $pull: { fcmTokens: { $in: invalidTokens } } }
        );
        console.log(`Removed ${invalidTokens.length} invalid tokens from database`);
      }
    }
  } catch (error) {
    console.error("Error sending Firebase push:", error.code || error.message);
  }
}


export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  let event;

  try {
    const reqBuffer = await req.text();
    const signSecret = process.env.STRIPE_SIGN_SECRET;
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
  } catch (e) {
    console.error('stripe error');
    return Response.json(e, {status: 400});
  }

  if (event.type === 'checkout.session.completed') {
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
    }

    const paymentAmount = event?.data?.object?.amount_total / 100;
    const pointsEarned = Math.floor(paymentAmount);

    if (isPaid) {
      // Обновляем заказ и начисляем бонусы (ИСПРАВЛЕНО: user._id вместо user)
      await Order.updateOne({_id: orderId}, { paid: true });
      await UserInfo.updateOne({_id: user._id}, { $inc: { points: pointsEarned } });

      // Получаем обновленный заказ из базы
      const updatedOrder = await Order.findById(orderId);
      console.log("Order updated successfully:", updatedOrder.orderNumber);
      
      const orderLocations = Array.isArray(updatedOrder.location)
        ? updatedOrder.location
        : [updatedOrder.location];

      console.log("Looking for sellers with seller:true and location in:", orderLocations);

      // ОДИН запрос к базе для получения продавцов
      const sellers = await UserInfo.find({
        seller: true,
        location: { $in: orderLocations },
      });

      console.log(`Found ${sellers.length} sellers matching location`);

      // Отправляем Pusher уведомления
      try {
        for (const seller of sellers) {
await pusher.trigger(`orders-channel-${seller.email}`, "order-paid", { order: updatedOrder });

  console.log(`Pusher notification sent to seller: ${seller.email}`);
        }
        console.log("All Pusher notifications sent successfully");
      } catch (err) {
        console.error("Pusher notification failed:", err.message);
      }

      // Отправляем Firebase уведомления (только тем, у кого есть токены)
      try {
        const sellersWithTokens = sellers.filter(seller => 
          seller.fcmTokens && seller.fcmTokens.length > 0
        );
        
        const allFcmTokens = sellersWithTokens.flatMap(seller => seller.fcmTokens || []);
        console.log(`Found ${sellersWithTokens.length} sellers with ${allFcmTokens.length} FCM tokens`);

        if (allFcmTokens.length > 0) {
          console.log("Sending Firebase notifications");
          await sendFirebaseNotifications(updatedOrder, allFcmTokens);
        } else {
          console.log("No FCM tokens found for notification, skipping Firebase");
        }
      } catch (error) {
        console.error("Error sending Firebase notifications:", error);
      }
    }
  }

  return Response.json('ok', {status: 200});
}
