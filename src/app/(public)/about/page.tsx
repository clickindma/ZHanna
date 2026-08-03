import Image from "next/image";
import Link from "next/link";
import { Gem, ShieldCheck, Recycle, Sparkles, Target, Eye, ArrowRight } from "lucide-react";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { Reveal } from "@/components/shared/reveal";
import { getSiteSettings } from "@/lib/queries/site-settings";
import { BRAND } from "@/lib/constants";

export const dynamic = "force-dynamic";

const ICON_MAP: Record<string, React.ElementType> = {
  gem: Gem,
  shield: ShieldCheck,
  recycle: Recycle,
  sparkles: Sparkles,
  target: Target,
  eye: Eye,
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const {
    aboutTitle,
    aboutStory,
    aboutMission,
    aboutVision,
    aboutValues,
    aboutTeam,
    aboutStats,
    aboutCta,
    aboutBanner,
  } = settings;

  return (
    <>
      {/* Hero Banner */}
      {aboutBanner ? (
        <section className="relative h-[340px] overflow-hidden sm:h-[420px]">
          <Image
            src={aboutBanner}
            alt={aboutTitle || "About Zhanna"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/40 to-transparent" />
          <div className="relative flex h-full items-end">
            <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
              <h1 className="font-playfair text-4xl font-medium text-white sm:text-5xl lg:text-6xl">
                {aboutTitle || `About ${BRAND.name}`}
              </h1>
            </div>
          </div>
        </section>
      ) : (
        <PublicPageHeader
          eyebrow="The House of Zhanna"
          title={
            <>
              Luxury that lives in{" "}
              <span className="text-gradient-gold italic">every detail.</span>
            </>
          }
          description="Zhanna is an Indian house of artificial diamond, oxidized and fashion jewellery — handcrafted to celebrate life's most radiant moments."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        />
      )}

      {/* Company Story Section */}
      <section className="relative overflow-hidden bg-navy-deep text-white">
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.05]" />
        <div className="pointer-events-none absolute -left-40 -top-24 h-[26rem] w-[26rem] rounded-full bg-sapphire/15 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">
                Our Story
              </p>
              <h2 className="mt-5 font-playfair text-4xl font-medium leading-tight sm:text-5xl">
                Born from a simple
                <span className="text-gradient-gold italic"> truth.</span>
              </h2>
              <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-white/60">
                {aboutStory.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 inline-flex items-center gap-3 rounded-lg border border-gold/30 bg-gold/10 px-5 py-3.5">
                <Gem className="h-5 w-5 text-gold" />
                <div className="text-sm">
                  <p className="font-medium text-gold-light">
                    Trademark No. {BRAND.trademarkNumber}
                  </p>
                  <p className="text-xs text-white/50">
                    Registered · {BRAND.trademarkClass} · Trade Marks Act, 1999
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision Section */}
      {(aboutMission || aboutVision) && (
        <section className="bg-background py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-dark">
                  Purpose & Direction
                </p>
                <h2 className="mt-4 font-playfair text-4xl font-medium leading-tight text-navy sm:text-5xl">
                  What drives{" "}
                  <span className="text-gradient-gold italic">us forward</span>
                </h2>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {aboutMission && (
                <Reveal delay={0.1}>
                  <div className="group h-full rounded-2xl border border-champagne-deep bg-champagne/30 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_50px_-20px_rgba(11,27,51,0.25)] sm:p-10">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy-deep">
                      <Target className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-6 font-playfair text-2xl text-navy">
                      Our Mission
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                      {aboutMission}
                    </p>
                  </div>
                </Reveal>
              )}
              {aboutVision && (
                <Reveal delay={0.2}>
                  <div className="group h-full rounded-2xl border border-champagne-deep bg-champagne/30 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_50px_-20px_rgba(11,27,51,0.25)] sm:p-10">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy-deep">
                      <Eye className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-6 font-playfair text-2xl text-navy">
                      Our Vision
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                      {aboutVision}
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Values Grid */}
      {aboutValues.length > 0 && (
        <section className="border-t border-champagne-deep bg-champagne/20 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-dark">
                  What we stand for
                </p>
                <h2 className="mt-4 font-playfair text-4xl font-medium leading-tight text-navy sm:text-5xl">
                  The Zhanna{" "}
                  <span className="text-gradient-gold italic">promise</span>
                </h2>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {aboutValues.map((value, index) => {
                const Icon = ICON_MAP[value.icon] || Sparkles;
                return (
                  <Reveal key={value.title} delay={index * 0.1}>
                    <div className="group h-full rounded-2xl border border-champagne-deep bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_50px_-20px_rgba(11,27,51,0.25)]">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy-deep">
                        <Icon className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                      <h3 className="mt-6 font-playfair text-xl text-navy">
                        {value.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {aboutTeam.length > 0 && (
        <section className="bg-background py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-dark">
                  The artisans
                </p>
                <h2 className="mt-4 font-playfair text-4xl font-medium leading-tight text-navy sm:text-5xl">
                  Meet the{" "}
                  <span className="text-gradient-gold italic">team</span>
                </h2>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {aboutTeam.map((member, index) => (
                <Reveal key={member.name} delay={index * 0.1}>
                  <div className="group overflow-hidden rounded-2xl border border-champagne-deep bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(11,27,51,0.25)]">
                    {member.image && (
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-playfair text-xl text-navy">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-dark">
                        {member.role}
                      </p>
                      {member.bio && (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Strip */}
      {aboutStats.length > 0 && (
        <section className="border-y border-champagne-deep bg-navy-deep py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {aboutStats.map((stat, index) => (
                <Reveal key={stat.label} delay={index * 0.1}>
                  <div className="text-center">
                    <p className="font-playfair text-4xl font-medium text-gold sm:text-5xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {aboutCta.title && (
        <section className="bg-background py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal variant="scale">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-deep via-[#0d2838] to-navy px-6 py-20 text-center sm:px-12 lg:py-28">
                <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-[30rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-10 right-10 h-32 w-32 rounded-full border border-gold/10" />
                <div className="pointer-events-none absolute left-8 top-8 h-20 w-20 rounded-full border border-gold/10" />

                <div className="relative">
                  <h2 className="mx-auto max-w-2xl font-playfair text-3xl font-medium leading-tight text-white sm:text-4xl lg:text-5xl">
                    {aboutCta.title}
                  </h2>
                  {aboutCta.subtitle && (
                    <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/60">
                      {aboutCta.subtitle}
                    </p>
                  )}
                  {aboutCta.buttonLabel && aboutCta.buttonHref && (
                    <Link
                      href={aboutCta.buttonHref}
                      className="group mt-10 inline-flex items-center gap-2.5 bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-navy-deep transition-all duration-500 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_20px_50px_-12px_rgba(212,175,55,0.5)]"
                    >
                      {aboutCta.buttonLabel}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
