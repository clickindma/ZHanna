import { model, models, Schema, type Model } from "mongoose";
import type {
  IAddress,
  IOrder,
  IOrderItem,
  IPaymentInfo,
  OrderStatus,
  PaymentStatus,
} from "@/types/models";

const addressSchema = new Schema<IAddress>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: "India", trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    image: { type: String },
  },
  { _id: false }
);

const paymentInfoSchema = new Schema<IPaymentInfo>(
  {
    razorpayOrderId: { type: String, trim: true },
    razorpayPaymentId: { type: String, trim: true },
    razorpaySignature: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"] as PaymentStatus[],
      default: "pending",
    },
  },
  { _id: false }
);

const orderStatuses: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },
    shippingAddress: { type: addressSchema, required: true },
    paymentInfo: { type: paymentInfoSchema, default: () => ({}) },
    itemsPrice: { type: Number, required: true, min: 0 },
    shippingPrice: { type: Number, default: 0, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    orderStatus: {
      type: String,
      enum: orderStatuses,
      default: "Pending",
    },
    trackingNumber: {
      type: String,
      trim: true,
      default: undefined,
    },
    trackingUrl: {
      type: String,
      trim: true,
      default: undefined,
    },
    adminNotes: {
      type: String,
      trim: true,
      default: undefined,
    },
    cancelReason: {
      type: String,
      trim: true,
      default: undefined,
    },
    paidAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });

export const Order: Model<IOrder> =
  (models.Order as Model<IOrder> | undefined) ??
  model<IOrder>("Order", orderSchema);

export default Order;
