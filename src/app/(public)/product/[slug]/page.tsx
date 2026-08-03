import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { BRAND } from "@/lib/constants";
import { getSessionUser } from "@/lib/admin";
import { getWishlistIds } from "@/lib/queries/account";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductGrid } from "@/components/product/product-grid";
import { WishlistButton } from "@/components/product/wishlist-button";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Piece not found" };
  }

  return {
    title: product.seoTitle ?? `${product.name} | ${BRAND.name}`,
    description:
      product.seoDescription ??
      product.shortDescription ??
      `${product.description.slice(0, 155)}…`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);
  const session = await getSessionUser();
  const wishlist = session ? await getWishlistIds(session.id) : [];

  return (
    <>
      {/* Breadcrumbs Section */}
      <section className="border-b border-champagne-deep/50 bg-parchment/30">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "The Collection", href: "/shop" },
              ...(product.category
                ? [
                    {
                      label: product.category.name,
                      href: `/shop?category=${product.category.slug}`,
                    },
                  ]
                : []),
              { label: product.name },
            ]}
          />
        </div>
      </section>

      {/* Product Main Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <ProductGallery product={product} />
          <ProductInfo
            product={product}
            wishlistButton={
              <WishlistButton
                productId={product._id}
                initialWishlist={wishlist.includes(product._id)}
              />
            }
          />
        </div>
      </section>

      {/* The Story Section */}
      <section className="border-t border-champagne-deep bg-parchment/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-semibold tracking-[0.4em] text-gold-dark uppercase">
              The Story
            </p>
            <h2 className="mt-4 font-playfair text-3xl text-emerald-deep sm:text-4xl">
              Behind the{" "}
              <span className="text-gradient-gold italic">piece</span>
            </h2>
            <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <p className="mt-8 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {product.description}
            </p>
            {product.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-champagne-deep bg-white px-3.5 py-1.5 text-xs text-muted-foreground shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t border-champagne-deep bg-ivory">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <p className="text-[10px] font-semibold tracking-[0.4em] text-gold-dark uppercase">
                Complete the look
              </p>
              <h2 className="mt-4 font-playfair text-3xl text-emerald-deep sm:text-4xl">
                You may also{" "}
                <span className="text-gradient-gold italic">love</span>
              </h2>
              <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
            </div>
            <div className="mt-12">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
