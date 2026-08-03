import { dbConnect } from "@/lib/db";
import { Order } from "@/models";
import type { IOrder, OrderStatus } from "@/types/models";

export interface PublicOrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface PublicOrder {
  _id: string;
  items: PublicOrderItem[];
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  paymentStatus: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
  cancelReason: string | null;
  paidAt: string | null;
  deliveredAt: string | null;
  shippingAddress: {
    fullName: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  createdAt: string;
}

type LeanOrder = Omit<IOrder, "user"> & {
  _id: { toString(): string };
  createdAt: Date;
};

/** Maps legacy statuses (e.g. "Paid") onto the current flow on read. */
function normalizeStatus(status: string): OrderStatus {
  if (status === "Paid" || status === "Confirmed") return "Confirmed";
  if (
    status === "Pending" ||
    status === "Packed" ||
    status === "Shipped" ||
    status === "Delivered" ||
    status === "Cancelled"
  ) {
    return status;
  }
  return "Pending";
}

export async function getUserOrders(userId: string): Promise<PublicOrder[]> {
  await dbConnect();

  const docs = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  return (docs as unknown as LeanOrder[]).map((order) => ({
    _id: order._id.toString(),
    items: order.orderItems.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image ?? null,
    })),
    itemsPrice: order.itemsPrice,
    shippingPrice: order.shippingPrice,
    totalPrice: order.totalPrice,
    orderStatus: normalizeStatus(order.orderStatus),
    paymentStatus: order.paymentInfo?.status ?? "pending",
    trackingNumber: order.trackingNumber ?? null,
    trackingUrl: order.trackingUrl ?? null,
    cancelReason: order.cancelReason ?? null,
    paidAt: order.paidAt ? order.paidAt.toISOString() : null,
    deliveredAt: order.deliveredAt ? order.deliveredAt.toISOString() : null,
    shippingAddress: {
      fullName: order.shippingAddress.fullName,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      pincode: order.shippingAddress.pincode,
      country: order.shippingAddress.country,
    },
    createdAt: order.createdAt.toISOString(),
  }));
}
