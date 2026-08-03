import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { dbConnect } from "@/lib/db";
import { Blog } from "@/models";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  await dbConnect();
  const blog = await Blog.findById(id).lean();

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ blog });
}

export async function PUT(request: Request, { params }: RouteContext) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

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

  // Remove immutable fields
  delete data._id;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.__v;

  // If switching to published and no publishedAt, set it
  if (data.status === "published" && !data.publishedAt) {
    data.publishedAt = new Date();
  }

  // If switching back to draft, clear publishedAt
  if (data.status === "draft") {
    data.publishedAt = null;
  }

  try {
    await dbConnect();
    const blog = await Blog.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    const message =
      error && typeof error === "object" && "code" in error && error.code === 11000
        ? "A blog with this slug already exists"
        : "Could not update blog";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  await dbConnect();
  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
