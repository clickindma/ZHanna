import { Hero } from "@/components/home/hero";
import { PromoStrip } from "@/components/home/promo-strip";
import { ProductCarousel } from "@/components/home/product-carousel";
import { FeaturedBanner } from "@/components/home/featured-banner";
import { ProductTabs } from "@/components/home/product-tabs";
import { CategoryBanners } from "@/components/home/category-banners";
import { FeaturesStrip } from "@/components/home/features-strip";
import { getHomepageContent } from "@/lib/queries/homepage";
import { getProducts } from "@/lib/queries/products";
import { getCategories } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getHomepageContent();

  const [categories, newArrivals, { products: featured }] = await Promise.all([
    getCategories(),
    getProducts({ newArrival: true, sort: "newest", limit: 10 }),
    getProducts({ featured: true, sort: "newest", limit: 1 }),
  ]);

  const totalProducts = categories.reduce((sum, category) => sum + category.productCount, 0);
  const tabCategories = categories.map((category) => ({
    slug: category.slug,
    name: category.name,
  }));

  const productOfMonth = featured[0] ?? null;

  return (
    <>
      <Hero
        content={content.hero}
        heroImages={content.heroImages}
        categories={categories}
        productOfMonth={productOfMonth}
      />

      <PromoStrip />

      <ProductCarousel
        title="New Arrival"
        subtitle="Freshly crafted pieces, just landed in the collection."
        products={newArrivals.products}
        viewAllHref="/shop?newArrival=true"
      />

      <FeaturedBanner
        eyebrow="The Craft"
        title={content.ctaTitle}
        subtitle={content.ctaSubtitle}
        buttonLabel={content.ctaButtonLabel}
        buttonHref={content.ctaButtonHref}
        image={content.ctaImage}
      />

      <ProductTabs
        title="New Products"
        subtitle="Our latest designs, refreshed every week."
        categories={tabCategories}
        sort="newest"
        viewAllHref="/shop?sort=newest"
      />

      <CategoryBanners collections={content.collections} />

      <ProductTabs
        title="Trending Products"
        subtitle="The pieces everyone is adding to their wishlist."
        categories={tabCategories}
        sort="newest"
        featured
        viewAllHref="/shop?sort=featured"
      />

      <FeaturesStrip
        badges={content.trustBadges}
        stats={[
          { value: totalProducts, suffix: "+", label: "Handcrafted Pieces" },
          { value: categories.length, label: "Curated Categories" },
          { value: 100, suffix: "%", label: "Secure Payments" },
          { value: 7, suffix: " Days", label: "Easy Returns" },
        ]}
      />
    </>
  );
}
