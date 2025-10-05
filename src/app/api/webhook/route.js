import mongoose from "mongoose";
import { Order } from "@/models/Order";
import { UserInfo } from "@/models/UserInfo";
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
  // Подключаемся к MongoDB, если еще не подключены
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
      const updatedUser = await UserInfo.findOneAndUpdate(
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
    }
  }

  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
