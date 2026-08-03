import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { dbConnect } from "@/lib/db";
import { SeoSetting } from "@/models";
import { getSeoSettings } from "@/lib/queries/seo";
import { seoSettingsSchema } from "@/lib/validations/seo";

export const dynamic = "force-dynamic";

function normalize(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function GET() {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const settings = await getSeoSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  let body: { settings?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = seoSettingsSchema.safeParse(body?.settings);
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
    const data = parsed.data;
    await SeoSetting.findOneAndUpdate(
      { key: "seo" },
      {
        $set: {
          siteTitle: data.siteTitle.trim(),
          metaDescription: data.metaDescription.trim(),
          metaKeywords: data.metaKeywords.map((keyword) => keyword.trim()),
          ogImage: normalize(data.ogImage),
          favicon: normalize(data.favicon),
          social: {
            instagram: data.social.instagram.trim(),
            facebook: data.social.facebook.trim(),
            whatsapp: data.social.whatsapp.trim(),
            youtube: data.social.youtube.trim(),
            pinterest: data.social.pinterest.trim(),
          },
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    ).exec();

    const settings = await getSeoSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to save SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to save SEO settings. Please try again." },
      { status: 502 }
    );
  }
}
