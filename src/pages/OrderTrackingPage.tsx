import { useState } from "react";
import { CheckCircle2, Package, Search, Truck } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type OrderTrackingPageProps = {
  navigate: (path: string) => void;
};

const steps = [
  { label: "Order placed", icon: CheckCircle2 },
  { label: "Packed", icon: Package },
  { label: "Out for delivery", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 }
];

export function OrderTrackingPage({ navigate }: OrderTrackingPageProps) {
  const [orderId, setOrderId] = useState("GD-1048");
  const [searchedOrder, setSearchedOrder] = useState("GD-1048");

  return (
    <div className="space-y-8 pb-12">
      <Seo
        description="Track Golden Drop edible oil orders from confirmation to delivery."
        path="/track-order"
        title="Order Tracking"
      />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
          Order tracking
        </p>
        <h1 className="mt-2">Track Your Golden Drop Order</h1>
      </div>
      <Card>
        <CardContent>
          <form
            className="grid gap-3 md:grid-cols-[1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchedOrder(orderId || "GD-1048");
            }}
          >
            <Input
              aria-label="Order ID"
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Enter order ID"
              value={orderId}
            />
            <Button className="gap-2" type="submit">
              <Search className="h-4 w-4" />
              Track
            </Button>
          </form>
        </CardContent>
      </Card>
      <section className="rounded-component border border-surface-border bg-surface-white p-5 shadow-soft">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl">Order {searchedOrder}</h2>
            <p className="mt-1 text-sm">Expected delivery: 2 business days</p>
          </div>
          <Button onClick={() => navigate("/products")} variant="outline">
            Shop Again
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                className="rounded-component border border-surface-border bg-[#fbfcf7] p-4"
                key={step.label}
              >
                <Icon className={index < 3 ? "h-6 w-6 text-harvest-olive" : "h-6 w-6 text-surface-muted"} />
                <div className="mt-3 font-bold">{step.label}</div>
                <p className="mt-1 text-sm">{index < 3 ? "Completed" : "Pending"}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
