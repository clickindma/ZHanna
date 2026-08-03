"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Ban,
  Check,
  ExternalLink,
  Eye,
  Loader2,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/admin/status-badge";
import { BRAND } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import { FULFILMENT_FLOW } from "@/types/admin";
import type { AdminOrder } from "@/types/admin";
import type { OrderStatus } from "@/types/models";

export function orderNumber(id: string) {
  return `#ZH-${id.slice(-6).toUpperCase()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_NOTES: Record<OrderStatus, string> = {
  Pending: "Awaiting payment confirmation.",
  Confirmed: "Payment received — order is being prepared.",
  Packed: "Packed and ready — handover to the courier next.",
  Shipped: "In transit to the customer.",
  Delivered: "Handed over successfully.",
  Cancelled: "This order was cancelled.",
};

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white">
        {orders.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted-foreground">
            No orders match these filters.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-navy">
                    {orderNumber(order._id)}
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-navy">
                        {order.user?.name ?? order.shippingAddress.fullName ?? "Guest"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {order.user?.email ?? order.shippingAddress.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-navy">
                    {formatPrice(order.totalPrice)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <OrderStatusBadge status={order.orderStatus} />
                      {order.trackingNumber && (
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Truck className="h-3 w-3" />
                          {order.trackingNumber}
                        </p>
                      )}
                      {order.cancelReason && (
                        <p className="max-w-[180px] truncate text-[11px] text-red-600">
                          {order.cancelReason}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelected(order)}
                        className="border-slate-200 text-slate-600 hover:border-gold hover:text-gold-dark"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {selected && (
        <OrderDetailsModal order={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
      <div className="mt-1 text-sm text-navy">{children}</div>
    </div>
  );
}

function StatusStepper({
  status,
  onSelect,
}: {
  status: OrderStatus;
  onSelect: (status: OrderStatus) => void;
}) {
  const isCancelled = status === "Cancelled";
  const currentIndex = isCancelled ? -1 : FULFILMENT_FLOW.indexOf(status);

  return (
    <div>
      <div className="relative">
        <div className="absolute top-[13px] right-[10%] left-[10%] h-0.5 bg-slate-200" />
        <div
          className="absolute top-[13px] left-[10%] h-0.5 bg-gradient-to-r from-gold to-gold transition-all duration-500"
          style={{ width: currentIndex >= 0 ? `calc(${currentIndex} * 20%)` : "0%" }}
        />
        <div className="relative flex justify-between">
          {FULFILMENT_FLOW.map((step, index) => {
            const reached = currentIndex >= 0 && index <= currentIndex;
            const isCurrent = currentIndex === index;
            const muted = isCancelled;
            return (
              <button
                key={step}
                type="button"
                onClick={() => onSelect(step)}
                className="group flex w-14 flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white text-[11px] font-bold transition-all duration-300",
                    isCurrent
                      ? "border-gold text-gold-dark shadow-[0_0_0_4px_rgba(182,139,64,0.15)]"
                      : reached
                        ? "border-gold bg-gold text-white"
                        : muted
                          ? "border-slate-200 bg-slate-50 text-slate-300"
                          : "border-slate-300 text-slate-400 group-hover:border-gold/60 group-hover:text-gold-dark"
                  )}
                >
                  {reached && !isCurrent ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-center text-[10px] font-semibold tracking-[0.08em] uppercase transition-colors",
                    isCurrent
                      ? "text-gold-dark"
                      : reached
                        ? "text-navy"
                        : muted
                          ? "text-slate-300"
                          : "text-slate-400 group-hover:text-gold-dark"
                  )}
                >
                  {step}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {isCancelled && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          <Ban className="h-3.5 w-3.5" />
          This order was cancelled. Click a step above to reactivate it.
        </div>
      )}
    </div>
  );
}

function OrderDetailsModal({
  order,
  onClose,
}: {
  order: AdminOrder;
  onClose: () => void;
}) {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.orderStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl ?? "");
  const [adminNotes, setAdminNotes] = useState(order.adminNotes ?? "");
  const [cancelReason, setCancelReason] = useState(order.cancelReason ?? "");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(
      orderStatus !== order.orderStatus ||
        trackingNumber.trim() !== (order.trackingNumber ?? "") ||
        trackingUrl.trim() !== (order.trackingUrl ?? "") ||
        adminNotes.trim() !== (order.adminNotes ?? "") ||
        cancelReason.trim() !== (order.cancelReason ?? "")
    );
  }, [
    orderStatus,
    trackingNumber,
    trackingUrl,
    adminNotes,
    cancelReason,
    order.orderStatus,
    order.trackingNumber,
    order.trackingUrl,
    order.adminNotes,
    order.cancelReason,
  ]);

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const showTracking = orderStatus === "Shipped" || orderStatus === "Delivered";
  const hasValidTrackingUrl = /^https?:\/\/.+/.test(trackingUrl.trim());

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus,
          trackingNumber: trackingNumber.trim() || null,
          trackingUrl: trackingUrl.trim() || null,
          adminNotes: adminNotes.trim() || null,
          cancelReason: cancelReason.trim() || null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Could not update order");
        return;
      }
      toast.success(
        orderStatus === "Cancelled"
          ? "Order cancelled"
          : `Order marked as ${orderStatus}`
      );
      window.setTimeout(() => window.location.reload(), 900);
    } catch {
      toast.error("Could not update order");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy-deep/40 backdrop-blur-sm"
        onClick={() => !saving && onClose()}
      />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="font-playfair text-xl text-navy">{orderNumber(order._id)}</h2>
            <p className="text-xs text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy"
          >
            ×
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <OrderStatusBadge status={orderStatus} />
            <PaymentStatusBadge status={order.paymentStatus} />
            <span className="text-xs text-muted-foreground">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </span>
            <span className="text-xs font-medium text-navy">
              {formatPrice(order.totalPrice)}
            </span>
          </div>

          <section>
            <p className="border-b border-slate-100 pb-2 text-[11px] font-bold tracking-[0.22em] text-gold-dark uppercase">
              Update fulfilment
            </p>
            <div className="mt-4 space-y-5">
              <StatusStepper status={orderStatus} onSelect={setOrderStatus} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="order-tracking" className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                    Tracking number
                  </Label>
                  <Input
                    id="order-tracking"
                    value={trackingNumber}
                    onChange={(event) => setTrackingNumber(event.target.value)}
                    placeholder="e.g. DHL-1234567890"
                    className="mt-1.5 h-10 rounded-lg border-slate-200 bg-white px-3 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
                  />
                </div>
                <div>
                  <Label htmlFor="order-tracking-url" className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                    Tracking link
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="order-tracking-url"
                      value={trackingUrl}
                      onChange={(event) => setTrackingUrl(event.target.value)}
                      placeholder="https://track.courier.com/… (optional)"
                      className="h-10 rounded-lg border-slate-200 bg-white px-3 pr-9 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
                    />
                    {hasValidTrackingUrl && (
                      <a
                        href={trackingUrl.trim()}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open tracking link"
                        className="absolute top-1/2 right-2.5 -translate-y-1/2 text-gold-dark transition-colors hover:text-gold"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {!showTracking && orderStatus !== "Cancelled" && (
                <p className="text-xs text-muted-foreground">
                  Mark the order as{" "}
                  <span className="font-semibold text-navy">Shipped</span> and add
                  the courier tracking number so the customer can follow it.
                </p>
              )}

              <div>
                <Label htmlFor="order-notes" className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                  Internal notes
                </Label>
                <Textarea
                  id="order-notes"
                  value={adminNotes}
                  onChange={(event) => setAdminNotes(event.target.value)}
                  rows={3}
                  placeholder="Notes for your team — never shown to the customer."
                  className="mt-1.5 rounded-lg border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
                />
              </div>

              {orderStatus === "Cancelled" && (
                <div className="rounded-lg border border-red-200 bg-red-50/60 p-4">
                  <Label htmlFor="order-cancel-reason" className="text-[11px] font-semibold tracking-[0.15em] text-red-800 uppercase">
                    Cancel reason (optional)
                  </Label>
                  <Textarea
                    id="order-cancel-reason"
                    value={cancelReason}
                    onChange={(event) => setCancelReason(event.target.value)}
                    rows={2}
                    placeholder="e.g. Customer requested cancellation, out of stock…"
                    className="mt-1.5 rounded-lg border-red-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-red-400 focus-visible:ring-2 focus-visible:ring-red-300/40"
                  />
                  <p className="mt-1.5 text-xs text-red-700/70">
                    The reason is shared with the customer on their order page.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                  <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-dark" />
                  <span>{STATUS_NOTES[orderStatus]}</span>
                </div>
                <div className="flex items-center gap-2">
                  {orderStatus !== "Cancelled" && (
                    <Button
                      variant="outline"
                      onClick={() => setOrderStatus("Cancelled")}
                      className="border-red-200 text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
                    >
                      <Ban className="h-4 w-4" />
                      Cancel order
                    </Button>
                  )}
                  <Button
                    onClick={save}
                    disabled={!dirty || saving}
                    className="shrink-0 bg-navy text-white transition-colors hover:bg-navy-mid disabled:opacity-50"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save changes
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="border-b border-slate-100 pb-2 text-[11px] font-bold tracking-[0.22em] text-gold-dark uppercase">
              Customer
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <FieldBlock label="Customer">
                {order.user?.name ?? "Guest customer"}
              </FieldBlock>
              <FieldBlock label="Email">
                {order.user?.email ?? "No account — guest checkout"}
              </FieldBlock>
            </div>
          </section>

          <section>
            <p className="border-b border-slate-100 pb-2 text-[11px] font-bold tracking-[0.22em] text-gold-dark uppercase">
              Items
            </p>
            <ul className="mt-3 space-y-3">
              {order.items.map((item, index) => (
                <li key={`${item.product ?? "line"}-${index}`} className="flex items-center gap-4">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-champagne">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-playfair text-navy/40">
                        {BRAND.name[0]}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-navy">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="border-b border-slate-100 pb-2 text-[11px] font-bold tracking-[0.22em] text-gold-dark uppercase">
              Payment
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <FieldBlock label="Status">
                <PaymentStatusBadge status={order.paymentStatus} />
              </FieldBlock>
              {order.paymentRef && (
                <FieldBlock label="Payment reference">
                  <span className="break-all">{order.paymentRef}</span>
                </FieldBlock>
              )}
              {order.paidAt && (
                <FieldBlock label="Paid on">{formatDate(order.paidAt)}</FieldBlock>
              )}
              {order.deliveredAt && (
                <FieldBlock label="Delivered on">{formatDate(order.deliveredAt)}</FieldBlock>
              )}
              {!order.paidAt && orderStatus !== "Cancelled" && (
                <FieldBlock label="Paid on">
                  <span className="text-amber-600">Not yet marked as paid</span>
                </FieldBlock>
              )}
            </div>
          </section>

          <section>
            <p className="border-b border-slate-100 pb-2 text-[11px] font-bold tracking-[0.22em] text-gold-dark uppercase">
              Shipping address
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <FieldBlock label="Recipient">
                {order.shippingAddress.fullName}
              </FieldBlock>
              <FieldBlock label="Phone">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-gold-dark" />
                  {order.shippingAddress.phone}
                </span>
              </FieldBlock>
              <div className="sm:col-span-2">
                <FieldBlock label="Address">
                  <span className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-dark" />
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
                    {order.shippingAddress.city}, {order.shippingAddress.state} —{" "}
                    {order.shippingAddress.pincode}, {order.shippingAddress.country}
                  </span>
                </FieldBlock>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-slate-50 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items subtotal</span>
                <span className="font-medium text-navy">{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-navy">
                  {order.shippingPrice === 0 ? (
                    <span className="text-emerald-700">Free</span>
                  ) : (
                    formatPrice(order.shippingPrice)
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="font-playfair text-navy">Total</span>
                <span className="font-playfair text-lg text-navy">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={saving} className="border-slate-200 text-slate-600">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
