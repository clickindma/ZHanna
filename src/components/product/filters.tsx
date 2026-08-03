"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { RotateCcw, Search } from "lucide-react";
import type { CategoryWithCount } from "@/types/product";
import { PRICE_PRESETS, SORT_OPTIONS } from "@/lib/filters";
import { cn } from "@/lib/utils";

export interface ActiveFilters {
  category?: string;
  search?: string;
  sort?: string;
  price?: string;
  featured?: string;
  newArrival?: string;
}

interface FiltersProps {
  categories: CategoryWithCount[];
  active: ActiveFilters;
  totalProducts: number;
  totalInAll?: number;
  onNavigate?: () => void;
  className?: string;
}

export function Filters({
  categories,
  active,
  totalProducts,
  totalInAll,
  onNavigate,
  className,
}: FiltersProps) {
  const router = useRouter();

  const apply = useCallback(
    (patch: ActiveFilters) => {
      const params = new URLSearchParams();
      const merged = { ...active, ...patch };

      Object.entries(merged).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      const query = params.toString();
      router.push(query ? `/shop?${query}` : "/shop");
      onNavigate?.();
    },
    [router, active, onNavigate]
  );

  const hasActiveFilters =
    Boolean(active.category) ||
    Boolean(active.search) ||
    Boolean(active.price) ||
    active.featured === "true" ||
    active.newArrival === "true" ||
    Boolean(active.sort && active.sort !== "newest");

  return (
    <div className={cn("space-y-9", className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const input = new FormData(event.currentTarget).get("q");
          apply({ search: typeof input === "string" ? input : undefined });
        }}
      >
        <label htmlFor="shop-search" className="sr-only">
          Search products
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="shop-search"
            name="q"
            type="search"
            defaultValue={active.search ?? ""}
            placeholder="Search pieces…"
            className="h-11 w-full rounded-lg border border-champagne-deep bg-white pr-3 pl-10 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/25"
          />
        </div>
      </form>

      <section>
        <h3 className="text-[10px] font-semibold tracking-[0.3em] text-navy uppercase">
          Category
        </h3>
        <ul className="mt-4 space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => apply({ category: undefined })}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition-colors",
                !active.category
                  ? "bg-parchment font-medium text-gold-dark"
                  : "text-muted-foreground hover:bg-parchment hover:text-emerald-deep"
              )}
            >
              All pieces
              <span className="text-xs text-muted-foreground/70">
                {totalInAll ?? totalProducts}
              </span>
            </button>
          </li>
          {categories.map((category) => {
            const isActive = active.category === category.slug;
            return (
              <li key={category._id}>
                <button
                  type="button"
                  onClick={() => apply({ category: isActive ? undefined : category.slug })}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition-colors",
                    isActive
                      ? "bg-champagne font-medium text-gold-dark"
                      : "text-muted-foreground hover:bg-champagne/60 hover:text-navy"
                  )}
                >
                  {category.name}
                  <span className="text-xs text-muted-foreground/70">
                    {category.productCount}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h3 className="text-[10px] font-semibold tracking-[0.3em] text-navy uppercase">
          Price
        </h3>
        <ul className="mt-4 space-y-1">
          <li>
            <button
              type="button"
              onClick={() => apply({ price: undefined })}
              className={cn(
                "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                !active.price
                  ? "bg-parchment font-medium text-gold-dark"
                  : "text-muted-foreground hover:bg-parchment hover:text-emerald-deep"
              )}
            >
              Any price
            </button>
          </li>
          {PRICE_PRESETS.map((preset) => (
            <li key={preset.id}>
              <button
                type="button"
                onClick={() =>
                  apply({ price: active.price === preset.id ? undefined : preset.id })
                }
                className={cn(
                  "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                  active.price === preset.id
                    ? "bg-champagne font-medium text-gold-dark"
                    : "text-muted-foreground hover:bg-champagne/60 hover:text-navy"
                )}
              >
                {preset.label}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-[10px] font-semibold tracking-[0.3em] text-navy uppercase">
          Curated
        </h3>
        <div className="mt-4 space-y-3">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-navy">
            <input
              type="checkbox"
              checked={active.featured === "true"}
              onChange={(event) =>
                apply({ featured: event.target.checked ? "true" : undefined })
              }
              className="h-4 w-4 rounded border-champagne-deep accent-gold-dark"
            />
            Featured pieces
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-navy">
            <input
              type="checkbox"
              checked={active.newArrival === "true"}
              onChange={(event) =>
                apply({ newArrival: event.target.checked ? "true" : undefined })
              }
              className="h-4 w-4 rounded border-champagne-deep accent-gold-dark"
            />
            New arrivals
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-semibold tracking-[0.3em] text-navy uppercase">
          Sort by
        </h3>
        <select
          value={active.sort ?? "newest"}
          onChange={(event) =>
            apply({
              sort: event.target.value === "newest" ? undefined : event.target.value,
            })
          }
          className="mt-4 h-11 w-full rounded-lg border border-champagne-deep bg-white px-3 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            router.push("/shop");
            onNavigate?.();
          }}
          className="inline-flex items-center gap-2 rounded-md text-xs font-semibold tracking-[0.15em] text-gold-dark uppercase transition-colors hover:text-navy"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear all filters
        </button>
      )}
    </div>
  );
}
