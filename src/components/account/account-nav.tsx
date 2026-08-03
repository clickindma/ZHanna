import { signOut } from "@/lib/auth";
import { LogOut, UserRound } from "lucide-react";
import type { SessionUser } from "@/lib/admin";
import { isAdmin } from "@/lib/admin";
import { AccountNavLinks } from "@/components/account/account-nav-links";

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export function AccountNav({ user }: { user: SessionUser }) {
  return (
    <aside className="h-fit rounded-2xl border border-champagne-deep bg-champagne/30 p-6 lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald text-gold-light">
          <UserRound className="h-5 w-5" strokeWidth={1.6} />
        </span>
        <div className="min-w-0">
          <p className="truncate font-playfair text-lg text-navy">
            {user.name ?? "My Account"}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <AccountNavLinks showAdmin={isAdmin(user.role)} />

      <form action={signOutAction} className="mt-6 border-t border-champagne-deep pt-5">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.7} />
          Sign out
        </button>
      </form>
    </aside>
  );
}
