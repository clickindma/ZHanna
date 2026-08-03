import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { getAdminCategories } from "@/lib/queries/admin";
import { adminCategorySchema } from "@/lib/validations/admin";
import { dbConnect } from "@/lib/db";
import { Category } from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const categories = await getAdminCategories();
  return NextResponse.json({ categories });
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

  const parsed = adminCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const category = await Category.create(parsed.data);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    const message =
      error && typeof error === "object" && "code" in error && error.code === 11000
        ? "A category with this slug already exists"
        : "Could not create category";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
