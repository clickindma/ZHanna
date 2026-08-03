import { model, models, Schema, type Model } from "mongoose";
import type { ICategory } from "@/types/models";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, trim: true },
    image: { type: String },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Category: Model<ICategory> =
  (models.Category as Model<ICategory> | undefined) ??
  model<ICategory>("Category", categorySchema);

export default Category;
