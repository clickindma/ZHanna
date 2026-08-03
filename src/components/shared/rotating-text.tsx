"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function RotatingText({
  words,
  interval = 3000,
  className = "",
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={`relative inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 20, rotateX: -40, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, rotateX: 40, filter: "blur(4px)" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-block"
          style={{ perspective: 600 }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
