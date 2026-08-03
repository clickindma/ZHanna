import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models";
import { registerApiSchema } from "@/lib/validations/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      name?: unknown;
      email?: unknown;
      password?: unknown;
    };

    const parsed = registerApiSchema.safeParse(body ?? {});

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message;
      return NextResponse.json(
        { message: firstError ?? "Please check the details you entered." },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    await dbConnect();

    const existing = await User.findOne({ email }).select("_id");
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { message: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    console.error("[register] unexpected error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
