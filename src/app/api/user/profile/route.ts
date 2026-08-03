import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/admin-api";
import { dbConnect } from "@/lib/db";
import { User } from "@/models";
import { updateProfileSchema } from "@/lib/validations/account";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireUserApi();
  if (guard instanceof NextResponse) return guard;

  await dbConnect();
  const user = await User.findById(guard.user.id).select("name email phone").lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
    },
  });
}

export async function PATCH(request: Request) {
  const guard = await requireUserApi();
  if (guard instanceof NextResponse) return guard;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await dbConnect();
  const user = await User.findByIdAndUpdate(
    guard.user.id,
    { $set: { name: parsed.data.name, phone: parsed.data.phone } },
    { new: true, runValidators: true }
  );
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
    },
  });
}
