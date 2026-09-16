/**
 * Product data layer — 3 produk unggulan CMMM.
 * Single source of truth untuk product grid, specs, dan inquiry form.
 */

export type ProductSpec = {
  ashContent: string;
  color: string;
  burningTime: string;
  odor: string;
  smoke: string;
  extras?: Record<string, string>;
};

export type Packaging = {
  masterBox: number[];
  miniBox: number[];
  specialBox: number[];
};

export type Delivery = {
  domestic: string[];
  international: string[];
  docs: string[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  useCase: string;
  pricePerKg: number;
  specs: ProductSpec;
  moq: string[];
  packaging: Packaging;
  delivery: Delivery;
  likes: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "shisha",
    name: "Shisha Charcoal",
    slug: "shisha-charcoal",
    description:
      "Premium shisha charcoal untuk penggunaan hookah/kalood. Padat, tahan lama, tidak berbau & tanpa asap.",
    useCase: "Shisha lounge, hookah bar, kalood rental, personal hookah",
    pricePerKg: 20000,
    specs: {
      ashContent: "< 4%",
      color: "Hitam pekat",
      burningTime: "45–60 menit",
      odor: "No odor",
      smoke: "No smoke",
      extras: {
        "Heat output": "Stabil & konsisten",
        "Shape": "Cube / Round",
      },
    },
    moq: [
      "18 ft container (~12 ton)",
      "20 ft container (~18 ton)",
      "50–100 kg (sample order)",
    ],
    packaging: {
      masterBox: [10, 20, 30],
      miniBox: [500, 5000],
      specialBox: [25, 500, 1000],
    },
    delivery: {
      domestic: ["Indah Kargo", "JTR", "Fuso", "Dahkota"],
      international: ["FOB", "CFR", "CIF"],
      docs: ["B/L", "COO/SKA", "MSDS", "Fumigasi"],
    },
    likes: 142,
  },
  {
    id: "bbq",
    name: "BBQ Charcoal",
    slug: "bbq-charcoal",
    description:
      "Wood charcoal premium untuk BBQ restoran, catering, dan home grilling. Api stabil, abu rendah, rasa makanan autentik.",
    useCase: "BBQ restoran, catering, home grilling, outdoor event",
    pricePerKg: 15000,
    specs: {
      ashContent: "< 6%",
      color: "Coklat gelap",
      burningTime: "60–90 menit",
      odor: "No odor",
      smoke: "Minimal smoke",
      extras: {
        "Heat output": "Tinggi & merata",
        "Shape": "Stick / Lump",
      },
    },
    moq: [
      "18 ft container (~14 ton)",
      "20 ft container (~20 ton)",
      "100–500 kg (wholesale)",
    ],
    packaging: {
      masterBox: [10, 20, 30],
      miniBox: [500],
      specialBox: [25, 500, 1000],
    },
    delivery: {
      domestic: ["Indah Kargo", "JTR", "Fuso", "Dahkota"],
      international: ["FOB", "CFR", "CIF"],
      docs: ["B/L", "COO/SKA", "MSDS", "Fumigasi"],
    },
    likes: 98,
  },
  {
    id: "quick-lighting",
    name: "Quick Lighting",
    slug: "quick-lighting",
    description:
      "Arang cepat menyala untuk kebutuhan memasak sehari-hari dan kompor portable. Nyala cepat dalam 3 detik.",
    useCase: "Kompor portable, memasak rumah tangga, warung, street food",
    pricePerKg: 12000,
    specs: {
      ashContent: "< 8%",
      color: "Hitam keabu-abuan",
      burningTime: "30–45 menit",
      odor: "No odor",
      smoke: "Minimal smoke",
      extras: {
        "Ignition time": "< 3 detik",
        "Shape": "Cube / Pillow",
      },
    },
    moq: [
      "18 ft container (~16 ton)",
      "20 ft container (~22 ton)",
      "50–100 kg (sample order)",
    ],
    packaging: {
      masterBox: [10, 20, 30],
      miniBox: [500, 5000],
      specialBox: [25, 500, 1000],
    },
    delivery: {
      domestic: ["Indah Kargo", "JTR", "Fuso", "Dahkota"],
      international: ["FOB", "CFR", "CIF"],
      docs: ["B/L", "COO/SKA", "MSDS", "Fumigasi"],
    },
    likes: 76,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}
