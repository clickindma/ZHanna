import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { dbConnect } from "@/lib/db";
import { Homepage } from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  await dbConnect();
  const doc = await Homepage.findOne({ key: "homepage" }).lean().exec();

  return NextResponse.json({
    heroImages: doc?.heroImages ?? [],
    statsSection: doc?.statsSection ?? [],
    testimonials: doc?.testimonials ?? [],
    faqItems: doc?.faqItems ?? [],
    ctaTitle: doc?.ctaTitle ?? "",
    ctaSubtitle: doc?.ctaSubtitle ?? "",
    ctaButtonLabel: doc?.ctaButtonLabel ?? "",
    ctaButtonHref: doc?.ctaButtonHref ?? "",
    ctaImage: doc?.ctaImage ?? "",
  });
}

export async function PUT(request: Request) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Only allow known extended fields
  const allowed = [
    "heroImages",
    "statsSection",
    "testimonials",
    "faqItems",
    "ctaTitle",
    "ctaSubtitle",
    "ctaButtonLabel",
    "ctaButtonHref",
    "ctaImage",
  ];

  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) {
      update[key] = body[key];
    }
  }

  try {
    await dbConnect();
    await Homepage.findOneAndUpdate(
      { key: "homepage" },
      { $set: update },
      { upsert: true, setDefaultsOnInsert: true }
    ).exec();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save extended storefront content:", error);
    return NextResponse.json(
      { error: "Failed to save. Please try again." },
      { status: 502 }
    );
  }
}
