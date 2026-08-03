"use client";

import { useRef, useState } from "react";
import { Controller, useForm, type Control, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Gem,
  ImagePlus,
  LayoutPanelLeft,
  Loader2,
  RefreshCcw,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/page-header";
import { HOME_DEFAULTS } from "@/lib/home-content";
import { storefrontContentSchema } from "@/lib/validations/storefront";
import type { HomepageContent } from "@/types/homepage";
import { cn } from "@/lib/utils";

const inputClass =
  "h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25";

const textareaClass =
  "w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25";

function flattenErrors(
  errors: FieldErrors<HomepageContent>
): Record<string, string> {
  const out: Record<string, string> = {};
  function walk(node: unknown, path: string) {
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;
    if (typeof obj["message"] === "string") {
      out[path] = obj["message"];
      return;
    }
    for (const [key, value] of Object.entries(obj)) {
      walk(value, path ? `${path}.${key}` : key);
    }
  }
  walk(errors, "");
  return out;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
        {label}
      </Label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Toggle visibility"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none",
        checked ? "border-gold bg-gold" : "border-slate-300 bg-slate-200"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function ControlledToggle({
  control,
  name,
  label,
}: {
  control: Control<HomepageContent>;
  name: string;
  label?: string;
}) {
  return (
    <Controller
      control={control}
      name={name as never}
      render={({ field }) => (
        <label className="flex cursor-pointer items-center gap-2.5">
          <Toggle checked={Boolean(field.value)} onChange={field.onChange} />
          {label && (
            <span className="text-xs font-medium text-slate-600">{label}</span>
          )}
        </label>
      )}
    />
  );
}

function AccentColorField({
  control,
  name,
}: {
  control: Control<HomepageContent>;
  name: string;
}) {
  return (
    <Controller
      control={control}
      name={name as never}
      render={({ field }) => (
        <div>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={field.value ?? "#16B5D8"}
              onChange={(e) => field.onChange(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-md border border-slate-200 bg-white p-1"
            />
            <span className="flex-1 truncate font-mono text-xs text-muted-foreground">
              {field.value ?? "Theme default (turquoise)"}
            </span>
            {field.value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => field.onChange(null)}
                className="h-7 px-2 text-xs text-slate-500 hover:text-red-600"
              >
                Reset
              </Button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Applies to eyebrow text and button accents. Leave at default for the
            turquoise palette.
          </p>
        </div>
      )}
    />
  );
}

function OverlayField({
  control,
  name,
}: {
  control: Control<HomepageContent>;
  name: string;
}) {
  return (
    <Controller
      control={control}
      name={name as never}
      render={({ field }) => {
        const value = typeof field.value === "number" ? field.value : 70;
        return (
          <div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#16B5D8]"
              />
              <span className="w-10 shrink-0 text-right text-xs font-semibold text-navy">
                {value}%
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Dark scrim placed behind text over background images. Raise it to
              keep text readable.
            </p>
          </div>
        );
      }}
    />
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  enabled,
  onToggleEnabled,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  children: React.ReactNode;
  enabled?: boolean;
  onToggleEnabled?: (value: boolean) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-dark">
            <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
          </span>
          <div>
            <h2 className="font-playfair text-[15px] text-navy">{title}</h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {onToggleEnabled && (
          <label className="flex shrink-0 cursor-pointer items-center gap-2">
            <span className="text-xs font-medium text-slate-600">
              {enabled ? "Visible" : "Hidden"}
            </span>
            <Toggle checked={Boolean(enabled)} onChange={onToggleEnabled} />
          </label>
        )}
      </header>
      <div
        className={cn(
          "space-y-5 p-5",
          !enabled && "pointer-events-none opacity-50 select-none"
        )}
      >
        {children}
      </div>
    </section>
  );
}

function BannerItemCard({
  index,
  title,
  children,
  enableName,
  control,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
  enableName: string;
  control: Control<HomepageContent>;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">
          {index + 1}. {title}
        </p>
        <div className="flex items-center gap-1.5">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              aria-label="Move up"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:border-gold hover:text-gold-dark disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              aria-label="Move down"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:border-gold hover:text-gold-dark disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          )}
          <ControlledToggle control={control} name={enableName} />
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function StorefrontImageField({
  label,
  value,
  onChange,
  recommendedSize,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  recommendedSize?: string;
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
        body: JSON.stringify({ dataUrl, folder: "zhanna/homepage" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "Upload failed");
      }
      onChange(data?.url ?? null);
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
          "relative h-40 w-full overflow-hidden rounded-xl border bg-slate-100",
          value ? "border-slate-200" : "border-dashed border-slate-300"
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remove image"
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy/80 text-white transition-colors hover:bg-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gold-dark" />
            ) : (
              <ImagePlus className="h-6 w-6 text-gold-dark" strokeWidth={1.5} />
            )}
            <p className="text-xs">
              {uploading
                ? "Uploading…"
                : "No image — decorative background is used"}
            </p>
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="mt-2 border-slate-200 text-slate-600 hover:border-gold hover:text-navy"
      >
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <UploadCloud className="h-3.5 w-3.5" />
        )}
        {value ? "Replace image" : "Upload image"}
      </Button>
      {recommendedSize && (
        <p className="mt-2 text-xs text-muted-foreground">
          Recommended:{" "}
          <span className="font-semibold text-navy">{recommendedSize}</span> —
          larger images are fine, this keeps the page fast.
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFile}
      />
    </div>
  );
}

const BANNER_THEMES = [
  { value: "ivory", label: "Ivory" },
  { value: "emerald", label: "Emerald" },
  { value: "champagne", label: "Champagne" },
  { value: "charcoal", label: "Charcoal" },
  { value: "rose", label: "Rose" },
] as const;

const COLLECTION_THEMES = [
  { value: "emerald", label: "Emerald" },
  { value: "champagne", label: "Champagne" },
  { value: "charcoal", label: "Charcoal" },
] as const;

const GENDER_THEMES = [
  { value: "emerald", label: "Emerald" },
  { value: "charcoal", label: "Charcoal" },
] as const;

const TRUST_ICONS = [
  { value: "shield", label: "Shield" },
  { value: "truck", label: "Truck" },
  { value: "refresh", label: "Refresh" },
  { value: "sparkles", label: "Sparkles" },
  { value: "award", label: "Award" },
  { value: "lock", label: "Lock" },
] as const;

function ThemeSelect({
  control,
  name,
  options,
}: {
  control: Control<HomepageContent>;
  name: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <Controller
      control={control}
      name={name as never}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className={inputClass}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

type ListKey = "featuredBanners" | "trustBadges" | "collections" | "genderTiles";

export function StorefrontForm({ initial }: { initial: HomepageContent }) {
  const rhf = useForm<HomepageContent>({
    resolver: zodResolver(storefrontContentSchema),
    defaultValues: initial,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = rhf;

  const register = rhf.register as unknown as (
    name: string,
    options?: Record<string, unknown>
  ) => ReturnType<typeof rhf.register>;

  const fieldErrors = flattenErrors(errors);

  const featuredAllVisible = (watch("featuredBanners") ?? []).every(
    (item) => item.enabled
  );
  const trustAllVisible = (watch("trustBadges") ?? []).every(
    (item) => item.enabled
  );
  const campaignsAllVisible = (watch("collections") ?? []).every(
    (item) => item.enabled
  );
  const genderAllVisible = (watch("genderTiles") ?? []).every(
    (item) => item.enabled
  );

  function setSectionEnabled(key: ListKey, value: boolean) {
    const values = getValues(key);
    if (!Array.isArray(values)) return;
    setValue(
      key,
      values.map((item) => ({ ...item, enabled: value })) as never,
      { shouldDirty: true }
    );
  }

  function moveItem(key: "featuredBanners" | "collections", index: number, dir: -1 | 1) {
    const values = getValues(key);
    if (!Array.isArray(values)) return;
    const target = index + dir;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setValue(key, next as never, { shouldDirty: true });
  }

  async function onSubmit(values: HomepageContent) {
    try {
      const res = await fetch("/api/admin/storefront", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: values }),
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
      toast.success("Storefront content saved");
      reset(values);
    } catch {
      toast.error("Could not save changes. Please try again.");
    }
  }

  function restoreDefaults() {
    reset(HOME_DEFAULTS, { keepDefaultValues: true });
    toast.info("Defaults loaded — press Save to publish them");
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Storefront"
        title="Homepage Content"
        description="Edit everything shown on the homepage — hero, banners, badges, colours and brand story — and publish instantly."
        action={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={restoreDefaults}
              className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy"
            >
              Restore defaults
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!isDirty || isSubmitting}
              className="bg-navy text-gold-light hover:bg-navy-deep"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save changes
            </Button>
          </div>
        }
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <SectionCard
          icon={LayoutPanelLeft}
          title="Hero Section"
          description="The opening editorial block — headline, intro and calls to action."
          enabled={watch("hero.enabled")}
          onToggleEnabled={(value) => setValue("hero.enabled", value, { shouldDirty: true })}
        >
          <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
            <Field label="Eyebrow tagline" error={fieldErrors["hero.eyebrow"]}>
              <Input
                className={inputClass}
                placeholder="Artificial Diamond & Fashion Jewellery"
                {...register("hero.eyebrow")}
              />
            </Field>
            <Field label="Subheadline" error={fieldErrors["hero.subheadline"]}>
              <Textarea
                rows={2}
                className={textareaClass}
                {...register("hero.subheadline")}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Field
                key={index}
                label={`Headline line ${index + 1}`}
                error={fieldErrors[`hero.title.${index}`]}
              >
                <Input
                  className={inputClass}
                  placeholder={index === 0 ? "Radiance," : index === 1 ? "made for you," : "every day."}
                  {...register(`hero.title.${index}`)}
                />
              </Field>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Primary button"
                error={fieldErrors["hero.ctaPrimaryLabel"]}
              >
                <Input
                  className={inputClass}
                  placeholder="Shop Best Sellers"
                  {...register("hero.ctaPrimaryLabel")}
                />
              </Field>
              <Field
                label="Primary link"
                error={fieldErrors["hero.ctaPrimaryHref"]}
              >
                <Input
                  className={inputClass}
                  placeholder="/shop?sort=featured"
                  {...register("hero.ctaPrimaryHref")}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Secondary button"
                error={fieldErrors["hero.ctaSecondaryLabel"]}
              >
                <Input
                  className={inputClass}
                  placeholder="Explore Collections"
                  {...register("hero.ctaSecondaryLabel")}
                />
              </Field>
              <Field
                label="Secondary link"
                error={fieldErrors["hero.ctaSecondaryHref"]}
              >
                <Input
                  className={inputClass}
                  placeholder="/shop"
                  {...register("hero.ctaSecondaryHref")}
                />
              </Field>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Controller
              control={control}
              name="hero.backgroundImage"
              render={({ field }) => (
                <Field label="Background image">
                  <StorefrontImageField
                    label="Hero background"
                    value={field.value}
                    onChange={field.onChange}
                    recommendedSize="1920 × 900 px (16:9)"
                  />
                </Field>
              )}
            />
            <div className="space-y-5">
              <Field label="Accent color">
                <AccentColorField control={control} name="hero.accentColor" />
              </Field>
              <Field label="Overlay opacity">
                <OverlayField control={control} name="hero.overlayOpacity" />
              </Field>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={Gem}
          title="Featured Banners"
          description="The two cards right below the marquee — pick a theme or a photograph."
          enabled={featuredAllVisible}
          onToggleEnabled={(value) => setSectionEnabled("featuredBanners", value)}
        >
          <div className="space-y-5">
            {[0, 1].map((index) => (
              <BannerItemCard
                key={index}
                index={index}
                title={index === 0 ? "The Edit" : "Gifting"}
                enableName={`featuredBanners.${index}.enabled`}
                control={control}
                onMoveUp={() => moveItem("featuredBanners", index, -1)}
                onMoveDown={() => moveItem("featuredBanners", index, 1)}
                canMoveUp={index > 0}
                canMoveDown={index < 1}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Eyebrow"
                    error={fieldErrors[`featuredBanners.${index}.eyebrow`]}
                  >
                    <Input className={inputClass} {...register(`featuredBanners.${index}.eyebrow`)} />
                  </Field>
                  <Field
                    label="Title"
                    error={fieldErrors[`featuredBanners.${index}.title`]}
                  >
                    <Input className={inputClass} {...register(`featuredBanners.${index}.title`)} />
                  </Field>
                  <Field
                    label="Subtitle"
                    className="sm:col-span-2"
                    error={fieldErrors[`featuredBanners.${index}.subtitle`]}
                  >
                    <Textarea
                      rows={2}
                      className={textareaClass}
                      {...register(`featuredBanners.${index}.subtitle`)}
                    />
                  </Field>
                  <Field
                    label="Button label"
                    error={fieldErrors[`featuredBanners.${index}.ctaLabel`]}
                  >
                    <Input className={inputClass} {...register(`featuredBanners.${index}.ctaLabel`)} />
                  </Field>
                  <Field
                    label="Link"
                    error={fieldErrors[`featuredBanners.${index}.ctaHref`]}
                  >
                    <Input className={inputClass} {...register(`featuredBanners.${index}.ctaHref`)} />
                  </Field>
                  <Field
                    label="Theme"
                    error={fieldErrors[`featuredBanners.${index}.theme`]}
                  >
                    <ThemeSelect
                      control={control}
                      name={`featuredBanners.${index}.theme`}
                      options={BANNER_THEMES}
                    />
                  </Field>
                  <Field
                    label="Overlay opacity"
                    error={fieldErrors[`featuredBanners.${index}.overlayOpacity`]}
                  >
                    <OverlayField
                      control={control}
                      name={`featuredBanners.${index}.overlayOpacity`}
                    />
                  </Field>
                  <Field
                    label="Accent color"
                    error={fieldErrors[`featuredBanners.${index}.accentColor`]}
                  >
                    <AccentColorField
                      control={control}
                      name={`featuredBanners.${index}.accentColor`}
                    />
                  </Field>
                  <Controller
                    control={control}
                    name={`featuredBanners.${index}.image` as never}
                    render={({ field }) => (
                      <Field label="Background image">
                        <StorefrontImageField
                          label={`Featured banner ${index + 1}`}
                          value={field.value}
                          onChange={field.onChange}
                          recommendedSize="800 × 1000 px"
                        />
                      </Field>
                    )}
                  />
                </div>
              </BannerItemCard>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={BadgeCheck}
          title="Trust Badges"
          description="The emerald strip with the four quality promises."
          enabled={trustAllVisible}
          onToggleEnabled={(value) => setSectionEnabled("trustBadges", value)}
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="space-y-4 rounded-lg border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">
                    Badge {index + 1}
                  </p>
                  <ControlledToggle
                    control={control}
                    name={`trustBadges.${index}.enabled`}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Icon"
                    error={fieldErrors[`trustBadges.${index}.icon`]}
                  >
                    <ThemeSelect
                      control={control}
                      name={`trustBadges.${index}.icon`}
                      options={TRUST_ICONS}
                    />
                  </Field>
                  <Field
                    label="Title"
                    error={fieldErrors[`trustBadges.${index}.title`]}
                  >
                    <Input className={inputClass} {...register(`trustBadges.${index}.title`)} />
                  </Field>
                  <Field
                    label="Subtitle"
                    className="sm:col-span-2"
                    error={fieldErrors[`trustBadges.${index}.subtitle`]}
                  >
                    <Input className={inputClass} {...register(`trustBadges.${index}.subtitle`)} />
                  </Field>
                  <Controller
                    control={control}
                    name={`trustBadges.${index}.image` as never}
                    render={({ field }) => (
                      <Field
                        label="Custom icon image"
                        hint="Overrides the icon above."
                        className="sm:col-span-2"
                      >
                        <StorefrontImageField
                          label={`Trust badge ${index + 1} icon`}
                          value={field.value}
                          onChange={field.onChange}
                          recommendedSize="80 × 80 px"
                        />
                      </Field>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={Sparkles}
          title="Campaign Banners"
          description="The editorial cards — Solitaire Story (tall), Gold Hour and Bridal Bloom."
          enabled={campaignsAllVisible}
          onToggleEnabled={(value) => setSectionEnabled("collections", value)}
        >
          <div className="space-y-5">
            {[0, 1, 2].map((index) => (
              <BannerItemCard
                key={index}
                index={index}
                title={index === 0 ? "Tall editorial" : index === 1 ? "Left card" : "Right card"}
                enableName={`collections.${index}.enabled`}
                control={control}
                onMoveUp={() => moveItem("collections", index, -1)}
                onMoveDown={() => moveItem("collections", index, 1)}
                canMoveUp={index > 0}
                canMoveDown={index < 2}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Eyebrow"
                    error={fieldErrors[`collections.${index}.eyebrow`]}
                  >
                    <Input className={inputClass} {...register(`collections.${index}.eyebrow`)} />
                  </Field>
                  <Field
                    label="Title"
                    error={fieldErrors[`collections.${index}.title`]}
                  >
                    <Input className={inputClass} {...register(`collections.${index}.title`)} />
                  </Field>
                  <Field
                    label="Subtitle"
                    className="sm:col-span-2"
                    error={fieldErrors[`collections.${index}.subtitle`]}
                  >
                    <Textarea
                      rows={2}
                      className={textareaClass}
                      {...register(`collections.${index}.subtitle`)}
                    />
                  </Field>
                  <Field
                    label="Button label"
                    error={fieldErrors[`collections.${index}.ctaLabel`]}
                  >
                    <Input className={inputClass} {...register(`collections.${index}.ctaLabel`)} />
                  </Field>
                  <Field
                    label="Link"
                    error={fieldErrors[`collections.${index}.ctaHref`]}
                  >
                    <Input className={inputClass} {...register(`collections.${index}.ctaHref`)} />
                  </Field>
                  <Field
                    label="Theme"
                    error={fieldErrors[`collections.${index}.theme`]}
                  >
                    <ThemeSelect
                      control={control}
                      name={`collections.${index}.theme`}
                      options={COLLECTION_THEMES}
                    />
                  </Field>
                  <Controller
                    control={control}
                    name={`collections.${index}.tall` as never}
                    render={({ field }) => (
                      <div className="flex items-end pb-1">
                        <Label className="flex items-center gap-2.5 text-sm font-medium text-navy">
                          <Checkbox
                            checked={Boolean(field.value)}
                            onCheckedChange={(checked) =>
                              field.onChange(Boolean(checked))
                            }
                          />
                          Tall layout (left column)
                        </Label>
                      </div>
                    )}
                  />
                  <Field
                    label="Overlay opacity"
                    error={fieldErrors[`collections.${index}.overlayOpacity`]}
                  >
                    <OverlayField
                      control={control}
                      name={`collections.${index}.overlayOpacity`}
                    />
                  </Field>
                  <Field
                    label="Accent color"
                    error={fieldErrors[`collections.${index}.accentColor`]}
                  >
                    <AccentColorField
                      control={control}
                      name={`collections.${index}.accentColor`}
                    />
                  </Field>
                  <Controller
                    control={control}
                    name={`collections.${index}.image` as never}
                    render={({ field }) => (
                      <Field label="Background image">
                        <StorefrontImageField
                          label={`Campaign ${index + 1}`}
                          value={field.value}
                          onChange={field.onChange}
                          recommendedSize="1200 × 700 px"
                        />
                      </Field>
                    )}
                  />
                </div>
              </BannerItemCard>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={Gem}
          title="Shop by Gender"
          description="The two tiles linking to the women's and men's edits."
          enabled={genderAllVisible}
          onToggleEnabled={(value) => setSectionEnabled("genderTiles", value)}
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="space-y-4 rounded-lg border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">
                    {index + 1}. {index === 0 ? "Women's" : "Men's"} tile
                  </p>
                  <ControlledToggle
                    control={control}
                    name={`genderTiles.${index}.enabled`}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Eyebrow"
                    error={fieldErrors[`genderTiles.${index}.eyebrow`]}
                  >
                    <Input className={inputClass} {...register(`genderTiles.${index}.eyebrow`)} />
                  </Field>
                  <Field
                    label="Title"
                    error={fieldErrors[`genderTiles.${index}.title`]}
                  >
                    <Input className={inputClass} {...register(`genderTiles.${index}.title`)} />
                  </Field>
                  <Field
                    label="Subtitle"
                    className="sm:col-span-2"
                    error={fieldErrors[`genderTiles.${index}.subtitle`]}
                  >
                    <Input className={inputClass} {...register(`genderTiles.${index}.subtitle`)} />
                  </Field>
                  <Field
                    label="Button label"
                    error={fieldErrors[`genderTiles.${index}.ctaLabel`]}
                  >
                    <Input className={inputClass} {...register(`genderTiles.${index}.ctaLabel`)} />
                  </Field>
                  <Field
                    label="Link"
                    error={fieldErrors[`genderTiles.${index}.ctaHref`]}
                  >
                    <Input className={inputClass} {...register(`genderTiles.${index}.ctaHref`)} />
                  </Field>
                  <Field
                    label="Theme"
                    error={fieldErrors[`genderTiles.${index}.theme`]}
                  >
                    <ThemeSelect
                      control={control}
                      name={`genderTiles.${index}.theme`}
                      options={GENDER_THEMES}
                    />
                  </Field>
                  <Field
                    label="Overlay opacity"
                    error={fieldErrors[`genderTiles.${index}.overlayOpacity`]}
                  >
                    <OverlayField
                      control={control}
                      name={`genderTiles.${index}.overlayOpacity`}
                    />
                  </Field>
                  <Field
                    label="Accent color"
                    error={fieldErrors[`genderTiles.${index}.accentColor`]}
                  >
                    <AccentColorField
                      control={control}
                      name={`genderTiles.${index}.accentColor`}
                    />
                  </Field>
                  <Controller
                    control={control}
                    name={`genderTiles.${index}.image` as never}
                    render={({ field }) => (
                      <Field label="Background image">
                        <StorefrontImageField
                          label={`Gender tile ${index + 1}`}
                          value={field.value}
                          onChange={field.onChange}
                          recommendedSize="900 × 1100 px"
                        />
                      </Field>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={RefreshCcw}
          title="About the Brand"
          description="The 'House of Zhanna' story block near the bottom of the page."
          enabled={watch("about.enabled")}
          onToggleEnabled={(value) => setValue("about.enabled", value, { shouldDirty: true })}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow" error={fieldErrors["about.eyebrow"]}>
              <Input className={inputClass} {...register("about.eyebrow")} />
            </Field>
            <Field label="Title" error={fieldErrors["about.title"]}>
              <Input className={inputClass} {...register("about.title")} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1].map((index) => (
              <Field
                key={index}
                label={`Paragraph ${index + 1}`}
                error={fieldErrors[`about.body.${index}`]}
              >
                <Textarea
                  rows={4}
                  className={textareaClass}
                  {...register(`about.body.${index}`)}
                />
              </Field>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Field
                key={index}
                label={`Promise ${index + 1}`}
                error={fieldErrors[`about.points.${index}`]}
              >
                <Input
                  className={inputClass}
                  placeholder="925 Sterling Silver"
                  {...register(`about.points.${index}`)}
                />
              </Field>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button label" error={fieldErrors["about.ctaLabel"]}>
              <Input className={inputClass} {...register("about.ctaLabel")} />
            </Field>
            <Field label="Link" error={fieldErrors["about.ctaHref"]}>
              <Input className={inputClass} {...register("about.ctaHref")} />
            </Field>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Controller
              control={control}
              name="about.image"
              render={({ field }) => (
                <Field label="Brand image" hint="Replaces the illustration when set.">
                  <StorefrontImageField
                    label="About brand image"
                    value={field.value}
                    onChange={field.onChange}
                    recommendedSize="1000 × 1200 px"
                  />
                </Field>
              )}
            />
            <Field label="Accent color">
              <AccentColorField control={control} name="about.accentColor" />
            </Field>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={restoreDefaults}
            className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy"
          >
            Restore defaults
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="bg-navy text-gold-light hover:bg-navy-deep"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
