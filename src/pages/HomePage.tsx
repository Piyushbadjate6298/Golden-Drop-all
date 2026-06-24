import { CartSummary } from "@/components/commerce/CartSummary";
import { HeroSection } from "@/components/commerce/HeroSection";
import { ProductCatalog } from "@/components/commerce/ProductCatalog";
import { QualitySection } from "@/components/commerce/QualitySection";

type PageProps = {
  navigate: (path: string) => void;
};

export function HomePage({ navigate }: PageProps) {
  return (
    <div className="space-y-14 pb-12">
      <HeroSection navigate={navigate} />
      <ProductCatalog navigate={navigate} />
      <QualitySection />
      <CartSummary navigate={navigate} />
    </div>
  );
}
