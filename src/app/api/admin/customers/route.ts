import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { getAdminCustomers } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const customers = await getAdminCustomers();
  return NextResponse.json({ customers });
}
