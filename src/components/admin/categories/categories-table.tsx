"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adminCategorySchema,
  type AdminCategoryInput,
  type AdminCategoryValues,
} from "@/lib/validations/admin";
import type { AdminCategory } from "@/types/admin";
import { CategoryImageUploader } from "@/components/admin/categories/category-image-uploader";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function toFormValues(category?: AdminCategory): AdminCategoryInput {
  return {
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    image: category?.image ?? "",
    isActive: category?.isActive ?? true,
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

export function CategoriesTable({ categories }: { categories: AdminCategory[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminCategoryInput, unknown, AdminCategoryValues>({
    resolver: zodResolver(adminCategorySchema) as never,
    defaultValues: toFormValues(),
  });

  useEffect(() => {
    if (modalOpen) {
      reset(toFormValues(editing ?? undefined));
    }
  }, [modalOpen, editing, reset]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(category: AdminCategory) {
    setEditing(category);
    setModalOpen(true);
  }

  function generateSlug() {
    const name = watch("name");
    if (name) setValue("slug", slugify(name), { shouldValidate: true });
  }

  async function onSubmit(values: AdminCategoryValues) {
    const url = editing
      ? `/api/admin/categories/${editing._id}`
      : "/api/admin/categories";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Could not save category");
        return;
      }
      toast.success(editing ? "Category updated" : "Category created");
      setModalOpen(false);
      window.location.reload();
    } catch {
      toast.error("Could not save category");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Could not delete category");
        return;
      }
      toast.success("Category deleted");
      setDeleteTarget(null);
      window.location.reload();
    } catch {
      toast.error("Could not delete category");
    } finally {
      setDeleting(false);
    }
  }

  const inputClasses =
    "mt-1.5 h-10 rounded-lg border-slate-200 bg-white px-3 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAdd} className="bg-navy text-white transition-colors hover:bg-navy-mid">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        {categories.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted-foreground">
            No categories yet — create one to organise your collection.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {category.image && (
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                          <Image
                            src={category.image}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-navy">{category.name}</p>
                        {category.description && (
                          <p className="max-w-xs truncate text-xs text-muted-foreground">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    /{category.slug}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full border-slate-200 font-normal text-slate-600">
                      {category.productCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {category.isActive ? (
                      <Badge className="rounded-full bg-emerald-50 font-medium text-emerald-700">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="rounded-full border-slate-200 font-medium text-slate-500">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(category)}
                        aria-label={`Edit ${category.name}`}
                        className="text-slate-500 hover:bg-sapphire/10 hover:text-sapphire"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(category)}
                        aria-label={`Delete ${category.name}`}
                        className="text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-navy-deep/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="font-playfair text-xl text-navy">
              {editing ? "Edit Category" : "Add Category"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {editing ? editing.name : "Organise your collection"}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
              <div>
                <Label htmlFor="c-name" className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                  Name
                </Label>
                <Input
                  id="c-name"
                  aria-invalid={Boolean(errors.name?.message)}
                  className={inputClasses}
                  placeholder="Rings"
                  {...register("name")}
                />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <Label htmlFor="c-slug" className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                  Slug
                </Label>
                <div className="flex items-end gap-2">
                  <Input
                    id="c-slug"
                    aria-invalid={Boolean(errors.slug?.message)}
                    className={inputClasses}
                    placeholder="rings"
                    {...register("slug")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSlug}
                    className="mb-px h-10 border-slate-200 text-xs text-slate-600 hover:border-gold hover:text-gold-dark"
                  >
                    Generate
                  </Button>
                </div>
                <FieldError message={errors.slug?.message} />
              </div>
              <div>
                <Label htmlFor="c-desc" className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                  Description
                </Label>
                <Textarea
                  id="c-desc"
                  rows={2}
                  aria-invalid={Boolean(errors.description?.message)}
                  className="mt-1.5 rounded-lg border-slate-200 bg-white text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
                  placeholder="What makes this collection special"
                  {...register("description")}
                />
                <FieldError message={errors.description?.message} />
              </div>
              <div>
                <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">
                  Feature Image
                </Label>
                <div className="mt-1.5">
                  <CategoryImageUploader
                    value={watch("image") ?? ""}
                    onChange={(image) =>
                      setValue("image", image, { shouldValidate: true })
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700">
                <Checkbox
                  checked={watch("isActive")}
                  onCheckedChange={(checked) => setValue("isActive", Boolean(checked), { shouldValidate: true })}
                />
                Active category
              </label>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
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
                  {editing ? "Save changes" : "Create category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-navy-deep/40 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="font-playfair text-lg text-navy">Delete category?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-navy">{deleteTarget.name}</span> will be
              permanently removed. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="border-slate-200 text-slate-600"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
