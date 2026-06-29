import { ProductCatalog } from "@/components/commerce/ProductCatalog";
import { Seo } from "@/components/seo/Seo";

type PageProps = {
  navigate: (path: string) => void;
};

export function ProductsPage({ navigate }: PageProps) {
  return (
    <div className="space-y-8 pb-12">
      <Seo
        description="Browse Golden Drop edible oil products with variants, pricing, and cart actions."
        path="/products"
        title="Products"
      />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
          Catalog
        </p>
        <h1 className="mt-2">Golden Drop Oils</h1>
      </div>
      <ProductCatalog navigate={navigate} />
    </div>
  );
}
