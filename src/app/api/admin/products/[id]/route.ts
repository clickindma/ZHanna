import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { getAdminProductById } from "@/lib/queries/admin";
import { adminProductSchema, toAdminProductPayload } from "@/lib/validations/admin";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const product = await getAdminProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  let body: { stock?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const stock = body.stock;
  if (
    typeof stock !== "number" ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    stock > 99999
  ) {
    return NextResponse.json(
      { error: "stock must be a whole number between 0 and 99999" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: { stock } },
      { new: true, runValidators: true }
    );
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Could not update stock" }, { status: 409 });
  }
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
    const product = await Product.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    const message =
      error && typeof error === "object" && "code" in error && error.code === 11000
        ? "A product with this slug or SKU already exists"
        : "Could not update product";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  await dbConnect();
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
