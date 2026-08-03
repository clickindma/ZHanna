import Link from "next/link";
import { Heart } from "lucide-react";
import { getSessionUser } from "@/lib/admin";
import { getWishlistIds } from "@/lib/queries/account";
import { getProductsByIds } from "@/lib/queries/products";
import { WishlistGrid } from "@/components/account/wishlist-grid";

export const dynamic = "force-dynamic";

export default async function AccountWishlistPage() {
  const session = await getSessionUser();
  const ids = await getWishlistIds(session!.id);
  const products = await getProductsByIds(ids);

  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.35em] text-gold-dark uppercase">
        My Account
      </p>
      <h1 className="mt-1 font-playfair text-3xl text-navy">
        My <span className="text-gradient-gold italic">Wishlist</span>
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {products.length === 1
          ? "1 piece saved for later."
          : `${products.length} piece${products.length === 1 ? "" : "s"} saved for later.`}
      </p>
      <div className="mt-3 h-px w-24 bg-gradient-to-r from-gold-dark to-gold" />

      <div className="mt-8">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-champagne-deep bg-champagne/30 px-6 py-20 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
              <Heart className="h-7 w-7" strokeWidth={1.6} />
            </span>
            <p className="mt-5 font-playfair text-2xl text-navy">
              Your wishlist is empty
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Tap the heart on any piece to save it here and never lose track
              of what you love.
            </p>
            <Link
              href="/shop"
              className="mt-7 rounded-full bg-gold px-8 py-3 text-xs font-semibold tracking-[0.2em] text-navy-deep uppercase transition-colors hover:bg-gold-dark hover:text-white"
            >
              Discover the collection
            </Link>
          </div>
        ) : (
          <WishlistGrid products={products} />
        )}
      </div>
    </div>
  );
}
