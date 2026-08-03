import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { getAdminOrders } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const { searchParams } = new URL(request.url);
  const orders = await getAdminOrders({
    status: searchParams.get("status") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });
  return NextResponse.json({ orders });
}
