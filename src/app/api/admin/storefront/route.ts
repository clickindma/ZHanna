import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { dbConnect } from "@/lib/db";
import { Homepage } from "@/models";
import { getHomepageContent } from "@/lib/queries/homepage";
import { storefrontContentSchema } from "@/lib/validations/storefront";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const content = await getHomepageContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  let body: { content?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = storefrontContentSchema.safeParse(body?.content);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    await Homepage.findOneAndUpdate(
      { key: "homepage" },
      { $set: parsed.data },
      { upsert: true, setDefaultsOnInsert: true }
    ).exec();
    return NextResponse.json({ content: parsed.data });
  } catch (error) {
    console.error("Failed to save storefront content:", error);
    return NextResponse.json(
      { error: "Failed to save storefront content. Please try again." },
      { status: 502 }
    );
  }
}
