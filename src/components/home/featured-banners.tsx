"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Tilt3D } from "@/components/shared/tilt-3d";
import type { HomeBannerContent } from "@/types/homepage";

// Default images for featured banners (from assets/image-1 and image-2)
const DEFAULT_BANNER_IMAGES = [
  "/brand/featured-banner-1.jpg",
  "/brand/featured-banner-2.jpg",
];

export function FeaturedBanners({ banners }: { banners: HomeBannerContent[] }) {
  const visible = banners.filter((banner) => banner.enabled);
  if (visible.length === 0) return null;

  const titles = ["Your Everyday Sparkle", "Gifting Made Easy"];

  return (
    <section id="featured" className="bg-snow">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-6 md:grid-cols-2">
          {visible.map((banner, i) => {
            const displayTitle = titles[i] ?? banner.title;
            // Use admin image if set, otherwise fall back to default banner images
            const bannerImage = banner.image || DEFAULT_BANNER_IMAGES[i] || null;

            return (
              <motion.div
                key={`${banner.title}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
              <Tilt3D maxTilt={4} scale={1.01} className="h-full rounded-xl">
                <Link
                  href={banner.ctaHref}
                  className="group relative block h-full min-h-[20rem] overflow-hidden rounded-xl transition-transform duration-500 hover:-translate-y-1 sm:min-h-[26rem]"
                >
                  {/* Background gradient fallback */}
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-brand via-[#132d3e] to-teal" />

                  {/* Banner image */}
                  {bannerImage && (
                    <>
                      <Image
                        src={bannerImage}
                        alt={displayTitle}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-navy-brand/80 via-navy-brand/40 to-transparent"
                        style={{ opacity: (banner.overlayOpacity ?? 72) / 100 }}
                      />
                    </>
                  )}

                  {/* Content overlay */}
                  <div className="relative flex h-full min-h-[20rem] flex-col justify-end p-6 sm:min-h-[26rem] sm:p-10">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-aqua">
                      {banner.eyebrow}
                    </p>
                    <h3 className="mt-2.5 font-playfair text-2xl font-semibold leading-tight text-snow sm:mt-3 sm:text-4xl">
                      {displayTitle}
                    </h3>
                    <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-silver/80 sm:mt-3">
                      {banner.subtitle}
                    </p>
                    <span className="mt-5 inline-flex w-fit items-center gap-2 border-b border-aqua/50 pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-aqua transition-colors duration-300 group-hover:border-snow group-hover:text-snow sm:mt-6">
                      {banner.ctaLabel}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Tilt3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
