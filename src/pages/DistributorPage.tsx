import { useState } from "react";
import { Send, Store, Truck } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";

export function DistributorPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      <Seo
        description="Apply to become a Golden Drop distributor for premium edible oils."
        path="/distributor"
        title="Distributor Enquiry"
      />
      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Distributor leads
          </p>
          <h1 className="mt-2">Partner With Golden Drop</h1>
          <p className="mt-4 text-lg leading-8">
            Send your territory, monthly volume, and business details. The sales team can
            qualify leads and export them from the admin panel.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-component border border-surface-border bg-surface-white p-4">
              <Store className="h-5 w-5 text-harvest-olive" />
              <div className="mt-2 font-bold">Retail supply</div>
            </div>
            <div className="rounded-component border border-surface-border bg-surface-white p-4">
              <Truck className="h-5 w-5 text-harvest-olive" />
              <div className="mt-2 font-bold">Bulk dispatch</div>
            </div>
          </div>
        </div>
        <Card>
          <CardContent>
            {submitted ? (
              <div className="py-8 text-center">
                <h2 className="text-2xl">Lead submitted</h2>
                <p className="mt-3">The distributor team will contact you soon.</p>
                <Button className="mt-5" onClick={() => setSubmitted(false)} variant="outline">
                  Submit Another Lead
                </Button>
              </div>
            ) : (
              <form
                className="grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
              >
                <Input required placeholder="Business name" />
                <Input required placeholder="City / Territory" />
                <Input required placeholder="Monthly volume" />
                <Input required placeholder="Phone number" />
                <Textarea placeholder="Message" />
                <Button className="gap-2" type="submit">
                  <Send className="h-4 w-4" />
                  Send Enquiry
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
