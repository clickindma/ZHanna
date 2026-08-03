import Link from "next/link";
import {
  Ban,
  Check,
  ExternalLink,
  MapPin,
  Package,
  PackageOpen,
  Truck,
} from "lucide-react";
import { getSessionUser } from "@/lib/admin";
import { getUserOrders } from "@/lib/queries/orders";
import { cn, formatPrice } from "@/lib/utils";
import { FULFILMENT_FLOW } from "@/types/admin";
import { ProductImage } from "@/components/product/product-image";
import type { OrderStatus } from "@/types/models";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: "Awaiting payment",
  Confirmed: "Confirmed",
  Packed: "Packed",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-sky-50 text-sky-700 border-sky-200",
  Packed: "bg-violet-50 text-violet-700 border-violet-200",
  Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusProgress({ status }: { status: OrderStatus }) {
  const isCancelled = status === "Cancelled";
  const currentIndex = isCancelled ? -1 : FULFILMENT_FLOW.indexOf(status);

  return (
    <div className="relative">
      <div className="absolute top-[9px] right-[8%] left-[8%] h-0.5 bg-champagne-deep/60" />
      <div
        className="absolute top-[9px] left-[8%] h-0.5 bg-gradient-to-r from-gold to-gold transition-all duration-500"
        style={{ width: currentIndex >= 0 ? `calc(${currentIndex} * 21%)` : "0%" }}
      />
      <div className="relative flex justify-between">
        {FULFILMENT_FLOW.map((step, index) => {
          const reached = currentIndex >= 0 && index <= currentIndex;
          const isCurrent = currentIndex === index;
          return (
            <div key={step} className="flex w-12 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 bg-white",
                  isCurrent
                    ? "border-gold text-gold-dark"
                    : reached
                      ? "border-gold bg-gold text-white"
                      : "border-champagne-deep bg-white text-slate-300"
                )}
              >
                {reached && !isCurrent && (
                  <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                )}
              </span>
              <span
                className={cn(
                  "text-[9px] font-semibold tracking-[0.08em] uppercase",
                  isCurrent ? "text-gold-dark" : reached ? "text-navy" : "text-slate-400"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function AccountOrdersPage() {
  const user = await getSessionUser();
  const orders = await getUserOrders(user!.id);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.35em] text-gold-dark uppercase">
            My Account
          </p>
          <h1 className="mt-1 font-playfair text-3xl text-navy">
            My <span className="text-gradient-gold italic">Orders</span>
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"} placed
        </p>
      </div>
      <div className="mt-3 h-px w-24 bg-gradient-to-r from-gold-dark to-gold" />

      {orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-champagne-deep bg-champagne/30 px-6 py-20 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
            <Package className="h-7 w-7" strokeWidth={1.6} />
          </span>
          <p className="mt-5 font-playfair text-2xl text-navy">No orders yet</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Your beautiful pieces are waiting. Explore the collection and place
            your first order — it&apos;ll appear here once placed.
          </p>
          <Link
            href="/shop"
            className="mt-7 rounded-full bg-gold px-8 py-3 text-xs font-semibold tracking-[0.2em] text-navy-deep uppercase transition-colors hover:bg-gold-dark hover:text-white"
          >
            Explore the collection
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const statusBadge = STATUS_BADGE[order.orderStatus] ?? STATUS_BADGE.Pending;
            const delivered = order.orderStatus === "Delivered";

            return (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-champagne-deep bg-background"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-champagne-deep bg-champagne/30 px-6 py-4 sm:px-8">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Order no.
                      </p>
                      <p className="font-medium text-navy">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Placed on
                      </p>
                      <p className="font-medium text-navy">
                        {formatShortDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Items
                      </p>
                      <p className="font-medium text-navy">
                        {itemCount} {itemCount === 1 ? "piece" : "pieces"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                        statusBadge
                      )}
                    >
                      {order.orderStatus === "Delivered" ? (
                        <PackageOpen className="h-3.5 w-3.5" strokeWidth={2} />
                      ) : order.orderStatus === "Shipped" ? (
                        <Truck className="h-3.5 w-3.5" strokeWidth={2} />
                      ) : order.orderStatus === "Cancelled" ? (
                        <Ban className="h-3.5 w-3.5" strokeWidth={2} />
                      ) : (
                        <Package className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      {STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
                    </span>
                    <p className="font-playfair text-lg text-navy">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-5 sm:px-8">
                  <div className="rounded-xl border border-champagne-deep bg-champagne/20 p-4 sm:p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-dark">
                      {delivered
                        ? "Order progress"
                        : order.orderStatus === "Cancelled"
                          ? "Order cancelled"
                          : "Order progress"}
                    </p>
                    <div className="mt-4">
                      <StatusProgress status={order.orderStatus} />
                    </div>

                    {order.orderStatus === "Shipped" && (
                      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                        Your order is on its way.
                        {order.trackingNumber
                          ? ` Tracking number: ${order.trackingNumber}`
                          : " Tracking details will appear here shortly."}
                      </p>
                    )}
                    {delivered && order.deliveredAt && (
                      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                        Delivered on {formatShortDate(order.deliveredAt)} — we hope
                        you love your pieces.
                      </p>
                    )}

                    {(order.trackingNumber || order.trackingUrl) && (
                      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
                        <Truck className="h-4 w-4 text-indigo-700" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold tracking-[0.2em] text-indigo-700 uppercase">
                            Tracking number
                          </p>
                          <p className="truncate font-mono text-sm font-medium text-indigo-900">
                            {order.trackingNumber ?? "—"}
                          </p>
                        </div>
                        {order.trackingUrl && (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-800"
                          >
                            Track shipment
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {order.orderStatus === "Cancelled" && order.cancelReason && (
                      <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700">
                        <Ban className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>
                          <span className="font-semibold">Cancellation reason: </span>
                          {order.cancelReason}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-wrap items-center gap-4">
                      {order.items.map((item, index) => (
                        <div key={`${item.name}-${index}`} className="flex items-center gap-3">
                          {item.image && (
                            <ProductImage
                              src={item.image}
                              alt={item.name}
                              imgClassName="h-16 w-16 rounded-lg border border-champagne-deep object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-navy">{item.name}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {formatPrice(item.price)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="shrink-0 text-sm text-muted-foreground sm:text-right">
                      <p>
                        Ship to:{" "}
                        <span className="font-medium text-navy">
                          {order.shippingAddress.fullName}
                        </span>
                      </p>
                      <p className="mt-1 flex items-start gap-1 sm:justify-end">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-dark" />
                        {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                        {order.shippingAddress.pincode} · {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
