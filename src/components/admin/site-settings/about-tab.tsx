"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, ImageUploadField, inputClass, textareaClass } from "./shared";
import { cn } from "@/lib/utils";

interface AboutValue { title: string; description: string; icon: string; }
interface TeamMember { name: string; role: string; image: string; bio: string; }
interface AboutStat { label: string; value: string; }
interface AboutCta { title: string; subtitle: string; buttonLabel: string; buttonHref: string; }

interface AboutTabProps {
  data: {
    aboutBanner: string;
    aboutTitle: string;
    aboutStory: string[];
    aboutMission: string;
    aboutVision: string;
    aboutValues: AboutValue[];
    aboutTeam: TeamMember[];
    aboutStats: AboutStat[];
    aboutCta: AboutCta;
    aboutImages: string[];
  };
  onSaved: (patch: Record<string, unknown>) => void;
}

export function AboutTab({ data, onSaved }: AboutTabProps) {
  const [banner, setBanner] = useState(data.aboutBanner ?? "");
  const [title, setTitle] = useState(data.aboutTitle ?? "");
  const [story, setStory] = useState<string[]>(data.aboutStory?.length ? data.aboutStory : [""]);
  const [mission, setMission] = useState(data.aboutMission ?? "");
  const [vision, setVision] = useState(data.aboutVision ?? "");
  const [values, setValues] = useState<AboutValue[]>(data.aboutValues ?? []);
  const [team, setTeam] = useState<TeamMember[]>(data.aboutTeam ?? []);
  const [stats, setStats] = useState<AboutStat[]>(data.aboutStats ?? []);
  const [cta, setCta] = useState<AboutCta>(data.aboutCta ?? { title: "", subtitle: "", buttonLabel: "", buttonHref: "" });
  const [saving, setSaving] = useState(false);

  // Story paragraphs
  function updateStory(i: number, val: string) { const c = [...story]; c[i] = val; setStory(c); }
  function addStory() { setStory([...story, ""]); }
  function removeStory(i: number) { setStory(story.filter((_, idx) => idx !== i)); }

  // Values
  function addValue() { setValues([...values, { title: "", description: "", icon: "" }]); }
  function removeValue(i: number) { setValues(values.filter((_, idx) => idx !== i)); }
  function updateValue(i: number, field: keyof AboutValue, val: string) { const c = [...values]; c[i] = { ...c[i], [field]: val }; setValues(c); }

  // Team
  function addMember() { setTeam([...team, { name: "", role: "", image: "", bio: "" }]); }
  function removeMember(i: number) { setTeam(team.filter((_, idx) => idx !== i)); }
  function updateMember(i: number, field: keyof TeamMember, val: string) { const c = [...team]; c[i] = { ...c[i], [field]: val }; setTeam(c); }

  // Stats
  function addStat() { setStats([...stats, { label: "", value: "" }]); }
  function removeStat(i: number) { setStats(stats.filter((_, idx) => idx !== i)); }
  function updateStat(i: number, field: keyof AboutStat, val: string) { const c = [...stats]; c[i] = { ...c[i], [field]: val }; setStats(c); }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        aboutBanner: banner,
        aboutTitle: title,
        aboutStory: story.filter((s) => s.trim()),
        aboutMission: mission,
        aboutVision: vision,
        aboutValues: values.filter((v) => v.title.trim()),
        aboutTeam: team.filter((m) => m.name.trim()),
        aboutStats: stats.filter((s) => s.label.trim()),
        aboutCta: cta,
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
      toast.success("About page settings saved");
      onSaved(payload);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Field label="About Banner Image">
        <ImageUploadField label="Banner" value={banner} onChange={setBanner} folder="zhanna/site" size="1920 × 600 px" />
      </Field>

      <Field label="Page Title">
        <Input className={cn(inputClass, "mt-1.5")} placeholder="About Zhanna" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>

      {/* Story */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-playfair text-[15px] text-navy">Our Story</h3>
          <Button type="button" variant="outline" size="sm" onClick={addStory} className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
            <Plus className="h-3.5 w-3.5" /> Add Paragraph
          </Button>
        </div>
        {story.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Textarea className={textareaClass} rows={3} value={p} onChange={(e) => updateStory(i, e.target.value)} placeholder={`Paragraph ${i + 1}`} />
            {story.length > 1 && (
              <button type="button" onClick={() => removeStory(i)} className="shrink-0 self-start mt-2 text-slate-400 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mission">
          <Textarea className={cn(textareaClass, "mt-1.5")} rows={3} value={mission} onChange={(e) => setMission(e.target.value)} placeholder="Our mission..." />
        </Field>
        <Field label="Vision">
          <Textarea className={cn(textareaClass, "mt-1.5")} rows={3} value={vision} onChange={(e) => setVision(e.target.value)} placeholder="Our vision..." />
        </Field>
      </div>

      {/* Values */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-playfair text-[15px] text-navy">Values</h3>
          <Button type="button" variant="outline" size="sm" onClick={addValue} className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {values.map((v, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input className={inputClass} placeholder="Title" value={v.title} onChange={(e) => updateValue(i, "title", e.target.value)} />
                <Input className={inputClass} placeholder="Description" value={v.description} onChange={(e) => updateValue(i, "description", e.target.value)} />
                <Input className={inputClass} placeholder="Icon name" value={v.icon} onChange={(e) => updateValue(i, "icon", e.target.value)} />
              </div>
              <button type="button" onClick={() => removeValue(i)} className="shrink-0 mt-2 text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-playfair text-[15px] text-navy">Team Members</h3>
          <Button type="button" variant="outline" size="sm" onClick={addMember} className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {team.map((m, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input className={inputClass} placeholder="Name" value={m.name} onChange={(e) => updateMember(i, "name", e.target.value)} />
                <Input className={inputClass} placeholder="Role" value={m.role} onChange={(e) => updateMember(i, "role", e.target.value)} />
                <Input className={inputClass} placeholder="Image URL" value={m.image} onChange={(e) => updateMember(i, "image", e.target.value)} />
                <Input className={inputClass} placeholder="Short bio" value={m.bio} onChange={(e) => updateMember(i, "bio", e.target.value)} />
              </div>
              <button type="button" onClick={() => removeMember(i)} className="shrink-0 mt-2 text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-playfair text-[15px] text-navy">Stats</h3>
          <Button type="button" variant="outline" size="sm" onClick={addStat} className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <Input className={inputClass} placeholder="Value (e.g. 10K+)" value={s.value} onChange={(e) => updateStat(i, "value", e.target.value)} />
              <Input className={inputClass} placeholder="Label" value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} />
              <button type="button" onClick={() => removeStat(i)} className="shrink-0 text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div>
        <h3 className="font-playfair text-[15px] text-navy mb-3">Call to Action</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="CTA Title"><Input className={cn(inputClass, "mt-1.5")} value={cta.title} onChange={(e) => setCta({ ...cta, title: e.target.value })} /></Field>
          <Field label="CTA Subtitle"><Input className={cn(inputClass, "mt-1.5")} value={cta.subtitle} onChange={(e) => setCta({ ...cta, subtitle: e.target.value })} /></Field>
          <Field label="Button Label"><Input className={cn(inputClass, "mt-1.5")} value={cta.buttonLabel} onChange={(e) => setCta({ ...cta, buttonLabel: e.target.value })} /></Field>
          <Field label="Button Link"><Input className={cn(inputClass, "mt-1.5")} value={cta.buttonHref} onChange={(e) => setCta({ ...cta, buttonHref: e.target.value })} /></Field>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="button" onClick={handleSave} disabled={saving} className="bg-navy text-gold-light hover:bg-navy-deep">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save About Page
        </Button>
      </div>
    </div>
  );
}
