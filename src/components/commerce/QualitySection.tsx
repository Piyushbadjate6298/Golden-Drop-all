import { BadgeCheck, Factory, PackageCheck } from "lucide-react";

const points = [
  {
    icon: BadgeCheck,
    title: "Premium Positioning",
    copy: "Clean product hierarchy, refined gold-led identity, and conversion-focused cards."
  },
  {
    icon: PackageCheck,
    title: "Variant Ready",
    copy: "Every oil supports 1 litre, 5 litre, and 15 litre packs with independent pricing."
  },
  {
    icon: Factory,
    title: "Scale Friendly",
    copy: "Typed product models, Redux cart state, and a service layer ready for backend APIs."
  }
];

export function QualitySection() {
  return (
    <section className="space-y-6" id="quality">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
          Commerce foundation
        </p>
        <h2 className="mt-2">Designed for a Premium Oil Brand</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {points.map((point) => {
          const Icon = point.icon;

          return (
            <div
              className="rounded-component border border-surface-border bg-surface-white p-5"
              key={point.title}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-gold-pale">
                <Icon className="h-5 w-5 text-gold-dark" />
              </div>
              <h3 className="text-xl">{point.title}</h3>
              <p className="mt-2 text-sm leading-6">{point.copy}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
