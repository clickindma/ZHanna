import type { CSSProperties } from "react";

interface BlobSpec {
  style: CSSProperties;
}

interface GemSpec {
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  sway: number;
}

interface SparkleSpec {
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
}

const BLOBS: BlobSpec[] = [
  {
    style: {
      top: "-8%",
      left: "-6%",
      width: "36rem",
      height: "36rem",
      ["--bx" as string]: "4rem",
      ["--by" as string]: "3.5rem",
      opacity: 0.5,
    },
  },
  {
    style: {
      top: "6%",
      right: "-8%",
      width: "30rem",
      height: "30rem",
      ["--bx" as string]: "-3rem",
      ["--by" as string]: "4rem",
      opacity: 0.38,
      animationDelay: "-9s",
    },
  },
  {
    style: {
      top: "46%",
      left: "38%",
      width: "26rem",
      height: "26rem",
      ["--bx" as string]: "3rem",
      ["--by" as string]: "-4rem",
      opacity: 0.3,
      animationDelay: "-16s",
    },
  },
  {
    style: {
      bottom: "-12%",
      left: "18%",
      width: "40rem",
      height: "40rem",
      ["--bx" as string]: "-4rem",
      ["--by" as string]: "-3rem",
      opacity: 0.42,
      animationDelay: "-5s",
    },
  },
  {
    style: {
      bottom: "-6%",
      right: "-4%",
      width: "28rem",
      height: "28rem",
      ["--bx" as string]: "3rem",
      ["--by" as string]: "3rem",
      opacity: 0.32,
      animationDelay: "-20s",
    },
  },
];

const GEMS: GemSpec[] = [
  { left: "4%", size: 16, duration: 30, delay: 0, opacity: 0.4, sway: 3 },
  { left: "12%", size: 9, duration: 22, delay: 6, opacity: 0.32, sway: 4 },
  { left: "20%", size: 22, duration: 38, delay: 12, opacity: 0.26, sway: 5 },
  { left: "29%", size: 11, duration: 26, delay: 3, opacity: 0.36, sway: 3 },
  { left: "37%", size: 15, duration: 34, delay: 18, opacity: 0.3, sway: 4 },
  { left: "46%", size: 8, duration: 20, delay: 9, opacity: 0.34, sway: 3 },
  { left: "54%", size: 18, duration: 36, delay: 2, opacity: 0.28, sway: 5 },
  { left: "62%", size: 10, duration: 24, delay: 14, opacity: 0.38, sway: 3 },
  { left: "70%", size: 14, duration: 32, delay: 7, opacity: 0.3, sway: 4 },
  { left: "78%", size: 9, duration: 22, delay: 20, opacity: 0.36, sway: 3 },
  { left: "86%", size: 20, duration: 40, delay: 11, opacity: 0.25, sway: 5 },
  { left: "94%", size: 12, duration: 28, delay: 4, opacity: 0.34, sway: 4 },
];

const SPARKLES: SparkleSpec[] = [
  { left: "6%", top: "16%", size: 14, duration: 3.4, delay: 0 },
  { left: "15%", top: "72%", size: 10, duration: 4.2, delay: 1.1 },
  { left: "24%", top: "34%", size: 16, duration: 3.8, delay: 2.3 },
  { left: "33%", top: "86%", size: 9, duration: 4.6, delay: 0.6 },
  { left: "41%", top: "24%", size: 12, duration: 3.2, delay: 1.8 },
  { left: "50%", top: "58%", size: 8, duration: 4.4, delay: 0.3 },
  { left: "58%", top: "12%", size: 15, duration: 3.6, delay: 2.7 },
  { left: "67%", top: "80%", size: 11, duration: 4.8, delay: 1.4 },
  { left: "75%", top: "38%", size: 13, duration: 3.3, delay: 0.9 },
  { left: "84%", top: "66%", size: 9, duration: 4.1, delay: 2.1 },
  { left: "92%", top: "28%", size: 15, duration: 3.7, delay: 1.6 },
];

/**
 * Decorative full-page animated backdrop for the homepage.
 * Pure CSS animation — no JS, zero re-renders. Sits behind all sections
 * (light sections are made translucent) so floating diamonds, twinkling
 * sparkles and soft turquoise gradient glows drift beneath the content.
 */
export function JewelBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="jewel-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Moving gradient glows */}
      {BLOBS.map((blob, i) => (
        <span key={i} className="jb-blob" style={blob.style} />
      ))}

      {/* Floating diamonds */}
      {GEMS.map((gem, i) => (
        <span
          key={i}
          className="jb-drift"
          style={
            {
              left: gem.left,
              animationDuration: `${gem.duration}s`,
              animationDelay: `${gem.delay}s`,
              ["--jb-o" as string]: gem.opacity,
            } as CSSProperties
          }
        >
          <span
            className="jb-sway"
            style={{ ["--jb-x" as string]: `${gem.sway}rem` } as CSSProperties}
          >
            <span
              className="jb-gem"
              style={
                {
                  width: gem.size,
                  height: gem.size,
                } as CSSProperties
              }
            />
          </span>
        </span>
      ))}

      {/* Twinkling sparkles */}
      {SPARKLES.map((sparkle, i) => (
        <span
          key={i}
          className="jb-sparkle"
          style={
            {
              left: sparkle.left,
              top: sparkle.top,
              fontSize: sparkle.size,
              animationDuration: `${sparkle.duration}s`,
              animationDelay: `${sparkle.delay}s`,
            } as CSSProperties
          }
        >
          ✦
        </span>
      ))}

      {/* Soft light sweep */}
      <span className="jb-sheen" />
    </div>
  );
}
