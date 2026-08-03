"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Filter, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ORDER_STATUSES } from "@/types/admin";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = ORDER_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

export function OrdersToolbar({
  initialStatus,
  initialFrom,
  initialTo,
  resultCount,
  hasFilters,
}: {
  initialStatus?: string;
  initialFrom?: string;
  initialTo?: string;
  resultCount: number;
  hasFilters: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [status, setStatus] = useState(initialStatus ?? "all");
  const [from, setFrom] = useState(initialFrom ?? "");
  const [to, setTo] = useState(initialTo ?? "");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setStatus(initialStatus ?? "all");
    setFrom(initialFrom ?? "");
    setTo(initialTo ?? "");
  }, [initialStatus, initialFrom, initialTo]);

  function apply(nextStatus = status, nextFrom = from, nextTo = to) {
    setPending(true);
    const params = new URLSearchParams();
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    if (nextFrom) params.set("from", nextFrom);
    if (nextTo) params.set("to", nextTo);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    window.setTimeout(() => setPending(false), 600);
  }

  function clear() {
    setStatus("all");
    setFrom("");
    setTo("");
    setPending(true);
    router.replace(pathname, { scroll: false });
    window.setTimeout(() => setPending(false), 600);
  }

  const dirty =
    status !== (initialStatus ?? "all") ||
    from !== (initialFrom ?? "") ||
    to !== (initialTo ?? "");

  const statusLabel =
    status === "all"
      ? "All statuses"
      : STATUS_OPTIONS.find((option) => option.value === status)?.label ??
        "All statuses";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="grid gap-4 sm:grid-cols-3 lg:w-auto lg:flex-1">
          <div>
            <Label
              htmlFor="orders-status"
              className="text-[10px] font-semibold tracking-[0.15em] text-navy uppercase"
            >
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value ?? "all")}
            >
              <SelectTrigger
                id="orders-status"
                className="mt-1.5 h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm text-navy focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
              >
                <span>{statusLabel}</span>
              </SelectTrigger>
              <SelectContent align="start" className="max-h-72">
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="orders-from"
              className="text-[10px] font-semibold tracking-[0.15em] text-navy uppercase"
            >
              From
            </Label>
            <Input
              id="orders-from"
              type="date"
              value={from}
              max={to || undefined}
              onChange={(event) => setFrom(event.target.value)}
              className="mt-1.5 h-10 rounded-lg border-slate-200 bg-white px-3 text-sm text-navy focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
            />
          </div>
          <div>
            <Label
              htmlFor="orders-to"
              className="text-[10px] font-semibold tracking-[0.15em] text-navy uppercase"
            >
              To
            </Label>
            <Input
              id="orders-to"
              type="date"
              value={to}
              min={from || undefined}
              onChange={(event) => setTo(event.target.value)}
              className="mt-1.5 h-10 rounded-lg border-slate-200 bg-white px-3 text-sm text-navy focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:justify-end">
          <span className="mr-auto text-xs text-muted-foreground lg:mr-0">
            {resultCount} {resultCount === 1 ? "order" : "orders"}
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={clear}
            disabled={!hasFilters}
            className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </Button>
          <Button
            type="button"
            onClick={() => apply()}
            disabled={!dirty || pending}
            className={cn(
              "transition-colors",
              pending ? "bg-navy/60 text-white" : "bg-navy text-gold-light hover:bg-navy-deep"
            )}
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Filter className="h-3.5 w-3.5" />
            )}
            Apply filters
          </Button>
        </div>
      </div>
    </div>
  );
}
