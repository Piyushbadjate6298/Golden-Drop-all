import { CartSummary } from "@/components/commerce/CartSummary";
import { HeroSection } from "@/components/commerce/HeroSection";
import { ProductCatalog } from "@/components/commerce/ProductCatalog";
import { QualitySection } from "@/components/commerce/QualitySection";
import { Seo } from "@/components/seo/Seo";

type PageProps = {
  navigate: (path: string) => void;
};

export function HomePage({ navigate }: PageProps) {
  return (
    <div className="space-y-14 pb-12">
      <Seo
        description="Shop Golden Drop safflower, sunflower, and groundnut edible oils in 1 litre, 5 litre, and 15 litre packs."
        path="/home"
        title="Premium Edible Oils"
      />
      <HeroSection navigate={navigate} />
      <ProductCatalog navigate={navigate} />
      <QualitySection />
      <CartSummary navigate={navigate} />
    </div>
  );
}
