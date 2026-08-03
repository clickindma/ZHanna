export interface PricePreset {
  id: string;
  label: string;
  min: number;
  max?: number;
}

export const PRICE_PRESETS: PricePreset[] = [
  { id: "under-2000", label: "Under ₹2,000", min: 0, max: 1999 },
  { id: "2000-4000", label: "₹2,000 – ₹4,000", min: 2000, max: 4000 },
  { id: "4000-6000", label: "₹4,000 – ₹6,000", min: 4001, max: 6000 },
  { id: "above-6000", label: "Above ₹6,000", min: 6001 },
];

export function pricePresetToRange(id?: string | null): {
  minPrice?: number;
  maxPrice?: number;
} {
  if (!id) {
    return {};
  }
  const preset = PRICE_PRESETS.find((entry) => entry.id === id);
  if (!preset) {
    return {};
  }
  return { minPrice: preset.min, maxPrice: preset.max };
}

export const SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A to Z" },
] as const;
