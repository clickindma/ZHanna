import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  IndianRupee,
  Package,
  PackageX,
  Shapes,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/page-header";
import { OrderStatusBadge } from "@/components/admin/status-badge";
import {
  getAdminStats,
  getLowStockProducts,
  getRecentOrders,
} from "@/lib/queries/admin";
import { cn, formatPrice } from "@/lib/utils";
import { ORDER_STATUSES } from "@/types/admin";

export const metadata = { title: "Dashboard | Admin" };

function orderNumber(id: string) {
  return `#ZH-${id.slice(-6).toUpperCase()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_TILE: Record<string, string> = {
  Pending: "border-amber-200 bg-amber-50 text-amber-800",
  Confirmed: "border-sky-200 bg-sky-50 text-sky-800",
  Packed: "border-violet-200 bg-violet-50 text-violet-800",
  Shipped: "border-indigo-200 bg-indigo-50 text-indigo-800",
  Delivered: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Cancelled: "border-red-200 bg-red-50 text-red-700",
};

export default async function AdminDashboardPage() {
  const [stats, recentOrders, lowStock] = await Promise.all([
    getAdminStats(),
    getRecentOrders(5),
    getLowStockProducts(10, 6),
  ]);

  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts.toLocaleString("en-IN"),
      icon: Package,
      accent: "text-sapphire",
      bg: "bg-sapphire/10",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString("en-IN"),
      icon: ShoppingBag,
      accent: "text-gold-dark",
      bg: "bg-gold/10",
      href: "/admin/orders",
    },
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: IndianRupee,
      accent: "text-emerald-700",
      bg: "bg-emerald-50",
      href: "/admin/orders",
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers.toLocaleString("en-IN"),
      icon: Users,
      accent: "text-indigo-600",
      bg: "bg-indigo-50",
      href: "/admin/customers",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A snapshot of your boutique — products, orders, revenue and customers at a glance."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
          >
            <div className="flex items-start justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg} ${card.accent}`}>
                <card.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-gold-dark" />
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-navy">{card.value}</p>
            <p className="mt-0.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="h-5 w-5 text-gold-dark" />
            <h2 className="font-playfair text-lg text-navy">Orders by status</h2>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-semibold tracking-wide text-gold-dark uppercase transition-colors hover:text-navy"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ORDER_STATUSES.map((status) => {
            const count = stats.ordersByStatus[status] ?? 0;
            return (
              <Link
                key={status}
                href={`/admin/orders?status=${status}`}
                className={cn(
                  "group flex flex-col items-start gap-1.5 rounded-xl border px-4 py-3.5 transition-transform hover:-translate-y-0.5",
                  STATUS_TILE[status] ?? "border-slate-200 bg-slate-50 text-slate-700"
                )}
              >
                <span className="text-2xl font-semibold tracking-tight">{count}</span>
                <span className="text-xs font-semibold tracking-wide uppercase">
                  {status}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {stats.lowStockProducts > 0 && (
        <section className="rounded-xl border border-amber-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <PackageX className="h-4.5 w-4.5" strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="font-playfair text-lg text-navy">Low stock alert</h2>
                <p className="text-xs text-muted-foreground">
                  {stats.lowStockProducts}{" "}
                  {stats.lowStockProducts === 1 ? "product is" : "products are"} running
                  low (10 or fewer in stock).
                </p>
              </div>
            </div>
            <Link
              href="/admin/products"
              className="flex items-center gap-1 text-xs font-semibold tracking-wide text-gold-dark uppercase transition-colors hover:text-navy"
            >
              Restock
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {lowStock.length > 0 && (
            <ul className="mt-4 divide-y divide-slate-100">
              {lowStock.map((product) => (
                <li
                  key={product._id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 shrink-0 rounded-md border border-slate-200 object-cover"
                      />
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-champagne font-playfair text-navy/40">
                        Z
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.sku} · {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                      product.stock === 0
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    )}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <ClipboardList className="h-5 w-5 text-gold-dark" />
              <h2 className="font-playfair text-lg text-navy">Recent Orders</h2>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-semibold tracking-wide text-gold-dark uppercase transition-colors hover:text-navy"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">
              No orders yet — they will appear here as customers check out.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-navy">
                      {orderNumber(order._id)}
                    </TableCell>
                    <TableCell>{order.user?.name ?? order.shippingAddress.fullName ?? "Guest"}</TableCell>
                    <TableCell className="text-right font-medium text-navy">
                      {formatPrice(order.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.orderStatus} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-playfair text-lg text-navy">Quick Links</h2>
          <div className="mt-4 space-y-2.5">
            {[
              { label: "Add a product", href: "/admin/products", icon: Package },
              { label: "Manage categories", href: "/admin/categories", icon: Shapes },
              { label: "Track orders", href: "/admin/orders", icon: ClipboardList },
              { label: "Browse customers", href: "/admin/customers", icon: Users },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-gold/50 hover:bg-champagne hover:text-navy"
              >
                <span className="flex items-center gap-2.5">
                  <link.icon className="h-4 w-4 text-gold-dark" />
                  {link.label}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-dark" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
