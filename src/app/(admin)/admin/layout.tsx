import { requireAdmin } from "@/lib/admin";
import { AdminChrome } from "@/components/admin/admin-chrome";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAdmin();

  return <AdminChrome user={user}>{children}</AdminChrome>;
}
