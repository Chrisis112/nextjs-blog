import { isAdmin } from "@/app/api/libs/auth";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  const { name } = await req.json();

  if (!(await isAdmin())) {
    return Response.json({}, { status: 401 });
  }

  // Ожидаем: name = { ru?: string, en?: string, et?: string }
  if (!name || !Object.values(name).some((v) => v?.trim())) {
    return Response.json(
      { error: "At least one language name (ru/en/et) is required" },
      { status: 400 }
    );
  }

  const categoryDoc = await Category.create({ name });
  return Response.json(categoryDoc);
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const { _id, name } = await req.json();

  if (!(await isAdmin())) {
    return Response.json({}, { status: 401 });
  }

  if (!name || !Object.values(name).some((v) => v?.trim())) {
    return Response.json(
      { error: "At least one language name (ru/en/et) is required" },
      { status: 400 }
    );
  }

  await Category.updateOne({ _id }, { name });
  return Response.json(true);
}

export async function GET() {
  mongoose.connect(process.env.MONGO_URL);
  const categories = await Category.find();
  return Response.json(categories);
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  if (!(await isAdmin())) {
    return Response.json({}, { status: 401 });
  }

  await Category.deleteOne({ _id });
  return Response.json(true);
}