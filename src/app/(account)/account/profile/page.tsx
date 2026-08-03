import { getSessionUser } from "@/lib/admin";
import { getAccountUser } from "@/lib/queries/account";
import { ProfileForm } from "@/components/account/profile-form";

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const session = await getSessionUser();
  const user = await getAccountUser(session!.id);

  if (!user) {
    return <p className="text-sm text-muted-foreground">Profile unavailable.</p>;
  }

  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.35em] text-gold-dark uppercase">
        My Account
      </p>
      <h1 className="mt-1 font-playfair text-3xl text-navy">
        My <span className="text-gradient-gold italic">Profile</span>
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Keep your name and contact number up to date so your orders are never delayed.
      </p>
      <div className="mt-3 h-px w-24 bg-gradient-to-r from-gold-dark to-gold" />

      <div className="mt-8 max-w-xl">
        <ProfileForm
          name={user.name}
          email={user.email}
          phone={user.phone ?? ""}
        />
      </div>
    </div>
  );
}
