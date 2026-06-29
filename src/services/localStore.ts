import type { Product } from "@/models/product";
import { products as defaultProducts } from "@/models/products";

export type Account = {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  createdAt: string;
};

const accountsKey = "golden-drop-accounts";
const productsKey = "golden-drop-products";
const removedProductsKey = "golden-drop-removed-products";
const groundnutRestoreKey = "golden-drop-groundnut-restored-v3";
const safflowerRestoreKey = "golden-drop-safflower-restored-v1";

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(`${key}:updated`));
}

export function loadAccounts() {
  return readJson<Account[]>(accountsKey, []);
}

export function saveAccount(account: Omit<Account, "id" | "createdAt">) {
  const accounts = loadAccounts();
  const nextAccount: Account = {
    ...account,
    id: `AC-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  writeJson(accountsKey, [nextAccount, ...accounts]);
  return nextAccount;
}

export function loadManagedProducts() {
  let storedProducts = readJson<Product[]>(productsKey, defaultProducts);
  let removedProducts = loadRemovedProducts();
  const groundnut = defaultProducts.find((product) => product.id === "groundnut-oil");
  const safflower = defaultProducts.find((product) => product.id === "safflower-oil");
  const shouldRestoreGroundnut =
    !window.localStorage.getItem(groundnutRestoreKey) &&
    groundnut &&
    !storedProducts.some((product) => product.id === "groundnut-oil");
  const shouldRestoreSafflower =
    !window.localStorage.getItem(safflowerRestoreKey) &&
    safflower &&
    !storedProducts.some((product) => product.id === "safflower-oil");

  if (shouldRestoreGroundnut) {
    storedProducts = [groundnut, ...storedProducts];
    removedProducts = removedProducts.filter((product) => product.id !== "groundnut-oil");
    window.localStorage.setItem(groundnutRestoreKey, "true");
  }

  if (shouldRestoreSafflower) {
    storedProducts = [safflower, ...storedProducts];
    removedProducts = removedProducts.filter((product) => product.id !== "safflower-oil");
    window.localStorage.setItem(safflowerRestoreKey, "true");
  }

  if (shouldRestoreGroundnut || shouldRestoreSafflower) {
    writeJson(productsKey, storedProducts);
    writeJson(removedProductsKey, removedProducts);
  }

  return storedProducts;
}

export function saveManagedProducts(products: Product[]) {
  writeJson(productsKey, products);
}

export function loadRemovedProducts() {
  return readJson<Product[]>(removedProductsKey, []);
}

export function saveRemovedProducts(products: Product[]) {
  writeJson(removedProductsKey, products);
}

export function productStoreEventName() {
  return `${productsKey}:updated`;
}

export function accountStoreEventName() {
  return `${accountsKey}:updated`;
}

export function removedProductStoreEventName() {
  return `${removedProductsKey}:updated`;
}
