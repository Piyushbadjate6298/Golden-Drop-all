import { Leaf, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";

type HeroSectionProps = {
  navigate: (path: string) => void;
};

const metrics = [
  { label: "Oil types", value: "3" },
  { label: "Pack sizes", value: "1L / 5L / 15L" },
  { label: "Dispatch", value: "24h" }
];

export function HeroSection({ navigate }: HeroSectionProps) {
  return (
    <section className="oil-sheen grid min-h-[620px] gap-10 rounded-component border border-surface-border p-6 md:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Cold kitchen confidence
          </p>
          <h1 className="max-w-3xl">Golden Drop Premium Edible Oils</h1>
          <p className="max-w-2xl text-lg leading-8">
            Safflower, sunflower, and groundnut oils packed for homes,
            restaurants, and bulk cooking with clean product choices and simple
            variant selection.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className="gap-2" onClick={() => navigate("/products")} size="lg">
            <Leaf className="h-5 w-5" />
            Shop Oils
          </Button>
          <Button
            className="gap-2"
            onClick={() => document.getElementById("quality")?.scrollIntoView()}
            size="lg"
            variant="outline"
          >
            <ShieldCheck className="h-5 w-5" />
            View Quality
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              className="rounded-component border border-surface-border bg-surface-white/70 p-4"
              key={metric.label}
            >
              <div className="text-2xl font-bold text-surface-black">
                {metric.value}
              </div>
              <div className="text-sm text-surface-muted">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-h-[420px] overflow-hidden rounded-component bg-surface-black">
        <img
          alt="Golden cooking oil being poured"
          className="absolute inset-0 h-full w-full object-cover opacity-85"
          src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=85"
        />
        <div className="absolute inset-x-5 bottom-5 rounded-component border border-surface-white/20 bg-surface-black/88 p-5 shadow-soft backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-pale">
              <Truck className="h-5 w-5 text-gold-dark" />
            </div>
            <div>
              <div className="font-bold text-surface-white">
                Fresh packs, fast dispatch
              </div>
              <div className="text-sm text-gold-pale">
                Built for direct-to-customer edible-oil ordering.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
