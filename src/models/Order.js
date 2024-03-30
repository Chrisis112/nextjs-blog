import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  userEmail: String,
  phone: String,
  streetAddress: String,
  postalCode: String,
  city: String,
  country: String,
  cartProducts: Object,
  orderNumber: {type:Number, required: true},
  paid: {type: Boolean, default: false},
  orderPoints: {type:Number, required: false},
}, {timestamps: true});

export const Order = models?.Order || model('Order', OrderSchema);