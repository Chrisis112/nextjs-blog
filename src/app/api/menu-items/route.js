import { isAdmin } from "@/app/api/libs/auth";
import { MenuItem } from "@/models/MenuItem";
import mongoose from "mongoose";

function normalizeMultilangFields(data) {
  if (typeof data.name === 'string') {
    data.name = { ru: data.name, en: '', et: '' };
  }
  if (typeof data.description === 'string') {
    data.description = { ru: data.description, en: '', et: '' };
  }
  return data;
}

export async function POST(req) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }
  let data = await req.json();
  if (await isAdmin()) {
    data = normalizeMultilangFields(data);
    const menuItemDoc = await MenuItem.create(data);
    return Response.json(menuItemDoc);
  } else {
    return Response.json({});
  }
}

export async function PUT(req) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }
  if (await isAdmin()) {
    const { _id, ...dataRaw } = await req.json();
    const data = normalizeMultilangFields(dataRaw);
    await MenuItem.findByIdAndUpdate(_id, data);
  }
  return Response.json(true);
}

export async function GET() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }
  return Response.json(await MenuItem.find());
}

export async function DELETE(req) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await MenuItem.deleteOne({ _id });
  }
  return Response.json(true);
}
