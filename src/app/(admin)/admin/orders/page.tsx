import { AdminPageHeader } from "@/components/admin/page-header";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { OrdersToolbar } from "@/components/admin/orders/orders-toolbar";
import { OrderStatusChips } from "@/components/admin/orders/order-status-chips";
import { getAdminOrders, getOrderStatusCounts } from "@/lib/queries/admin";
import type { OrderStatus } from "@/types/models";

export const metadata = { title: "Orders | Admin" };

const VALID_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

interface PageProps {
  searchParams: Promise<{ status?: string; from?: string; to?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const status =
    params.status && VALID_STATUSES.includes(params.status as OrderStatus)
      ? params.status
      : undefined;

  const [orders, statusCounts] = await Promise.all([
    getAdminOrders({
      status,
      from: params.from,
      to: params.to,
    }),
    getOrderStatusCounts(),
  ]);

  const hasFilters = Boolean(status || params.from || params.to);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Fulfilment"
        title="Orders"
        description="Track every order from pending to delivered, add tracking and internal notes, and update fulfilment status."
      />
      <OrderStatusChips counts={statusCounts} currentStatus={status} />
      <OrdersToolbar
        initialStatus={status}
        initialFrom={params.from}
        initialTo={params.to}
        resultCount={orders.length}
        hasFilters={hasFilters}
      />
      <OrdersTable orders={orders} />
    </div>
  );
}
