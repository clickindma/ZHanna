import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/queries/categories";
import { CATEGORIES } from "@/lib/constants";
import { CategoriesGrid } from "@/components/home/categories-grid";

const CATEGORY_IMAGES: Record<string, string> = {
  rings: "/brand/category-rings.jpg",
  earrings: "/brand/category-earrings.jpg",
  bracelets: "/brand/category-bracelets.jpg",
  pendants: "/brand/category-pendants.jpg",
  bridal: "/brand/category-bridal.jpg",
};

export async function CategoriesSection() {
  const dbCategories = await getCategories();
  const categories =
    dbCategories.length > 0
      ? dbCategories.map((c) => ({
          name: c.name,
          slug: c.slug,
          productCount: c.productCount,
          image: (c.image ?? CATEGORY_IMAGES[c.slug]) ?? null,
        }))
      : [...CATEGORIES].map((c) => ({
          name: c.name,
          slug: c.slug,
          productCount: 0,
          image: (CATEGORY_IMAGES[c.slug] as string | null) ?? null,
        }));

  return (
    <section className="bg-snow">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-playfair text-3xl font-semibold tracking-tight text-charcoal-brand sm:text-4xl lg:text-5xl">
            Shop By Category
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-teal to-transparent" />
        </div>

        {/* Grid */}
        <CategoriesGrid categories={categories} />

        {/* View all link */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-teal transition-colors duration-300 hover:text-navy-brand"
          >
            View all categories
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
