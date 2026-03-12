export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sku: string;
  availability: 'In Stock' | 'Out of Stock' | 'Pre-order';
}

export type NewProduct = Omit<Product, 'id'>;

export interface ValidationErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  image?: string;
  sku?: string;
  availability?: string;
}
