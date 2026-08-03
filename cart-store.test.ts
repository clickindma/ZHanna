const storage = new Map<string, string>();

const memoryStorage: Storage = {
  get length() {
    return storage.size;
  },
  clear: () => storage.clear(),
  getItem: (key) => storage.get(key) ?? null,
  key: (index) => Array.from(storage.keys())[index] ?? null,
  removeItem: (key) => void storage.delete(key),
  setItem: (key, value) => void storage.set(key, value),
};

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error("FAIL: " + msg);
  console.log("  OK " + msg);
}

async function main() {
  globalThis.localStorage = memoryStorage;

  const { useCartStore, buildCartKey, selectCartCount, selectCartSubtotal } =
    await import("./src/store/cart-store");

  const state = () => useCartStore.getState();

  assert(state().items.length === 0, "starts empty");

  state().addItem({ productId: "p1", slug: "sig-ring", name: "Signature Ring", price: 2499, size: "6", quantity: 1 });
  assert(state().items.length === 1, "add first item");
  assert(state().items[0].key === buildCartKey("p1", "6"), "composite key = productId::size");
  assert(state().items[0].productId === "p1" && state().items[0].size === "6", "productId + size stored");

  state().addItem({ productId: "p1", slug: "sig-ring", name: "Signature Ring", price: 2499, size: "6", quantity: 2 });
  assert(state().items.length === 1, "same product+size dedupes");
  assert(state().items[0].quantity === 3, "dedupe increments quantity");

  state().addItem({ productId: "p1", slug: "sig-ring", name: "Signature Ring", price: 2499, size: "7", quantity: 1 });
  assert(state().items.length === 2, "different size = separate line");

  state().addItem({ productId: "p2", slug: "necklace", name: "Bridal Necklace", price: 6999, quantity: 1 });
  assert(useCartStore.getState().items.length === 3, "no-size item ok");
  assert(selectCartCount(useCartStore.getState()) === 5, "totalItems = 5");
  assert(selectCartSubtotal(useCartStore.getState()) === 3 * 2499 + 2499 + 6999, "totalPrice correct");

  const neckKey = buildCartKey("p2");
  state().updateQuantity(neckKey, 2);
  assert(selectCartCount(useCartStore.getState()) === 6, "updateQuantity up");
  state().updateQuantity(neckKey, 0);
  assert(useCartStore.getState().items.length === 2, "updateQuantity to 0 removes item");
  assert(selectCartSubtotal(useCartStore.getState()) === 3 * 2499 + 2499, "subtotal after remove");

  state().removeItem(buildCartKey("p1", "6"));
  assert(useCartStore.getState().items.length === 1, "removeItem by key");

  state().clearCart();
  assert(useCartStore.getState().items.length === 0, "clearCart");
  assert(storage.has("zhanna-cart"), "persisted to localStorage under zhanna-cart");

  console.log("ALL CART STORE CHECKS PASSED");
}

void main();
