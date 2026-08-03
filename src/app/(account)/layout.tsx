import { redirect } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AccountNav } from "@/components/account/account-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { getSessionUser } from "@/lib/admin";

export default async function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?next=/account/orders");
  }

  return (
    <div className="flex min-h-screen flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[270px_1fr]">
            <AccountNav user={user} />
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
