export interface ProductCategoryRef {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductListItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  shortDescription?: string;
  description: string;
  materials: string[];
  stock: number;
  sku: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  sizeOptions: string[];
  weight?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  category: ProductCategoryRef | null;
  createdAt: string;
}

export interface CategoryWithCount {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount: number;
}

export type ProductSort =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc";
