import { dbConnect } from "@/lib/db";
import { Category, Product } from "@/models";
import type { CategoryWithCount } from "@/types/product";

export async function getCategories(): Promise<CategoryWithCount[]> {
  await dbConnect();

  const categories = await Category.find({ isActive: true })
    .sort({ name: 1 })
    .lean();

  const counts = await Product.aggregate<{ _id: string; count: number }>([
    { $match: { isActive: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const countByCategory = new Map(
    counts.map((entry) => [entry._id.toString(), entry.count])
  );

  return categories.map((category) => ({
    _id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description ?? null,
    image: category.image ?? null,
    productCount: countByCategory.get(category._id.toString()) ?? 0,
  }));
}
