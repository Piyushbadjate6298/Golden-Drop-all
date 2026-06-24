export type ProductVariant = {
  id: string;
  label: "1 Litre" | "5 Litre" | "15 Litre";
  price: number;
  mrp: number;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  colorClass: string;
  nutritionHighlights: string[];
  bestFor: string[];
  variants: ProductVariant[];
};

export type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;
};
