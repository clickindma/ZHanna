import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { toCsv } from "@/lib/csv";
import { IMPORT_COLUMNS, IMPORT_TEMPLATE_ROWS } from "@/lib/product-import";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const csv = toCsv([[...IMPORT_COLUMNS], ...IMPORT_TEMPLATE_ROWS]);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="zhanna-product-import-template.csv"',
    },
  });
}
