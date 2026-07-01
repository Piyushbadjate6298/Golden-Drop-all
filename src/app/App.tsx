import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { LoginPage } from "@/pages/LoginPage";

const AdminPage = lazy(() =>
  import("@/pages/AdminPage").then((module) => ({ default: module.AdminPage }))
);


const BlogPage = lazy(() =>
  import("@/pages/BlogPage").then((module) => ({ default: module.BlogPage }))
);
const CartPage = lazy(() =>
  import("@/pages/CartPage").then((module) => ({ default: module.CartPage }))
);
const CheckoutPage = lazy(() =>
  import("@/pages/CheckoutPage").then((module) => ({ default: module.CheckoutPage }))
);
const DistributorPage = lazy(() =>
  import("@/pages/DistributorPage").then((module) => ({
    default: module.DistributorPage
  }))
);
const HomePage = lazy(() =>
  import("@/pages/HomePage").then((module) => ({ default: module.HomePage }))
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage }))
);
const OrderTrackingPage = lazy(() =>
  import("@/pages/OrderTrackingPage").then((module) => ({
    default: module.OrderTrackingPage
  }))
);
const ProductDetailsPage = lazy(() =>
  import("@/pages/ProductDetailsPage").then((module) => ({
    default: module.ProductDetailsPage
  }))
);
const ProductsPage = lazy(() =>
  import("@/pages/ProductsPage").then((module) => ({ default: module.ProductsPage }))
);

export type Route =
  | "login"
  | "home"
  | "products"
  | "product"
  | "cart"
  | "checkout"
  | "track-order"
  | "distributor"
  | "blog"
  | "admin";

function getInitialPath() {
  const hashPath = window.location.hash.replace("#", "");
  if (hashPath) return hashPath;

  return window.location.pathname;
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
    if (path === "/") {
      return <LoginPage navigate={navigate} />;
    }

    if (path === "/admin") {
      return (
        <Suspense fallback={<div className="p-8">Loading admin...</div>}>
          <AdminPage navigate={navigate} />
        </Suspense>
      );
    }

    if (path === "/home") {
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

    if (path === "/track-order") {
      return <OrderTrackingPage navigate={navigate} />;
    }

    if (path === "/distributor") {
      return <DistributorPage />;
    }

    if (path === "/blog") {
      return <BlogPage />;
    }

    return <NotFoundPage navigate={navigate} />;
  }, [path]);

  if (path === "/" || path === "/admin") {
    return page;
  }

  return (
    <AppLayout currentPath={path} navigate={navigate}>
      <Suspense fallback={<div className="py-16 text-center font-semibold">Loading...</div>}>
        {page}
      </Suspense>
    </AppLayout>
  );
}
