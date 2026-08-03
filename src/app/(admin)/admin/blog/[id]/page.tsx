"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Loader2, Save, Send, Trash2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageHeader } from "@/components/admin/page-header";
import { cn } from "@/lib/utils";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

const inputClass =
  "h-10 w-full rounded-lg border-slate-200 bg-white px-3 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25";

const textareaClass =
  "w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  useEffect(() => {
    async function loadBlog() {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Not found");
        const blog = data.blog;
        setTitle(blog.title ?? "");
        setSlug(blog.slug ?? "");
        setExcerpt(blog.excerpt ?? "");
        setContent(blog.content ?? "");
        setCategory(blog.category ?? "");
        setTags((blog.tags ?? []).join(", "));
        setFeaturedImage(blog.featuredImage ?? "");
        setSeoTitle(blog.seoTitle ?? "");
        setSeoDescription(blog.seoDescription ?? "");
        setStatus(blog.status ?? "draft");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load blog");
        router.push("/admin/blog");
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [id, router]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB.");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, folder: "zhanna/blog" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Upload failed");
      setFeaturedImage(data?.url ?? "");
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(newStatus: "draft" | "published") {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }
    setSaving(true);
    try {
      const body = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category: category.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        featuredImage,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
        status: newStatus,
      };
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Failed to save");
      setStatus(newStatus);
      toast.success(newStatus === "published" ? "Blog published!" : "Draft saved!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setDeletingPost(true);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Delete failed");
      }
      toast.success("Blog post deleted");
      router.push("/admin/blog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingPost(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Blog"
        title="Edit Blog Post"
        description="Update your blog post content and settings."
        action={
          <Link href="/admin/blog">
            <Button variant="outline" className="border-slate-200 text-slate-600 hover:border-gold hover:text-navy">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
            <h2 className="font-playfair text-[15px] text-navy">Post Content</h2>

            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Title</Label>
              <Input
                className={cn(inputClass, "mt-1.5")}
                placeholder="Enter blog post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Slug</Label>
              <Input
                className={cn(inputClass, "mt-1.5")}
                placeholder="url-slug"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
              />
            </div>

            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Excerpt</Label>
              <Textarea
                className={cn(textareaClass, "mt-1.5")}
                rows={3}
                placeholder="Brief summary..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Content</Label>
              <Textarea
                className={cn(textareaClass, "mt-1.5 min-h-[300px]")}
                rows={15}
                placeholder="Write your blog post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </section>

          {/* SEO */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
            <h2 className="font-playfair text-[15px] text-navy">SEO Settings</h2>
            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">SEO Title</Label>
              <Input
                className={cn(inputClass, "mt-1.5")}
                placeholder="Custom SEO title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">SEO Description</Label>
              <Textarea
                className={cn(textareaClass, "mt-1.5")}
                rows={3}
                placeholder="Meta description..."
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
              />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-playfair text-[15px] text-navy">Publish</h2>
            <p className="text-xs text-muted-foreground">
              Current status:{" "}
              <span className={cn("font-semibold", status === "published" ? "text-emerald-600" : "text-amber-600")}>
                {status}
              </span>
            </p>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={() => handleSave("published")}
                disabled={saving}
                className="w-full bg-navy text-gold-light hover:bg-navy-deep"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {status === "published" ? "Update" : "Publish"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="w-full border-slate-200 text-slate-600 hover:border-gold hover:text-navy"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save as Draft
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={deletingPost}
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                {deletingPost ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete Post
              </Button>
            </div>
          </section>

          {/* Category & Tags */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-playfair text-[15px] text-navy">Organization</h2>
            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Category</Label>
              <Input
                className={cn(inputClass, "mt-1.5")}
                placeholder="e.g. Jewelry Care"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-[11px] font-semibold tracking-[0.15em] text-navy uppercase">Tags</Label>
              <Input
                className={cn(inputClass, "mt-1.5")}
                placeholder="tag1, tag2, tag3"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">Comma-separated</p>
            </div>
          </section>

          {/* Featured Image */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-playfair text-[15px] text-navy">Featured Image</h2>
            <div
              className={cn(
                "relative h-40 w-full overflow-hidden rounded-xl border bg-slate-100",
                featuredImage ? "border-slate-200" : "border-dashed border-slate-300"
              )}
            >
              {featuredImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featuredImage} alt="Featured" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage("")}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy/80 text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-gold-dark" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-gold-dark" strokeWidth={1.5} />
                  )}
                  <p className="text-xs">{uploading ? "Uploading…" : "No image set"}</p>
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-slate-200 text-slate-600 hover:border-gold hover:text-navy"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
              {featuredImage ? "Replace image" : "Upload image"}
            </Button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleImageUpload}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
