import {Order} from "@/models/Order";
import { UserInfo } from "@/models/UserInfo";



const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  let event;
  

  try {
    const reqBuffer = await req.text();
    const signSecret = process.env.STRIPE_SIGN_SECRET;
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
  } catch (e) {
    console.error('stripe error');
    console.log(e);
    return Response.json(e, {status: 400});
    
  }

  if (event.type === 'checkout.session.completed') {
    console.log(event);
   
    const orderId = event?.data?.object?.metadata?.orderId;
    const isPaid = event?.data?.object?.payment_status === 'paid';
    const userEmail = event?.data?.object?.customer_email;
    const user = await UserInfo.findOne({ email: userEmail });
    if (isPaid) {
      
      await Order.updateOne({_id:orderId}, {paid:true});
      await UserInfo.updateOne( {_id:user},{ $inc: { points: 1 } }, { new: true });
    }
  }

  return Response.json('ok', {status: 200});
}