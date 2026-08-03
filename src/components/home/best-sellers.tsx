import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/queries/products";
import { BestSellersGrid } from "@/components/home/best-sellers-grid";

export async function BestSellers() {
  const { products } = await getProducts({ featured: true, limit: 8 });

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-ice/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <h2 className="font-playfair text-3xl font-semibold tracking-tight text-charcoal-brand sm:text-4xl lg:text-5xl">
            Best Sellers
          </h2>
          <div className="mt-5 h-px w-16 bg-gradient-to-r from-transparent via-teal to-transparent" />
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-brand">
            Our most loved pieces — handpicked by thousands of happy customers.
          </p>
        </div>

        {/* Product Grid */}
        <BestSellersGrid products={products} />

        {/* View all */}
        <div className="mt-14 text-center">
          <Link
            href="/shop?sort=featured"
            className="group inline-flex items-center gap-2.5 border border-teal px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal transition-all duration-500 hover:-translate-y-0.5 hover:bg-teal hover:text-snow hover:shadow-[0_16px_40px_-12px_rgba(14,143,176,0.4)]"
          >
            View all best sellers
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
