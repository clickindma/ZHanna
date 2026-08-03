import "server-only";

import { dbConnect } from "@/lib/db";
import { User } from "@/models";
import type { IUser } from "@/types/models";

export interface AccountUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: IUser["addresses"];
  createdAt?: Date;
}

export async function getAccountUser(userId: string): Promise<AccountUser | null> {
  await dbConnect();
  const user = await User.findById(userId).lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    addresses: user.addresses,
    createdAt: user.createdAt,
  };
}

export async function getWishlistIds(userId: string): Promise<string[]> {
  await dbConnect();
  const user = await User.findById(userId).select("wishlist").lean();
  if (!user) return [];
  return (user.wishlist ?? []).map((id) => id.toString());
}
