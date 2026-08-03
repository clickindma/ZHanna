"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface SimpleProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category?: { name: string } | null;
}

export function NewsletterSection() {
  const [products, setProducts] = useState<SimpleProduct[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?limit=6&sort=newest");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products ?? []);
        }
      } catch {
        // Silently fail - section just won't show products
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="bg-ice/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        {/* Heading */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <h2 className="font-playfair text-3xl font-semibold tracking-tight text-charcoal-brand sm:text-4xl">
              Explore More Designs
            </h2>
            <p className="mt-2 text-sm text-slate-brand">
              Fresh additions to our collection
            </p>
          </div>
          <Link
            href="/shop?sort=newest"
            className="group mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-teal transition-colors duration-300 hover:text-navy-brand sm:mt-0"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Horizontal product strip */}
        <div className="mt-10 flex gap-5 overflow-x-auto pb-4 scrollbar-none">
          {products.length > 0
            ? products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-56 flex-shrink-0 sm:w-64"
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-silver/50 bg-ice shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_-12px_rgba(14,143,176,0.2)]">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-display text-4xl italic text-teal/15">
                            {product.name[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-teal">
                        {product.category?.name ?? "Zhanna"}
                      </p>
                      <h3 className="mt-1 truncate font-playfair text-sm font-medium text-charcoal-brand transition-colors duration-300 group-hover:text-teal">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-charcoal-brand">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))
            : /* Skeleton placeholders */
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-56 flex-shrink-0 sm:w-64">
                  <div className="aspect-[4/5] animate-pulse rounded-lg bg-silver/30" />
                  <div className="mt-3 space-y-2">
                    <div className="h-2.5 w-16 animate-pulse rounded bg-silver/30" />
                    <div className="h-3.5 w-32 animate-pulse rounded bg-silver/30" />
                    <div className="h-3 w-20 animate-pulse rounded bg-silver/30" />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
