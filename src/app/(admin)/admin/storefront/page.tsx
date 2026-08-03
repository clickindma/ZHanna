import { StorefrontForm } from "@/components/admin/storefront/storefront-form";
import { StorefrontExtended } from "@/components/admin/storefront/storefront-extended";
import { getHomepageContent } from "@/lib/queries/homepage";

export const metadata = { title: "Storefront | Admin" };

export default async function AdminStorefrontPage() {
  const content = await getHomepageContent();

  return (
    <div className="space-y-8">
      <StorefrontForm initial={content} />
      <div className="border-t border-slate-200 pt-8">
        <h2 className="font-playfair text-xl text-navy mb-1">Extended Homepage Sections</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Hero slider images, statistics, testimonials, FAQ, and CTA sections.
        </p>
        <StorefrontExtended />
      </div>
    </div>
  );
}
