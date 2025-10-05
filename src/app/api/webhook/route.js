import mongoose from "mongoose";
import { Order } from "@/models/Order";
import { UserInfo } from "@/models/UserInfo";
import Pusher from 'pusher';
import admin from 'firebase-admin';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const stripe = require('stripe')(process.env.STRIPE_SK);

async function sendFirebaseNotifications(order, tokens) {
  if (!tokens?.length) return;

  const message = {
    notification: {
      title: 'Новый заказ',
      body: `Заказ №${order.orderNumber} ожидает обработки`,
    },
    tokens: tokens,
    data: {
      orderId: order._id.toString(),
    },
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log(`Firebase push sent: ${response.successCount} messages sent successfully.`);
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`Failed to send to token ${tokens[idx]}:`, resp.error);
        }
      });
    }
  } catch (error) {
    console.error('Error sending Firebase push:', error);
  }
}

export async function POST(req) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }

  const sig = req.headers.get('stripe-signature');
  let event;

  try {
    const reqBuffer = await req.text();
    const signSecret = process.env.STRIPE_SIGN_SECRET;
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
  } catch (e) {
    console.error('stripe error:', e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (event.type === 'checkout.session.completed') {
    const orderId = event?.data?.object?.metadata?.orderId;
    const isPaid = event?.data?.object?.payment_status === 'paid';
    const userEmail = event?.data?.object?.customer_email;

    if (!orderId || !userEmail) {
      return new Response(JSON.stringify({ error: "Missing orderId or userEmail" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await UserInfo.findOne({ email: userEmail });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const paymentAmount = event?.data?.object?.amount_total / 100; // из центов в евро
    const pointsEarned = Math.floor(paymentAmount);

    if (isPaid) {
      await Order.updateOne({ _id: orderId }, { paid: true });
      await UserInfo.findOneAndUpdate(
        { _id: user._id },
        { $inc: { points: pointsEarned } },
        { new: true }
      );

      const updatedOrder = await Order.findById(orderId);

      try {
        await pusher.trigger('orders-channel', 'order-paid', { order: updatedOrder });
        console.log('Pusher event "order-paid" sent');
      } catch (err) {
        console.error('Pusher trigger error:', err);
      }

      const sellers = await UserInfo.find({ seller: true, fcmTokens: { $exists: true, $ne: [] } });
      const allFcmTokens = sellers.flatMap(seller => seller.fcmTokens || []);

      await sendFirebaseNotifications(updatedOrder, allFcmTokens);
    }
  }

  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
