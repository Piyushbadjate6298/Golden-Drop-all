import { useMemo, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getProductBySlug } from "@/models/products";
import { addToCart } from "@/store/slices/cartSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

type ProductDetailsPageProps = {
  navigate: (path: string) => void;
  slug: string;
};

export function ProductDetailsPage({ navigate, slug }: ProductDetailsPageProps) {
  const dispatch = useAppDispatch();
  const product = getProductBySlug(slug);
  const [selectedVariantId, setSelectedVariantId] = useState(product?.variants[0]?.id);

  const selectedVariant = useMemo(
    () =>
      product?.variants.find((variant) => variant.id === selectedVariantId) ??
      product?.variants[0],
    [product, selectedVariantId]
  );

  if (!product || !selectedVariant) {
    return (
      <div className="pb-12">
        <h1>Product not found</h1>
        <p className="mt-3 max-w-xl">
          This oil is not available in the Golden Drop catalog.
        </p>
        <Button className="mt-6" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 pb-12 lg:grid-cols-[0.95fr_1.05fr]">
      <div className={cn("overflow-hidden rounded-component bg-gradient-to-br", product.colorClass)}>
        <img
          alt={`${product.name} bottle`}
          className="h-full min-h-[420px] w-full object-cover mix-blend-multiply"
          src={product.imageUrl}
        />
      </div>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Product details
          </p>
          <h1 className="mt-2">{product.name}</h1>
          <p className="mt-4 text-lg leading-8">{product.description}</p>
        </div>

        <Card>
          <CardContent className="space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-sm text-surface-muted">Selected pack</div>
                <div className="text-2xl font-bold text-surface-black">
                  {selectedVariant.label}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-surface-black">
                  {formatCurrency(selectedVariant.price)}
                </div>
                <div className="text-sm text-surface-muted line-through">
                  {formatCurrency(selectedVariant.mrp)}
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
              {[...product.nutritionHighlights, ...product.bestFor].map((item) => (
                <div className="flex items-center gap-2" key={item}>
                  <Check className="h-4 w-4 text-harvest-olive" />
                  {item}
                </div>
              ))}
            </div>

            <Button
              className="w-full gap-2"
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
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
