"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Loader2, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IAddress } from "@/types/models";

interface AddressBookProps {
  addresses: IAddress[];
}

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export function AddressBook({ addresses: initialAddresses }: AddressBookProps) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [busy, setBusy] = useState(false);

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setOpen(true);
  }

  function openEdit(index: number) {
    const address = addresses[index];
    setEditing(index);
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    });
    setOpen(true);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const url =
        editing == null
          ? "/api/user/addresses"
          : `/api/user/addresses/${editing}`;
      const res = await fetch(url, {
        method: editing == null ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Could not save address");
        return;
      }
      setAddresses(data.addresses);
      setOpen(false);
      setEditing(null);
      toast.success(editing == null ? "Address added" : "Address updated");
      router.refresh();
    } catch {
      toast.error("Could not save address");
    } finally {
      setBusy(false);
    }
  }

  async function remove(index: number) {
    setBusy(true);
    try {
      const res = await fetch(`/api/user/addresses/${index}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Could not delete address");
        return;
      }
      setAddresses(data.addresses);
      toast.success("Address deleted");
      router.refresh();
    } catch {
      toast.error("Could not delete address");
    } finally {
      setBusy(false);
    }
  }

  async function makeDefault(index: number) {
    setBusy(true);
    try {
      const res = await fetch(`/api/user/addresses/${index}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Could not update default address");
        return;
      }
      setAddresses(data.addresses);
      toast.success("Default address updated");
      router.refresh();
    } catch {
      toast.error("Could not update default address");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {addresses.length === 0 && !open && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-champagne-deep bg-champagne/30 px-6 py-16 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
            <MapPin className="h-6 w-6" strokeWidth={1.6} />
          </span>
          <p className="mt-4 font-playfair text-xl text-navy">No saved addresses</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a delivery address to speed up your next checkout.
          </p>
        </div>
      )}

      {addresses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-champagne-deep bg-background p-5"
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-gold-dark uppercase">
                  <Star className="h-3 w-3" />
                  Default
                </span>
              )}
              <p className="pr-20 font-medium text-navy">{address.fullName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {address.city}, {address.state} {address.pincode}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">{address.country}</p>
              <p className="mt-2 text-xs font-medium text-gold-dark">{address.phone}</p>

              <div className="mt-4 flex items-center gap-2 border-t border-champagne-deep pt-4">
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => makeDefault(index)}
                    className="h-8 text-xs text-slate-500 hover:bg-gold/10 hover:text-gold-dark"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Make default
                  </Button>
                )}
                <div className="ml-auto flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={busy}
                    onClick={() => openEdit(index)}
                    aria-label={`Edit address ${index + 1}`}
                    className="text-slate-500 hover:bg-gold/10 hover:text-gold-dark"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={busy}
                    onClick={() => remove(index)}
                    aria-label={`Delete address ${index + 1}`}
                    className="text-slate-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open ? (
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-gold/30 bg-background p-6 shadow-sm"
        >
          <h2 className="font-playfair text-lg text-navy">
            {editing == null ? "Add a new address" : "Edit address"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <Input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="rounded-xl border-slate-200 bg-white"
                required
                minLength={2}
              />
            </Field>
            <Field label="Phone number" required>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-xl border-slate-200 bg-white"
                required
                inputMode="tel"
              />
            </Field>
            <Field label="Street address" required className="sm:col-span-2">
              <Input
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
                placeholder="House no, street, area"
                className="rounded-xl border-slate-200 bg-white"
                required
              />
            </Field>
            <Field label="Landmark (optional)" className="sm:col-span-2">
              <Input
                value={form.line2}
                onChange={(e) => setForm({ ...form, line2: e.target.value })}
                placeholder="Near…"
                className="rounded-xl border-slate-200 bg-white"
              />
            </Field>
            <Field label="City" required>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="rounded-xl border-slate-200 bg-white"
                required
              />
            </Field>
            <Field label="State" required>
              <Input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="rounded-xl border-slate-200 bg-white"
                required
              />
            </Field>
            <Field label="Pincode" required>
              <Input
                value={form.pincode}
                onChange={(e) =>
                  setForm({ ...form, pincode: e.target.value.replace(/\D/g, "") })
                }
                maxLength={6}
                className="rounded-xl border-slate-200 bg-white"
                required
                inputMode="numeric"
              />
            </Field>
            <Field label="Country" required>
              <Input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="rounded-xl border-slate-200 bg-white"
                required
              />
            </Field>
          </div>
          <div className="flex justify-end gap-2 border-t border-champagne-deep pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setEditing(null);
              }}
              disabled={busy}
              className="rounded-full border-slate-200 text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={busy}
              className="rounded-full bg-gold text-xs font-semibold tracking-[0.2em] text-navy-deep uppercase transition-colors hover:bg-gold-dark hover:text-white"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing == null ? "Save address" : "Save changes"}
            </Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={openAdd}
          disabled={addresses.length >= 6}
          className="rounded-full border border-gold/40 bg-transparent px-6 text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase transition-colors hover:bg-gold hover:text-white"
        >
          <Plus className="h-4 w-4" />
          Add new address
        </Button>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-sm text-navy">{label}</Label>
      {children}
    </div>
  );
}
