"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_FILE_BYTES = 8 * 1024 * 1024;

interface CategoryImageUploaderProps {
  value: string;
  onChange: (image: string) => void;
  error?: string;
  disabled?: boolean;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function CategoryImageUploader({
  value,
  onChange,
  error,
  disabled,
}: CategoryImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File) {
    if (disabled) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG or WebP)");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("Image must be under 8 MB");
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, folder: "zhanna/categories" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "Upload failed");
      }
      if (data?.url) {
        onChange(data.url);
        toast.success("Feature image uploaded");
      }
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "Upload failed";
      toast.error(`${file.name}: ${message}`);
    } finally {
      setUploading(false);
    }
  }

  function onSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void uploadFile(file);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  return (
    <div>
      {value ? (
        <div className="space-y-2">
          <div className="group relative aspect-[16/9] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <Image
              src={value}
              alt="Category feature image"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove category image"
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy/80 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-red-600 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loader2 className="h-5 w-5 animate-spin text-gold-dark" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-gold hover:text-gold-dark disabled:opacity-50"
          >
            <RefreshCw className="h-3 w-3" />
            Replace image
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload category feature image"
          aria-disabled={disabled}
          onClick={() => {
            if (!disabled) inputRef.current?.click();
          }}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && !disabled) {
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex aspect-[16/9] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center transition-colors",
            dragging
              ? "border-gold bg-gold/10"
              : "border-slate-300 bg-slate-50 hover:border-gold/70 hover:bg-gold/5",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-dark">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" strokeWidth={1.6} />
            )}
          </span>
          <p className="mt-3 text-sm font-medium text-navy">
            {uploading ? "Uploading…" : "Drag & drop or click to upload"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG or WebP · up to 8 MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={onSelect}
        disabled={disabled}
      />

      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Shown across the storefront for this category.
        </p>
      )}
    </div>
  );
}
