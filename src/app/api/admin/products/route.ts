import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { getAdminProducts } from "@/lib/queries/admin";
import { adminProductSchema, toAdminProductPayload } from "@/lib/validations/admin";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const products = await getAdminProducts();
  return NextResponse.json({ products });
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

  const parsed = adminProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const payload = toAdminProductPayload(parsed.data);

  try {
    await dbConnect();
    const product = await Product.create({
      ...payload,
      category: payload.category,
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message =
      error && typeof error === "object" && "code" in error && error.code === 11000
        ? "A product with this slug or SKU already exists"
        : "Could not create product";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
