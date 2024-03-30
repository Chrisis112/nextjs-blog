import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {MenuItem} from "@/models/MenuItem";
import {Order} from "@/models/Order";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
const stripe = require('stripe')(process.env.STRIPE_SK);


export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  console.log (req.headers)
  async function generateOrderNumber() {
    try {
        const lastOrder = await Order.findOne().sort({ _id: -1 }).exec();
        const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;
        return orderNumber > 99 ? 1 : orderNumber;
    } catch (error) {
        console.error('Error generating order number:', error);
        throw error;
    }
}
module.exports = generateOrderNumber;

  const {cartProducts, address} = await req.json();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const userPhone = session?.user?.phone;

  const orderDoc = await Order.create({
    userEmail,
    ...address,
    cartProducts,
    paid: false, 
    orderNumber: await generateOrderNumber(),
  });

  const stripeLineItems = [];
  for (const cartProduct of cartProducts) {

    const productInfo = await MenuItem.findById(cartProduct._id);

    let productPrice = productInfo.basePrice;
    if (cartProduct.size) {
      const size = productInfo.sizes
        .find(size => size._id.toString() === cartProduct.size._id.toString());
      productPrice += size.price;
    }
    if (cartProduct.extras?.length > 0) {
      for (const cartProductExtraThing of cartProduct.extras) {
        const productExtras = productInfo.extraIngredientPrices;
        const extraThingInfo = productExtras
          .find(extra => extra._id.toString() === cartProductExtraThing._id.toString());
        productPrice += extraThingInfo.price;
      }
    }

    const productName = cartProduct.name;

    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: 'EUR',
        product_data: {
          name: productName,
        },
        unit_amount: productPrice * 100,
      },
    });
  }
  
  const stripeSession = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: 'payment',
    customer_email: userEmail,
    customer_phone:userPhone,
    success_url: process.env.NEXTAUTH_URL + 'orders/' + orderDoc._id.toString() + '?clear-cart=1',
    cancel_url: process.env.NEXTAUTH_URL + 'cart?canceled=1',
    metadata: {orderId:orderDoc._id.toString()},
    payment_intent_data: {
      metadata:{orderId:orderDoc._id.toString()},
    },
  });
  async function getUserPoints(userEmail) {
    try {
        const user = await UserInfo.findOne({ email: userEmail }); 
        if (user) {
            return user.points;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error retrieving user points:', error);
        throw new Error('Failed to retrieve user points');
    }
}
async function updateUserPoints(userEmail, newPoints) {
  try {
      // Assuming you're using some ORM or database library like Prisma, Sequelize, or plain SQL
      const user = await UserInfo.findOne({ email: userEmail });
      if (!user) {
          user.points = newPoints;
          await user.save(); // Save updated user points to the database
      } else {
          throw new Error('User not found');
      }
  } catch (error) {
      console.error('Error updating user points:', error);
      throw new Error('Failed to update user points');
  }
}
  

  return Response.json(stripeSession.url);
}