"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealVariant = "fade-up" | "flip" | "scale";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  variant?: RevealVariant;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = false,
  variant = "fade-up",
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const hidden =
    variant === "flip"
      ? { opacity: 0, y: 24, rotateY: 16, scale: 0.97 }
      : variant === "scale"
        ? { opacity: 0, scale: 0.93, y: 10 }
        : { opacity: 0, y };

  const show =
    variant === "flip"
      ? { opacity: 1, y: 0, rotateY: 0, scale: 1 }
      : variant === "scale"
        ? { opacity: 1, scale: 1, y: 0 }
        : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={show}
      viewport={{ once, amount: 0.2, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      style={variant === "flip" ? { transformPerspective: 1000 } : undefined}
    >
      {children}
    </motion.div>
  );
}
