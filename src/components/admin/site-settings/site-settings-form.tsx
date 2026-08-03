"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Layout, FootprintsIcon, Phone, BookOpen } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { HeaderTab } from "./header-tab";
import { FooterTab } from "./footer-tab";
import { ContactTab } from "./contact-tab";
import { AboutTab } from "./about-tab";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "header", label: "Header", icon: Layout },
  { id: "footer", label: "Footer", icon: FootprintsIcon },
  { id: "contact", label: "Contact Info", icon: Phone },
  { id: "about", label: "About Page", icon: BookOpen },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface SiteSettingsData {
  logo: string;
  navLinks: { label: string; href: string; children?: { label: string; href: string }[] }[];
  footerDescription: string;
  footerLinks: { heading: string; links: { label: string; href: string }[] }[];
  socialLinks: { platform: string; url: string; icon: string }[];
  copyrightText: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  mapEmbedUrl: string;
  businessHours: { day: string; hours: string }[];
  aboutBanner: string;
  aboutTitle: string;
  aboutStory: string[];
  aboutMission: string;
  aboutVision: string;
  aboutValues: { title: string; description: string; icon: string }[];
  aboutTeam: { name: string; role: string; image: string; bio: string }[];
  aboutStats: { label: string; value: string }[];
  aboutCta: { title: string; subtitle: string; buttonLabel: string; buttonHref: string };
  aboutImages: string[];
}

export function SiteSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SiteSettingsData | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("header");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/site-settings");
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? "Failed to load");
        setData(json.settings ?? json);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleSaved(patch: Record<string, unknown>) {
    if (data) setData({ ...data, ...patch } as SiteSettingsData);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold-dark" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Could not load site settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Configuration"
        title="Site Settings"
        description="Manage your store's header, footer, contact information, and about page content."
      />

      {/* Tab navigation */}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors",
                activeTab === tab.id
                  ? "bg-navy text-gold-light shadow-sm"
                  : "text-slate-600 hover:bg-champagne hover:text-navy"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {activeTab === "header" && (
          <HeaderTab data={{ logo: data.logo, navLinks: data.navLinks }} onSaved={handleSaved} />
        )}
        {activeTab === "footer" && (
          <FooterTab
            data={{
              footerDescription: data.footerDescription,
              footerLinks: data.footerLinks,
              socialLinks: data.socialLinks,
              copyrightText: data.copyrightText,
            }}
            onSaved={handleSaved}
          />
        )}
        {activeTab === "contact" && (
          <ContactTab
            data={{
              email: data.email,
              phone: data.phone,
              address: data.address,
              city: data.city,
              mapEmbedUrl: data.mapEmbedUrl,
              businessHours: data.businessHours,
            }}
            onSaved={handleSaved}
          />
        )}
        {activeTab === "about" && (
          <AboutTab
            data={{
              aboutBanner: data.aboutBanner,
              aboutTitle: data.aboutTitle,
              aboutStory: data.aboutStory,
              aboutMission: data.aboutMission,
              aboutVision: data.aboutVision,
              aboutValues: data.aboutValues,
              aboutTeam: data.aboutTeam,
              aboutStats: data.aboutStats,
              aboutCta: data.aboutCta,
              aboutImages: data.aboutImages,
            }}
            onSaved={handleSaved}
          />
        )}
      </div>
    </div>
  );
}
