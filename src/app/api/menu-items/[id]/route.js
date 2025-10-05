import mongoose from 'mongoose';
import { MenuItem } from '@/models/MenuItem';

export async function GET(req) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }

  const { params } = req;
  const id = params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response('Invalid ID', { status: 400 });
  }

  const item = await MenuItem.findById(id);
  if (!item) {
    return new Response('Not Found', { status: 404 });
  }

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
