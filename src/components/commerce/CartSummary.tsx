import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getProductById, getVariantById } from "@/models/products";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  clearCart,
  removeFromCart,
  updateQuantity
} from "@/store/slices/cartSlice";
import { formatCurrency } from "@/utils/formatCurrency";

type CartSummaryProps = {
  navigate: (path: string) => void;
};

export function CartSummary({ navigate }: CartSummaryProps) {
  const dispatch = useAppDispatch();
  const lines = useAppSelector((state) => state.cart.lines);

  const hydratedLines = lines
    .map((line) => {
      const product = getProductById(line.productId);
      const variant = product ? getVariantById(product, line.variantId) : undefined;

      if (!product || !variant) {
        return null;
      }

      return {
        ...line,
        lineTotal: variant.price * line.quantity,
        product,
        variant
      };
    })
    .filter((line) => line !== null);

  const subtotal = hydratedLines.reduce((total, line) => total + line.lineTotal, 0);
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);

  return (
    <section className="space-y-5" id="cart">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
          Cart
        </p>
        <h2 className="mt-2">Order Summary</h2>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gold-dark" />
            Your Cart
          </CardTitle>
          <span className="text-sm font-semibold text-surface-muted">
            {itemCount} items
          </span>
        </CardHeader>
        <CardContent className="space-y-5">
          {hydratedLines.length === 0 ? (
            <div className="rounded-component border border-dashed border-surface-border bg-harvest-cream p-6 text-center">
              <p className="text-sm leading-6">
                Your cart is empty. Add a Golden Drop oil variant to begin.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {hydratedLines.map((line) => (
                <div
                  className="grid gap-3 rounded-component border border-surface-border p-4 md:grid-cols-[1fr_auto]"
                  key={`${line.productId}-${line.variantId}`}
                >
                  <div>
                    <div className="font-semibold text-surface-black">
                      {line.product.name}
                    </div>
                    <div className="text-sm text-surface-muted">
                      {line.variant.label} x {line.quantity}
                    </div>
                    <div className="mt-2 font-bold text-surface-black">
                      {formatCurrency(line.lineTotal)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      aria-label="Decrease quantity"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: line.productId,
                            quantity: line.quantity - 1,
                            variantId: line.variantId
                          })
                        )
                      }
                      size="sm"
                      variant="outline"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-bold">
                      {line.quantity}
                    </span>
                    <Button
                      aria-label="Increase quantity"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: line.productId,
                            quantity: line.quantity + 1,
                            variantId: line.variantId
                          })
                        )
                      }
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      aria-label="Remove item"
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            productId: line.productId,
                            variantId: line.variantId
                          })
                        )
                      }
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 border-t border-surface-border pt-4">
            <div className="flex items-center justify-between text-sm text-surface-muted">
              <span>Subtotal</span>
              <span className="font-bold text-surface-black">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-surface-muted">
              <span>Estimated shipping</span>
              <span className="font-bold text-harvest-olive">Free</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold text-surface-black">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1 gap-2"
              disabled={hydratedLines.length === 0}
              onClick={() => navigate("/checkout")}
            >
              <ShoppingBag className="h-4 w-4" />
              Checkout
            </Button>
            <Button
              className="flex-1"
              disabled={hydratedLines.length === 0}
              onClick={() => dispatch(clearCart())}
              variant="outline"
            >
              Clear Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
