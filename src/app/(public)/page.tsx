import { Hero } from "@/components/home/hero";
import { CategoriesMarquee } from "@/components/home/categories-marquee";
import { MarqueeStrip } from "@/components/home/marquee-strip";
import { FeaturedBanners } from "@/components/home/featured-banners";
import { CategoriesSection } from "@/components/home/categories-section";
import { BestSellers } from "@/components/home/best-sellers";
import { TrustBadges } from "@/components/home/trust-badges";
import { CampaignSection } from "@/components/home/campaign-section";
import { ShopByGender } from "@/components/home/shop-by-gender";
import { AboutBrand } from "@/components/home/about-brand";
import { CtaBanner } from "@/components/home/cta-banner";
import { NewsletterSection } from "@/components/home/newsletter";
import { SectionReveal } from "@/components/shared/section-reveal";
import { getHomepageContent } from "@/lib/queries/homepage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getHomepageContent();

  return (
    <>
      <Hero content={content.hero} heroImages={content.heroImages} />
      <CategoriesMarquee />
      <MarqueeStrip />

      <SectionReveal style="float">
        <FeaturedBanners banners={content.featuredBanners} />
      </SectionReveal>

      <SectionReveal style="flip" delay={0.05}>
        <CategoriesSection />
      </SectionReveal>

      <SectionReveal style="wave">
        <BestSellers />
      </SectionReveal>

      <SectionReveal style="rise" delay={0.05}>
        <TrustBadges items={content.trustBadges} />
      </SectionReveal>

      <SectionReveal style="flip">
        <CampaignSection collections={content.collections} />
      </SectionReveal>

      <SectionReveal style="float">
        <ShopByGender tiles={content.genderTiles} />
      </SectionReveal>

      <SectionReveal style="wave">
        <AboutBrand about={content.about} />
      </SectionReveal>

      <SectionReveal style="rise">
        <CtaBanner
          title={content.ctaTitle}
          subtitle={content.ctaSubtitle}
          buttonLabel={content.ctaButtonLabel}
          buttonHref={content.ctaButtonHref}
          image={content.ctaImage}
        />
      </SectionReveal>

      <SectionReveal style="float">
        <NewsletterSection />
      </SectionReveal>
    </>
  );
}
