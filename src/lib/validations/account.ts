import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be under 80 characters"),
  phone: z
    .union([
      z.string().trim().regex(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number"),
      z.literal(""),
    ])
    .transform((value) => (value === "" ? null : value)),
});

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number"),
  line1: z.string().trim().min(4, "Street address is required").max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2, "City is required").max(80),
  state: z.string().trim().min(2, "State is required").max(80),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pincode must be 6 digits"),
  country: z.string().trim().min(2, "Country is required").max(80).default("India"),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
