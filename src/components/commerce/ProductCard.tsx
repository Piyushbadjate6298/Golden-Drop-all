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
  compact?: boolean;
  navigate: (path: string) => void;
  product: Product;
};

export function ProductCard({ compact = false, navigate, product }: ProductCardProps) {
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
      <div
        className={cn(
          "relative bg-gradient-to-br",
          compact ? "h-28 sm:h-44" : "h-64",
          product.colorClass
        )}
      >
        <img
          alt={`${product.name} bottle`}
          className="h-full w-full object-cover mix-blend-multiply"
          loading="lazy"
          src={product.imageUrl}
        />
        <div
          className={cn(
            "absolute rounded-full bg-surface-white/90 font-bold uppercase tracking-[0.14em] text-gold-dark",
            compact ? "left-2 top-2 px-2 py-1 text-[0.6rem]" : "left-4 top-4 px-3 py-1 text-xs"
          )}
        >
          Golden Drop
        </div>
      </div>
      <CardContent className={cn(compact ? "space-y-3 p-3" : "space-y-5")}>
        <div className={cn(compact ? "space-y-1" : "space-y-2")}>
          <div
            className={cn(
              "flex gap-4",
              compact ? "flex-col" : "items-start justify-between"
            )}
          >
            <div>
              <h3 className={cn(compact ? "font-body text-base" : "text-2xl")}>
                {product.name}
              </h3>
              <p
                className={cn(
                  "mt-1 text-sm",
                  compact ? "hidden leading-5 sm:line-clamp-2 sm:block" : "leading-6"
                )}
              >
                {product.shortDescription}
              </p>
            </div>
            <div className={cn(compact ? "text-left" : "text-right")}>
              <div className={cn("font-bold text-surface-black", compact ? "text-lg" : "text-xl")}>
                {formatCurrency(selectedVariant.price)}
              </div>
              <div className="text-sm text-surface-muted line-through">
                {formatCurrency(selectedVariant.mrp)}
              </div>
            </div>
          </div>
        </div>

        <div className={cn("flex flex-wrap gap-2", compact && "hidden gap-1.5 sm:flex")}>
          {product.variants.map((variant) => (
            <button
              className={cn(
                "h-10 rounded-component border px-3 text-sm font-semibold transition focus:outline-none focus-visible:shadow-focus",
                compact && "h-8 px-2 text-xs",
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

        <div className={cn("grid gap-2 text-sm text-surface-muted", compact && "hidden")}>
          {product.nutritionHighlights.map((highlight) => (
            <div className="flex items-center gap-2" key={highlight}>
              <Check className="h-4 w-4 text-harvest-olive" />
              {highlight}
            </div>
          ))}
        </div>

        <div className={cn("grid gap-3", compact ? "grid-cols-2 gap-2" : "sm:grid-cols-2")}>
          <Button
            className="gap-2 px-2"
            onClick={() =>
              dispatch(
                addToCart({
                  productId: product.id,
                  variantId: selectedVariant.id
                })
              )
            }
            size={compact ? "sm" : "md"}
            title="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className={cn(compact && "sr-only sm:not-sr-only")}>Add</span>
          </Button>
          <Button
            className="gap-2 px-2"
            onClick={() => navigate(`/products/${product.slug}`)}
            size={compact ? "sm" : "md"}
            title="View product details"
            variant="outline"
          >
            <Eye className="h-4 w-4" />
            <span className={cn(compact && "sr-only sm:not-sr-only")}>Details</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
