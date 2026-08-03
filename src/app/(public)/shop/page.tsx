import type { Metadata } from "next";
import { getProducts } from "@/lib/queries/products";
import { getCategories } from "@/lib/queries/categories";
import { pricePresetToRange } from "@/lib/filters";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Filters } from "@/components/product/filters";
import { FiltersSheet } from "@/components/product/filters-sheet";
import { ProductGrid } from "@/components/product/product-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Explore Zhanna's collection of handcrafted artificial diamond, oxidized and fashion jewellery — rings, necklaces, earrings, bracelets and pendants.",
};

type SearchParam = string | string[] | undefined;

function first(value: SearchParam): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, SearchParam>>;
}) {
  const params = await searchParams;

  const category = first(params.category);
  const search = first(params.search);
  const sort = first(params.sort);
  const price = first(params.price);
  const featured = first(params.featured) === "true";
  const newArrival = first(params.newArrival) === "true";
  const range = pricePresetToRange(price);

  const [{ products, total }, categories] = await Promise.all([
    getProducts({
      category,
      search,
      sort,
      featured: featured || undefined,
      newArrival: newArrival || undefined,
      minPrice: range.minPrice,
      maxPrice: range.maxPrice,
    }),
    getCategories(),
  ]);

  const activeCategory = categories.find((entry) => entry.slug === category);
  const totalInAll = categories.reduce(
    (sum, entry) => sum + entry.productCount,
    0
  );

  return (
    <>
      {/* Elegant Page Header */}
      <section className="relative overflow-hidden border-b border-champagne-deep bg-parchment">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-emerald/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "The Collection", href: "/shop" },
              ...(activeCategory
                ? [{ label: activeCategory.name }]
                : []),
            ]}
          />

          <div className="mt-8">
            <h1 className="font-playfair text-4xl leading-tight text-emerald-deep sm:text-5xl lg:text-6xl">
              {activeCategory ? (
                <>
                  {activeCategory.name}{" "}
                  <span className="text-gradient-gold italic">Collection</span>
                </>
              ) : (
                <>
                  The{" "}
                  <span className="text-gradient-gold italic">Collection</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {activeCategory?.description ??
                "Handcrafted artificial diamond, oxidized and fashion jewellery — each piece finished to be worn, loved and remembered."}
            </p>
            {/* Decorative divider */}
            <div className="mt-8 h-px w-20 bg-gradient-to-r from-gold via-gold-dark to-transparent" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-14">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-champagne-deep bg-white/60 p-6 shadow-sm backdrop-blur-sm">
                <p className="mb-6 font-playfair text-lg text-emerald-deep">
                  Refine <span className="text-gold-dark italic">Results</span>
                </p>
                <Filters
                  categories={categories}
                  active={{
                    category,
                    search,
                    sort,
                    price,
                    featured: featured ? "true" : undefined,
                    newArrival: newArrival ? "true" : undefined,
                  }}
                  totalProducts={total}
                  totalInAll={totalInAll}
                />
              </div>
            </div>
          </aside>

          {/* Product Area */}
          <div className="min-w-0">
            {/* Top bar with count and mobile filter */}
            <div className="mb-8 flex items-center justify-between gap-4 rounded-xl border border-champagne-deep/50 bg-white/60 px-5 py-3.5 shadow-sm backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-emerald-deep">{total}</span>{" "}
                {total === 1 ? "piece" : "pieces"}
                {search && (
                  <>
                    {" "}
                    for &ldquo;<span className="font-medium text-gold-dark">{search}</span>&rdquo;
                  </>
                )}
              </p>
              <div className="lg:hidden">
                <FiltersSheet
                  categories={categories}
                  active={{
                    category,
                    search,
                    sort,
                    price,
                    featured: featured ? "true" : undefined,
                    newArrival: newArrival ? "true" : undefined,
                  }}
                  totalProducts={total}
                />
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </>
  );
}
