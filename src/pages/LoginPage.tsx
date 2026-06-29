import { useState } from "react";
import { ArrowRight, Mail, ShoppingBag, UserPlus } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { saveAccount } from "@/services/localStore";

type LoginPageProps = {
  navigate: (path: string) => void;
};

export function LoginPage({ navigate }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [message, setMessage] = useState("");

  return (
    <main className="min-h-screen bg-[#f8fbf1]">
      <Seo
        description="Login to Golden Drop as a customer or administrator, create an account, or recover access."
        path="/"
        title="Login"
      />
      <section className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden bg-surface-black lg:block">
          <img
            alt="Premium cooking oil bottles on a bright kitchen counter"
            className="h-full w-full object-cover opacity-90"
            loading="eager"
            src="https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=1400&q=82"
          />
          <div className="absolute inset-x-10 bottom-10 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-secondary">
              Golden Drop commerce
            </p>
            <h1 className="mt-3 text-surface-white">One portal for buyers and business teams</h1>
            <p className="mt-4 text-lg leading-8 text-white/82">
              Create an account, shop premium edible oils, and let admins manage products,
              orders, and customer records from one workspace.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-8 md:px-10">
          <div className="w-full max-w-3xl">
            <div className="mb-8">
              <div className="text-xl font-bold text-surface-black">Golden Drop</div>
              <p className="mt-1 text-sm text-surface-muted">
                Login, recover access, or create your customer account first.
              </p>
            </div>

            <div className="grid gap-5">
              <div className="rounded-component border border-surface-border bg-surface-white p-5 shadow-soft">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-component bg-gold-pale text-gold-dark">
                  {mode === "signup" ? <UserPlus className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      setMode("login");
                      setMessage("");
                    }}
                    size="sm"
                    variant={mode === "login" ? "primary" : "outline"}
                  >
                    Customer Login
                  </Button>
                  <Button
                    onClick={() => {
                      setMode("signup");
                      setMessage("");
                    }}
                    size="sm"
                    variant={mode === "signup" ? "primary" : "outline"}
                  >
                    Create Account
                  </Button>
                  <Button
                    onClick={() => {
                      setMode("forgot");
                      setMessage("");
                    }}
                    size="sm"
                    variant={mode === "forgot" ? "primary" : "ghost"}
                  >
                    Forgot?
                  </Button>
                </div>

                {mode === "login" ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      navigate("/home");
                    }}
                  >
                    <h2 className="text-2xl">Customer Login</h2>
                    <p className="mt-2 text-sm leading-6">
                      Access shopping, checkout, order tracking, and cart features.
                    </p>
                    <div className="mt-5 space-y-3">
                      <Input required aria-label="Customer email" placeholder="Customer email" type="email" />
                      <Input required aria-label="Customer password" placeholder="Password" type="password" />
                    </div>
                    <Button className="mt-5 w-full gap-2" type="submit">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                ) : null}

                {mode === "signup" ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      const form = new FormData(event.currentTarget);
                      saveAccount({
                        name: String(form.get("name") ?? ""),
                        phone: String(form.get("phone") ?? ""),
                        email: String(form.get("email") ?? ""),
                        password: String(form.get("password") ?? "")
                      });
                      setMessage("Account created. Admin can see it in Customers.");
                      event.currentTarget.reset();
                    }}
                  >
                    <h2 className="text-2xl">Create Account</h2>
                    <p className="mt-2 text-sm leading-6">
                      Register first using phone number and email ID.
                    </p>
                    <div className="mt-5 grid gap-3">
                      <Input required name="name" placeholder="Full name" />
                      <Input required name="phone" placeholder="Phone number" type="tel" />
                      <Input required name="email" placeholder="Email ID" type="email" />
                      <Input required minLength={6} name="password" placeholder="Create password" type="password" />
                    </div>
                    <Button className="mt-5 w-full gap-2" type="submit">
                      <UserPlus className="h-4 w-4" />
                      Create Account
                    </Button>
                  </form>
                ) : null}

                {mode === "forgot" ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      setMessage("Password reset instructions are ready for this demo account.");
                    }}
                  >
                    <h2 className="text-2xl">Forgot Password</h2>
                    <p className="mt-2 text-sm leading-6">
                      Enter your registered email or phone number to recover access.
                    </p>
                    <div className="mt-5 space-y-3">
                      <Input required placeholder="Email ID or phone number" />
                    </div>
                    <Button className="mt-5 w-full gap-2" type="submit">
                      <Mail className="h-4 w-4" />
                      Send Recovery
                    </Button>
                  </form>
                ) : null}

                {message ? (
                  <div className="mt-4 rounded-component border border-harvest-olive/30 bg-[#edf7e6] px-3 py-2 text-sm font-semibold text-harvest-olive">
                    {message}
                  </div>
                ) : null}
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
