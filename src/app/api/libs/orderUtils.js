import { Order } from "@/models/Order";

export async function generateOrderNumber() {
  const lastOrder = await Order.findOne().sort({ _id: -1 }).exec();
  const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;
  return orderNumber > 99 ? 1 : orderNumber;
}
