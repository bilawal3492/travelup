import type { Product, NewProduct } from '../types/Product';

const BASE_URL = '/api/products';

/**
 * Generic request helper with error handling.
 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const message = `API error: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/** GET /products – retrieve all products */
export const fetchProducts = (): Promise<Product[]> => request<Product[]>(BASE_URL);

/** POST /products – create a new product */
export const createProduct = (product: NewProduct): Promise<Product> =>
  request<Product>(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(product),
  });

/** PUT /products/:id – fully replace a product */
export const updateProduct = (id: number, product: NewProduct): Promise<Product> =>
  request<Product>(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });

/** DELETE /products/:id – remove a product */
export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
};
