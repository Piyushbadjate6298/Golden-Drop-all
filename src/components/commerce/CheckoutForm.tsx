import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import type { CustomerDetails } from "@/models/order";

type CheckoutFormProps = {
  disabled: boolean;
  onSubmit: (details: CustomerDetails) => void;
};

const initialDetails: CustomerDetails = {
  name: "",
  email: "",
  phone: "",
  address: ""
};

export function CheckoutForm({ disabled, onSubmit }: CheckoutFormProps) {
  const [details, setDetails] = useState(initialDetails);

  return (
    <Card>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(details);
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-surface-black">
              Full name
              <Input
                onChange={(event) =>
                  setDetails((value) => ({ ...value, name: event.target.value }))
                }
                required
                value={details.name}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-surface-black">
              Phone number
              <Input
                onChange={(event) =>
                  setDetails((value) => ({ ...value, phone: event.target.value }))
                }
                required
                type="tel"
                value={details.phone}
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-surface-black">
            Email
            <Input
              onChange={(event) =>
                setDetails((value) => ({ ...value, email: event.target.value }))
              }
              required
              type="email"
              value={details.email}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-surface-black">
            Delivery address
            <Textarea
              onChange={(event) =>
                setDetails((value) => ({ ...value, address: event.target.value }))
              }
              required
              value={details.address}
            />
          </label>
          <Button disabled={disabled} type="submit">
            Place Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
