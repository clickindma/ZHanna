import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { getAdminOrderById } from "@/lib/queries/admin";
import { adminOrderUpdateSchema } from "@/lib/validations/admin";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PUT(request: Request, { params }: RouteContext) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = adminOrderUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await dbConnect();

  const orderStatus = parsed.data.orderStatus;
  const current = await Order.findById(id).select("paidAt paymentInfo orderStatus");
  if (!current) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {
    orderStatus,
    trackingNumber: parsed.data.trackingNumber,
    trackingUrl: parsed.data.trackingUrl,
    adminNotes: parsed.data.adminNotes,
  };

  if (orderStatus === "Cancelled") {
    updates.cancelReason = parsed.data.cancelReason;
  } else {
    updates.cancelReason = null;
  }

  if (orderStatus === "Delivered") {
    updates.deliveredAt = current.deliveredAt ?? new Date();
  } else {
    updates.deliveredAt = null;
  }

  if (
    orderStatus === "Confirmed" ||
    orderStatus === "Packed" ||
    orderStatus === "Shipped" ||
    orderStatus === "Delivered"
  ) {
    if (current.paymentInfo?.status === "paid" && !current.paidAt) {
      updates.paidAt = new Date();
    }
  }
  if (orderStatus === "Pending" || orderStatus === "Cancelled") {
    if (orderStatus === "Pending" && current.paymentInfo?.status !== "paid") {
      updates.paidAt = null;
    }
  }

  const order = await Order.findByIdAndUpdate(id, updates, { new: true });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}
