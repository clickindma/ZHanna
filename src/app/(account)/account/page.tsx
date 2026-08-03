import Link from "next/link";
import { Heart, MapPin, Package, Truck, UserRound, Wallet } from "lucide-react";
import { getSessionUser } from "@/lib/admin";
import { getUserOrders } from "@/lib/queries/orders";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountDashboardPage() {
  const user = await getSessionUser();
  const orders = await getUserOrders(user!.id);

  const activeOrders = orders.filter(
    (order) =>
      order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled"
  );
  const totalSpent = orders
    .filter((order) => order.orderStatus !== "Cancelled")
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const memberSince = user?.name ? new Date().getFullYear() : null;

  const stats = [
    {
      label: "Orders placed",
      value: String(orders.length),
      icon: Package,
    },
    {
      label: "In progress",
      value: String(activeOrders.length),
      icon: Truck,
    },
    {
      label: "Total spent",
      value: formatPrice(totalSpent),
      icon: Wallet,
    },
  ];

  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.35em] text-gold-dark uppercase">
        My Account
      </p>
      <h1 className="mt-1 font-playfair text-3xl text-navy">
        Hello, <span className="text-gradient-gold italic">{user?.name ?? "there"}</span>
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {memberSince
          ? `Welcome back. Here's what's happening with your jewellery since ${memberSince}.`
          : "Welcome back. Here's what's happening with your jewellery."}
      </p>
      <div className="mt-3 h-px w-24 bg-gradient-to-r from-gold-dark to-gold" />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-champagne-deep bg-champagne/30 p-5"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
              <stat.icon className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="mt-4 font-playfair text-2xl text-navy">{stat.value}</p>
            <p className="mt-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <QuickLink
          href="/account/orders"
          title="My Orders"
          description="Track deliveries and review past purchases."
          icon={Package}
        />
        <QuickLink
          href="/account/profile"
          title="Profile"
          description="Update your name and phone number."
          icon={UserRound}
        />
        <QuickLink
          href="/account/addresses"
          title="Addresses"
          description="Manage your saved shipping addresses."
          icon={MapPin}
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-xl text-navy">Recent orders</h2>
          {orders.length > 0 && (
            <Link
              href="/account/orders"
              className="text-sm font-medium text-gold-dark hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-champagne-deep bg-champagne/30 px-6 py-16 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
              <Heart className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <p className="mt-4 font-playfair text-xl text-navy">Nothing here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Place your first order and it&apos;ll show up right here.
            </p>
            <Link
              href="/shop"
              className="mt-6 rounded-full bg-gold px-7 py-2.5 text-xs font-semibold tracking-[0.2em] text-navy-deep uppercase transition-colors hover:bg-gold-dark hover:text-white"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-champagne-deep rounded-2xl border border-champagne-deep bg-background">
            {orders.slice(0, 3).map((order) => (
              <Link
                key={order._id}
                href="/account/orders"
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-champagne/20"
              >
                <div className="min-w-0">
                  <p className="font-medium text-navy">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {order.items[0]?.name}
                    {order.items.length > 1
                      ? ` +${order.items.length - 1} more`
                      : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-playfair text-base text-navy">
                    {formatPrice(order.totalPrice)}
                  </p>
                  <p className="text-[11px] font-medium tracking-wider text-gold-dark uppercase">
                    {order.orderStatus}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: typeof Package;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-champagne-deep bg-background p-5 transition-all hover:border-gold/40 hover:shadow-md"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold-dark transition-colors group-hover:bg-gold group-hover:text-white">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <p className="mt-4 font-playfair text-lg text-navy">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
    </Link>
  );
}
