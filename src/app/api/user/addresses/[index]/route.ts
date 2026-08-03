import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/admin-api";
import { dbConnect } from "@/lib/db";
import { User } from "@/models";
import { addressSchema } from "@/lib/validations/account";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ index: string }>;
}

function parseIndex(value: string): number | null {
  const index = Number(value);
  return Number.isInteger(index) && index >= 0 ? index : null;
}

export async function PUT(request: Request, { params }: RouteContext) {
  const guard = await requireUserApi();
  if (guard instanceof NextResponse) return guard;

  const { index: indexValue } = await params;
  const index = parseIndex(indexValue);
  if (index == null) {
    return NextResponse.json({ error: "Invalid address index" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await dbConnect();
  const user = await User.findById(guard.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const current = user.addresses[index];
  if (!current) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  const input = parsed.data;
  const isDefault = input.isDefault ?? current.isDefault;

  if (isDefault) {
    for (const address of user.addresses) {
      address.isDefault = false;
    }
  }

  user.addresses[index] = { ...(current as unknown as Record<string, unknown>), ...input, isDefault } as typeof current;
  await user.save();

  return NextResponse.json({ addresses: user.addresses });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const guard = await requireUserApi();
  if (guard instanceof NextResponse) return guard;

  const { index: indexValue } = await params;
  const index = parseIndex(indexValue);
  if (index == null) {
    return NextResponse.json({ error: "Invalid address index" }, { status: 400 });
  }

  let body: { isDefault?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.isDefault !== true) {
    return NextResponse.json({ error: "isDefault must be true" }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findById(guard.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.addresses[index]) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  for (const address of user.addresses) {
    address.isDefault = false;
  }
  user.addresses[index].isDefault = true;
  await user.save();

  return NextResponse.json({ addresses: user.addresses });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const guard = await requireUserApi();
  if (guard instanceof NextResponse) return guard;

  const { index: indexValue } = await params;
  const index = parseIndex(indexValue);
  if (index == null) {
    return NextResponse.json({ error: "Invalid address index" }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findById(guard.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.addresses[index]) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  user.addresses.splice(index, 1);

  if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  return NextResponse.json({ addresses: user.addresses });
}
