import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/admin-api";
import { dbConnect } from "@/lib/db";
import { User } from "@/models";
import { addressSchema } from "@/lib/validations/account";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireUserApi();
  if (guard instanceof NextResponse) return guard;

  await dbConnect();
  const user = await User.findById(guard.user.id).select("addresses").lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ addresses: user.addresses ?? [] });
}

export async function POST(request: Request) {
  const guard = await requireUserApi();
  if (guard instanceof NextResponse) return guard;

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

  const input = parsed.data;
  const isFirst = user.addresses.length === 0;
  const isDefault = input.isDefault ?? isFirst;

  if (isDefault) {
    for (const address of user.addresses) {
      address.isDefault = false;
    }
  }

  user.addresses.push({ ...input, isDefault });
  await user.save();

  return NextResponse.json({ addresses: user.addresses }, { status: 201 });
}
