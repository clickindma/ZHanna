import { AdminPageHeader } from "@/components/admin/page-header";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { getAdminCategories } from "@/lib/queries/admin";

export const metadata = { title: "Categories | Admin" };

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Collections"
        title="Categories"
        description="Organise your catalogue. Products carry over counts here automatically."
      />
      <CategoriesTable categories={categories} />
    </div>
  );
}
