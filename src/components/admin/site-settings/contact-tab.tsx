"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, inputClass, textareaClass } from "./shared";
import { cn } from "@/lib/utils";

interface BusinessHour {
  day: string;
  hours: string;
}

interface ContactTabProps {
  data: {
    email: string;
    phone: string;
    address: string;
    city: string;
    mapEmbedUrl: string;
    businessHours: BusinessHour[];
  };
  onSaved: (patch: Record<string, unknown>) => void;
}

export function ContactTab({ data, onSaved }: ContactTabProps) {
  const [email, setEmail] = useState(data.email ?? "");
  const [phone, setPhone] = useState(data.phone ?? "");
  const [address, setAddress] = useState(data.address ?? "");
  const [city, setCity] = useState(data.city ?? "");
  const [mapEmbedUrl, setMapEmbedUrl] = useState(data.mapEmbedUrl ?? "");
  const [hours, setHours] = useState<BusinessHour[]>(data.businessHours ?? []);
  const [saving, setSaving] = useState(false);

  function addHour() {
    setHours([...hours, { day: "", hours: "" }]);
  }
  function removeHour(i: number) {
    setHours(hours.filter((_, idx) => idx !== i));
  }
  function updateHour(i: number, field: "day" | "hours", value: string) {
    const copy = [...hours];
    copy[i] = { ...copy[i], [field]: value };
    setHours(copy);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        email,
        phone,
        address,
        city,
        mapEmbedUrl,
        businessHours: hours.filter((h) => h.day.trim()),
      };
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error ?? "Save failed");
      }
      toast.success("Contact info saved");
      onSaved(payload);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email">
          <Input className={cn(inputClass, "mt-1.5")} placeholder="hello@zhanna.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input className={cn(inputClass, "mt-1.5")} placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
      </div>

      <Field label="Address">
        <Textarea className={cn(textareaClass, "mt-1.5")} rows={2} placeholder="Street address..." value={address} onChange={(e) => setAddress(e.target.value)} />
      </Field>

      <Field label="City">
        <Input className={cn(inputClass, "mt-1.5")} placeholder="Mumbai, India" value={city} onChange={(e) => setCity(e.target.value)} />
      </Field>

      <Field label="Google Maps Embed URL" hint="Paste the src URL from a Google Maps embed iframe">
        <Textarea className={cn(textareaClass, "mt-1.5")} rows={2} placeholder="https://www.google.com/maps/embed?..." value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)} />
      </Field>

      {/* Business Hours */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-playfair text-[15px] text-navy">Business Hours</h3>
          <Button type="button" variant="outline" size="sm" onClick={addHour} className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {hours.map((h, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <Input className={inputClass} placeholder="Monday - Friday" value={h.day} onChange={(e) => updateHour(i, "day", e.target.value)} />
              <Input className={inputClass} placeholder="9:00 AM - 6:00 PM" value={h.hours} onChange={(e) => updateHour(i, "hours", e.target.value)} />
              <button type="button" onClick={() => removeHour(i)} className="shrink-0 text-slate-400 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {hours.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No business hours added.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="button" onClick={handleSave} disabled={saving} className="bg-navy text-gold-light hover:bg-navy-deep">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Contact Info
        </Button>
      </div>
    </div>
  );
}
