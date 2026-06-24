import { CartSummary } from "@/components/commerce/CartSummary";

type PageProps = {
  navigate: (path: string) => void;
};

export function CartPage({ navigate }: PageProps) {
  return (
    <div className="pb-12">
      <CartSummary navigate={navigate} />
    </div>
  );
}
