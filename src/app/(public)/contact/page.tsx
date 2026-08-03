import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/shared/reveal";
import { getSiteSettings } from "@/lib/queries/site-settings";
import { BRAND } from "@/lib/constants";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
} from "@/components/shared/social-icons";

export const dynamic = "force-dynamic";

const SOCIAL_ICON_MAP: Record<string, React.ElementType> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const {
    email,
    phone,
    address,
    city,
    mapEmbedUrl,
    businessHours,
    socialLinks,
    contactSubtitle,
  } = settings;

  const channels = [
    {
      Icon: Mail,
      label: "Email us",
      value: email || BRAND.email,
      href: `mailto:${email || BRAND.email}`,
    },
    {
      Icon: Phone,
      label: "Call us",
      value: phone || BRAND.phone,
      href: `tel:${(phone || BRAND.phone).replace(/\s/g, "")}`,
    },
    {
      Icon: MapPin,
      label: "Visit us",
      value: `${address || BRAND.address}${city ? `, ${city}` : ""}`,
    },
    {
      Icon: Clock,
      label: "Client care hours",
      value: businessHours.length > 0
        ? businessHours.map((bh) => `${bh.day}: ${bh.hours}`).join(" · ")
        : "Mon–Sat · 10:00 AM – 7:00 PM IST",
    },
  ];

  return (
    <>
      <PublicPageHeader
        eyebrow="Client Care"
        title={
          <>
            We&apos;d love to{" "}
            <span className="text-gradient-gold italic">hear from you.</span>
          </>
        }
        description={contactSubtitle || "Questions about an order, a custom design, or a wholesale partnership — our client care team is here for you."}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/* Contact Info + Form */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Left: Info */}
          <div className="lg:col-span-2">
            <Reveal>
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-dark">
                Reach us
              </p>
              <h2 className="mt-4 font-playfair text-3xl font-medium leading-tight text-navy sm:text-4xl">
                Every message is answered{" "}
                <span className="text-gradient-gold italic">by a human.</span>
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                No bots, no call centers — just the team behind your jewellery.
                Expect a thoughtful reply within one business day.
              </p>
            </Reveal>

            <div className="mt-9 space-y-5">
              {channels.map(({ Icon, label, value, href }) => (
                <Reveal key={label} delay={0.05}>
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-dark">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-1 block text-[15px] font-medium text-navy transition-colors hover:text-gold-dark"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 text-[15px] font-medium text-navy">
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <Reveal delay={0.15}>
                <div className="mt-9 flex items-center gap-3">
                  {socialLinks.map((social) => {
                    const Icon = SOCIAL_ICON_MAP[social.icon] || InstagramIcon;
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.platform}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne-deep text-navy/70 transition-all duration-300 hover:border-gold hover:text-gold-dark"
                      >
                        <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                      </a>
                    );
                  })}
                </div>
              </Reveal>
            )}

            {/* Business Hours Card */}
            {businessHours.length > 0 && (
              <Reveal delay={0.2}>
                <div className="mt-10 rounded-2xl border border-champagne-deep bg-navy-deep p-6 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
                    Business Hours
                  </p>
                  <div className="mt-4 space-y-2">
                    {businessHours.map((bh) => (
                      <div
                        key={bh.day}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-white/60">{bh.day}</span>
                        <span className="font-medium text-gold-light">
                          {bh.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Google Maps Embed */}
      {mapEmbedUrl && (
        <section className="border-t border-champagne-deep">
          <Reveal>
            <div className="relative h-[400px] w-full overflow-hidden">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Zhanna Store Location"
                className="absolute inset-0"
              />
            </div>
          </Reveal>
        </section>
      )}

      {/* FAQ / Additional Info */}
      <section className="border-t border-champagne-deep bg-champagne/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-dark">
                Good to know
              </p>
              <h2 className="mt-4 font-playfair text-3xl font-medium leading-tight text-navy sm:text-4xl">
                Before you{" "}
                <span className="text-gradient-gold italic">write in</span>
              </h2>
            </div>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4">
            {[
              {
                question: "How long does dispatch take?",
                answer:
                  "In-stock pieces are dispatched within 24–48 hours. Made-to-order designs take 5–7 business days, and we confirm timelines by email.",
              },
              {
                question: "Can I get a custom or bespoke piece?",
                answer:
                  "Yes. Share your inspiration and budget via this form and our design atelier will guide you through stones, metals and sizes.",
              },
              {
                question: "Do you offer repair or re-sizing?",
                answer:
                  "We provide free re-sizing within 30 days of purchase and paid servicing for lifetime. Write to us with your order details.",
              },
            ].map((faq) => (
              <Reveal key={faq.question}>
                <details className="group rounded-xl border border-champagne-deep bg-background p-6 transition-colors open:border-gold/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-playfair text-lg text-navy [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span className="text-gold-dark transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
