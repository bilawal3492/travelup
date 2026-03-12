/**
 * Vercel Serverless Catch-All – Products API
 *
 * Single function handles ALL /api/* routes so module-level state
 * (products array) is shared across every request within a warm instance.
 *
 *   GET    /api/products        → list all
 *   POST   /api/products        → create
 *   GET    /api/products/:id    → get one
 *   PUT    /api/products/:id    → replace one
 *   DELETE /api/products/:id    → remove one
 */

const SEED = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling over-ear headphones with 30-hour battery life.',
    price: 1490.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/product-1/640/480',
    sku: 'ELEC-WH-001',
    availability: 'In Stock',
  },
  {
    id: 2,
    name: 'Running Shoes',
    description: 'Lightweight breathable running shoes with cushioned sole for maximum comfort.',
    price: 89.95,
    category: 'Sports',
    image: 'https://picsum.photos/seed/product-2/640/480',
    sku: 'SPRT-RS-002',
    availability: 'In Stock',
  },
  {
    id: 3,
    name: 'Organic Coffee Beans',
    description: 'Fair-trade single-origin Arabica beans, 1 kg bag.',
    price: 24.5,
    category: 'Food & Drink',
    image: 'https://picsum.photos/seed/product-3/640/480',
    sku: 'FOOD-CB-003',
    availability: 'In Stock',
  },
  {
    id: 4,
    name: 'Desk Lamp',
    description: 'Adjustable LED desk lamp with 5 brightness levels and USB charging port.',
    price: 45,
    category: 'Home',
    image: 'https://picsum.photos/seed/product-4/640/480',
    sku: 'HOME-DL-004',
    availability: 'Out of Stock',
  },
  {
    id: 5,
    name: 'Backpack',
    description: 'Water-resistant 30L travel backpack with padded laptop compartment.',
    price: 69.99,
    category: 'Travel',
    image: 'https://picsum.photos/seed/product-5/640/480',
    sku: 'TRVL-BP-005',
    availability: 'In Stock',
  },
  {
    id: 6,
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 360° sound and 12-hour playback.',
    price: 59.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/product-6/640/480',
    sku: 'ELEC-BS-006',
    availability: 'Pre-order',
  },
];

// Module-level store – shared across all requests to this warm instance
let products = JSON.parse(JSON.stringify(SEED));
let nextId = 7;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // req.query.path is the array of segments after /api/
  // e.g. /api/products     → ['products']
  //      /api/products/3   → ['products', '3']
  const segments = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);

  if (segments[0] !== 'products') {
    return res.status(404).json({ message: 'Not found' });
  }

  const id = segments[1] ? Number(segments[1]) : null;

  // GET /api/products
  if (req.method === 'GET' && id === null) {
    return res.status(200).json(products);
  }

  // GET /api/products/:id
  if (req.method === 'GET' && id !== null) {
    const product = products.find((p) => p.id === id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json(product);
  }

  // POST /api/products
  if (req.method === 'POST' && id === null) {
    const body = req.body;
    if (!body || !body.name) {
      return res.status(400).json({ message: 'name is required' });
    }
    const created = { ...body, id: nextId++ };
    products.push(created);
    return res.status(201).json(created);
  }

  // PUT /api/products/:id
  if (req.method === 'PUT' && id !== null) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    const updated = { ...req.body, id };
    products[index] = updated;
    return res.status(200).json(updated);
  }

  // DELETE /api/products/:id
  if (req.method === 'DELETE' && id !== null) {
    const exists = products.some((p) => p.id === id);
    if (!exists) return res.status(404).json({ message: 'Product not found' });
    products = products.filter((p) => p.id !== id);
    return res.status(200).json({});
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
