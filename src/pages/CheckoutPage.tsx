import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { CheckoutForm } from "@/components/commerce/CheckoutForm";
import { Button } from "@/components/ui/Button";
import { getProductById, getVariantById } from "@/models/products";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { clearCart } from "@/store/slices/cartSlice";
import type { CustomerDetails } from "@/models/order";
import { formatCurrency } from "@/utils/formatCurrency";

type PageProps = {
  navigate: (path: string) => void;
};

export function CheckoutPage({ navigate }: PageProps) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const dispatch = useAppDispatch();
  const lines = useAppSelector((state) => state.cart.lines);
  const subtotal = lines.reduce((total, line) => {
    const product = getProductById(line.productId);
    const variant = product ? getVariantById(product, line.variantId) : undefined;
    return total + (variant ? variant.price * line.quantity : 0);
  }, 0);

  const handleSubmit = (_details: CustomerDetails) => {
    setOrderPlaced(true);
    dispatch(clearCart());
  };

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-2xl pb-12 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold-pale">
          <CheckCircle className="h-8 w-8 text-harvest-olive" />
        </div>
        <h1>Order Request Received</h1>
        <p className="mt-4">
          This frontend is ready to connect to a backend order API. For now, the
          checkout flow validates customer details and clears the cart.
        </p>
        <Button className="mt-6" onClick={() => navigate("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 pb-12 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Checkout
          </p>
          <h1 className="mt-2">Delivery Details</h1>
        </div>
        <CheckoutForm disabled={lines.length === 0} onSubmit={handleSubmit} />
      </div>
      <aside className="h-fit rounded-component border border-surface-border bg-surface-white p-5 shadow-soft">
        <h2 className="text-2xl">Payment Summary</h2>
        <div className="mt-5 space-y-3 text-sm text-surface-muted">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <strong className="text-surface-black">{formatCurrency(subtotal)}</strong>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <strong className="text-harvest-olive">Free</strong>
          </div>
          <div className="flex justify-between border-t border-surface-border pt-3 text-lg text-surface-black">
            <span>Total</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
        </div>
        {lines.length === 0 ? (
          <Button className="mt-6 w-full" onClick={() => navigate("/products")}>
            Add Products
          </Button>
        ) : null}
      </aside>
    </div>
  );
}
