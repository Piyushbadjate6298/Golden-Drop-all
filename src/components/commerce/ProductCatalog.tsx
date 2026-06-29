import { useEffect, useState } from "react";
import { ProductCard } from "@/components/commerce/ProductCard";
import type { Product } from "@/models/product";
import { loadManagedProducts, productStoreEventName } from "@/services/localStore";

type ProductCatalogProps = {
  navigate: (path: string) => void;
};

export function ProductCatalog({ navigate }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>(() => loadManagedProducts());

  useEffect(() => {
    const refreshProducts = () => setProducts(loadManagedProducts());
    window.addEventListener(productStoreEventName(), refreshProducts);
    window.addEventListener("storage", refreshProducts);
    window.addEventListener("focus", refreshProducts);
    document.addEventListener("visibilitychange", refreshProducts);
    refreshProducts();
    return () => {
      window.removeEventListener(productStoreEventName(), refreshProducts);
      window.removeEventListener("storage", refreshProducts);
      window.removeEventListener("focus", refreshProducts);
      document.removeEventListener("visibilitychange", refreshProducts);
    };
  }, []);

  return (
    <section className="space-y-6" id="products">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Shop by oil
          </p>
          <h2 className="mt-2">Premium Oils for Every Kitchen</h2>
        </div>
        <p className="max-w-xl text-sm leading-6">
          Choose 1 litre for trials, 5 litre for monthly family cooking, and 15
          litre for high-volume kitchens.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} navigate={navigate} product={product} />
        ))}
      </div>
    </section>
  );
}
