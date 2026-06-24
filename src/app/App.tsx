import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { HomePage } from "@/pages/HomePage";
import { ProductDetailsPage } from "@/pages/ProductDetailsPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export type Route = "home" | "products" | "product" | "cart" | "checkout";

function getInitialPath() {
  return window.location.hash.replace("#", "") || "/";
}

export function App() {
  const [path, setPath] = useState(getInitialPath);

  const navigate = (nextPath: string) => {
    window.history.pushState(null, "", `#${nextPath}`);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handlePopState = () => setPath(getInitialPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const page = useMemo(() => {
    if (path === "/" || path === "/home") {
      return <HomePage navigate={navigate} />;
    }

    if (path === "/products") {
      return <ProductsPage navigate={navigate} />;
    }

    if (path.startsWith("/products/")) {
      return (
        <ProductDetailsPage
          navigate={navigate}
          slug={path.replace("/products/", "")}
        />
      );
    }

    if (path === "/cart") {
      return <CartPage navigate={navigate} />;
    }

    if (path === "/checkout") {
      return <CheckoutPage navigate={navigate} />;
    }

    return <NotFoundPage navigate={navigate} />;
  }, [path]);

  return <AppLayout navigate={navigate}>{page}</AppLayout>;
}
