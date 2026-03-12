/**
 * Returns a deterministic random product image URL from picsum.photos.
 * Uses the product id as a seed so the same product always gets the same image.
 */
export function getProductImage(productId: number | string, width = 640, height = 480): string {
  return `https://picsum.photos/seed/product-${productId}/${width}/${height}`;
}

/**
 * Returns a product thumbnail URL (smaller).
 */
export function getProductThumb(productId: number | string): string {
  return getProductImage(productId, 320, 240);
}

/**
 * Returns an array of gallery images for a product detail page.
 */
export function getProductGallery(productId: number | string, count = 4): string[] {
  return Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/product-${productId}-gallery-${i}/${640}/${480}`,
  );
}

/**
 * Returns a random image URL for a newly created product (no id yet).
 */
export function getRandomProductImage(width = 640, height = 480): string {
  const seed = Math.random().toString(36).slice(2, 8);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
