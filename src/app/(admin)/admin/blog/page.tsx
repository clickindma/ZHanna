"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FileText, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface BlogItem {
  _id: string;
  title: string;
  category: string;
  status: "draft" | "published";
  createdAt: string;
  publishedAt: string | null;
}

const STATUS_FILTERS = ["all", "published", "draft"] as const;

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      const res = await fetch(`/api/admin/blogs?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to fetch blogs");
      setBlogs(data.blogs ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Delete failed");
      }
      toast.success("Blog post deleted");
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Content"
        title="Blog Posts"
        description="Create and manage blog posts for your store."
        action={
          <Link href="/admin/blog/new">
            <Button className="bg-navy text-gold-light hover:bg-navy-deep">
              <Plus className="h-4 w-4" />
              New Blog Post
            </Button>
          </Link>
        }
      />

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 w-fit">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-md px-4 py-1.5 text-xs font-semibold capitalize transition-colors",
              filter === s
                ? "bg-navy text-gold-light"
                : "text-slate-600 hover:bg-champagne hover:text-navy"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Blog table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-gold-dark" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm text-muted-foreground">No blog posts found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100">
                <TableHead className="text-[10px] font-semibold tracking-[0.15em] text-navy uppercase">Title</TableHead>
                <TableHead className="text-[10px] font-semibold tracking-[0.15em] text-navy uppercase">Category</TableHead>
                <TableHead className="text-[10px] font-semibold tracking-[0.15em] text-navy uppercase">Status</TableHead>
                <TableHead className="text-[10px] font-semibold tracking-[0.15em] text-navy uppercase">Date</TableHead>
                <TableHead className="text-[10px] font-semibold tracking-[0.15em] text-navy uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog._id} className="border-slate-50">
                  <TableCell className="font-medium text-navy max-w-[200px] truncate">
                    {blog.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {blog.category || "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        blog.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {blog.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(blog.publishedAt ?? blog.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/blog/${blog._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 border-slate-200 hover:border-gold hover:text-gold-dark"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(blog._id, blog.title)}
                        disabled={deleting === blog._id}
                        className="h-7 w-7 p-0 border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      >
                        {deleting === blog._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
