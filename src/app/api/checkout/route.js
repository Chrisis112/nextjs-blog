import { authOptions } from "../libs/authOptions";
import { MenuItem } from "@/models/MenuItem";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { generateOrderNumber } from "../libs/orderUtils";
import { UserInfo } from "@/models/UserInfo";
const stripe = require('stripe')(process.env.STRIPE_SK);

// Универсальная функция для вытягивания текста нужного языка из мультиязычного объекта или строки
function getLocalizedText(field, currentLang = 'ru') {
  if (!field) return '';
  return typeof field === 'string'
    ? field
    : (field[currentLang] || field['ru'] || '');
}

export async function POST(req) {
  await mongoose.connect(process.env.MONGO_URL);

const { cartProducts, address, location } = await req.json();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const orderNumber = await generateOrderNumber();

  const orderDoc = await Order.create({
    userEmail,
    ...address,
    location,
    cartProducts,
    paid: false,
    orderNumber,
  });

  console.log('Order created:', orderDoc._id);

  const stripeLineItems = [];
  const currentLang = 'ru';

for (const cartProduct of cartProducts) {
  const productInfo = await MenuItem.findById(cartProduct._id);
  
  let productPrice = productInfo.basePrice;

  if (cartProduct.size) {
    const size = productInfo.sizes.find(size => size._id.toString() === cartProduct.size._id.toString());
    if (size) productPrice += size.price;
  }
  
  if (cartProduct.extras?.length > 0) {
    for (const cartProductExtraThing of cartProduct.extras) {
      const extraThingInfo = productInfo.extraIngredientPrices.find(extra => extra._id.toString() === cartProductExtraThing._id.toString());
      if (extraThingInfo) productPrice += extraThingInfo.price;
    }
  }

  let productName = getLocalizedText(cartProduct.name, currentLang);

  // Проверяем и применяем fallback
  if (!productName || productName.trim().length === 0) {
    productName = getLocalizedText(productInfo.name, currentLang) || 'Product';
  }

  stripeLineItems.push({
    quantity: 1,
    price_data: {
      currency: 'EUR',
      product_data: { name: productName },
      unit_amount: Math.round(productPrice * 100),
    },
  });
}

  const stripeSession = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: 'payment',
    customer_email: userEmail,
    success_url: `${process.env.NEXTAUTH_URL}/orders/${orderDoc._id.toString()}?clear-cart=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart?canceled=1`,
    metadata: { orderId: orderDoc._id.toString() },
    payment_intent_data: {
      metadata: { orderId: orderDoc._id.toString() },
    },
  });

  // Исправленный возврат с JSON и заголовками
  return new Response(JSON.stringify({ url: stripeSession.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
