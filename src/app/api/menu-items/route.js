import { isAdmin } from "@/app/api/libs/auth";
import { MenuItem } from "@/models/MenuItem";
import mongoose from "mongoose";

function validateCategory(category) {
  if (!category || typeof category !== "string" || category.trim().length === 0) {
    return "Category is required and must be a valid ObjectId string";
  }
  if (!mongoose.Types.ObjectId.isValid(category.trim())) {
    return "Category is not a valid ObjectId";
  }
  return null;
}

function normalizeMultilangFields(data) {
  if (typeof data.name === "string") {
    data.name = { ru: data.name, en: "", et: "" };
  }
  if (typeof data.description === "string") {
    data.description = { ru: data.description, en: "", et: "" };
  }
  return data;
}

export async function POST(req) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }

  let data = await req.json();

  if (!(await isAdmin())) {
    return Response.json({}, { status: 401 });
  }

  data = normalizeMultilangFields(data);

  const categoryError = validateCategory(data.category);
  if (categoryError) {
    return Response.json({ error: categoryError }, { status: 400 });
  }

  const menuItemDoc = await MenuItem.create(data);
  return Response.json(menuItemDoc);
}

export async function PUT(req) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }

  if (!(await isAdmin())) {
    return Response.json({}, { status: 401 });
  }

  const { _id, ...dataRaw } = await req.json();
  const data = normalizeMultilangFields(dataRaw);

  const categoryError = validateCategory(data.category);
  if (categoryError) {
    return Response.json({ error: categoryError }, { status: 400 });
  }

  await MenuItem.findByIdAndUpdate(_id, data);
  return Response.json(true);
}

export async function GET() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }
  const menuItems = await MenuItem.find();
  return Response.json(menuItems);
}

export async function DELETE(req) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  if (!(await isAdmin())) {
    return Response.json({}, { status: 401 });
  }

  await MenuItem.deleteOne({ _id });
  return Response.json(true);
}