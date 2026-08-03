import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { adminCategorySchema } from "@/lib/validations/admin";
import { dbConnect } from "@/lib/db";
import { Category, Product } from "@/models";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
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

  const parsed = adminCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const category = await Category.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ category });
  } catch (error) {
    const message =
      error && typeof error === "object" && "code" in error && error.code === 11000
        ? "A category with this slug already exists"
        : "Could not update category";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  await dbConnect();

  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete category — ${productCount} product${productCount === 1 ? "" : "s"} still reference it`,
      },
      { status: 409 }
    );
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
