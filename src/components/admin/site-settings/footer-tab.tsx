"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, inputClass, textareaClass } from "./shared";
import { cn } from "@/lib/utils";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterLinkGroup {
  heading: string;
  links: { label: string; href: string }[];
}

interface FooterTabProps {
  data: {
    footerDescription: string;
    footerLinks: FooterLinkGroup[];
    socialLinks: SocialLink[];
    copyrightText: string;
  };
  onSaved: (patch: Record<string, unknown>) => void;
}

export function FooterTab({ data, onSaved }: FooterTabProps) {
  const [description, setDescription] = useState(data.footerDescription ?? "");
  const [copyright, setCopyright] = useState(data.copyrightText ?? "");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(data.socialLinks ?? []);
  const [footerLinks, setFooterLinks] = useState<FooterLinkGroup[]>(data.footerLinks ?? []);
  const [saving, setSaving] = useState(false);

  function addSocial() {
    setSocialLinks([...socialLinks, { platform: "", url: "", icon: "" }]);
  }
  function removeSocial(i: number) {
    setSocialLinks(socialLinks.filter((_, idx) => idx !== i));
  }
  function updateSocial(i: number, field: keyof SocialLink, value: string) {
    const copy = [...socialLinks];
    copy[i] = { ...copy[i], [field]: value };
    setSocialLinks(copy);
  }

  function addGroup() {
    setFooterLinks([...footerLinks, { heading: "", links: [] }]);
  }
  function removeGroup(i: number) {
    setFooterLinks(footerLinks.filter((_, idx) => idx !== i));
  }
  function updateGroupHeading(i: number, heading: string) {
    const copy = [...footerLinks];
    copy[i] = { ...copy[i], heading };
    setFooterLinks(copy);
  }
  function addGroupLink(gi: number) {
    const copy = [...footerLinks];
    copy[gi] = { ...copy[gi], links: [...copy[gi].links, { label: "", href: "" }] };
    setFooterLinks(copy);
  }
  function removeGroupLink(gi: number, li: number) {
    const copy = [...footerLinks];
    copy[gi] = { ...copy[gi], links: copy[gi].links.filter((_, idx) => idx !== li) };
    setFooterLinks(copy);
  }
  function updateGroupLink(gi: number, li: number, field: "label" | "href", value: string) {
    const copy = [...footerLinks];
    const links = [...copy[gi].links];
    links[li] = { ...links[li], [field]: value };
    copy[gi] = { ...copy[gi], links };
    setFooterLinks(copy);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        footerDescription: description,
        copyrightText: copyright,
        socialLinks: socialLinks.filter((s) => s.platform.trim()),
        footerLinks: footerLinks.filter((g) => g.heading.trim()),
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
      toast.success("Footer settings saved");
      onSaved(payload);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Field label="Footer Description">
        <Textarea
          className={cn(textareaClass, "mt-1.5")}
          rows={3}
          placeholder="A short brand description for the footer..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <Field label="Copyright Text">
        <Input
          className={cn(inputClass, "mt-1.5")}
          placeholder="© 2024 Zhanna. All rights reserved."
          value={copyright}
          onChange={(e) => setCopyright(e.target.value)}
        />
      </Field>

      {/* Social Links */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-playfair text-[15px] text-navy">Social Links</h3>
          <Button type="button" variant="outline" size="sm" onClick={addSocial} className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {socialLinks.map((s, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <Input className={inputClass} placeholder="Platform" value={s.platform} onChange={(e) => updateSocial(i, "platform", e.target.value)} />
              <Input className={inputClass} placeholder="URL" value={s.url} onChange={(e) => updateSocial(i, "url", e.target.value)} />
              <Input className={cn(inputClass, "w-24")} placeholder="Icon" value={s.icon} onChange={(e) => updateSocial(i, "icon", e.target.value)} />
              <button type="button" onClick={() => removeSocial(i)} className="shrink-0 text-slate-400 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Link Groups */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-playfair text-[15px] text-navy">Footer Link Groups</h3>
          <Button type="button" variant="outline" size="sm" onClick={addGroup} className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
            <Plus className="h-3.5 w-3.5" /> Add Group
          </Button>
        </div>
        <div className="space-y-4">
          {footerLinks.map((group, gi) => (
            <div key={gi} className="rounded-lg border border-slate-100 bg-slate-50/70 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Input className={inputClass} placeholder="Group heading" value={group.heading} onChange={(e) => updateGroupHeading(gi, e.target.value)} />
                <button type="button" onClick={() => removeGroup(gi)} className="shrink-0 text-slate-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {group.links.map((link, li) => (
                <div key={li} className="flex items-center gap-2 pl-4">
                  <Input className={inputClass} placeholder="Label" value={link.label} onChange={(e) => updateGroupLink(gi, li, "label", e.target.value)} />
                  <Input className={inputClass} placeholder="/href" value={link.href} onChange={(e) => updateGroupLink(gi, li, "href", e.target.value)} />
                  <button type="button" onClick={() => removeGroupLink(gi, li)} className="shrink-0 text-slate-400 hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addGroupLink(gi)} className="ml-4 border-slate-200 text-xs text-slate-500 hover:border-gold hover:text-navy">
                <Plus className="h-3 w-3" /> Add Link
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="button" onClick={handleSave} disabled={saving} className="bg-navy text-gold-light hover:bg-navy-deep">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Footer
        </Button>
      </div>
    </div>
  );
}
