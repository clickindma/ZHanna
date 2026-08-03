"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tilt3D } from "@/components/shared/tilt-3d";

interface CategoryItem {
  name: string;
  slug: string;
  productCount?: number;
  image?: string | null;
}

const GRADIENTS = [
  "from-teal/20 via-ice to-snow",
  "from-navy-brand/10 via-ice to-snow",
  "from-aqua/20 via-ice to-snow",
  "from-silver/40 via-ice to-snow",
  "from-turquoise/15 via-ice to-snow",
];

export function CategoriesGrid({ categories }: { categories: CategoryItem[] }) {
  return (
    <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((category, i) => (
        <motion.div
          key={category.slug}
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{
            duration: 0.65,
            delay: (i % 5) * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            y: -8,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <Link
            href={`/shop?category=${category.slug}`}
            className="group flex flex-col items-center"
          >
            {/* Image placeholder */}
            <Tilt3D maxTilt={7} scale={1.03} className="w-full rounded-xl">
            <div
              className={`relative aspect-square w-full overflow-hidden rounded-xl border border-silver/60 bg-gradient-to-b ${GRADIENTS[i % GRADIENTS.length]} shadow-sm transition-all duration-500 group-hover:border-teal/40 group-hover:shadow-[0_20px_50px_-15px_rgba(14,143,176,0.25)]`}
            >
              {category.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-6xl italic text-teal/20 transition-all duration-500 group-hover:scale-110 group-hover:text-teal/40">
                    {category.name[0]}
                  </span>
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-navy-brand/0 transition-colors duration-500 group-hover:bg-navy-brand/10" />
            </div>
            </Tilt3D>

            {/* Name */}
            <h3 className="mt-4 text-center font-playfair text-base font-medium text-charcoal-brand transition-colors duration-300 group-hover:text-teal">
              {category.name}
            </h3>
            {category.productCount != null && category.productCount > 0 && (
              <p className="mt-1 text-[11px] text-slate-brand">
                {category.productCount} pieces
              </p>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
