import { authOptions } from "../libs/authOptions";
import { isAdmin, isSeller } from "@/app/api/libs/auth";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function GET(req) {
  // Подключаемся к MongoDB, если еще не подключены
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();
  const seller = await isSeller();

  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');

  // Проверка валидности _id
  if (_id) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return new Response('Invalid order ID', { status: 400 });
    }
    const order = await Order.findById(_id);
    if (order) return new Response(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    return new Response('Order not found', { status: 404 });
  }

  let orders = [];
  if (seller || admin) {
    orders = await Order.find().sort({ createdAt: -1 });
  } else if (userEmail) {
    orders = await Order.find({ userEmail }).sort({ createdAt: -1 });
  } else {
    return new Response('Unauthorized', { status: 403 });
  }

  return new Response(JSON.stringify(orders), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
