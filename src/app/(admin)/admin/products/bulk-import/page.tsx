import { AdminPageHeader } from "@/components/admin/page-header";
import { BulkImportForm } from "@/components/admin/products/bulk-import-form";

export const metadata = { title: "Bulk Import | Admin" };

export default function BulkImportPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Bulk Import Products"
        description="Upload a CSV to add many pieces at once. Download the template, fill it in, and we'll validate every row before creating products."
      />
      <BulkImportForm />
    </div>
  );
}
