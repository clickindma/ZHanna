"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Minus, PackagePlus, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductFormDialog } from "@/components/admin/products/product-form";
import { BRAND } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { AdminProduct } from "@/types/admin";

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

function StockCell({
  productId,
  stock,
  onChange,
}: {
  productId: string;
  stock: number;
  onChange: (stock: number) => void;
}) {
  const [adjusting, setAdjusting] = useState(false);
  const [draft, setDraft] = useState<number | null>(null);

  const displayed = draft ?? stock;

  const status =
    stock === 0
      ? { label: "Out of Stock", className: "bg-red-50 text-red-600" }
      : stock <= 5
        ? { label: "Low Stock", className: "bg-amber-50 text-amber-700" }
        : { label: "In Stock", className: "bg-emerald-50 text-emerald-700" };

  function commit(next: number) {
    const value = Math.max(0, Math.min(99999, next));
    setDraft(null);
    setAdjusting(true);
    onChange(value);
    setTimeout(() => setAdjusting(false), 800);
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Badge className={`rounded-full font-medium ${status.className}`}>
        {adjusting && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
        {status.label}
      </Badge>
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => commit(stock - 1)}
          disabled={stock === 0}
          aria-label={`Decrease stock for ${productId}`}
          className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40"
        >
          <Minus className="h-3 w-3" />
        </button>
        <input
          type="number"
          value={displayed}
          min={0}
          max={99999}
          onChange={(e) => {
            const value = Number(e.target.value);
            setDraft(Number.isNaN(value) ? 0 : value);
          }}
          onBlur={() => {
            if (draft != null && draft !== stock) commit(draft);
            else setDraft(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          className="h-7 w-14 rounded-md border border-slate-200 bg-white px-1 text-center text-sm font-medium text-navy focus:border-gold/50 focus:outline-none"
          aria-label={`Set stock for ${productId}`}
        />
        <button
          type="button"
          onClick={() => commit(stock + 1)}
          aria-label={`Increase stock for ${productId}`}
          className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export function ProductsTable({
  products,
  categories,
}: {
  products: AdminProduct[];
  categories: CategoryOption[];
}) {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) =>
      [product.name, product.sku, product.slug, product.category?.name ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [products, search]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: AdminProduct) {
    setEditing(product);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Could not delete product");
        return;
      }
      toast.success("Product deleted");
      setDeleteTarget(null);
      window.location.reload();
    } catch {
      toast.error("Could not delete product");
    } finally {
      setDeleting(false);
    }
  }

  async function updateStock(productId: string, stock: number) {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Could not update stock");
        return;
      }
      toast.success("Stock updated");
      window.location.reload();
    } catch {
      toast.error("Could not update stock");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU or category…"
            className="h-10 rounded-lg border-slate-200 bg-white pl-9 text-sm"
          />
        </div>
        <Button onClick={openAdd} className="bg-navy text-white transition-colors hover:bg-navy-mid">
          <PackagePlus className="h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        {filtered.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted-foreground">
            {products.length === 0
              ? "No products yet — add your first piece to get started."
              : "No products match your search."}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16">Piece</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product._id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="relative h-12 w-10 overflow-hidden rounded-md border border-slate-200 bg-champagne">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center font-playfair text-xs text-navy/40">
                          {BRAND.name[0]}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-navy">{product.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {product.sku} · /{product.slug}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.category ? (
                      <Badge variant="outline" className="rounded-full border-slate-200 font-normal text-slate-600">
                        {product.category.name}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium text-navy">
                    {formatPrice(product.price)}
                    {product.compareAtPrice != null && (
                      <span className="ml-1.5 text-xs text-slate-400 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <StockCell
                      productId={product._id}
                      stock={product.stock}
                      onChange={(stock) => updateStock(product._id, stock)}
                    />
                  </TableCell>
                  <TableCell>
                    {product.isActive ? (
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
                        onClick={() => openEdit(product)}
                        aria-label={`Edit ${product.name}`}
                        className="text-slate-500 hover:bg-sapphire/10 hover:text-sapphire"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(product)}
                        aria-label={`Delete ${product.name}`}
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

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        categories={categories}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-navy-deep/40 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="font-playfair text-lg text-navy">Delete product?</h2>
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
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
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
