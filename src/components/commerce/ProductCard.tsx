import { useMemo, useState } from "react";
import { Check, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { addToCart } from "@/store/slices/cartSlice";
import type { Product } from "@/models/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

type ProductCardProps = {
  navigate: (path: string) => void;
  product: Product;
};

export function ProductCard({ navigate, product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id);

  const selectedVariant = useMemo(
    () =>
      product.variants.find((variant) => variant.id === selectedVariantId) ??
      product.variants[0],
    [product.variants, selectedVariantId]
  );

  return (
    <Card className="overflow-hidden">
      <div className={cn("relative h-64 bg-gradient-to-br", product.colorClass)}>
        <img
          alt={`${product.name} bottle`}
          className="h-full w-full object-cover mix-blend-multiply"
          loading="lazy"
          src={product.imageUrl}
        />
        <div className="absolute left-4 top-4 rounded-full bg-surface-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-gold-dark">
          Golden Drop
        </div>
      </div>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl">{product.name}</h3>
              <p className="mt-1 text-sm leading-6">{product.shortDescription}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-surface-black">
                {formatCurrency(selectedVariant.price)}
              </div>
              <div className="text-sm text-surface-muted line-through">
                {formatCurrency(selectedVariant.mrp)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <button
              className={cn(
                "h-10 rounded-component border px-3 text-sm font-semibold transition focus:outline-none focus-visible:shadow-focus",
                selectedVariant.id === variant.id
                  ? "border-gold-primary bg-gold-pale text-surface-black"
                  : "border-surface-border bg-surface-white text-surface-muted hover:border-gold-primary"
              )}
              key={variant.id}
              onClick={() => setSelectedVariantId(variant.id)}
              type="button"
            >
              {variant.label}
            </button>
          ))}
        </div>

        <div className="grid gap-2 text-sm text-surface-muted">
          {product.nutritionHighlights.map((highlight) => (
            <div className="flex items-center gap-2" key={highlight}>
              <Check className="h-4 w-4 text-harvest-olive" />
              {highlight}
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            className="gap-2"
            onClick={() =>
              dispatch(
                addToCart({
                  productId: product.id,
                  variantId: selectedVariant.id
                })
              )
            }
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
          <Button
            className="gap-2"
            onClick={() => navigate(`/products/${product.slug}`)}
            variant="outline"
          >
            <Eye className="h-4 w-4" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
