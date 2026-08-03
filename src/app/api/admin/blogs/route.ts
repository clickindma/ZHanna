import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { dbConnect } from "@/lib/db";
import { Blog } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
  const skip = (page - 1) * limit;

  await dbConnect();

  const filter: Record<string, unknown> = {};
  if (status === "draft" || status === "published") {
    filter.status = status;
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .sort({ createdAt: -1 })
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

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!data.slug || typeof data.slug !== "string" || !data.slug.trim()) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  if (!data.content || typeof data.content !== "string" || !data.content.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  // Set publishedAt when status is published
  if (data.status === "published" && !data.publishedAt) {
    data.publishedAt = new Date();
  }

  try {
    await dbConnect();
    const blog = await Blog.create(data);
    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    const message =
      error && typeof error === "object" && "code" in error && error.code === 11000
        ? "A blog with this slug already exists"
        : "Could not create blog";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
