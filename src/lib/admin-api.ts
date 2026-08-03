import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/types/models";

/**
 * Returns the authenticated session user for server-side (API) use,
 * or null when signed out.
 */
export async function getApiSessionUser(): Promise<{
  id: string;
  name?: string | null;
  email?: string | null;
  role: UserRole;
} | null> {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

/**
 * Guard for admin-only API routes. Returns the session user or a
 * 401/403 NextResponse that the route handler can return directly.
 */
export async function requireAdminApi(): Promise<
  | { user: { id: string; name?: string | null; email?: string | null; role: UserRole } }
  | NextResponse
> {
  const user = await getApiSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { user };
}

/**
 * Guard for any authenticated-user API route. Returns the session user or a
 * 401 NextResponse that the route handler can return directly.
 */
export async function requireUserApi(): Promise<
  | { user: { id: string; name?: string | null; email?: string | null; role: UserRole } }
  | NextResponse
> {
  const user = await getApiSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { user };
}
