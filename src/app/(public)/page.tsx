import { Hero } from "@/components/home/hero";
import { JewelBackdrop } from "@/components/home/jewel-backdrop";
import { CategoryIconStrip } from "@/components/home/category-icon-strip";
import { PromoStrip } from "@/components/home/promo-strip";
import { ProductCarousel } from "@/components/home/product-carousel";
import { ProductTabs } from "@/components/home/product-tabs";
import { SplitPromo } from "@/components/home/split-promo";
import { CategoryBanners } from "@/components/home/category-banners";
import { FeaturesStrip } from "@/components/home/features-strip";
import { BlogPreview } from "@/components/home/blog-preview";
import { GalleryMosaic } from "@/components/home/gallery-mosaic";
import { NewsletterBand } from "@/components/home/newsletter-band";
import { getHomepageContent } from "@/lib/queries/homepage";
import { getProducts } from "@/lib/queries/products";
import { getCategories } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getHomepageContent();

  const [categories, newArrivals, { products: featured }, showcase] =
    await Promise.all([
      getCategories(),
      getProducts({ newArrival: true, sort: "newest", limit: 10 }),
      getProducts({ featured: true, sort: "newest", limit: 1 }),
      getProducts({ featured: true, sort: "newest", limit: 8 }),
    ]);

  const totalProducts = categories.reduce((sum, category) => sum + category.productCount, 0);
  const tabCategories = categories.map((category) => ({
    slug: category.slug,
    name: category.name,
  }));

  const productOfMonth = featured[0] ?? null;

  return (
    <>
      <JewelBackdrop />
      <Hero
        content={content.hero}
        heroImages={content.heroImages}
        categories={categories}
        productOfMonth={productOfMonth}
      />

      <CategoryIconStrip />

      <PromoStrip />

      <ProductCarousel
        title="New Arrival"
        subtitle="Freshly crafted pieces, just landed in the collection."
        products={newArrivals.products}
        viewAllHref="/shop?newArrival=true"
      />

      <ProductTabs
        title="New Products"
        subtitle="Our latest designs, refreshed every week."
        categories={tabCategories}
        sort="newest"
        limit={8}
        viewAllHref="/shop?sort=newest"
      />

      <SplitPromo />

      <ProductTabs
        title="Trending Products"
        subtitle="The pieces everyone is adding to their wishlist."
        categories={tabCategories}
        sort="newest"
        featured
        limit={8}
        viewAllHref="/shop?sort=featured"
      />

      <CategoryBanners collections={content.collections} />

      <FeaturesStrip
        badges={content.trustBadges}
        stats={[
          { value: totalProducts, suffix: "+", label: "Handcrafted Pieces" },
          { value: categories.length, label: "Curated Categories" },
          { value: 100, suffix: "%", label: "Secure Payments" },
          { value: 7, suffix: " Days", label: "Easy Returns" },
        ]}
      />

      <BlogPreview />

      <GalleryMosaic />

      <NewsletterBand products={showcase.products} />
    </>
  );
}
