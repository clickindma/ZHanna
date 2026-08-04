import type { ICategory, IProduct, Material } from "@/types/models";

export const SEED_ADMIN = {
  name: "Zhanna Admin",
  email: "admin@zhanna.com",
  password: "Zhanna2026",
};

export const SEED_CATEGORIES: Array<Omit<ICategory, "isActive"> & { isActive: boolean }> = [
  { name: "Rings", slug: "rings", description: "Statement rings and everyday bands", image: "/brand/category-rings.jpg", isActive: true },
  { name: "Necklaces", slug: "necklaces", description: "Chokers, chains and bridal neckpieces", isActive: true },
  { name: "Earrings", slug: "earrings", description: "Studs, drops and chandbalis", image: "/brand/category-earrings.jpg", isActive: true },
  { name: "Bracelets", slug: "bracelets", description: "Cuffs, bangles and tennis chains", image: "/brand/category-bracelets.jpg", isActive: true },
  { name: "Pendants", slug: "pendants", description: "Solitaires, lockets and celestial charms", image: "/brand/category-pendants.jpg", isActive: true },
];

type SeedProduct = Omit<
  IProduct,
  "category" | "isFeatured" | "isNewArrival" | "isActive" | "images" | "tags"
> & {
  categorySlug: string;
  materials: Material[];
  tags: string[];
  images: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
};

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: "Signature Eternity Diamond Ring",
    slug: "signature-eternity-diamond-ring",
    sku: "ZN-RNG-001",
    shortDescription: "A radiant band of brilliant-cut stones that catch every light.",
    description:
      "The Signature Eternity Ring is Zhanna's most requested piece — a delicate band pavé-set with lab-crafted brilliant-cut stones. The halo of sparkle runs seamlessly around the band, designed to be worn solo or stacked. Each stone is hand-set and rhodium polished for mirror-like shine that never dulls.",
    price: 2499,
    compareAtPrice: 3299,
    categorySlug: "rings",
    materials: ["Artificial Gold", "Diamond-like", "Rhodium Plated"],
    stock: 42,
    images: [],
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["ring", "diamond", "eternity", "bridal", "gift"],
    weight: "3.2 g",
    sizeOptions: ["6", "7", "8", "9", "10"],
    seoTitle: "Signature Eternity Diamond Ring | Zhanna",
    seoDescription:
      "Shop the Signature Eternity Ring — an artificial diamond pavé band, rhodium plated, hand-set in India by Zhanna.",
  },
  {
    name: "Rani Jadau Bridal Necklace",
    slug: "rani-jadau-bridal-necklace",
    sku: "ZN-NKL-001",
    shortDescription: "An heirloom-worthy jadau choker for your grandest moments.",
    description:
      "Inspired by royal Rajasthani ateliers, the Rani Jadau Bridal Necklace layers uncut artificial diamonds, rose gold plating and hand-worked enamel in a majestic choker silhouette. Its adjustable hook clasp and weighted drape make it the centrepiece of any bridal trousseau.",
    price: 6999,
    compareAtPrice: 8999,
    categorySlug: "necklaces",
    materials: ["Artificial Gold", "Diamond-like", "Copper", "Alloy"],
    stock: 12,
    images: [],
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    tags: ["bridal", "necklace", "jadau", "choker", "ethnic"],
    weight: "48 g",
    sizeOptions: ["Adjustable"],
    seoTitle: "Rani Jadau Bridal Necklace | Zhanna",
    seoDescription:
      "Royal jadau bridal necklace with uncut artificial diamonds and rose gold plating by Zhanna. Shop online in India.",
  },
  {
    name: "Imperial Chandbali Earrings",
    slug: "imperial-chandbali-earrings",
    sku: "ZN-ERN-001",
    shortDescription: "Half-moon chandbalis that frame the face with Mughal grace.",
    description:
      "The Imperial Chandbali Earrings reimagine the classic Mughal crescent. A sculpted moon of gold-toned alloy is edged with cascading diamond-like stones and tiny jhumka drops that sway with every movement. Feather-light, they are comfortable from ceremony to midnight.",
    price: 3299,
    compareAtPrice: 4299,
    categorySlug: "earrings",
    materials: ["Artificial Gold", "Diamond-like", "Alloy"],
    stock: 28,
    images: [],
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["earrings", "chandbali", "jhumka", "ethnic", "bridal"],
    weight: "14 g",
    sizeOptions: ["One Size"],
    seoTitle: "Imperial Chandbali Earrings | Zhanna",
    seoDescription:
      "Mughal-inspired chandbali earrings with diamond-like stones and jhumka drops. Handcrafted by Zhanna.",
  },
  {
    name: "Timeless Tennis Bracelet",
    slug: "timeless-tennis-bracelet",
    sku: "ZN-BRC-001",
    shortDescription: "A continuous line of sparkle for wrist-grazing elegance.",
    description:
      "The Timeless Tennis Bracelet strings uniform brilliant-cut artificial diamonds along a secure double-lock chain. Rhodium-plated for a white-metal finish that resists tarnish, it layers beautifully with bangles or shines alone as a daily signature.",
    price: 4499,
    compareAtPrice: null,
    categorySlug: "bracelets",
    materials: ["Silver", "Diamond-like", "Rhodium Plated"],
    stock: 19,
    images: [],
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    tags: ["bracelet", "tennis", "diamond", "everyday", "layering"],
    weight: "6.8 g",
    sizeOptions: ["7 inch", "7.5 inch", "8 inch"],
    seoTitle: "Timeless Tennis Bracelet | Zhanna",
    seoDescription:
      "Rhodium-plated tennis bracelet with brilliant artificial diamonds by Zhanna. Tarnish-resistant and gift-ready.",
  },
  {
    name: "Lotus Solitaire Pendant",
    slug: "lotus-solitaire-pendant",
    sku: "ZN-PND-001",
    shortDescription: "A pure lotus silhouette crowned with a single solitaire.",
    description:
      "The Lotus Solitaire Pendant suspends a hand-cut solitaire above an open lotus motif — a symbol of purity and new beginnings. Finished in rhodium with a delicate cable chain, it is the perfect everyday talisman.",
    price: 2999,
    compareAtPrice: 3699,
    categorySlug: "pendants",
    materials: ["Artificial Gold", "Diamond-like", "Rhodium Plated"],
    stock: 35,
    images: [],
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["pendant", "lotus", "solitaire", "everyday", "minimal"],
    weight: "4.1 g",
    sizeOptions: ["16 inch", "18 inch"],
    seoTitle: "Lotus Solitaire Pendant | Zhanna",
    seoDescription:
      "Lotus solitaire pendant with cable chain by Zhanna. Rhodium plated, anti-tarnish, everyday luxury.",
  },
  {
    name: "Pearl Cascade Drop Earrings",
    slug: "pearl-cascade-drop-earrings",
    sku: "ZN-ERN-002",
    shortDescription: "Soft-touch pearls cascading in a gentle waterfall line.",
    description:
      "The Pearl Cascade Drop Earrings layer graduated faux pearls with diamond-like accents on whisper-light wires. Their ivory sheen suits both ivory lehengas and linen summer dresses, moving beautifully as you speak.",
    price: 1999,
    compareAtPrice: 2599,
    categorySlug: "earrings",
    materials: ["Artificial Gold", "Diamond-like", "Alloy"],
    stock: 40,
    images: [],
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["earrings", "pearl", "drops", "party", "elegant"],
    weight: "8.5 g",
    sizeOptions: ["One Size"],
    seoTitle: "Pearl Cascade Drop Earrings | Zhanna",
    seoDescription:
      "Graduated faux pearl drop earrings with diamond-like accents by Zhanna. Elegant for parties and weddings.",
  },
  {
    name: "Regal Kundan Choker Set",
    slug: "regal-kundan-choker-set",
    sku: "ZN-NKL-002",
    shortDescription: "Choker and earrings set in glowing rose-gold kundan.",
    description:
      "The Regal Kundan Choker Set pairs a sculpted choker with matching jhumka earrings, all set with polished kundan stones and a kiss of rose-gold plating. Light enough for all-night wear, grand enough for the aisle.",
    price: 5499,
    compareAtPrice: 6999,
    categorySlug: "necklaces",
    materials: ["Artificial Gold", "Diamond-like", "Copper"],
    stock: 9,
    images: [],
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    tags: ["set", "kundan", "choker", "bridal", "party"],
    weight: "36 g",
    sizeOptions: ["Adjustable"],
    seoTitle: "Regal Kundan Choker Set | Zhanna",
    seoDescription:
      "Kundan choker and jhumka earrings set in rose-gold finish by Zhanna. Bridal and festive jewellery online.",
  },
  {
    name: "Minimal Chevron Ring",
    slug: "minimal-chevron-ring",
    sku: "ZN-RNG-002",
    shortDescription: "A sleek geometric V-band, quiet and modern.",
    description:
      "The Minimal Chevron Ring is cut from a single line of polished metal with a subtle diamond-set accent at its apex. An understated piece for modern wardrobes — stack it or let it stand alone.",
    price: 1299,
    compareAtPrice: null,
    categorySlug: "rings",
    materials: ["Silver", "Rhodium Plated"],
    stock: 64,
    images: [],
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["ring", "minimal", "geometric", "everyday", "stacking"],
    weight: "2.1 g",
    sizeOptions: ["6", "7", "8", "9"],
    seoTitle: "Minimal Chevron Ring | Zhanna",
    seoDescription:
      "Geometric chevron ring with a subtle diamond accent. Rhodium-plated silver by Zhanna, made for stacking.",
  },
  {
    name: "Delicate Daisy Chain Bracelet",
    slug: "delicate-daisy-chain-bracelet",
    sku: "ZN-BRC-002",
    shortDescription: "Tiny enamel daisies on a whisper of a chain.",
    description:
      "The Delicate Daisy Chain Bracelet threads hand-painted enamel daisies along a fine gold-toned chain. A sweet, feminine piece that stacks prettily or charms alone — and makes the loveliest of gifts.",
    price: 1599,
    compareAtPrice: 2099,
    categorySlug: "bracelets",
    materials: ["Artificial Gold", "Alloy"],
    stock: 55,
    images: [],
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["bracelet", "daisy", "enamel", "gift", "feminine"],
    weight: "3.4 g",
    sizeOptions: ["6.5 inch", "7 inch"],
    seoTitle: "Delicate Daisy Chain Bracelet | Zhanna",
    seoDescription:
      "Enamel daisy chain bracelet in gold-tone by Zhanna. A sweet everyday gift piece, tarnish-resistant.",
  },
  {
    name: "Celestial Moonstone Pendant",
    slug: "celestial-moonstone-pendant",
    sku: "ZN-PND-002",
    shortDescription: "A crescent moon cradling a milky moonstone.",
    description:
      "The Celestial Moonstone Pendant pairs a gleaming crescent with an adularescent moonstone — a stone said to carry calm and intuition. Hangs on a 16-inch chain with a 2-inch extender, finished in anti-tarnish rhodium.",
    price: 2499,
    compareAtPrice: 3199,
    categorySlug: "pendants",
    materials: ["Silver", "Rhodium Plated", "Diamond-like"],
    stock: 31,
    images: [],
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["pendant", "moonstone", "celestial", "moon", "gift"],
    weight: "4.6 g",
    sizeOptions: ["16 inch", "18 inch"],
    seoTitle: "Celestial Moonstone Pendant | Zhanna",
    seoDescription:
      "Crescent moon pendant with a genuine moonstone by Zhanna. Anti-tarnish rhodium finish, celestial jewellery.",
  },
];
