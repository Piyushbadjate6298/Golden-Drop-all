import type { Product } from "@/models/product";

export const products: Product[] = [
  {
    id: "safflower-oil",
    name: "Safflower Oil",
    slug: "safflower-oil",
    shortDescription: "Light, golden oil for everyday cooking and heart-aware kitchens.",
    description:
      "Naturally mild safflower oil with a clean finish, ideal for sauteing, roasting, and balanced daily meals.",
    imageUrl:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80",
    colorClass: "from-harvest-safflower/15 to-gold-pale",
    nutritionHighlights: ["Light texture", "Neutral aroma", "High-heat friendly"],
    bestFor: ["Sauteing", "Salads", "Daily cooking"],
    variants: [
      { id: "safflower-1l", label: "1 Litre", price: 219, mrp: 249, stock: 80 },
      { id: "safflower-5l", label: "5 Litre", price: 1049, mrp: 1199, stock: 42 },
      { id: "safflower-15l", label: "15 Litre", price: 2999, mrp: 3399, stock: 18 }
    ]
  },
  {
    id: "sunflower-oil",
    name: "Sunflower Oil",
    slug: "sunflower-oil",
    shortDescription: "Bright, versatile cooking oil with a naturally smooth taste.",
    description:
      "A refined kitchen essential for frying, baking, and daily Indian cooking where a lighter flavor is preferred.",
    imageUrl:
      "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=900&q=80",
    colorClass: "from-gold-secondary/20 to-harvest-cream",
    nutritionHighlights: ["Vitamin E source", "Smooth taste", "Everyday versatile"],
    bestFor: ["Frying", "Baking", "Family meals"],
    variants: [
      { id: "sunflower-1l", label: "1 Litre", price: 169, mrp: 199, stock: 110 },
      { id: "sunflower-5l", label: "5 Litre", price: 799, mrp: 925, stock: 56 },
      { id: "sunflower-15l", label: "15 Litre", price: 2299, mrp: 2599, stock: 20 }
    ]
  },
  {
    id: "groundnut-oil",
    name: "Groundnut Oil",
    slug: "groundnut-oil",
    shortDescription: "Rich, nutty oil crafted for deep flavor and traditional recipes.",
    description:
      "A full-bodied groundnut oil for crisp frying, pickles, and regional dishes that need a richer aroma.",
    imageUrl: "/images/groundnut-oil-bottle.png",
    colorClass: "from-harvest-olive/15 to-gold-pale",
    nutritionHighlights: ["Nutty aroma", "Traditional taste", "Crisp frying"],
    bestFor: ["Deep frying", "Pickles", "Regional recipes"],
    variants: [
      { id: "groundnut-1l", label: "1 Litre", price: 239, mrp: 275, stock: 70 },
      { id: "groundnut-5l", label: "5 Litre", price: 1149, mrp: 1325, stock: 36 },
      { id: "groundnut-15l", label: "15 Litre", price: 3299, mrp: 3749, stock: 14 }
    ]
  }
];

export function getProductById(productId: string) {
  return products.find((product) => product.id === productId);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getVariantById(product: Product, variantId: string) {
  return product.variants.find((variant) => variant.id === variantId);
}
