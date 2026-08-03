"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BarChart3,
  ImagePlus,
  Loader2,
  MessageSquareQuote,
  HelpCircle,
  Megaphone,
  Plus,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const inputClass =
  "h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25";

const textareaClass =
  "w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25";

interface StatItem { value: string; label: string; }
interface Testimonial { name: string; text: string; image: string; rating: number; }
interface FaqItem { question: string; answer: string; }

interface ExtendedData {
  heroImages: string[];
  statsSection: StatItem[];
  testimonials: Testimonial[];
  faqItems: FaqItem[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  ctaImage: string;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}) {
  return (
    <header className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-dark">
        <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
      </span>
      <div>
        <h2 className="font-playfair text-[15px] text-navy">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </header>
  );
}

export function StorefrontExtended() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<ExtendedData>({
    heroImages: [],
    statsSection: [],
    testimonials: [],
    faqItems: [],
    ctaTitle: "",
    ctaSubtitle: "",
    ctaButtonLabel: "",
    ctaButtonHref: "",
    ctaImage: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/storefront");
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? "Failed to load");
        // The extended fields are stored on the homepage doc
        // Try to get them from a direct homepage fetch
        const hpRes = await fetch("/api/admin/storefront/extended");
        if (hpRes.ok) {
          const hpData = await hpRes.json();
          setData({
            heroImages: hpData.heroImages ?? [],
            statsSection: hpData.statsSection ?? [],
            testimonials: hpData.testimonials ?? [],
            faqItems: hpData.faqItems ?? [],
            ctaTitle: hpData.ctaTitle ?? "",
            ctaSubtitle: hpData.ctaSubtitle ?? "",
            ctaButtonLabel: hpData.ctaButtonLabel ?? "",
            ctaButtonHref: hpData.ctaButtonHref ?? "",
            ctaImage: hpData.ctaImage ?? "",
          });
        }
      } catch {
        // Silently use defaults on first load
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/storefront/extended", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error ?? "Save failed");
      }
      toast.success("Extended sections saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gold-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Images */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeader
          icon={ImagePlus}
          title="Hero Slider Images"
          description="Upload multiple images for the homepage hero carousel."
        />
        <HeroImagesEditor
          images={data.heroImages}
          onChange={(heroImages) => setData({ ...data, heroImages })}
        />
      </section>

      {/* Stats */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeader
          icon={BarChart3}
          title="Stats Section"
          description="Showcase key numbers and achievements."
        />
        <StatsEditor
          items={data.statsSection}
          onChange={(statsSection) => setData({ ...data, statsSection })}
        />
      </section>

      {/* Testimonials */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeader
          icon={MessageSquareQuote}
          title="Testimonials"
          description="Customer reviews displayed on the homepage."
        />
        <TestimonialsEditor
          items={data.testimonials}
          onChange={(testimonials) => setData({ ...data, testimonials })}
        />
      </section>

      {/* FAQ */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeader
          icon={HelpCircle}
          title="FAQ Section"
          description="Frequently asked questions shown on the homepage."
        />
        <FaqEditor
          items={data.faqItems}
          onChange={(faqItems) => setData({ ...data, faqItems })}
        />
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeader
          icon={Megaphone}
          title="CTA Section"
          description="The call-to-action banner near the bottom of the page."
        />
        <CtaEditor
          data={data}
          onChange={(patch) => setData({ ...data, ...patch })}
        />
      </section>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-navy text-gold-light hover:bg-navy-deep"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Extended Sections
        </Button>
      </div>
    </div>
  );
}

/* ─── Sub-editors ─── */

function HeroImagesEditor({ images, onChange }: { images: string[]; onChange: (v: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Choose an image."); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error("Max 8 MB."); return; }
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, folder: "zhanna/homepage" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Upload failed");
      onChange([...images, data?.url ?? ""]);
      toast.success("Image added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative h-28 rounded-lg overflow-hidden border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`Hero ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy/80 text-white hover:bg-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading} className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
        Add Image
      </Button>
      <p className="mt-1 text-xs text-muted-foreground">Recommended: 1920 × 900 px. Add multiple for a carousel.</p>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleUpload} />
    </div>
  );
}

function StatsEditor({ items, onChange }: { items: StatItem[]; onChange: (v: StatItem[]) => void }) {
  function add() { onChange([...items, { value: "", label: "" }]); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }
  function update(i: number, field: keyof StatItem, val: string) {
    const c = [...items]; c[i] = { ...c[i], [field]: val }; onChange(c);
  }
  return (
    <div>
      <div className="space-y-2 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
            <Input className={inputClass} placeholder="10K+" value={item.value} onChange={(e) => update(i, "value", e.target.value)} />
            <Input className={inputClass} placeholder="Happy Customers" value={item.label} onChange={(e) => update(i, "label", e.target.value)} />
            <button type="button" onClick={() => remove(i)} className="shrink-0 text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add} className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
        <Plus className="h-3.5 w-3.5" /> Add Stat
      </Button>
    </div>
  );
}

function TestimonialsEditor({ items, onChange }: { items: Testimonial[]; onChange: (v: Testimonial[]) => void }) {
  function add() { onChange([...items, { name: "", text: "", image: "", rating: 5 }]); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }
  function update(i: number, field: keyof Testimonial, val: string | number) {
    const c = [...items]; c[i] = { ...c[i], [field]: val }; onChange(c);
  }
  return (
    <div>
      <div className="space-y-3 mb-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">Testimonial {i + 1}</p>
              <button type="button" onClick={() => remove(i)} className="text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Name</Label>
                <Input className={cn(inputClass, "mt-1")} value={item.name} onChange={(e) => update(i, "name", e.target.value)} />
              </div>
              <div>
                <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Rating (1-5)</Label>
                <Input className={cn(inputClass, "mt-1")} type="number" min={1} max={5} value={item.rating} onChange={(e) => update(i, "rating", Number(e.target.value))} />
              </div>
            </div>
            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Review Text</Label>
              <Textarea className={cn(textareaClass, "mt-1")} rows={2} value={item.text} onChange={(e) => update(i, "text", e.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add} className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
        <Plus className="h-3.5 w-3.5" /> Add Testimonial
      </Button>
    </div>
  );
}

function FaqEditor({ items, onChange }: { items: FaqItem[]; onChange: (v: FaqItem[]) => void }) {
  function add() { onChange([...items, { question: "", answer: "" }]); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }
  function update(i: number, field: keyof FaqItem, val: string) {
    const c = [...items]; c[i] = { ...c[i], [field]: val }; onChange(c);
  }
  return (
    <div>
      <div className="space-y-3 mb-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">FAQ {i + 1}</p>
              <button type="button" onClick={() => remove(i)} className="text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Question</Label>
              <Input className={cn(inputClass, "mt-1")} value={item.question} onChange={(e) => update(i, "question", e.target.value)} />
            </div>
            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Answer</Label>
              <Textarea className={cn(textareaClass, "mt-1")} rows={3} value={item.answer} onChange={(e) => update(i, "answer", e.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add} className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
        <Plus className="h-3.5 w-3.5" /> Add FAQ
      </Button>
    </div>
  );
}

function CtaEditor({ data, onChange }: { data: ExtendedData; onChange: (patch: Partial<ExtendedData>) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Title</Label>
          <Input className={cn(inputClass, "mt-1.5")} placeholder="Ready to shine?" value={data.ctaTitle} onChange={(e) => onChange({ ctaTitle: e.target.value })} />
        </div>
        <div>
          <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Subtitle</Label>
          <Input className={cn(inputClass, "mt-1.5")} placeholder="Discover our collection" value={data.ctaSubtitle} onChange={(e) => onChange({ ctaSubtitle: e.target.value })} />
        </div>
        <div>
          <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Button Label</Label>
          <Input className={cn(inputClass, "mt-1.5")} placeholder="Shop Now" value={data.ctaButtonLabel} onChange={(e) => onChange({ ctaButtonLabel: e.target.value })} />
        </div>
        <div>
          <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Button Link</Label>
          <Input className={cn(inputClass, "mt-1.5")} placeholder="/shop" value={data.ctaButtonHref} onChange={(e) => onChange({ ctaButtonHref: e.target.value })} />
        </div>
      </div>
      <div>
        <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">CTA Background Image URL</Label>
        <Input className={cn(inputClass, "mt-1.5")} placeholder="https://..." value={data.ctaImage} onChange={(e) => onChange({ ctaImage: e.target.value })} />
        <p className="mt-1 text-xs text-muted-foreground">Paste an image URL or upload via the hero images section.</p>
      </div>
    </div>
  );
}
