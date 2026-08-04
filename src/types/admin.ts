import type { OrderStatus, PaymentStatus, UserRole } from "./models";

export interface AdminProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  shortDescription?: string;
  description: string;
  materials: string[];
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
  category: { _id: string; name: string; slug: string } | null;
  createdAt: string;
}

export interface AdminCategory {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  productCount: number;
}

export interface AdminOrderItem {
  product: string | null;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface AdminOrderShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface AdminOrder {
  _id: string;
  user: { _id: string; name: string; email: string } | null;
  items: AdminOrderItem[];
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  trackingNumber: string | null;
  trackingUrl: string | null;
  adminNotes: string | null;
  cancelReason: string | null;
  paymentStatus: PaymentStatus;
  paymentRef: string | null;
  paidAt: string | null;
  deliveredAt: string | null;
  shippingAddress: AdminOrderShippingAddress;
  createdAt: string;
}

export interface AdminCustomer {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockProducts: number;
  ordersByStatus: Record<OrderStatus, number>;
}

export interface AdminLowStockProduct {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  image: string | null;
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const FULFILMENT_FLOW: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
];

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

/** Legacy statuses that map onto the current flow when read back. */
export const LEGACY_STATUS_MAP: Record<string, OrderStatus> = {
  Paid: "Confirmed",
};
