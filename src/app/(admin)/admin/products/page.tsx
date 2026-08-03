import Link from "next/link";
import { UploadCloud } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductsTable } from "@/components/admin/products/products-table";
import { Button } from "@/components/ui/button";
import { getAdminProducts, getAdminCategories } from "@/lib/queries/admin";

export const metadata = { title: "Products | Admin" };

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ]);

  const categoryOptions = categories
    .filter((category) => category.isActive)
    .map((category) => ({
      _id: category._id,
      name: category.name,
      slug: category.slug,
    }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Products"
        description={`${products.length} piece${products.length === 1 ? "" : "s"} in the collection. Add, edit or retire listings.`}
        action={
          <Button
            render={<Link href="/admin/products/bulk-import" />}
            variant="outline"
            className="border-slate-200 text-slate-600 hover:border-gold/40 hover:text-gold-dark"
          >
            <UploadCloud className="h-4 w-4" />
            Bulk Import
          </Button>
        }
      />
      <ProductsTable products={products} categories={categoryOptions} />
    </div>
  );
}
