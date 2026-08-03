"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

type RevealStyle = "float" | "flip" | "wave" | "rise";

interface SectionRevealProps {
  children: ReactNode;
  style?: RevealStyle;
  delay?: number;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const variants: Record<RevealStyle, Variants> = {
  float: {
    hidden: { opacity: 0, y: 60, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.9, ease: EASE },
    },
  },
  flip: {
    hidden: { opacity: 0, rotateX: 8, y: 40, scale: 0.97 },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.85, ease: EASE },
    },
  },
  wave: {
    hidden: { opacity: 0, y: 50, skewY: 1.5 },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: { duration: 0.8, ease: EASE },
    },
  },
  rise: {
    hidden: { opacity: 0, y: 80, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: EASE },
    },
  },
};

export function SectionReveal({
  children,
  style = "float",
  delay = 0,
  className,
}: SectionRevealProps) {
  const selectedVariants = variants[style];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.12 }}
      variants={{
        hidden: selectedVariants.hidden,
        visible: {
          ...(selectedVariants.visible as object),
          transition: {
            ...((selectedVariants.visible as { transition?: object })?.transition ?? {}),
            delay,
          },
        },
      }}
      style={{ perspective: style === "flip" ? 1200 : undefined }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
