import { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import type { NewProduct } from '../../types/Product';
import ProductItem from '../ProductItem/ProductItem';
import ProductForm from '../ProductForm/ProductForm';
import styles from './ProductList.module.scss';

export default function ProductList() {
  const { products, loading, error, addProduct, loadProducts } = useProducts();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [products, search]);

  const handleAdd = async (data: NewProduct) => {
    await addProduct(data);
  };

  return (
    <main className={`container ${styles.section}`}>
      {/* Add-product form */}
      <ProductForm onSubmit={handleAdd} />

      {/* Toolbar */}
      <div className={styles.section__toolbar}>
        <h2 className={styles.section__title}>
          Products{' '}
          <span className={styles.section__count}>({filtered.length})</span>
        </h2>
        <input
          type="search"
          className={styles.section__search}
          placeholder="🔍  Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
        />
      </div>

      {/* States */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.loading__spinner} />
          <p>Loading products…</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.error}>
          <p>{error}</p>
          <button className={styles.error__retry} onClick={loadProducts}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.empty__icon}>📭</div>
          <p className={styles.empty__text}>
            {search ? 'No products match your search.' : 'No products yet. Add one above!'}
          </p>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
