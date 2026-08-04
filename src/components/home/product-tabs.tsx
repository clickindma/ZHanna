"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ProductListItem } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

interface TabItem {
  slug: string;
  name: string;
}

interface ProductTabsProps {
  title: string;
  subtitle?: string;
  categories: TabItem[];
  sort?: string;
  featured?: boolean;
  limit?: number;
  viewAllHref?: string;
}

export function ProductTabs({
  title,
  subtitle,
  categories,
  sort = "newest",
  featured,
  limit = 5,
  viewAllHref,
}: ProductTabsProps) {
  const tabs: TabItem[] = [{ slug: "all", name: "All" }, ...categories];
  const [active, setActive] = useState("all");
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const cacheRef = useRef<Map<string, ProductListItem[]>>(new Map());

  const loadTab = useCallback(
    async (slug: string) => {
      const cached = cacheRef.current.get(slug);
      if (cached) {
        setProducts(cached);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams({ sort, limit: String(limit) });
        if (slug !== "all") params.set("category", slug);
        if (featured) params.set("featured", "true");
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        const list: ProductListItem[] = data.products ?? [];
        cacheRef.current.set(slug, list);
        setProducts(list);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [sort, limit, featured]
  );

  useEffect(() => {
    void loadTab(active);
  }, [active, loadTab]);

  return (
    <section className="bg-snow">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Heading row: title left, tabs right */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-dark">
                The Collection
              </p>
              <h2 className="mt-2 font-playfair text-3xl font-semibold tracking-tight text-emerald-deep sm:text-4xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-2 max-w-md text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {/* Filter tabs */}
            <div
              className="flex flex-wrap items-center gap-x-1 gap-y-2"
              role="tablist"
              aria-label={`${title} categories`}
            >
              {tabs.map((tab, i) => (
                <span key={tab.slug} className="flex items-center">
                  {i > 0 && (
                    <span aria-hidden="true" className="mx-1.5 text-[13px] text-champagne-deep">
                      —
                    </span>
                  )}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active === tab.slug}
                    onClick={() => setActive(tab.slug)}
                    className={`group relative cursor-pointer py-1 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                      active === tab.slug
                        ? "text-gold-dark"
                        : "text-muted-foreground hover:text-emerald-deep"
                    }`}
                  >
                    {tab.name}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-gold transition-all duration-500 ease-out ${
                        active === tab.slug ? "w-full" : "w-0 group-hover:w-1/2"
                      }`}
                    />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-gold/40 via-champagne-deep to-transparent" />
        </motion.div>

        {/* Grid with fade transition on tab switch */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {loading ? (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                  {Array.from({ length: limit }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="aspect-[3/4] animate-pulse rounded-2xl bg-silver/30" />
                      <div className="h-2.5 w-16 animate-pulse rounded bg-silver/30" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-silver/30" />
                      <div className="h-3 w-20 animate-pulse rounded bg-silver/30" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-champagne-deep bg-parchment/50 px-6 py-20 text-center">
                  <p className="font-playfair text-xl text-emerald-deep">
                    Nothing here yet
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    New pieces are added every week — check back soon.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                  {products.slice(0, limit).map((product, i) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      priority={i < 5}
                      index={i}
                      className="h-full"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {viewAllHref && (
          <div className="mt-8 flex justify-center">
            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-2 border-b border-gold/40 pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark transition-colors duration-300 hover:border-gold"
            >
              View all {title.toLowerCase()}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
