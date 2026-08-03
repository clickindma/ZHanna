import { dbConnect } from "@/lib/db";
import Blog, { type IBlog } from "@/models/Blog";

export interface BlogListResult {
  blogs: IBlog[];
  total: number;
  page: number;
  totalPages: number;
}

interface GetBlogsOptions {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

/**
 * Fetches published blog posts with optional filtering and pagination.
 */
export async function getBlogs(options: GetBlogsOptions = {}): Promise<BlogListResult> {
  const { page = 1, limit = 12, category, search } = options;
  const skip = (page - 1) * limit;

  await dbConnect();

  const filter: Record<string, unknown> = { status: "published" };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .select("-content")
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  return {
    blogs: JSON.parse(JSON.stringify(blogs)) as IBlog[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Fetches a single published blog post by slug.
 */
export async function getBlogBySlug(slug: string): Promise<IBlog | null> {
  await dbConnect();

  const blog = await Blog.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!blog) return null;

  return JSON.parse(JSON.stringify(blog)) as IBlog;
}

/**
 * Fetches related posts by category, excluding the current post.
 */
export async function getRelatedBlogs(
  category: string,
  excludeSlug: string,
  limit = 3
): Promise<IBlog[]> {
  await dbConnect();

  const blogs = await Blog.find({
    status: "published",
    category,
    slug: { $ne: excludeSlug },
  })
    .select("-content")
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  return JSON.parse(JSON.stringify(blogs)) as IBlog[];
}

/**
 * Fetches all unique categories from published blogs.
 */
export async function getBlogCategories(): Promise<string[]> {
  await dbConnect();

  const categories = await Blog.distinct("category", {
    status: "published",
    category: { $ne: "" },
  });

  return categories as string[];
}
