import { getSessionUser } from "@/lib/admin";
import { getAccountUser } from "@/lib/queries/account";
import { AddressBook } from "@/components/account/address-book";

export const dynamic = "force-dynamic";

export default async function AccountAddressesPage() {
  const session = await getSessionUser();
  const user = await getAccountUser(session!.id);

  if (!user) {
    return <p className="text-sm text-muted-foreground">Addresses unavailable.</p>;
  }

  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.35em] text-gold-dark uppercase">
        My Account
      </p>
      <h1 className="mt-1 font-playfair text-3xl text-navy">
        My <span className="text-gradient-gold italic">Addresses</span>
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Save delivery addresses to speed up checkout. Your default address is
        pre-selected for every order.
      </p>
      <div className="mt-3 h-px w-24 bg-gradient-to-r from-gold-dark to-gold" />

      <div className="mt-8">
        <AddressBook addresses={user.addresses} />
      </div>
    </div>
  );
}
