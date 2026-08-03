import { SeoForm } from "@/components/admin/seo/seo-form";
import { getSeoSettings } from "@/lib/queries/seo";

export const metadata = { title: "SEO & Branding | Admin" };

export default async function AdminSeoPage() {
  const settings = await getSeoSettings();

  return <SeoForm initial={settings} />;
}
