import { dbConnect } from "@/lib/db";
import { Category, Order, Product, User } from "@/models";
import type {
  AdminCategory,
  AdminCustomer,
  AdminLowStockProduct,
  AdminOrder,
  AdminProduct,
  AdminStats,
} from "@/types/admin";
import type { OrderStatus, IOrder } from "@/types/models";

type LeanObjectId = { toString(): string };

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

type LeanCategory = {
  _id: LeanObjectId;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
};

type LeanProductDoc = {
  _id: LeanObjectId;
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
  category:
    | { _id: LeanObjectId; name: string; slug: string }
    | string
    | null;
  createdAt: Date;
};

function mapProduct(product: LeanProductDoc): AdminProduct {
  const category =
    product.category && typeof product.category === "object"
      ? {
          _id: product.category._id.toString(),
          name: product.category.name,
          slug: product.category.slug,
        }
      : null;

  return {
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    images: product.images ?? [],
    shortDescription: product.shortDescription,
    description: product.description,
    materials: product.materials ?? [],
    stock: product.stock,
    sku: product.sku,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isActive: product.isActive,
    tags: product.tags ?? [],
    weight: product.weight,
    sizeOptions: product.sizeOptions ?? [],
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    category,
    createdAt: product.createdAt.toISOString(),
  };
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  await dbConnect();
  const docs = await Product.find({})
    .sort({ createdAt: -1 })
    .populate("category", "name slug")
    .lean();
  return (docs as unknown as LeanProductDoc[]).map(mapProduct);
}

export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
  await dbConnect();
  const doc = await Product.findById(id)
    .populate("category", "name slug")
    .lean();
  if (!doc) return null;
  return mapProduct(doc as unknown as LeanProductDoc);
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  await dbConnect();

  const categories = await Category.find({}).sort({ name: 1 }).lean();
  const counts = await Product.aggregate<{ _id: string; count: number }>([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  const countByCategory = new Map(
    counts.map((entry) => [entry._id.toString(), entry.count])
  );

  return (categories as unknown as LeanCategory[]).map((category) => ({
    _id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description ?? null,
    image: category.image ?? null,
    isActive: category.isActive,
    productCount: countByCategory.get(category._id.toString()) ?? 0,
  }));
}

type LeanOrder = Omit<IOrder, "user"> & {
  _id: LeanObjectId;
  user: { _id: LeanObjectId; name: string; email: string } | null;
  createdAt: Date;
};

function mapOrder(order: LeanOrder): AdminOrder {
  return {
    _id: order._id.toString(),
    user: order.user
      ? {
          _id: order.user._id.toString(),
          name: order.user.name,
          email: order.user.email,
        }
      : null,
    items: order.orderItems.map((item) => ({
      product: item.product ? item.product.toString() : null,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    itemsPrice: order.itemsPrice,
    shippingPrice: order.shippingPrice,
    totalPrice: order.totalPrice,
    orderStatus: normalizeStatus(order.orderStatus),
    trackingNumber: order.trackingNumber ?? null,
    trackingUrl: order.trackingUrl ?? null,
    adminNotes: order.adminNotes ?? null,
    cancelReason: order.cancelReason ?? null,
    paymentStatus: order.paymentInfo?.status ?? "pending",
    paymentRef:
      order.paymentInfo?.razorpayPaymentId ??
      order.paymentInfo?.razorpayOrderId ??
      null,
    paidAt: order.paidAt ? order.paidAt.toISOString() : null,
    deliveredAt: order.deliveredAt ? order.deliveredAt.toISOString() : null,
    shippingAddress: {
      fullName: order.shippingAddress.fullName,
      phone: order.shippingAddress.phone,
      line1: order.shippingAddress.line1,
      line2: order.shippingAddress.line2,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      pincode: order.shippingAddress.pincode,
      country: order.shippingAddress.country,
    },
    createdAt: order.createdAt.toISOString(),
  };
}

export interface AdminOrderFilters {
  status?: string;
  from?: string;
  to?: string;
}

function buildOrderQuery(filters: AdminOrderFilters = {}) {
  const query: Record<string, unknown> = {};

  if (filters.status && filters.status !== "all") {
    // Legacy "Paid" orders surface under the "Confirmed" filter.
    query.orderStatus =
      filters.status === "Confirmed"
        ? { $in: ["Confirmed", "Paid"] }
        : filters.status;
  }

  if (filters.from || filters.to) {
    const range: Record<string, Date> = {};
    if (filters.from) {
      const from = new Date(`${filters.from}T00:00:00`);
      if (!Number.isNaN(from.getTime())) range.$gte = from;
    }
    if (filters.to) {
      const to = new Date(`${filters.to}T23:59:59.999`);
      if (!Number.isNaN(to.getTime())) range.$lte = to;
    }
    if (range.$gte || range.$lte) {
      query.createdAt = range;
    }
  }

  return query;
}

export async function getAdminOrders(
  filters: AdminOrderFilters = {}
): Promise<AdminOrder[]> {
  await dbConnect();
  const docs = await Order.find(buildOrderQuery(filters))
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .lean();
  return (docs as unknown as LeanOrder[]).map(mapOrder);
}

/**
 * Counts of orders in every status, plus the total, used for the
 * status chips on the admin Orders page. Legacy "Paid" rows count
 * towards "Confirmed".
 */
export async function getOrderStatusCounts(): Promise<
  Record<OrderStatus, number> & { all: number }
> {
  await dbConnect();

  const counts: Record<OrderStatus, number> & { all: number } = {
    Pending: 0,
    Confirmed: 0,
    Packed: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
    all: 0,
  };

  const aggregation = await Order.aggregate<{ _id: string; count: number }>([
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
  ]);

  for (const entry of aggregation) {
    const status = normalizeStatus(entry._id);
    counts[status] += entry.count;
    counts.all += entry.count;
  }

  return counts;
}

export async function getAdminOrderById(id: string): Promise<AdminOrder | null> {
  await dbConnect();
  const doc = await Order.findById(id)
    .populate("user", "name email")
    .lean();
  if (!doc) return null;
  return mapOrder(doc as unknown as LeanOrder);
}

export async function getRecentOrders(limit = 5): Promise<AdminOrder[]> {
  await dbConnect();
  const docs = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "name email")
    .lean();
  return (docs as unknown as LeanOrder[]).map(mapOrder);
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  await dbConnect();

  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  const orders = await Order.aggregate<{
    _id: string;
    orderCount: number;
    totalSpent: number;
  }>([
    { $group: { _id: "$user", orderCount: { $sum: 1 }, totalSpent: { $sum: "$totalPrice" } } },
  ]);
  const byUser = new Map(
    orders
      .filter((entry) => entry._id)
      .map((entry) => [entry._id.toString(), entry])
  );

  return users.map((user) => {
    const stats = byUser.get(user._id.toString());
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      ordersCount: stats?.orderCount ?? 0,
      totalSpent: stats?.totalSpent ?? 0,
      createdAt: user.createdAt?.toISOString?.() ?? "",
    };
  });
}

export async function getAdminStats(): Promise<AdminStats> {
  await dbConnect();

  const [totalProducts, totalOrders, totalCustomers, lowStockProducts, revenueAgg, statusAgg] =
    await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments({ isActive: true, stock: { $lte: 10 } }),
      Order.aggregate<{ total: number }>([
        { $match: { orderStatus: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),
    ]);

  const ordersByStatus: AdminStats["ordersByStatus"] = {
    Pending: 0,
    Confirmed: 0,
    Packed: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  for (const entry of statusAgg) {
    const status = normalizeStatus(entry._id);
    ordersByStatus[status] += entry.count;
  }

  return {
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue: revenueAgg[0]?.total ?? 0,
    pendingOrders: ordersByStatus.Pending,
    lowStockProducts,
    ordersByStatus,
  };
}

export async function getLowStockProducts(
  threshold = 10,
  limit = 6
): Promise<AdminLowStockProduct[]> {
  await dbConnect();
  const docs = await Product.find({ isActive: true, stock: { $lte: threshold } })
    .sort({ stock: 1 })
    .limit(limit)
    .select("name sku stock price images")
    .lean();

  return (docs as unknown as Array<{
    _id: LeanObjectId;
    name: string;
    sku: string;
    stock: number;
    price: number;
    images?: string[];
  }>).map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    stock: product.stock,
    price: product.price,
    image: product.images?.[0] ?? null,
  }));
}
