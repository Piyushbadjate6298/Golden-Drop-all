import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  Download,
  Edit3,
  Eye,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  Users
} from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import type { Product, ProductVariant } from "@/models/product";
import {
  accountStoreEventName,
  loadAccounts,
  loadManagedProducts,
  loadRemovedProducts,
  removedProductStoreEventName,
  saveManagedProducts,
  saveRemovedProducts,
  type Account
} from "@/services/localStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

type AdminPageProps = {
  navigate: (path: string) => void;
};

type AdminModule = "Dashboard" | "Products" | "Orders" | "Customers";

type ProductForm = {
  name: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  oneLitrePrice: string;
  fiveLitrePrice: string;
  fifteenLitrePrice: string;
  stock: string;
  bestFor: string;
  highlights: string;
};

const modules: Array<{ label: AdminModule; icon: typeof LayoutDashboard }> = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Products", icon: Boxes },
  { label: "Orders", icon: PackageCheck },
  { label: "Customers", icon: Users }
];

const adminCredentials = {
  email: "admin@goldendrop.com",
  password: "admin123"
};

const orders = [
  {
    id: "GD-1048",
    customer: "Priya Sharma",
    item: "Groundnut Oil 15 Litre",
    quantity: 1,
    total: 3299,
    status: "Packed"
  },
  {
    id: "GD-1049",
    customer: "Urban Foods",
    item: "Groundnut Oil 5 Litre",
    quantity: 10,
    total: 11490,
    status: "Processing"
  },
  {
    id: "GD-1050",
    customer: "Aarav Patel",
    item: "Sunflower Oil 5 Litre",
    quantity: 1,
    total: 799,
    status: "Delivered"
  },
  {
    id: "GD-1051",
    customer: "Hotel Sai",
    item: "Sunflower Oil 15 Litre",
    quantity: 10,
    total: 22990,
    status: "Shipped"
  }
];

const emptyForm: ProductForm = {
  name: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  oneLitrePrice: "",
  fiveLitrePrice: "",
  fifteenLitrePrice: "",
  stock: "",
  bestFor: "",
  highlights: ""
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function MiniChart({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);

  return (
    <div className="flex h-44 items-end gap-2 rounded-component border border-surface-border bg-[#fbfcf7] p-4">
      {values.map((value, index) => (
        <div className="flex flex-1 flex-col items-center gap-2" key={`${value}-${index}`}>
          <div
            className={cn("w-full rounded-t-component", color)}
            style={{ height: `${Math.max(18, (value / max) * 132)}px` }}
          />
          <span className="text-xs font-semibold text-surface-muted">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function createInvoicePdf(order: (typeof orders)[number], status: string) {
  const subtotal = order.total;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + tax;
  const lines = [
    "GOLDEN DROP",
    "Premium Edible Oils",
    `Invoice: ${order.id}`,
    `Date: ${new Date().toLocaleDateString()}`,
    `Customer: ${order.customer}`,
    `Status: ${status}`,
    "------------------------------------------------",
    "Item",
    `${order.item} x ${order.quantity}`,
    `Subtotal: INR ${subtotal.toLocaleString("en-IN")}`,
    `GST 5%: INR ${tax.toLocaleString("en-IN")}`,
    `Grand Total: INR ${grandTotal.toLocaleString("en-IN")}`,
    "------------------------------------------------",
    "Thank you for choosing Golden Drop."
  ];
  const content = [
    "BT",
    "/F1 22 Tf",
    "72 760 Td",
    `(${escapePdfText(lines[0])}) Tj`,
    "/F1 11 Tf",
    ...lines.slice(1).map((line) => `0 -28 Td (${escapePdfText(line)}) Tj`),
    "ET"
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  ];
  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(header.length + body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = header.length + body.length;
  const xref = [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `),
    "trailer",
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    String(xrefOffset),
    "%%EOF"
  ].join("\n");

  return `${header}${body}${xref}`;
}

export function AdminPage({ navigate }: AdminPageProps) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeModule, setActiveModule] = useState<AdminModule>("Dashboard");
  const [productView, setProductView] = useState<"add" | "history">("add");
  const [query, setQuery] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(() => loadAccounts());
  const [managedProducts, setManagedProducts] = useState<Product[]>(() => loadManagedProducts());
  const [removedProducts, setRemovedProducts] = useState<Product[]>(() => loadRemovedProducts());
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<Product | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
    Object.fromEntries(orders.map((order) => [order.id, order.status]))
  );

  useEffect(() => {
    const refreshAccounts = () => setAccounts(loadAccounts());
    window.addEventListener(accountStoreEventName(), refreshAccounts);
    window.addEventListener("storage", refreshAccounts);
    return () => {
      window.removeEventListener(accountStoreEventName(), refreshAccounts);
      window.removeEventListener("storage", refreshAccounts);
    };
  }, []);

  useEffect(() => {
    const refreshRemovedProducts = () => setRemovedProducts(loadRemovedProducts());
    window.addEventListener(removedProductStoreEventName(), refreshRemovedProducts);
    window.addEventListener("storage", refreshRemovedProducts);
    return () => {
      window.removeEventListener(removedProductStoreEventName(), refreshRemovedProducts);
      window.removeEventListener("storage", refreshRemovedProducts);
    };
  }, []);

  const filteredProducts = useMemo(
    () =>
      managedProducts.filter((product) =>
        product.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [managedProducts, query]
  );

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);

  const stats = [
    { label: "Revenue", value: formatCurrency(totalRevenue), note: "From active orders" },
    { label: "Orders", value: String(orders.length), note: "Status update enabled" },
    { label: "Customers", value: String(accounts.length), note: "Created from login page" },
    { label: "Products", value: String(managedProducts.length), note: "Managed in admin" }
  ];

  const updateForm = (key: keyof ProductForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const persistProducts = (nextProducts: Product[]) => {
    setManagedProducts(nextProducts);
    saveManagedProducts(nextProducts);
  };

  const persistRemovedProducts = (nextProducts: Product[]) => {
    setRemovedProducts(nextProducts);
    saveRemovedProducts(nextProducts);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitProduct = () => {
    const slug = slugify(form.name);
    const stock = Number(form.stock || 0);
    const variants: ProductVariant[] = [
      {
        id: `${slug}-1l`,
        label: "1 Litre",
        price: Number(form.oneLitrePrice || 0),
        mrp: Number(form.oneLitrePrice || 0) + 30,
        stock
      },
      {
        id: `${slug}-5l`,
        label: "5 Litre",
        price: Number(form.fiveLitrePrice || 0),
        mrp: Number(form.fiveLitrePrice || 0) + 100,
        stock
      },
      {
        id: `${slug}-15l`,
        label: "15 Litre",
        price: Number(form.fifteenLitrePrice || 0),
        mrp: Number(form.fifteenLitrePrice || 0) + 250,
        stock
      }
    ];
    const product: Product = {
      id: editingId ?? slug,
      name: form.name,
      slug,
      shortDescription: form.shortDescription,
      description: form.description,
      imageUrl:
        form.imageUrl ||
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80",
      colorClass: "from-gold-secondary/20 to-harvest-cream",
      nutritionHighlights: splitList(form.highlights),
      bestFor: splitList(form.bestFor),
      variants
    };

    const nextProducts = editingId
      ? managedProducts.map((item) => (item.id === editingId ? product : item))
      : [product, ...managedProducts];

    persistProducts(nextProducts);
    resetForm();
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      imageUrl: product.imageUrl,
      oneLitrePrice: String(product.variants[0]?.price ?? ""),
      fiveLitrePrice: String(product.variants[1]?.price ?? ""),
      fifteenLitrePrice: String(product.variants[2]?.price ?? ""),
      stock: String(product.variants[0]?.stock ?? ""),
      bestFor: product.bestFor.join(", "),
      highlights: product.nutritionHighlights.join(", ")
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmRemoveProduct = () => {
    if (!pendingRemoval) {
      return;
    }

    persistProducts(managedProducts.filter((product) => product.id !== pendingRemoval.id));
    persistRemovedProducts([pendingRemoval, ...removedProducts]);
    if (editingId === pendingRemoval.id) {
      resetForm();
    }
    setPendingRemoval(null);
  };

  const restoreProduct = (product: Product) => {
    persistProducts([product, ...managedProducts]);
    persistRemovedProducts(removedProducts.filter((item) => item.id !== product.id));
  };

  const deleteHistoryProduct = (productId: string) => {
    persistRemovedProducts(removedProducts.filter((product) => product.id !== productId));
  };

  const downloadInvoice = (orderId: string) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order) {
      return;
    }

    const invoice = createInvoicePdf(order, orderStatuses[order.id]);
    const blob = new Blob([invoice], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${order.id}-invoice.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImageUpload = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateForm("imageUrl", String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  };

  if (!isAdminLoggedIn) {
    return (
      <main className="min-h-screen bg-[#f7f9f2] text-surface-black">
        <Seo
          description="Golden Drop admin login for dashboard, product, order, and customer management."
          path="/admin"
          title="Admin Login"
        />
        <section className="flex min-h-screen items-center justify-center px-5 py-8">
          <div className="w-full max-w-md rounded-component border border-surface-border bg-surface-white p-6 shadow-soft">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-component bg-[#e9f5df] text-harvest-olive">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-3xl">Admin Login</h1>
            <p className="mt-2 text-sm leading-6">
              Enter your admin credentials to open the admin workspace.
            </p>
            <form
              className="mt-5 grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const email = String(formData.get("email") ?? "");
                const password = String(formData.get("password") ?? "");

                if (email === adminCredentials.email && password === adminCredentials.password) {
                  setIsAdminLoggedIn(true);
                  setLoginError("");
                  return;
                }

                setLoginError("Invalid admin email or password.");
              }}
            >
              <Input required name="email" placeholder="Admin email" type="email" />
              <Input required name="password" placeholder="Admin password" type="password" />
              {loginError ? (
                <div className="rounded-component border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  {loginError}
                </div>
              ) : null}
              <Button className="gap-2" type="submit" variant="secondary">
                <LockKeyhole className="h-4 w-4" />
                Open Admin
              </Button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f2] text-surface-black">
      <Seo
        description="Golden Drop admin panel for dashboard, product, order, and customer account management."
        path="/admin"
        title="Admin Panel"
      />
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-surface-border bg-surface-white p-4 lg:border-b-0 lg:border-r">
          <button className="mb-6 text-left" onClick={() => navigate("/home")} type="button">
            <div className="text-lg font-bold">Golden Drop</div>
            <div className="text-sm text-surface-muted">Admin workspace</div>
          </button>
          <nav className="grid gap-1">
            {modules.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-component px-3 text-left text-sm font-semibold transition",
                    activeModule === item.label
                      ? "bg-surface-black text-surface-white"
                      : "text-surface-muted hover:bg-[#edf4e4] hover:text-surface-black"
                  )}
                  key={item.label}
                  onClick={() => setActiveModule(item.label)}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="p-5 md:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-harvest-olive">
                Admin panel UI
              </p>
              <h1 className="mt-2">{activeModule}</h1>
            </div>
            <Button className="gap-2" onClick={() => navigate("/")} variant="outline">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {activeModule === "Dashboard" ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.label}>
                    <CardContent>
                      <p className="text-sm font-semibold text-surface-muted">{stat.label}</p>
                      <div className="mt-2 text-3xl font-bold">{stat.value}</div>
                      <p className="mt-1 text-sm">{stat.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid gap-5 xl:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Sales Chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MiniChart color="bg-gold-primary" values={[32, 48, 38, 70, 62, 91, 84]} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PackageCheck className="h-5 w-5" />
                      Orders Chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MiniChart color="bg-harvest-olive" values={[22, 30, 44, 39, 58, 53, 68]} />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : null}

          {activeModule === "Products" ? (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setProductView("add")}
                  variant={productView === "add" ? "primary" : "outline"}
                >
                  Add Product
                </Button>
                <Button
                  onClick={() => setProductView("history")}
                  variant={productView === "history" ? "primary" : "outline"}
                >
                  Removed History
                </Button>
              </div>

              {pendingRemoval ? (
                <Card className="border-gold-primary">
                  <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-1 h-5 w-5 text-gold-dark" />
                      <div>
                        <h3 className="text-xl">Confirm Remove</h3>
                        <p className="text-sm">
                          Remove {pendingRemoval.name}? It will move to Removed History.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={confirmRemoveProduct} variant="secondary">
                        Yes, Remove
                      </Button>
                      <Button onClick={() => setPendingRemoval(null)} variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {productView === "add" ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{editingId ? "Edit Product" : "Add Product"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form
                        className="grid gap-3"
                        onSubmit={(event) => {
                          event.preventDefault();
                          submitProduct();
                        }}
                      >
                        <div className="grid gap-3 md:grid-cols-2">
                          <Input required placeholder="Product name" value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
                          <Input placeholder="Image URL" value={form.imageUrl} onChange={(event) => updateForm("imageUrl", event.target.value)} />
                          <Input required placeholder="Short description" value={form.shortDescription} onChange={(event) => updateForm("shortDescription", event.target.value)} />
                          <Input required placeholder="Stock per variant" type="number" value={form.stock} onChange={(event) => updateForm("stock", event.target.value)} />
                          <Input required placeholder="1 Litre price" type="number" value={form.oneLitrePrice} onChange={(event) => updateForm("oneLitrePrice", event.target.value)} />
                          <Input required placeholder="5 Litre price" type="number" value={form.fiveLitrePrice} onChange={(event) => updateForm("fiveLitrePrice", event.target.value)} />
                          <Input required placeholder="15 Litre price" type="number" value={form.fifteenLitrePrice} onChange={(event) => updateForm("fifteenLitrePrice", event.target.value)} />
                          <Input placeholder="Best for, comma separated" value={form.bestFor} onChange={(event) => updateForm("bestFor", event.target.value)} />
                        </div>
                        <Textarea required placeholder="Full product description" value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
                        <Input placeholder="Highlights, comma separated" value={form.highlights} onChange={(event) => updateForm("highlights", event.target.value)} />
                        {form.imageUrl ? (
                          <img
                            alt="Uploaded product preview"
                            className="h-40 w-full max-w-sm rounded-component border border-surface-border object-cover"
                            src={form.imageUrl}
                          />
                        ) : null}
                        <input
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleImageUpload(event.target.files?.[0])}
                          ref={fileInputRef}
                          type="file"
                        />
                        <div className="flex flex-wrap gap-2">
                          <Button className="gap-2" type="submit">
                            {editingId ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            {editingId ? "Update Product" : "Add Product"}
                          </Button>
                          <Button
                            className="gap-2"
                            onClick={() => fileInputRef.current?.click()}
                            type="button"
                            variant="outline"
                          >
                            <Upload className="h-4 w-4" />
                            Image Upload
                          </Button>
                          {editingId ? (
                            <Button onClick={resetForm} type="button" variant="ghost">
                              Cancel Edit
                            </Button>
                          ) : null}
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-surface-muted" />
                    <Input
                      className="pl-9"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search products"
                      value={query}
                    />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <Card key={product.id}>
                        <img
                          alt={product.name}
                          className="h-40 w-full rounded-t-component object-cover"
                          loading="lazy"
                          src={product.imageUrl}
                        />
                        <CardContent>
                          <h3 className="text-xl">{product.name}</h3>
                          <p className="mt-1 text-sm">{product.shortDescription}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {product.variants.map((variant) => (
                              <span
                                className="rounded-component border border-surface-border px-2 py-1 text-xs font-semibold"
                                key={variant.id}
                              >
                                {variant.label} {formatCurrency(variant.price)} Stock {variant.stock}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button className="gap-2" onClick={() => editProduct(product)} size="sm" variant="outline">
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button className="gap-2" onClick={() => setPendingRemoval(product)} size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : null}

              {productView === "history" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Removed History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {removedProducts.length === 0 ? (
                      <p>No removed products yet.</p>
                    ) : (
                      <div className="grid gap-4 lg:grid-cols-3">
                        {removedProducts.map((product) => (
                          <div
                            className="overflow-hidden rounded-component border border-surface-border bg-surface-white"
                            key={product.id}
                          >
                            <img
                              alt={product.name}
                              className="h-36 w-full object-cover opacity-80"
                              src={product.imageUrl}
                            />
                            <div className="p-4">
                              <h3 className="text-xl">{product.name}</h3>
                              <p className="mt-1 text-sm">{product.shortDescription}</p>
                              <Button
                                className="mt-4 gap-2"
                                onClick={() => restoreProduct(product)}
                                size="sm"
                                variant="outline"
                              >
                                <RotateCcw className="h-4 w-4" />
                                Restore
                              </Button>
                              <Button
                                className="ml-2 mt-4 gap-2"
                                onClick={() => deleteHistoryProduct(product.id)}
                                size="sm"
                                variant="ghost"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove History
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : null}

          {activeModule === "Orders" ? (
            <Card>
              <CardHeader>
                <CardTitle>Order List</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedInvoiceId ? (
                  <div className="overflow-hidden rounded-component border border-gold-primary bg-surface-white shadow-soft">
                    {(() => {
                      const order = orders.find((item) => item.id === selectedInvoiceId);
                      const subtotal = order?.total ?? 0;
                      const tax = Math.round(subtotal * 0.05);
                      const grandTotal = subtotal + tax;
                      return order ? (
                        <div>
                          <div className="flex flex-col justify-between gap-4 bg-surface-black p-5 text-surface-white md:flex-row md:items-start">
                            <div>
                              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-secondary">
                                Golden Drop
                              </div>
                              <h3 className="mt-2 text-3xl text-surface-white">Tax Invoice</h3>
                              <p className="mt-2 text-sm text-white/75">
                                Premium edible oils for homes and businesses
                              </p>
                            </div>
                            <div className="text-left text-sm md:text-right">
                              <div className="font-bold">Invoice {order.id}</div>
                              <div className="mt-1 text-white/75">{new Date().toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="grid gap-5 p-5">
                            <div className="grid gap-4 rounded-component border border-surface-border bg-[#fbfcf7] p-4 md:grid-cols-3">
                              <div>
                                <div className="text-xs font-bold uppercase tracking-[0.16em] text-surface-muted">
                                  Bill To
                                </div>
                                <div className="mt-2 font-bold">{order.customer}</div>
                              </div>
                              <div>
                                <div className="text-xs font-bold uppercase tracking-[0.16em] text-surface-muted">
                                  Status
                                </div>
                                <div className="mt-2 font-bold">{orderStatuses[order.id]}</div>
                              </div>
                              <div>
                                <div className="text-xs font-bold uppercase tracking-[0.16em] text-surface-muted">
                                  Payment
                                </div>
                                <div className="mt-2 font-bold">Paid</div>
                              </div>
                            </div>
                            <div className="overflow-hidden rounded-component border border-surface-border">
                              <div className="grid grid-cols-[1fr_80px_130px] bg-gold-pale px-4 py-3 text-sm font-bold">
                                <span>Product</span>
                                <span>Qty</span>
                                <span className="text-right">Amount</span>
                              </div>
                              <div className="grid grid-cols-[1fr_80px_130px] px-4 py-4 text-sm">
                                <span>{order.item}</span>
                                <span>{order.quantity}</span>
                                <span className="text-right">{formatCurrency(subtotal)}</span>
                              </div>
                            </div>
                            <div className="ml-auto w-full max-w-sm space-y-2 rounded-component border border-surface-border p-4 text-sm">
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <strong>{formatCurrency(subtotal)}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>GST 5%</span>
                                <strong>{formatCurrency(tax)}</strong>
                              </div>
                              <div className="flex justify-between border-t border-surface-border pt-2 text-lg">
                                <span>Total</span>
                                <strong>{formatCurrency(grandTotal)}</strong>
                              </div>
                            </div>
                            <Button
                              className="mt-2 gap-2"
                              onClick={() => downloadInvoice(order.id)}
                            >
                              <Download className="h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                ) : null}
                {orders.map((order) => (
                  <div
                    className="grid gap-3 rounded-component border border-surface-border p-4 md:grid-cols-[1fr_1fr_140px_260px]"
                    key={order.id}
                  >
                    <div>
                      <div className="font-bold">{order.id}</div>
                      <p className="text-sm">Order details for {order.customer}</p>
                    </div>
                    <div className="font-semibold">{formatCurrency(order.total)}</div>
                    <select
                      className="h-10 rounded-component border border-surface-border bg-surface-white px-3 text-sm"
                      onChange={(event) =>
                        setOrderStatuses((current) => ({
                          ...current,
                          [order.id]: event.target.value
                        }))
                      }
                      value={orderStatuses[order.id]}
                    >
                      <option>Processing</option>
                      <option>Packed</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        className="gap-2"
                        onClick={() => setSelectedInvoiceId(order.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4" />
                        View Invoice
                      </Button>
                      <Button
                        className="gap-2"
                        onClick={() => downloadInvoice(order.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {activeModule === "Customers" ? (
            <Card>
              <CardHeader>
                <CardTitle>Created Accounts</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {accounts.length === 0 ? (
                  <p>No customer accounts created yet.</p>
                ) : (
                  accounts.map((account) => (
                    <div
                      className="grid gap-3 rounded-component border border-surface-border p-4 md:grid-cols-[1fr_1fr_1fr_160px]"
                      key={account.id}
                    >
                      <strong>{account.name}</strong>
                      <span>{account.phone}</span>
                      <span>{account.email}</span>
                      <span>{new Date(account.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ) : null}
        </section>
      </div>
    </main>
  );
}
