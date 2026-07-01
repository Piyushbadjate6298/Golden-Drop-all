import { useEffect, useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";
import { ProductCard } from "@/components/commerce/ProductCard";
import type { Product } from "@/models/product";
import { loadManagedProducts, productStoreEventName } from "@/services/localStore";
import { cn } from "@/utils/cn";

type ProductCatalogProps = {
  navigate: (path: string) => void;
};

type CatalogView = "list" | "grid";

export function ProductCatalog({ navigate }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>(() => loadManagedProducts());
  const [catalogView, setCatalogView] = useState<CatalogView>("list");

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
      <div className="flex items-center justify-between gap-3 rounded-component border border-surface-border bg-surface-white p-2 shadow-soft sm:justify-end">
        <span className="pl-2 text-sm font-semibold text-surface-muted sm:hidden">
          View
        </span>
        <div
          aria-label="Choose products view"
          className="grid grid-cols-2 rounded-component bg-harvest-cream p-1"
          role="group"
        >
          <button
            aria-pressed={catalogView === "list"}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-component px-3 text-sm font-semibold transition focus:outline-none focus-visible:shadow-focus",
              catalogView === "list"
                ? "bg-gold-primary text-surface-black shadow-soft"
                : "text-surface-muted hover:text-surface-black"
            )}
            onClick={() => setCatalogView("list")}
            type="button"
          >
            <LayoutList className="h-4 w-4" />
            List
          </button>
          <button
            aria-pressed={catalogView === "grid"}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-component px-3 text-sm font-semibold transition focus:outline-none focus-visible:shadow-focus",
              catalogView === "grid"
                ? "bg-gold-primary text-surface-black shadow-soft"
                : "text-surface-muted hover:text-surface-black"
            )}
            onClick={() => setCatalogView("grid")}
            type="button"
          >
            <LayoutGrid className="h-4 w-4" />
            Grid
          </button>
        </div>
      </div>
      <div
        className={cn(
          "grid",
          catalogView === "grid"
            ? "grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
            : "gap-5 lg:grid-cols-3"
        )}
      >
        {products.map((product) => (
          <ProductCard
            compact={catalogView === "grid"}
            key={product.id}
            navigate={navigate}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
