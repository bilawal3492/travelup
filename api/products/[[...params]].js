/**
 * Vercel Serverless Function – Products API
 *
 * Handles all routes:
 *   GET    /api/products          → list all
 *   POST   /api/products          → create
 *   GET    /api/products/:id      → get one
 *   PUT    /api/products/:id      → replace one
 *   DELETE /api/products/:id      → remove one
 *
 * State is kept in module-level variables so it persists across
 * requests within the same warm function instance (ideal for demos).
 */

const SEED_PRODUCTS = [
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

// Module-level store – initialised once per warm function instance
let products = JSON.parse(JSON.stringify(SEED_PRODUCTS));
let nextId = 7;

export default function handler(req, res) {
  // CORS – allow requests from any origin (needed for Vercel preview URLs)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract the optional :id segment from [[...params]]
  const paramSegments = req.query.params ?? [];
  const id = paramSegments.length > 0 ? Number(paramSegments[0]) : null;

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
    const newProduct = { ...body, id: nextId++ };
    products.push(newProduct);
    return res.status(201).json(newProduct);
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
