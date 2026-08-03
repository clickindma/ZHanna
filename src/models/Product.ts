import { model, models, Schema, type Model } from "mongoose";
import { MATERIALS } from "@/lib/constants";
import type { IProduct } from "@/types/models";

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [160, "Product name cannot exceed 160 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [220, "Short description cannot exceed 220 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      min: [0, "Compare-at price cannot be negative"],
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    materials: {
      type: [String],
      enum: MATERIALS,
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    weight: {
      type: String,
      trim: true,
      default: undefined,
    },
    sizeOptions: {
      type: [String],
      default: [],
    },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", tags: "text", shortDescription: "text" });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ category: 1, isActive: 1, price: 1 });

export const Product: Model<IProduct> =
  (models.Product as Model<IProduct> | undefined) ??
  model<IProduct>("Product", productSchema);

export default Product;
