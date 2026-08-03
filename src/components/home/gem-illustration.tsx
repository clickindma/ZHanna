"use client";

import { motion } from "framer-motion";

const SPARKLES = [
  { x: 96, y: 96, delay: 0 },
  { x: 322, y: 118, delay: 1.2 },
  { x: 340, y: 286, delay: 0.6 },
  { x: 84, y: 272, delay: 1.8 },
  { x: 206, y: 60, delay: 0.9 },
];

export function GemIllustration() {
  return (
    <motion.svg
      viewBox="0 0 420 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        <linearGradient id="zhPendantCrown" x1="210" y1="110" x2="210" y2="184" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8BE0F2" />
          <stop offset="0.55" stopColor="#16B5D8" />
          <stop offset="1" stopColor="#0E8FB0" />
        </linearGradient>
        <linearGradient id="zhPendantPavilion" x1="210" y1="168" x2="210" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16B5D8" />
          <stop offset="0.5" stopColor="#0E8FB0" />
          <stop offset="1" stopColor="#0B6C88" />
        </linearGradient>
        <linearGradient id="zhPendantGold" x1="120" y1="110" x2="292" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9BE7F7" />
          <stop offset="0.5" stopColor="#16B5D8" />
          <stop offset="1" stopColor="#0E8FB0" />
        </linearGradient>
        <radialGradient id="zhPendantGlow" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#6FD7EE" stopOpacity="0.9" />
          <stop offset="1" stopColor="#6FD7EE" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.g
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="210" cy="252" r="188" fill="url(#zhPendantGlow)" opacity="0.35" />

        <path
          d="M78 190 C118 74, 150 40, 210 40 C270 40, 302 74, 342 190"
          stroke="url(#zhPendantGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M110 96 C132 60, 168 34, 210 34 C252 34, 288 60, 310 96"
          stroke="url(#zhPendantGold)"
          strokeWidth="1.25"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />

        <circle cx="80" cy="184" r="5.5" fill="url(#zhPendantCrown)" stroke="url(#zhPendantGold)" strokeWidth="1" />
        <circle cx="340" cy="184" r="5.5" fill="url(#zhPendantCrown)" stroke="url(#zhPendantGold)" strokeWidth="1" />

        <rect x="203" y="48" width="14" height="22" rx="7" fill="url(#zhPendantGold)" />

        <path
          d="M210 128 L268 156 L292 186 L248 236 L210 336 L172 236 L128 186 L152 156 Z"
          fill="url(#zhPendantPavilion)"
          stroke="#062B3A"
          strokeWidth="1.25"
        />
        <path
          d="M210 146 L250 166 L256 192 L210 206 L164 192 L170 166 Z"
          fill="url(#zhPendantCrown)"
          stroke="url(#zhPendantGold)"
          strokeOpacity="0.75"
          strokeWidth="0.75"
        />

        <g stroke="#16B5D8" strokeOpacity="0.6" strokeWidth="0.9">
          <path d="M250 166 L268 156 M256 192 L292 186 M164 192 L128 186 M170 166 L152 156" />
          <path d="M292 186 L248 236 M128 186 L172 236 M248 236 L210 336 M172 236 L210 336" />
          <path d="M210 206 L210 336" />
          <path d="M152 156 L164 192 M268 156 L256 192" />
        </g>

        <path
          d="M196 150 L210 160 L224 150 L210 186 Z"
          fill="#EDF9FC"
          opacity="0.85"
        />

        <circle cx="210" cy="210" r="52" fill="url(#zhPendantGlow)" opacity="0.3" />
      </motion.g>

      {SPARKLES.map(({ x, y, delay }, i) => (
        <motion.path
          key={i}
          d={`M${x} ${y - 9} L${x + 2.4} ${y - 2.4} L${x + 9} ${y} L${x + 2.4} ${y + 2.4} L${x} ${y + 9} L${x - 2.4} ${y + 2.4} L${x - 9} ${y} L${x - 2.4} ${y - 2.4} Z`}
          fill="#9BE7F7"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{
            duration: 3.2,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.svg>
  );
}
