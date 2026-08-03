"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  initialWishlist,
}: {
  productId: string;
  initialWishlist: boolean;
}) {
  const pathname = usePathname();
  const [inWishlist, setInWishlist] = useState(initialWishlist);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (res.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent(pathname)}`;
        return;
      }

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Could not update wishlist");
        return;
      }

      setInWishlist(data.inWishlist);
      toast.success(
        data.inWishlist
          ? "Added to your wishlist"
          : "Removed from your wishlist",
        { description: "Manage it anytime from your account." }
      );
    } catch {
      toast.error("Could not update wishlist");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={inWishlist}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-all",
        inWishlist
          ? "border-gold bg-gold/10 text-gold-dark"
          : "border-champagne-deep bg-white text-emerald-deep hover:border-gold/60 hover:text-gold-dark"
      )}
    >
      {busy ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart
          className={cn("h-5 w-5 transition-transform", inWishlist && "fill-gold scale-110")}
          strokeWidth={1.8}
        />
      )}
    </button>
  );
}
