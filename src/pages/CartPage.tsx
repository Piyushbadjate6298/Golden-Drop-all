import { CartSummary } from "@/components/commerce/CartSummary";
import { Seo } from "@/components/seo/Seo";

type PageProps = {
  navigate: (path: string) => void;
};

export function CartPage({ navigate }: PageProps) {
  return (
    <div className="pb-12">
      <Seo
        description="Review Golden Drop cart items, quantities, and checkout readiness."
        path="/cart"
        title="Cart"
      />
      <CartSummary navigate={navigate} />
    </div>
  );
}
