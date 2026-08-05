"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronRight, ShoppingBag } from "lucide-react";
import type { HomeHeroContent } from "@/types/homepage";
import type { CategoryWithCount, ProductListItem } from "@/types/product";
import { ProductImage } from "@/components/product/product-image";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.25 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

interface HeroProps {
  content: HomeHeroContent;
  heroImages?: string[];
  categories: CategoryWithCount[];
  productOfMonth: ProductListItem | null;
}

/** Left column — "Shop by Categories" sidebar. */
function CategorySidebar({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const fallback = [
    { slug: "rings", name: "Rings" },
    { slug: "necklaces", name: "Necklaces" },
    { slug: "earrings", name: "Earrings" },
    { slug: "bracelets", name: "Bracelets" },
    { slug: "pendants", name: "Pendants" },
  ];
  const list =
    categories.length > 0
      ? categories
      : (fallback as unknown as CategoryWithCount[]);

  return (
    <aside className="hidden h-full lg:block">
      <div className="flex h-full flex-col rounded-2xl border border-champagne-deep bg-white/70 p-4 shadow-sm backdrop-blur-sm">
        <h2 className="flex items-center justify-between px-2 pb-3 font-playfair text-base text-emerald-deep">
          Shop by Categories
          <span className="h-px flex-1 bg-gradient-to-r from-gold/60 to-transparent" />
        </h2>
        <ul className="flex flex-1 flex-col gap-0.5">
          {list.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/shop?category=${category.slug}`}
                className="group flex items-center justify-between gap-2 rounded-lg px-2.5 py-2.5 transition-all duration-300 hover:bg-parchment hover:pl-3.5"
              >
                <span className="text-[13px] font-medium text-emerald-deep transition-colors duration-300 group-hover:text-gold-dark">
                  {category.name}
                </span>
                <span className="flex items-center gap-1.5">
                  {category.productCount != null && category.productCount > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      {category.productCount}
                    </span>
                  )}
                  <ChevronRight className="h-3.5 w-3.5 text-gold transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/shop"
          className="group mt-2 flex items-center justify-between rounded-lg border border-champagne-deep bg-parchment px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-dark transition-all duration-300 hover:border-gold/50 hover:bg-gold/10"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </aside>
  );
}

/** Center column — hero banner slider with parallax. */
function HeroSlider({
  content,
  images,
}: {
  content: HomeHeroContent;
  images: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % images.length),
      6000
    );
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div
      ref={ref}
      className="relative min-h-[26rem] overflow-hidden rounded-2xl sm:min-h-[30rem] lg:min-h-[32rem]"
    >
      {/* Slides with parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="absolute inset-0"
        >
          <motion.div style={{ y: parallaxY }} className="absolute inset-0">
            <Image
              src={images[currentSlide]}
              alt="Zhanna Jewellery Collection"
              fill
              priority={currentSlide === 0}
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-brand/85 via-navy-brand/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-brand/60 via-transparent to-navy-brand/25" />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex h-full min-h-[26rem] items-center px-6 py-10 sm:min-h-[30rem] sm:px-10 lg:min-h-[32rem]"
      >
        {/* Decorative sparkles */}
        <div className="pointer-events-none absolute top-10 right-12 hidden sm:block" aria-hidden="true">
          <span className="animate-sparkle block text-base text-aqua">+</span>
        </div>
        <div className="pointer-events-none absolute top-24 right-1/3 hidden md:block" aria-hidden="true">
          <span className="animate-sparkle-delay block text-sm text-turquoise">+</span>
        </div>
        <div className="pointer-events-none absolute bottom-16 right-24 hidden sm:block" aria-hidden="true">
          <span className="animate-sparkle-delay-2 block text-sm text-aqua/70">+</span>
        </div>

        <div className="max-w-xl">
          <motion.p
            variants={fadeUp}
            className="chip-luxe"
          >
            <span className="h-1 w-1 rounded-full bg-turquoise" />
            {content.eyebrow || "Exclusive Collection"}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-5 font-playfair text-3xl font-semibold leading-[1.1] tracking-tight text-snow sm:mt-6 sm:text-5xl lg:text-6xl"
          >
            {content.title.map((line, index) => (
              <span key={index} className={index === 1 ? "block" : ""}>
                {index === 1 ? (
                  <span className="font-display italic text-aqua">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-md text-sm leading-relaxed text-silver/85 sm:mt-5 sm:text-base"
          >
            {content.subheadline ||
              "Discover handcrafted artificial diamond & fashion jewellery crafted for every occasion."}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4"
          >
            <Link
              href={content.ctaPrimaryHref || "/shop"}
              className="group inline-flex items-center gap-2.5 bg-turquoise px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy-brand transition-all duration-500 hover:-translate-y-0.5 hover:bg-aqua hover:shadow-[0_20px_50px_-12px_rgba(22,181,216,0.5)] active:scale-[0.98]"
            >
              {content.ctaPrimaryLabel || "Shop Now"}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            {content.ctaSecondaryLabel && (
              <Link
                href={content.ctaSecondaryHref || "/shop?sort=newest"}
                className="inline-flex items-center gap-2 border border-silver/30 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-snow/90 backdrop-blur-sm transition-all duration-300 hover:border-aqua/50 hover:text-aqua active:scale-[0.98]"
              >
                {content.ctaSecondaryLabel}
              </Link>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Slide dots */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-6 flex items-center gap-2.5 sm:left-10">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-500 ${currentSlide === index
                  ? "h-2.5 w-7 rounded-full bg-turquoise shadow-[0_0_12px_rgba(22,181,216,0.6)]"
                  : "h-2.5 w-2.5 rounded-full bg-silver/40 hover:bg-silver/70"
                }`}
            />
          ))}
          <span className="ml-3 text-[10px] font-medium tracking-wider text-silver/50 uppercase">
            {String(currentSlide + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}

/** Right column — Product of the Month card. */
function ProductOfMonth({ product }: { product: ProductListItem | null }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  if (!product) return null;

  return (
    <aside className="hidden h-full lg:block">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-champagne-deep bg-white/70 shadow-sm backdrop-blur-sm">
        <p className="px-4 pt-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-gold-dark">
          Product of the Month
        </p>

        <Link
          href={`/product/${product.slug}`}
          className="relative mt-3 block aspect-square overflow-hidden px-4"
        >
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            name={product.name}
            imgClassName="rounded-xl transition-transform duration-[350ms] ease-out group-hover:scale-110"
          />
        </Link>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[9px] font-semibold tracking-[0.2em] text-gold-dark uppercase">
            {product.category?.name ?? "Zhanna"}
          </p>
          <h3 className="mt-1 font-playfair text-[16px] leading-snug text-emerald-deep transition-colors duration-300 group-hover:text-gold-dark">
            {product.name}
          </h3>
          <p className="mt-1.5 text-[15px] font-semibold text-emerald-deep">
            {formatPrice(product.price)}
          </p>

          <button
            type="button"
            onClick={() => {
              addItem({
                productId: product._id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                mrp: product.compareAtPrice ?? undefined,
                image: product.images[0],
                quantity: 1,
              });
              openCart();
            }}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-deep px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-light transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:text-navy-deep hover:shadow-[0_14px_30px_-10px_rgba(22,181,216,0.5)]"
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.8} />
            Add to cart
          </button>
        </div>
      </div>
    </aside>
  );
}

export function Hero({
  content,
  heroImages = [],
  categories,
  productOfMonth,
}: HeroProps) {
  const images =
    heroImages.length > 0
      ? heroImages
      : ["/brand/hero-banner-1.png", "/brand/hero-banner-2.png"];

  if (!content.enabled) return null;

  const mobileCategories = categories.length > 0 ? categories : [];

  return (
    <section className="bg-snow bg-luxe-glow">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Mobile category chips */}
        {mobileCategories.length > 0 && (
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none lg:hidden">
            {mobileCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="shrink-0 rounded-full border border-champagne-deep bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-deep shadow-sm transition-all duration-300 hover:border-gold/50 hover:text-gold-dark hover:shadow-[0_4px_12px_-3px_rgba(22,181,216,0.3)]"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,1.15fr)] lg:items-stretch">
          <CategorySidebar categories={categories} />
          <HeroSlider content={content} images={images} />
          <ProductOfMonth product={productOfMonth} />
        </div>
      </div>
    </section>
  );
}