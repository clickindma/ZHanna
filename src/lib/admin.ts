import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/types/models";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
}

/**
 * Returns the authenticated session user, or null when signed out.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

/**
 * Guard for admin-only routes. Redirects visitors away instead of
 * rendering the page, so it can be called from layouts/pages directly.
 *
 * - Signed out  -> redirected to /login
 * - Non-admin   -> redirected to /
 * - Admin       -> returns the session user
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  return user;
}

/**
 * Pure role check for use inside client components or conditionals.
 */
export function isAdmin(role?: UserRole): boolean {
  return role === "admin";
}
