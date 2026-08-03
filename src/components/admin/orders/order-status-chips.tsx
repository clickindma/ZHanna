"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/models";

const STATUS_TILE: Record<string, string> = {
  Pending: "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300",
  Confirmed: "border-sky-200 bg-sky-50 text-sky-800 hover:border-sky-300",
  Packed: "border-violet-200 bg-violet-50 text-violet-800 hover:border-violet-300",
  Shipped: "border-indigo-200 bg-indigo-50 text-indigo-800 hover:border-indigo-300",
  Delivered: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300",
  Cancelled: "border-red-200 bg-red-50 text-red-700 hover:border-red-300",
};

export function OrderStatusChips({
  counts,
  currentStatus,
}: {
  counts: Record<OrderStatus, number> & { all: number };
  currentStatus?: string;
}) {
  const pathname = usePathname();
  const baseHref = (status: string) =>
    status === "all" ? pathname : `${pathname}?status=${status}`;

  const chips = [
    { label: "All", status: "all", count: counts.all },
    { label: "Pending", status: "Pending", count: counts.Pending },
    { label: "Confirmed", status: "Confirmed", count: counts.Confirmed },
    { label: "Packed", status: "Packed", count: counts.Packed },
    { label: "Shipped", status: "Shipped", count: counts.Shipped },
    { label: "Delivered", status: "Delivered", count: counts.Delivered },
    { label: "Cancelled", status: "Cancelled", count: counts.Cancelled },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {chips.map((chip) => {
        const active = currentStatus
          ? chip.status === currentStatus
          : chip.status === "all";
        return (
          <Link
            key={chip.status}
            href={baseHref(chip.status)}
            className={cn(
              "group flex flex-col items-start gap-0.5 rounded-xl border px-4 py-3 transition-all hover:-translate-y-0.5",
              active
                ? "border-navy bg-navy text-white shadow-lg shadow-navy/20"
                : STATUS_TILE[chip.status] ?? "border-slate-200 bg-white text-slate-700 hover:shadow-md"
            )}
          >
            <span className="text-xl font-semibold tracking-tight">{chip.count}</span>
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase">
              {chip.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
