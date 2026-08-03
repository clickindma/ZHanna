import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getProducts } from "@/lib/queries/products";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SearchHero } from "@/components/search/search-hero";
import { ProductGrid } from "@/components/product/product-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the Zhanna collection of handcrafted artificial diamond, oxidized and fashion jewellery.",
};

const POPULAR_SEARCHES = [
  "Solitaire",
  "Oxidised",
  "Chandbali",
  "Tennis bracelet",
  "Jhumka",
  "Gold plated",
];

type SearchParam = string | string[] | undefined;

function first(value: SearchParam): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, SearchParam>>;
}) {
  const params = await searchParams;
  const q = first(params.q)?.trim() ?? "";

  const { products, total } = await getProducts({ search: q, limit: 48 });

  return (
    <>
      {/* Search Hero Section */}
      <section className="relative overflow-hidden border-b border-champagne-deep bg-parchment">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gold/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-emerald/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Search" }]}
          />

          <div className="mx-auto mt-10 max-w-3xl text-center">
            <h1 className="font-playfair text-4xl leading-tight text-emerald-deep sm:text-5xl lg:text-6xl">
              {q ? (
                <>
                  Results for{" "}
                  <span className="text-gradient-gold italic">&ldquo;{q}&rdquo;</span>
                </>
              ) : (
                <>
                  Search the{" "}
                  <span className="text-gradient-gold italic">Collection</span>
                </>
              )}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {q
                ? `We found ${total} ${total === 1 ? "piece" : "pieces"} matching your search.`
                : "Find your next piece by name, material or style."}
            </p>

            {/* Large Centered Search Input */}
            <div className="mt-8">
              <SearchHero initialQuery={q} />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {q ? (
          <>
            {total === 0 ? (
              /* No Results State */
              <div className="mx-auto max-w-2xl">
                <div className="flex flex-col items-center rounded-2xl border border-champagne-deep bg-parchment/40 px-8 py-16 text-center shadow-sm">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-champagne/60">
                    <Sparkles className="h-7 w-7 text-gold-dark" />
                  </div>
                  <h2 className="mt-6 font-playfair text-2xl text-emerald-deep">
                    No pieces found
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    We couldn&apos;t find anything matching &ldquo;{q}&rdquo;. Try a
                    different term or explore our popular searches below.
                  </p>
                  <div className="mt-8 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <Link
                        key={term}
                        href={`/search?q=${encodeURIComponent(term)}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-white px-4 py-2 text-xs font-medium text-gold-dark shadow-sm transition-all hover:bg-gold hover:text-white hover:shadow-md"
                      >
                        <Sparkles className="h-3 w-3" />
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-8 text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-emerald-deep">{total}</span>{" "}
                  {total === 1 ? "piece" : "pieces"} for &ldquo;
                  <span className="font-medium text-gold-dark">{q}</span>&rdquo;
                </p>
                <ProductGrid products={products} />
              </>
            )}
          </>
        ) : (
          /* Empty State - No query */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-champagne-deep bg-parchment/30 px-6 py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-champagne/60">
              <Sparkles className="h-6 w-6 text-gold-dark" />
            </div>
            <p className="mt-6 font-playfair text-2xl text-emerald-deep">
              Start typing to explore
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Try &ldquo;solitaires&rdquo;, &ldquo;oxidised&rdquo;, &ldquo;chandbali&rdquo;
              or &ldquo;tennis bracelet&rdquo;.
            </p>
            <div className="mt-8 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-white px-4 py-2 text-xs font-medium text-gold-dark shadow-sm transition-all hover:bg-gold hover:text-white hover:shadow-md"
                >
                  <Sparkles className="h-3 w-3" />
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
