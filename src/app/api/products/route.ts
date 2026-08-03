import { NextResponse } from "next/server";
import { getProducts } from "@/lib/queries/products";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = {
    category: searchParams.get("category") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    featured: searchParams.get("featured") === "true" || undefined,
    newArrival: searchParams.get("new") === "true" || undefined,
    minPrice:
      searchParams.get("minPrice") != null
        ? Number(searchParams.get("minPrice")) || undefined
        : undefined,
    maxPrice:
      searchParams.get("maxPrice") != null
        ? Number(searchParams.get("maxPrice")) || undefined
        : undefined,
    limit:
      searchParams.get("limit") != null
        ? Number(searchParams.get("limit")) || undefined
        : undefined,
  };

  const { products, total } = await getProducts(query);

  return NextResponse.json({ products, total });
}
