import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { Category, Order, Product, User } from "@/models";
import { SEED_ADMIN, SEED_CATEGORIES, SEED_PRODUCTS } from "@/lib/seed-data";

/**
 * Wipes all collections. Intended for local development only.
 */
export async function clearDatabase(): Promise<void> {
  await dbConnect();
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
  ]);
}

export interface SeedSummary {
  adminCreated: number;
  customersCreated: number;
  categoriesCreated: number;
  categoriesSkipped: number;
  productsCreated: number;
  productsSkipped: number;
  ordersCreated: number;
  ordersSkipped: number;
}

const CUSTOMER_PASSWORD = "customer123";

const SEED_CUSTOMERS = [
  {
    name: "Ananya Sharma",
    email: "ananya@example.com",
    phone: "9876543210",
    addresses: [
      {
        fullName: "Ananya Sharma",
        phone: "9876543210",
        line1: "12 Rose Villa, Marine Drive",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400002",
        country: "India",
        isDefault: true,
      },
    ],
  },
  {
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "9820011223",
    addresses: [
      {
        fullName: "Priya Patel",
        phone: "9820011223",
        line1: "B-704, Shanti Residency, Navrangpura",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380009",
        country: "India",
        isDefault: true,
      },
    ],
  },
  {
    name: "Riya Kapoor",
    email: "riya@example.com",
    phone: "9988776655",
    addresses: [
      {
        fullName: "Riya Kapoor",
        phone: "9988776655",
        line1: "4th Floor, Pearl Apartments, Koramangala",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560034",
        country: "India",
        isDefault: true,
      },
    ],
  },
  {
    name: "Kavya Nair",
    email: "kavya@example.com",
    phone: "9765432109",
    addresses: [
      {
        fullName: "Kavya Nair",
        phone: "9765432109",
        line1: "House 21, Greenfield Lane, Panampilly Nagar",
        city: "Kochi",
        state: "Kerala",
        pincode: "682036",
        country: "India",
        isDefault: true,
      },
    ],
  },
];

interface DemoOrderInput {
  customerEmail: string;
  productSlugs: { slug: string; quantity: number }[];
  orderStatus: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  daysAgo: number;
}

const SEED_ORDERS: DemoOrderInput[] = [
  {
    customerEmail: "ananya@example.com",
    productSlugs: [
      { slug: "signature-eternity-diamond-ring", quantity: 1 },
      { slug: "timeless-tennis-bracelet", quantity: 1 },
    ],
    orderStatus: "Delivered",
    paymentStatus: "paid",
    daysAgo: 21,
  },
  {
    customerEmail: "priya@example.com",
    productSlugs: [{ slug: "rani-jadau-bridal-necklace", quantity: 1 }],
    orderStatus: "Shipped",
    paymentStatus: "paid",
    daysAgo: 9,
  },
  {
    customerEmail: "riya@example.com",
    productSlugs: [
      { slug: "imperial-chandbali-earrings", quantity: 1 },
      { slug: "celestial-moonstone-pendant", quantity: 2 },
    ],
    orderStatus: "Confirmed",
    paymentStatus: "paid",
    daysAgo: 4,
  },
  {
    customerEmail: "kavya@example.com",
    productSlugs: [{ slug: "lotus-solitaire-pendant", quantity: 1 }],
    orderStatus: "Pending",
    paymentStatus: "pending",
    daysAgo: 1,
  },
  {
    customerEmail: "ananya@example.com",
    productSlugs: [{ slug: "minimal-chevron-ring", quantity: 1 }],
    orderStatus: "Cancelled",
    paymentStatus: "failed",
    daysAgo: 2,
  },
];

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 79;

/**
 * Seeds the database with the admin account, demo customers, categories,
 * products and a handful of demo orders. Existing records (matched by
 * slug/email) are left untouched, so it is safe to run repeatedly — except
 * the admin account, whose password and role are refreshed on every run so
 * re-seeding can restore lost credentials.
 */
export async function seedDatabase(): Promise<SeedSummary> {
  await dbConnect();

  const summary: SeedSummary = {
    adminCreated: 0,
    customersCreated: 0,
    categoriesCreated: 0,
    categoriesSkipped: 0,
    productsCreated: 0,
    productsSkipped: 0,
    ordersCreated: 0,
    ordersSkipped: 0,
  };

  const adminExists = await User.findOne({ email: SEED_ADMIN.email });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(SEED_ADMIN.password, 10);
    await User.create({
      name: SEED_ADMIN.name,
      email: SEED_ADMIN.email,
      password: hashedPassword,
      role: "admin",
      addresses: [],
    });
    summary.adminCreated = 1;
  } else {
    const hashedPassword = await bcrypt.hash(SEED_ADMIN.password, 10);
    adminExists.password = hashedPassword;
    adminExists.role = "admin";
    adminExists.name = SEED_ADMIN.name;
    await adminExists.save();
  }

  for (const customerData of SEED_CUSTOMERS) {
    const existing = await User.findOne({ email: customerData.email });
    if (existing) continue;

    const hashedPassword = await bcrypt.hash(CUSTOMER_PASSWORD, 10);
    await User.create({
      ...customerData,
      password: hashedPassword,
      role: "customer",
    });
    summary.customersCreated += 1;
  }

  const categoryIds = new Map<string, string>();

  for (const categoryData of SEED_CATEGORIES) {
    const existing = await Category.findOne({ slug: categoryData.slug });
    if (existing) {
      categoryIds.set(categoryData.slug, existing._id.toString());
      summary.categoriesSkipped += 1;
      continue;
    }

    const created = await Category.create(categoryData);
    categoryIds.set(categoryData.slug, created._id.toString());
    summary.categoriesCreated += 1;
  }

  for (const productData of SEED_PRODUCTS) {
    const existing = await Product.findOne({ slug: productData.slug });
    if (existing) {
      summary.productsSkipped += 1;
      continue;
    }

    const { categorySlug, ...product } = productData;
    const categoryId = categoryIds.get(categorySlug);

    if (!categoryId) {
      throw new Error(
        `Seed aborted: category "${categorySlug}" not found for product "${product.slug}"`
      );
    }

    await Product.create({ ...product, category: categoryId });
    summary.productsCreated += 1;
  }

  const existingOrder = await Order.findOne({});
  if (!existingOrder) {
    for (const orderData of SEED_ORDERS) {
      await createDemoOrder(orderData);
      summary.ordersCreated += 1;
    }
  } else {
    summary.ordersSkipped = SEED_ORDERS.length;
  }

  return summary;
}

async function createDemoOrder(orderData: DemoOrderInput): Promise<void> {
  const customer = await User.findOne({ email: orderData.customerEmail });
  const address = customer?.addresses?.[0];
  if (!customer || !address) return;

  const items: Array<{
    product: import("mongoose").Types.ObjectId | string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }> = [];
  let itemsPrice = 0;

  for (const line of orderData.productSlugs) {
    const product = await Product.findOne({ slug: line.slug });
    if (!product) {
      throw new Error(`Seed aborted: product "${line.slug}" not found for demo order`);
    }

    const price = product.price ?? 0;
    itemsPrice += price * line.quantity;
    items.push({
      product: product._id,
      name: product.name,
      price,
      quantity: line.quantity,
      image: product.images?.[0] ?? undefined,
    });  }

  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const placedAt = new Date(Date.now() - orderData.daysAgo * 24 * 60 * 60 * 1000);
  const isPaid = orderData.paymentStatus === "paid";
  const isDelivered = orderData.orderStatus === "Delivered";

  await Order.create({
    user: customer._id,
    orderItems: items,
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    },
    paymentInfo: {
      status: orderData.paymentStatus,
      ...(isPaid
        ? { razorpayPaymentId: `pay_${Math.random().toString(36).slice(2, 12)}` }
        : {}),
    },
    itemsPrice,
    shippingPrice,
    totalPrice: itemsPrice + shippingPrice,
    orderStatus: orderData.orderStatus,
    paidAt: isPaid ? placedAt : null,
    deliveredAt: isDelivered
      ? new Date(placedAt.getTime() + 3 * 24 * 60 * 60 * 1000)
      : null,
    createdAt: placedAt,
  });
}

/**
 * Read-only summary of existing records, used to inspect seed state.
 */
export async function getSeedStatus() {
  await dbConnect();

  const [users, categories, products, orders] = await Promise.all([
    User.countDocuments(),
    Category.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  return { users, categories, products, orders };
}
