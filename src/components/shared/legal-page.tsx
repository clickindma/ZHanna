import { PublicPageHeader } from "@/components/shared/public-page-header";

export interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export function LegalPage({
  eyebrow,
  title,
  description,
  lastUpdated,
  sections,
}: LegalPageProps) {
  return (
    <>
      <PublicPageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: eyebrow }]}
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Last updated · {lastUpdated}
        </p>

        <div className="mt-10 space-y-12">
          {sections.map(({ heading, body }, index) => (
            <section key={heading}>
              <div className="flex items-baseline gap-4">
                <span className="font-playfair text-sm text-gold-dark">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-playfair text-2xl font-medium leading-snug text-navy sm:text-3xl">
                  {heading}
                </h2>
              </div>
              <div className="mt-5 space-y-4">
                {body.map((paragraph, paragraphIndex) => (
                  <p
                    key={paragraphIndex}
                    className="text-[15px] leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
