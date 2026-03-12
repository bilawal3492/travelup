import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { getProductImage } from '../../utils/images';
import styles from './ProductsPage.module.scss';

type ViewMode = 'grid' | 'list';

export default function ProductsPage() {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewMode>('grid');

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

  return (
    <main className={`container ${styles.page}`}>
      {/* ---- Page header ---- */}
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Our Products</h1>
        <p className={styles.page__subtitle}>
          Browse our full range and find something you love.
        </p>
      </div>

      {/* ---- Toolbar ---- */}
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.toolbar__search}
          placeholder="🔍  Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
        />

        <div className={styles.toolbar__right}>
          <span className={styles.toolbar__count}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className={styles['toolbar__view-btns']}>
            <button
              className={`${styles['toolbar__view-btn']} ${view === 'grid' ? styles['toolbar__view-btn--active'] : ''}`}
              onClick={() => setView('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              ▦
            </button>
            <button
              className={`${styles['toolbar__view-btn']} ${view === 'list' ? styles['toolbar__view-btn--active'] : ''}`}
              onClick={() => setView('list')}
              aria-label="List view"
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* ---- Loading ---- */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.loading__spinner} />
          <p>Loading products…</p>
        </div>
      )}

      {/* ---- Empty ---- */}
      {!loading && filtered.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.empty__icon}>📭</div>
          <p className={styles.empty__text}>
            {search
              ? 'No products match your search.'
              : 'No products available right now.'}
          </p>
        </div>
      )}

      {/* ---- GRID VIEW ---- */}
      {!loading && filtered.length > 0 && view === 'grid' && (
        <div className={styles['product-grid']}>
          {filtered.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className={styles.card}
            >
              <img
                className={styles.card__image}
                src={product.image || getProductImage(product.id)}
                alt={product.name}
                loading="lazy"
              />
              <div className={styles.card__body}>
                <div className={styles.card__tags}>
                  <span className={styles.card__category}>{product.category}</span>
                  <span
                    className={`${styles.card__availability} ${
                      product.availability === 'In Stock'
                        ? styles['card__availability--in-stock']
                        : product.availability === 'Out of Stock'
                          ? styles['card__availability--out-of-stock']
                          : styles['card__availability--pre-order']
                    }`}
                  >
                    {product.availability}
                  </span>
                </div>
                <h3 className={styles.card__name}>{product.name}</h3>
                <p className={styles.card__description}>
                  {product.description}
                </p>
                <div className={styles.card__footer}>
                  <span className={styles.card__price}>
                    £{product.price.toFixed(2)}
                  </span>
                  <span className={styles['card__view-btn']}>View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ---- LIST VIEW ---- */}
      {!loading && filtered.length > 0 && view === 'list' && (
        <div className={styles['product-list']}>
          {filtered.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className={styles['list-item']}
            >
              <img
                className={styles['list-item__image']}
                src={product.image || getProductImage(product.id)}
                alt={product.name}
                loading="lazy"
              />
              <div className={styles['list-item__body']}>
                <div className={styles['list-item__tags']}>
                  <span className={styles['list-item__category']}>
                    {product.category}
                  </span>
                  <span
                    className={`${styles['list-item__availability']} ${
                      product.availability === 'In Stock'
                        ? styles['list-item__availability--in-stock']
                        : product.availability === 'Out of Stock'
                          ? styles['list-item__availability--out-of-stock']
                          : styles['list-item__availability--pre-order']
                    }`}
                  >
                    {product.availability}
                  </span>
                </div>
                <h3 className={styles['list-item__name']}>{product.name}</h3>
                <p className={styles['list-item__description']}>
                  {product.description}
                </p>
                <div className={styles['list-item__footer']}>
                  <span className={styles['list-item__price']}>
                    £{product.price.toFixed(2)}
                  </span>
                  <span className={styles['list-item__view-btn']}>
                    View details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
