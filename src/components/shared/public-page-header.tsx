import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/breadcrumbs";

interface PublicPageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function PublicPageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs = [{ label: "Home", href: "/" }],
}: PublicPageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-champagne-deep bg-champagne/40">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-dark">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-playfair text-4xl font-medium leading-tight text-navy sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        <div className="mt-8 h-px w-24 bg-gradient-to-r from-gold-dark to-gold" />
      </div>
    </section>
  );
}
