import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireUserApi } from "@/lib/admin-api";
import { dbConnect } from "@/lib/db";
import { Product, User } from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireUserApi();
  if (guard instanceof NextResponse) return guard;

  await dbConnect();
  const user = await User.findById(guard.user.id).select("wishlist").lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ wishlist: user.wishlist ?? [] });
}

export async function POST(request: Request) {
  const guard = await requireUserApi();
  if (guard instanceof NextResponse) return guard;

  let body: { productId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const productId = body.productId;
  if (typeof productId !== "string" || !mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  await dbConnect();
  const product = await Product.findById(productId).select("_id isActive").lean();
  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const user = await User.findById(guard.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const wishlist = user.wishlist ?? [];
  const inWishlist = wishlist.some((id) => id.toString() === productId);

  if (inWishlist) {
    user.wishlist = wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist = [...wishlist, productId];
  }
  await user.save();

  return NextResponse.json({
    wishlist: user.wishlist,
    inWishlist: !inWishlist,
  });
}
