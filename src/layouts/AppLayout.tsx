import type { ReactNode } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setSidebarOpen } from "@/store/slices/uiSlice";
import { cn } from "@/utils/cn";

type AppLayoutProps = {
  children: ReactNode;
  navigate: (path: string) => void;
};

const navigation = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Cart", path: "/cart" }
];

export function AppLayout({ children, navigate }: AppLayoutProps) {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);
  const itemCount = useAppSelector((state) =>
    state.cart.lines.reduce((total, line) => total + line.quantity, 0)
  );

  const goTo = (path: string) => {
    navigate(path);
    dispatch(setSidebarOpen(false));
  };

  return (
    <main className="min-h-screen bg-harvest-cream">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 md:px-8 lg:px-10">
        <header className="sticky top-0 z-40 mb-8 flex items-center justify-between border-b border-surface-border/80 bg-harvest-cream/95 py-4 backdrop-blur">
          <button className="text-left" onClick={() => goTo("/")} type="button">
            <div className="text-lg font-bold text-surface-black">Golden Drop</div>
            <div className="text-sm text-surface-muted">Premium edible oils</div>
          </button>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-surface-black md:flex">
            {navigation.map((item) => (
              <button
                className="transition hover:text-gold-dark"
                key={item.path}
                onClick={() => goTo(item.path)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              aria-label="Open cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-component border border-surface-border bg-surface-white transition hover:border-gold-primary"
              onClick={() => goTo("/cart")}
              type="button"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-primary px-1 text-xs font-bold text-surface-black">
                  {itemCount}
                </span>
              ) : null}
            </button>
            <button
              aria-label="Open navigation"
              className="inline-flex h-10 w-10 items-center justify-center rounded-component border border-surface-border bg-surface-white md:hidden"
              onClick={() => dispatch(setSidebarOpen(!isSidebarOpen))}
              type="button"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>

        <div
          className={cn(
            "mb-6 grid gap-2 rounded-component border border-surface-border bg-surface-white p-3 md:hidden",
            !isSidebarOpen && "hidden"
          )}
        >
          {navigation.map((item) => (
            <button
              className="rounded-component px-3 py-2 text-left text-sm font-semibold hover:bg-gold-pale"
              key={item.path}
              onClick={() => goTo(item.path)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        {children}
      </div>
    </main>
  );
}
