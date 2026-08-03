import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminCustomers } from "@/lib/queries/admin";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Customers | Admin" };

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Clients"
        title="Customers"
        description="Everyone who has an account with Zhanna, with their order history at a glance."
      />

      <div className="rounded-xl border border-slate-200 bg-white">
        {customers.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted-foreground">
            No customers yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Customer</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer._id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-playfair text-sm text-gold-light">
                        {customer.name.charAt(0)?.toUpperCase() ?? "?"}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-navy">{customer.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        customer.role === "admin"
                          ? "rounded-full border-gold/40 bg-gold/10 font-medium text-gold-dark"
                          : "rounded-full border-slate-200 font-normal text-slate-600"
                      }
                    >
                      {customer.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-navy">
                    {customer.ordersCount}
                  </TableCell>
                  <TableCell className="text-right font-medium text-navy">
                    {formatPrice(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(customer.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
