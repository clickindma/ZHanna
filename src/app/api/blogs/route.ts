import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Blog } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 12));
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
      .select("-content") // Exclude full content from listing for performance
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  return NextResponse.json({
    blogs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
