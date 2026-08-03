import { model, models, Schema, type Model } from "mongoose";

export interface IBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
  publishedAt: Date | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogDocument = IBlog;

const blogSchema = new Schema<BlogDocument>(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: { type: String, default: "" },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    featuredImage: { type: String, default: "" },
    category: { type: String, default: "" },
    tags: { type: [String], default: [] },
    author: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    publishedAt: { type: Date, default: null },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", excerpt: "text", content: "text" });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });

export const Blog: Model<BlogDocument> =
  (models.Blog as Model<BlogDocument> | undefined) ??
  model<BlogDocument>("Blog", blogSchema);

export default Blog;
