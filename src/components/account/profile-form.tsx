"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function ProfileForm({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) {
  const router = useRouter();
  const [formName, setFormName] = useState(name);
  const [formPhone, setFormPhone] = useState(phone);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, phone: formPhone }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Could not save your profile");
        return;
      }
      toast.success("Profile updated");
      router.refresh();
    } catch {
      toast.error("Could not save your profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-champagne-deep bg-background p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="profile-name" className="text-sm text-navy">
            Full name
          </Label>
          <Input
            id="profile-name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Your name"
            className="rounded-xl border-slate-200 bg-white"
            required
            minLength={2}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-phone" className="text-sm text-navy">
            Phone number
          </Label>
          <Input
            id="profile-phone"
            value={formPhone}
            onChange={(e) => setFormPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="rounded-xl border-slate-200 bg-white"
            inputMode="tel"
          />
          <p className="text-xs text-muted-foreground">
            Used for delivery updates and order enquiries.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile-email" className="text-sm text-navy">
          Email
        </Label>
        <Input
          id="profile-email"
          value={email}
          disabled
          className="cursor-not-allowed rounded-xl border-slate-200 bg-slate-50 text-slate-500"
        />
        <p className="text-xs text-muted-foreground">
          Your email is your login and can&apos;t be changed here.
        </p>
      </div>

      <div className="flex justify-end border-t border-champagne-deep pt-5">
        <Button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gold px-7 text-xs font-semibold tracking-[0.2em] text-navy-deep uppercase transition-colors hover:bg-gold-dark hover:text-white"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {!saving && <Save className="h-4 w-4" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}
