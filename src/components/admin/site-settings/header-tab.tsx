"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, ImageUploadField, inputClass } from "./shared";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

interface HeaderTabProps {
  data: { logo: string; navLinks: NavLink[] };
  onSaved: (patch: Partial<{ logo: string; navLinks: NavLink[] }>) => void;
}

export function HeaderTab({ data, onSaved }: HeaderTabProps) {
  const [logo, setLogo] = useState(data.logo ?? "");
  const [navLinks, setNavLinks] = useState<NavLink[]>(data.navLinks ?? []);
  const [saving, setSaving] = useState(false);

  function addLink() {
    setNavLinks([...navLinks, { label: "", href: "" }]);
  }

  function removeLink(idx: number) {
    setNavLinks(navLinks.filter((_, i) => i !== idx));
  }

  function updateLink(idx: number, field: "label" | "href", value: string) {
    const copy = [...navLinks];
    copy[idx] = { ...copy[idx], [field]: value };
    setNavLinks(copy);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { logo, navLinks: navLinks.filter((l) => l.label.trim()) };
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error ?? "Save failed");
      }
      toast.success("Header settings saved");
      onSaved(payload);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Field label="Logo">
        <ImageUploadField
          label="Logo"
          value={logo}
          onChange={setLogo}
          folder="zhanna/site"
          size="300 × 80 px (SVG or PNG)"
        />
      </Field>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-playfair text-[15px] text-navy">Navigation Links</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLink}
            className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy"
          >
            <Plus className="h-3.5 w-3.5" /> Add Link
          </Button>
        </div>

        <div className="space-y-3">
          {navLinks.map((link, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  className={inputClass}
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => updateLink(idx, "label", e.target.value)}
                />
                <Input
                  className={inputClass}
                  placeholder="/href"
                  value={link.href}
                  onChange={(e) => updateLink(idx, "href", e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeLink(idx)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {navLinks.length === 0 && (
            <p className="text-xs text-muted-foreground py-4 text-center">No navigation links yet.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={cn("bg-navy text-gold-light hover:bg-navy-deep")}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Header
        </Button>
      </div>
    </div>
  );
}
