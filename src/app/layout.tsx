import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { BRAND } from "@/lib/constants";
import { getSeoSettings } from "@/lib/queries/seo";
import { SEO_DEFAULTS } from "@/types/seo";
import "./globals.css";

export const dynamic = "force-dynamic";

const playfair = localFont({
  variable: "--font-playfair",
  display: "swap",
  src: [
    { path: "./fonts/playfair-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/playfair-italic-400.woff2", weight: "400", style: "italic" },
    { path: "./fonts/playfair-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/playfair-italic-500.woff2", weight: "500", style: "italic" },
    { path: "./fonts/playfair-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/playfair-italic-600.woff2", weight: "600", style: "italic" },
    { path: "./fonts/playfair-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/playfair-italic-700.woff2", weight: "700", style: "italic" },
  ],
});

const cormorant = localFont({
  variable: "--font-cormorant",
  display: "swap",
  src: [
    { path: "./fonts/cormorant-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cormorant-italic-400.woff2", weight: "400", style: "italic" },
    { path: "./fonts/cormorant-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant-italic-500.woff2", weight: "500", style: "italic" },
    { path: "./fonts/cormorant-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/cormorant-italic-600.woff2", weight: "600", style: "italic" },
    { path: "./fonts/cormorant-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/cormorant-italic-700.woff2", weight: "700", style: "italic" },
  ],
});

const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    { path: "./fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-italic-400.woff2", weight: "400", style: "italic" },
    { path: "./fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/inter-italic-500.woff2", weight: "500", style: "italic" },
    { path: "./fonts/inter-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/inter-700.woff2", weight: "700", style: "normal" },
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  let settings = SEO_DEFAULTS;
  try {
    settings = await getSeoSettings();
  } catch (error) {
    console.error("Failed to load SEO settings, falling back to defaults:", error);
  }
  const siteUrl = new URL("https://zhannajewels.in");

  const defaultTitle = settings.siteTitle || `${BRAND.name} | ${BRAND.tagline}`;

  const icons: Metadata["icons"] = {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  };
  if (settings.favicon) {
    icons.icon = settings.favicon;
    icons.shortcut = settings.favicon;
  }

  return {
    metadataBase: siteUrl,
    title: {
      default: defaultTitle,
      template: `%s | ${BRAND.name}`,
    },
    description: settings.metaDescription,
    keywords: settings.metaKeywords,
    authors: [{ name: BRAND.company }],
    openGraph: {
      title: defaultTitle,
      description: settings.metaDescription,
      type: "website",
      locale: "en_IN",
      siteName: BRAND.name,
      url: siteUrl,
      ...(settings.ogImage
        ? { images: [{ url: settings.ogImage, width: 1200, height: 630, alt: BRAND.name }] }
        : {}),
    },
    icons,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "font-sans",
          }}
        />
      </body>
    </html>
  );
}
