import type { Product, NewProduct } from '../types/Product';

/**
 * Persistence strategy:
 *   - All data lives in localStorage under STORAGE_KEY.
 *   - On the very first visit (nothing in localStorage) the seed data is
 *     fetched from my-json-server (which reads db.json from GitHub) and
 *     stored locally.  If that network request fails, the hardcoded
 *     SEED_FALLBACK is used instead.
 *   - Every subsequent add / edit / delete writes directly to localStorage,
 *     so data survives page refreshes with no backend required.
 */

const STORAGE_KEY = 'travelup_products';
const SEED_URL =
  'https://my-json-server.typicode.com/bilawal3492/travelup/products';

const SEED_FALLBACK: Product[] = [
  { id: 1, name: 'Wireless Headphones', description: 'Premium noise-cancelling over-ear headphones with 30-hour battery life.', price: 1490.99, category: 'Electronics', image: 'https://picsum.photos/seed/product-1/640/480', sku: 'ELEC-WH-001', availability: 'In Stock' },
  { id: 2, name: 'Running Shoes', description: 'Lightweight breathable running shoes with cushioned sole for maximum comfort.', price: 89.95, category: 'Sports', image: 'https://picsum.photos/seed/product-2/640/480', sku: 'SPRT-RS-002', availability: 'In Stock' },
  { id: 3, name: 'Organic Coffee Beans', description: 'Fair-trade single-origin Arabica beans, 1 kg bag.', price: 24.5, category: 'Food & Drink', image: 'https://picsum.photos/seed/product-3/640/480', sku: 'FOOD-CB-003', availability: 'In Stock' },
  { id: 4, name: 'Desk Lamp', description: 'Adjustable LED desk lamp with 5 brightness levels and USB charging port.', price: 45, category: 'Home', image: 'https://picsum.photos/seed/product-4/640/480', sku: 'HOME-DL-004', availability: 'Out of Stock' },
  { id: 5, name: 'Backpack', description: 'Water-resistant 30L travel backpack with padded laptop compartment.', price: 69.99, category: 'Travel', image: 'https://picsum.photos/seed/product-5/640/480', sku: 'TRVL-BP-005', availability: 'In Stock' },
  { id: 6, name: 'Bluetooth Speaker', description: 'Portable waterproof speaker with 360° sound and 12-hour playback.', price: 59.99, category: 'Electronics', image: 'https://picsum.photos/seed/product-6/640/480', sku: 'ELEC-BS-006', availability: 'Pre-order' },
];

// ── localStorage helpers ──────────────────────────────────────────────────

function load(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

function save(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function getNextId(products: Product[]): number {
  return products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
}

// ── Public API ────────────────────────────────────────────────────────────

/** Load from localStorage; seed from remote (or fallback) on first visit */
export async function fetchProducts(): Promise<Product[]> {
  const cached = load();
  if (cached.length > 0) return cached;

  try {
    const res = await fetch(SEED_URL);
    if (!res.ok) throw new Error('seed fetch failed');
    const data = (await res.json()) as Product[];
    save(data);
    return data;
  } catch {
    save(SEED_FALLBACK);
    return SEED_FALLBACK;
  }
}

/** Create a new product and persist to localStorage */
export function createProduct(product: NewProduct): Promise<Product> {
  const products = load();
  const created: Product = { ...product, id: getNextId(products) };
  save([...products, created]);
  return Promise.resolve(created);
}

/** Update an existing product and persist to localStorage */
export function updateProduct(id: number, product: NewProduct): Promise<Product> {
  const products = load();
  const updated: Product = { ...product, id };
  save(products.map((p) => (p.id === id ? updated : p)));
  return Promise.resolve(updated);
}

/** Remove a product and persist to localStorage */
export function deleteProduct(id: number): Promise<void> {
  const products = load();
  save(products.filter((p) => p.id !== id));
  return Promise.resolve();
}
