export interface CartItem {
  key: string;
  productId: string;
  slug?: string;
  name: string;
  price: number;
  mrp?: number;
  image?: string;
  size?: string;
  quantity: number;
}

export type CategorySlug = "diamond" | "oxidized" | "gold" | "fashion";

export type ProductCategory = {
  slug: CategorySlug;
  name: string;
  description?: string;
};
