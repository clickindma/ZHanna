import type { Types } from "mongoose";

export type UserRole = "customer" | "admin";

export interface IAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  addresses: IAddress[];
  wishlist: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: Types.ObjectId | string | null;
  isActive: boolean;
  createdAt?: Date;
}

export type Material =
  | "Artificial Gold"
  | "Silver"
  | "Oxidized"
  | "Diamond-like"
  | "Gold Plated"
  | "Rhodium Plated"
  | "Copper"
  | "Alloy";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  category: Types.ObjectId | string;
  materials: Material[];
  stock: number;
  sku: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  tags: string[];
  weight?: string;
  sizeOptions: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface IOrderItem {
  product: Types.ObjectId | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IPaymentInfo {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: PaymentStatus;
}

export interface IOrder {
  user?: Types.ObjectId | string | null;
  orderItems: IOrderItem[];
  shippingAddress: IAddress;
  paymentInfo: IPaymentInfo;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  trackingUrl?: string;
  adminNotes?: string;
  cancelReason?: string;
  paidAt?: Date | null;
  deliveredAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type WithId<T> = T & { _id: Types.ObjectId };

export type UserDocument = WithId<IUser> & { createdAt: Date; updatedAt: Date };
export type CategoryDocument = WithId<ICategory> & { createdAt: Date };
export type ProductDocument = WithId<IProduct> & {
  createdAt: Date;
  updatedAt: Date;
};
export type OrderDocument = WithId<IOrder> & { createdAt: Date; updatedAt: Date };
