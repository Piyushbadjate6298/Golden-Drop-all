import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { CustomerDetails } from "@/models/order";

type CheckoutFormProps = {
  disabled: boolean;
  onSubmit: (details: CustomerDetails) => void;
};

type PinCodeResponse = {
  Status: string;
  PostOffice: Array<{
    District?: string;
    Name?: string;
  }> | null;
};

const initialDetails: CustomerDetails = {
  name: "",
  email: "",
  phone: "",
  address: ""
};

const initialAddressDetails = {
  line1: "",
  line2: "",
  city: "",
  pinCode: ""
};

export function CheckoutForm({ disabled, onSubmit }: CheckoutFormProps) {
  const [details, setDetails] = useState(initialDetails);
  const [addressDetails, setAddressDetails] = useState(initialAddressDetails);
  const [cityStatus, setCityStatus] = useState<"idle" | "loading" | "found" | "error">(
    "idle"
  );

  useEffect(() => {
    const pinCode = addressDetails.pinCode;

    if (pinCode.length !== 6) {
      setCityStatus("idle");
      setAddressDetails((value) => ({ ...value, city: "" }));
      return;
    }

    const controller = new AbortController();
    setCityStatus("loading");

    fetch(`https://api.postalpincode.in/pincode/${pinCode}`, {
      signal: controller.signal
    })
      .then((response) => response.json() as Promise<PinCodeResponse[]>)
      .then((data) => {
        const postOffice = data[0]?.PostOffice?.[0];
        const city = postOffice?.District || postOffice?.Name || "";

        if (data[0]?.Status === "Success" && city) {
          setAddressDetails((value) => ({ ...value, city }));
          setCityStatus("found");
          return;
        }

        setAddressDetails((value) => ({ ...value, city: "" }));
        setCityStatus("error");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setAddressDetails((value) => ({ ...value, city: "" }));
        setCityStatus("error");
      });

    return () => controller.abort();
  }, [addressDetails.pinCode]);

  return (
    <Card>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const address = [
              addressDetails.line1,
              addressDetails.line2,
              addressDetails.city,
              addressDetails.pinCode
            ]
              .filter(Boolean)
              .join(", ");

            onSubmit({ ...details, address });
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
          <div className="grid gap-4">
            <p className="text-sm font-semibold text-surface-black">Delivery address</p>
            <label className="grid gap-2 text-sm font-semibold text-surface-black">
              Line 1
              <Input
                onChange={(event) =>
                  setAddressDetails((value) => ({ ...value, line1: event.target.value }))
                }
                required
                value={addressDetails.line1}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-surface-black">
              Line 2
              <Input
                onChange={(event) =>
                  setAddressDetails((value) => ({ ...value, line2: event.target.value }))
                }
                value={addressDetails.line2}
              />
            </label>
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-surface-black">
                Pin Code
                <Input
                  inputMode="numeric"
                  onChange={(event) =>
                    setAddressDetails((value) => ({
                      ...value,
                      pinCode: event.target.value.replace(/\D/g, "").slice(0, 6)
                    }))
                  }
                  pattern="[0-9]{6}"
                  required
                  value={addressDetails.pinCode}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-surface-black">
                City
                <Input
                  onChange={(event) =>
                    setAddressDetails((value) => ({ ...value, city: event.target.value }))
                  }
                  placeholder={
                    cityStatus === "loading" ? "Fetching city..." : "City will appear here"
                  }
                  required
                  value={addressDetails.city}
                />
              </label>
            </div>
            {cityStatus === "error" ? (
              <p className="text-xs font-medium text-red-600">
                City could not be found for this pin code. Please check the pin code.
              </p>
            ) : null}
          </div>
          <Button disabled={disabled} type="submit">
            Place Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
