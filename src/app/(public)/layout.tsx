import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FooterMarquee } from "@/components/layout/footer-marquee";
import { BottomNav } from "@/components/layout/bottom-nav";
import { BackToTop } from "@/components/layout/back-to-top";
import { getSiteSettings } from "@/lib/queries/site-settings";

export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  // Map navLinks for the header
  const navLinks = settings.navLinks.map((link: { label: string; href: string; children?: { label: string; href: string }[] }) => ({
    label: link.label,
    href: link.href,
    children: link.children?.map((child: { label: string; href: string }) => ({
      label: child.label,
      href: child.href,
    })),
  }));

  return (
    <div className="flex min-h-screen flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Header navLinks={navLinks} />
      <main className="flex-1">{children}</main>
      <FooterMarquee />
      <Footer
        description={settings.footerDescription}
        footerLinks={settings.footerLinks}
        socialLinks={settings.socialLinks}
        copyrightText={settings.copyrightText}
        email={settings.email}
        phone={settings.phone}
        address={settings.address}
      />
      <BottomNav />
      <BackToTop />
    </div>
  );
}
