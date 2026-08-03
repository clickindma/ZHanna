"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
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
import { ImageUploader } from "@/components/admin/products/image-uploader";
import {
  adminProductSchema,
  type AdminProductInput,
  type AdminProductValues,
} from "@/lib/validations/admin";
import { MATERIALS } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import type { AdminProduct } from "@/types/admin";
import type { Material } from "@/types/models";

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

function RequiredMark() {
  return (
    <span className="text-red-500" aria-hidden="true">
      *
    </span>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function Field({ label, error, hint, required, id, className, ...props }: FieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
        {label} {required && <RequiredMark />}
      </Label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-1.5 h-10 rounded-lg border-slate-200 bg-white text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25",
          className
        )}
        {...props}
      />
      {error ? <FieldError message={error} /> : hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function TextareaField({ label, error, hint, required, id, className, ...props }: TextareaFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
        {label} {required && <RequiredMark />}
      </Label>
      <Textarea
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-1.5 rounded-lg border-slate-200 bg-white text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25",
          className
        )}
        {...props}
      />
      {error ? <FieldError message={error} /> : hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-b border-slate-100 pb-2 text-[11px] font-bold tracking-[0.22em] text-gold-dark uppercase">
      {children}
    </p>
  );
}

function toFormValues(product?: AdminProduct): AdminProductInput {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    sku: product?.sku ?? "",
    category: product?.category?._id ?? "",
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice ?? ("" as unknown as number),
    stock: product?.stock ?? 0,
    weight: product?.weight ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    materials: (product?.materials ?? []) as AdminProductInput["materials"],
    tags: product?.tags?.join(", ") ?? "",
    sizeOptions: product?.sizeOptions?.join(", ") ?? "",
    images: product?.images ?? [],
    isFeatured: product?.isFeatured ?? false,
    isNewArrival: product?.isNewArrival ?? false,
    isActive: product?.isActive ?? true,
    seoTitle: product?.seoTitle ?? "",
    seoDescription: product?.seoDescription ?? "",
  };
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: AdminProduct | null;
  categories: CategoryOption[];
}) {
  const isEdit = Boolean(product);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminProductInput, unknown, AdminProductValues>({
    resolver: zodResolver(adminProductSchema) as never,
    defaultValues: toFormValues(product ?? undefined),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(product ?? undefined));
    }
  }, [open, product, reset]);

  const materials = watch("materials") ?? [];

  function toggleMaterial(material: Material) {
    setValue(
      "materials",
      materials.includes(material)
        ? materials.filter((m) => m !== material)
        : [...materials, material],
      { shouldValidate: true }
    );
  }

  function generateSlug() {
    const name = watch("name");
    if (name) {
      setValue("slug", slugify(name), { shouldValidate: true });
    }
  }

  async function onSubmit(values: AdminProductValues) {
    const url = isEdit
      ? `/api/admin/products/${product?._id}`
      : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await res.json().catch(() => null)) as {
        error?: string;
        issues?: { fieldErrors?: Record<string, string[]> };
      } | null;

      if (!res.ok) {
        const firstFieldError = Object.values(data?.issues?.fieldErrors ?? {})
          .flat()[0];
        toast.error(firstFieldError ?? data?.error ?? "Could not save product");
        return;
      }

      toast.success(isEdit ? "Product updated" : "Product created");
      onOpenChange(false);
      window.location.reload();
    } catch {
      toast.error("Could not save product");
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-navy-deep/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all",
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="font-playfair text-xl text-navy">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isEdit ? product?.name : "Create a new piece for the collection"}
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
            <section className="space-y-4">
              <SectionTitle>Basics</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Product name"
                  id="p-name"
                  required
                  error={errors.name?.message}
                  placeholder="Signature Eternity Ring"
                  hint="Shown on product cards and pages"
                  {...register("name")}
                />
                <Field
                  label="SKU"
                  id="p-sku"
                  required
                  error={errors.sku?.message}
                  placeholder="ZN-RNG-002"
                  hint="Must be unique across the catalogue"
                  {...register("sku")}
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field
                    label="Slug"
                    id="p-slug"
                    required
                    error={errors.slug?.message}
                    placeholder="signature-eternity-ring"
                    hint="Appears in the product URL"
                    {...register("slug")}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSlug}
                  className="mb-px h-10 border-slate-200 text-xs text-slate-600 hover:border-gold hover:text-gold-dark"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate
                </Button>
              </div>
              <div>
                <Label htmlFor="p-category" className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                  Category <RequiredMark />
                </Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger
                        id="p-category"
                        aria-invalid={Boolean(errors.category?.message)}
                        className="mt-1.5 h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm text-navy data-placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent align="center" className="max-h-64">
                        {categories.length === 0 && (
                          <p className="px-3 py-2 text-xs text-muted-foreground">
                            No categories yet — add one from the Categories page.
                          </p>
                        )}
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.category?.message} />
              </div>
            </section>

            <section className="space-y-4">
              <SectionTitle>Pricing & Inventory</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="Price (₹)"
                  id="p-price"
                  required
                  type="number"
                  min={0}
                  step="1"
                  error={errors.price?.message}
                  hint="Selling price in INR"
                  {...register("price", { valueAsNumber: true })}
                />
                <Field
                  label="Compare-at (₹)"
                  id="p-compare"
                  type="number"
                  min={0}
                  step="1"
                  hint="Optional — shown struck-through"
                  error={errors.compareAtPrice?.message}
                  {...register("compareAtPrice", { valueAsNumber: true })}
                />
                <Field
                  label="Stock"
                  id="p-stock"
                  type="number"
                  min={0}
                  step="1"
                  error={errors.stock?.message}
                  hint="Units in inventory"
                  {...register("stock", { valueAsNumber: true })}
                />
              </div>
            </section>

            <section className="space-y-4">
              <SectionTitle>Images</SectionTitle>
              <Controller
                control={control}
                name="images"
                render={({ field }) => (
                  <ImageUploader
                    value={Array.isArray(field.value) ? field.value : []}
                    onChange={(next) => field.onChange(next)}
                    error={errors.images?.message}
                  />
                )}
              />
            </section>

            <section className="space-y-4">
              <SectionTitle>Description</SectionTitle>
              <TextareaField
                label="Short description"
                id="p-short"
                rows={2}
                placeholder="One-line hook shown on cards"
                hint="Optional — up to 220 characters"
                error={errors.shortDescription?.message}
                {...register("shortDescription")}
              />
              <TextareaField
                label="Full description"
                id="p-description"
                required
                rows={4}
                placeholder="The story, craft and character of the piece"
                hint="At least 10 characters"
                error={errors.description?.message}
                {...register("description")}
              />
            </section>

            <section className="space-y-4">
              <SectionTitle>Craft & Media</SectionTitle>
              <div>
                <Label className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                  Materials
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MATERIALS.map((material) => {
                    const selected = materials.includes(material);
                    return (
                      <button
                        key={material}
                        type="button"
                        onClick={() => toggleMaterial(material)}
                        aria-pressed={selected}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs transition-colors",
                          selected
                            ? "border-gold bg-gold/10 font-medium text-gold-dark"
                            : "border-slate-200 bg-white text-slate-600 hover:border-gold/60"
                        )}
                      >
                        {material}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Optional — select the materials used
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Weight"
                  id="p-weight"
                  placeholder="e.g. 3.2 g"
                  hint="Optional"
                  error={errors.weight?.message}
                  {...register("weight")}
                />
                <Field
                  label="Sizes"
                  id="p-sizes"
                  placeholder="6, 7, 8 (comma separated)"
                  hint="Leave empty for one-size pieces"
                  error={errors.sizeOptions?.message}
                  {...register("sizeOptions")}
                />
              </div>
              <Field
                label="Tags"
                id="p-tags"
                placeholder="ring, diamond, bridal (comma separated)"
                hint="Optional — used for search and filtering"
                error={errors.tags?.message}
                {...register("tags")}
              />
            </section>

            <section className="space-y-4">
              <SectionTitle>Visibility & SEO</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Featured", field: "isFeatured" as const },
                  { label: "New arrival", field: "isNewArrival" as const },
                  { label: "Active", field: "isActive" as const },
                ].map(({ label, field }) => (
                  <label
                    key={field}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700"
                  >
                    <Checkbox
                      checked={watch(field)}
                      onCheckedChange={(checked) => setValue(field, Boolean(checked), { shouldValidate: true })}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="SEO title"
                  id="p-seo-title"
                  placeholder="Optional page title"
                  hint="Optional"
                  error={errors.seoTitle?.message}
                  {...register("seoTitle")}
                />
                <Field
                  label="SEO description"
                  id="p-seo-desc"
                  placeholder="Optional meta description"
                  hint="Optional"
                  error={errors.seoDescription?.message}
                  {...register("seoDescription")}
                />
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Fields marked <RequiredMark /> are required
              </p>
              <p className="mt-0.5 font-playfair text-navy">
                {formatPrice(Number(watch("price")) || 0)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-200 text-slate-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-navy text-white transition-colors hover:bg-navy-mid"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEdit ? "Save changes" : "Create product"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
