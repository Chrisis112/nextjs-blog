import { model, models, Schema } from "mongoose";

const UserInfoSchema = new Schema({
  email: { type: String, required: true },
  phone: { type: String },
  admin: { type: Boolean, default: false },
  seller: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
  fcmTokens: { type: [String], default: [] },
  location: { type: String, default: '' }

}, { timestamps: true });

export const UserInfo = models?.UserInfo || model('UserInfo', UserInfoSchema);
