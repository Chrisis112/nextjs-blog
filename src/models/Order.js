import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  uuserEmail: {String, required: false},
  phone: {String, required: false},
  streetAddress: {String, required: false},
  postalCode: {String, required: false},
  cartProducts: Object, required: false,
  orderNumber: {type:Number, required: true},
  paid: {type: Boolean, default: false},
  orderPoints: {type:Number, required: false},
}, {timestamps: true});

export const Order = models?.Order || model('Order', OrderSchema);
