import { model, models, Schema, type Model } from "mongoose";
import type { IAddress, IUser, UserRole } from "@/types/models";

const addressSchema = new Schema<IAddress>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: "India", trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const userRoles: UserRole[] = ["customer", "admin"];

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: userRoles,
      default: "customer",
    },
    phone: { type: String, trim: true },
    addresses: { type: [addressSchema], default: [] },
    wishlist: { type: [String], default: [], index: true },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  (models.User as Model<IUser> | undefined) ??
  model<IUser>("User", userSchema);

export default User;
