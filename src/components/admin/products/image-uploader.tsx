"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";
import {
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 10;
const MAX_FILE_BYTES = 8 * 1024 * 1024;

interface PendingUpload {
  id: string;
  name: string;
}

interface ImageUploaderProps {
  value: string[];
  onChange: (images: string[]) => void;
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

export function ImageUploader({
  value,
  onChange,
  error,
  disabled,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<PendingUpload[]>([]);

  const remaining = MAX_IMAGES - value.length - uploading.length;
  const busy = uploading.length > 0;

  async function uploadFiles(files: File[]) {
    if (disabled) return;

    const images = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= MAX_FILE_BYTES
    );
    const skipped = files.length - images.length;
    if (skipped > 0) {
      toast.error(
        `${skipped} file${skipped === 1 ? " was" : "s were"} skipped — images only, max 8 MB each`
      );
    }

    if (images.length === 0) return;

    const pending: PendingUpload[] = images.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
    }));
    setUploading((current) => [...current, ...pending]);

    for (const [index, file] of images.entries()) {
      try {
        const dataUrl = await fileToDataUrl(file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error ?? "Upload failed");
        }
        if (data?.url) {
          const next = value.includes(data.url) ? value : [...value, data.url];
          onChange(next);
        }
      } catch (uploadError) {
        const message =
          uploadError instanceof Error ? uploadError.message : "Upload failed";
        toast.error(`${file.name}: ${message}`);
      } finally {
        setUploading((current) =>
          current.filter((entry) => entry.id !== pending[index].id)
        );
      }
    }
  }

  function onSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    uploadFiles(files);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    uploadFiles(Array.from(event.dataTransfer.files ?? []));
  }

  function removeImage(url: string) {
    onChange(value.filter((image) => image !== url));
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload product images"
        aria-disabled={disabled || remaining <= 0}
        onClick={() => {
          if (disabled || remaining <= 0) return;
          inputRef.current?.click();
        }}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && !disabled && remaining > 0) {
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled && remaining > 0) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-9 text-center transition-colors",
          dragging
            ? "border-gold bg-gold/10"
            : "border-slate-300 bg-slate-50 hover:border-gold/70 hover:bg-gold/5",
          (disabled || remaining <= 0) && "cursor-not-allowed opacity-60"
        )}
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-dark">
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <UploadCloud className="h-5 w-5" strokeWidth={1.6} />
          )}
        </span>
        <p className="mt-4 text-sm font-medium text-navy">
          {remaining <= 0
            ? "Maximum 10 images reached"
            : "Drag & drop images here, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG, PNG or WebP · up to 8 MB each · {Math.max(remaining, 0)} slot
          {remaining === 1 ? "" : "s"} left
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={onSelect}
          disabled={disabled}
        />
      </div>

      {(value.length > 0 || uploading.length > 0) && (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url, index) => (
            <li
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                sizes="160px"
                className="object-cover"
              />
              {index === 0 && (
                <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-navy/80 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-gold uppercase backdrop-blur-sm">
                  <Star className="h-2.5 w-2.5 fill-gold" />
                  Primary
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(url)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-navy/80 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-red-600 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </li>
          ))}

          {uploading.map((pending) => (
            <li
              key={pending.id}
              className="relative flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gold/50 bg-gold/5"
            >
              <Loader2 className="h-5 w-5 animate-spin text-gold-dark" />
              <span className="line-clamp-2 max-w-[80%] px-1 text-center text-[10px] text-muted-foreground">
                {pending.name}
              </span>
            </li>
          ))}
        </ul>
      )}

      {value.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ImagePlus className="h-3 w-3" />
            The first image is the primary thumbnail. Remove it to promote another.
          </span>
        </p>
      )}

      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Uploaded to Cloudinary — you can remove images any time before saving.
        </p>
      )}
    </div>
  );
}
