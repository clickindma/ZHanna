"use client";

import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Globe,
  ImagePlus,
  Link2,
  Loader2,
  Save,
  Share2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  WhatsAppIcon,
  YoutubeIcon,
} from "@/components/shared/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageHeader } from "@/components/admin/page-header";
import { seoSettingsSchema, type SeoSettingsInput } from "@/lib/validations/seo";
import { SEO_DEFAULTS, type SeoSettings } from "@/types/seo";
import { cn } from "@/lib/utils";

const inputClass =
  "h-10 w-full rounded-lg border-champagne-deep bg-white px-3 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25";

const textareaClass =
  "w-full rounded-lg border-champagne-deep bg-white px-3 py-2 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25";

const SOCIAL_FIELDS = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/zhannajewels", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/zhannajewels", Icon: FacebookIcon },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/91XXXXXXXXXX", Icon: WhatsAppIcon },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@zhannajewels", Icon: YoutubeIcon },
  { key: "pinterest", label: "Pinterest", placeholder: "https://pinterest.com/zhannajewels", Icon: PinterestIcon },
] as const;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function ImageUploadField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB.");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, folder: "zhanna/seo" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "Upload failed");
      }
      onChange(data?.url ?? null);
      toast.success(`${label} uploaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        className={cn(
          "relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border bg-champagne",
          value ? "border-champagne-deep" : "border-dashed border-silver"
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label={`Remove ${label}`}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy/80 text-white transition-colors hover:bg-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gold-dark" />
            ) : (
              <ImagePlus className="h-6 w-6 text-gold-dark" strokeWidth={1.5} />
            )}
            <p className="text-xs">{uploading ? "Uploading…" : "No image uploaded"}</p>
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="mt-2 border-champagne-deep text-slate-600 hover:border-gold hover:text-navy"
      >
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <UploadCloud className="h-3.5 w-3.5" />
        )}
        {value ? "Replace image" : "Upload image"}
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="sr-only"
        onChange={handleFile}
      />
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-champagne-deep bg-white shadow-sm">
      <header className="flex items-start gap-3 border-b border-champagne-deep px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-dark">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
        </span>
        <div>
          <h2 className="font-playfair text-[15px] text-navy">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </header>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

export function SeoForm({ initial }: { initial: SeoSettings }) {
  const [keywordsText, setKeywordsText] = useState(initial.metaKeywords.join(", "));
  const [ogImage, setOgImage] = useState<string | null>(initial.ogImage);
  const [favicon, setFavicon] = useState<string | null>(initial.favicon);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SeoSettingsInput>({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues: {
      siteTitle: initial.siteTitle,
      metaDescription: initial.metaDescription,
      metaKeywords: initial.metaKeywords,
      ogImage: initial.ogImage,
      favicon: initial.favicon,
      social: initial.social,
    },
  });

  const metaDescriptionValue = useWatch({ control, name: "metaDescription" });

  async function onSubmit(values: SeoSettingsInput) {
    const payload: SeoSettings = {
      ...values,
      metaKeywords: keywordsText
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
      ogImage,
      favicon,
    };

    const res = await fetch("/api/admin/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: payload }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        (data?.issues as { message: string }[] | undefined)
          ?.map((issue) => issue.message)
          .join("; ") ?? data?.error ?? "Could not save changes";
      toast.error(message);
      return;
    }
    toast.success("SEO settings saved");
  }

  function restoreDefaults() {
    setKeywordsText(SEO_DEFAULTS.metaKeywords.join(", "));
    setOgImage(SEO_DEFAULTS.ogImage);
    setFavicon(SEO_DEFAULTS.favicon);
    toast.info("Defaults loaded — press Save to publish them");
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="SEO & Branding"
        title="SEO Settings"
        description="Search-engine title, meta description, share image, favicon and social links. Everything here is published instantly to the whole site."
        action={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={restoreDefaults}
              className="border-champagne-deep text-slate-600 hover:border-gold hover:text-navy"
            >
              Restore defaults
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="bg-navy text-white transition-colors hover:bg-navy-mid disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save settings
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <SectionCard
          icon={Globe}
          title="Search Engine"
          description="Used for the browser tab, Google results and social share previews."
        >
          <div>
            <Label htmlFor="seo-site-title" className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
              Site title
            </Label>
            <Input
              id="seo-site-title"
              className={cn(inputClass, "mt-1.5")}
              placeholder={SEO_DEFAULTS.siteTitle}
              {...register("siteTitle")}
            />
            {errors.siteTitle && (
              <p className="mt-1.5 text-xs text-red-600">{errors.siteTitle.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="seo-meta-description" className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                Meta description
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {(metaDescriptionValue ?? "").length} / 320
              </span>
            </div>
            <Textarea
              id="seo-meta-description"
              rows={3}
              className={cn(textareaClass, "mt-1.5")}
              placeholder={SEO_DEFAULTS.metaDescription}
              {...register("metaDescription")}
            />
            {errors.metaDescription && (
              <p className="mt-1.5 text-xs text-red-600">{errors.metaDescription.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="seo-keywords" className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
              Meta keywords
            </Label>
            <Input
              id="seo-keywords"
              className={cn(inputClass, "mt-1.5")}
              placeholder="Zhanna, artificial diamond jewellery, oxidized jewellery"
              value={keywordsText}
              onChange={(event) => setKeywordsText(event.target.value)}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Comma-separated list. Saves as tags for search engines.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          icon={Share2}
          title="Social Preview"
          description="The image shared on WhatsApp, Facebook and other platforms when someone shares the site."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                Open Graph image
              </Label>
              <div className="mt-1.5">
                <ImageUploadField
                  label="Open Graph image"
                  hint="Recommended 1200 × 630 px. Shown in social share previews."
                  value={ogImage}
                  onChange={setOgImage}
                />
              </div>
            </div>
            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                Favicon
              </Label>
              <div className="mt-1.5">
                <ImageUploadField
                  label="Favicon"
                  hint="Square PNG or ICO, at least 64 × 64 px. Shown in the browser tab."
                  value={favicon}
                  onChange={setFavicon}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={Link2}
          title="Social Links"
          description="Shown in the storefront footer. Leave blank to hide that network."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {SOCIAL_FIELDS.map(({ key, label, placeholder, Icon }) => (
              <div key={key}>
                <Label htmlFor={`seo-social-${key}`} className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                  <Icon className="h-3.5 w-3.5 text-gold-dark" />
                  {label}
                </Label>
                <Input
                  id={`seo-social-${key}`}
                  className={cn(inputClass, "mt-1.5")}
                  placeholder={placeholder}
                  {...register(`social.${key}`)}
                />
                {errors.social?.[key] && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.social[key]?.message}</p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={restoreDefaults}
            className="border-champagne-deep text-slate-600 hover:border-gold hover:text-navy"
          >
            Restore defaults
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-navy text-white transition-colors hover:bg-navy-mid disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save settings
          </Button>
        </div>
      </form>
    </div>
  );
}
