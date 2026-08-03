import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import {
  isCloudinaryConfigured,
  uploadImage,
} from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Add CLOUDINARY_* variables to .env.local" },
      { status: 500 }
    );
  }

  let body: { dataUrl?: string; folder?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const dataUrl = body?.dataUrl;
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "No image data provided" },
      { status: 400 }
    );
  }

  if (Buffer.byteLength(dataUrl, "utf8") > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is too large. Please keep it under 8 MB." },
      { status: 413 }
    );
  }

  try {
    const result = await uploadImage(dataUrl, {
      folder: body?.folder ?? "zhanna/products",
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 502 }
    );
  }
}
