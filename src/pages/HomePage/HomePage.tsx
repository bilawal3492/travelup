import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { getProductImage } from '../../utils/images';
import styles from './HomePage.module.scss';

export default function HomePage() {
  const { products } = useProducts();
  const featured = products.slice(0, 3);

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className={styles.hero}>
        <div className={`container ${styles.hero__inner}`}>
          <div className={styles.hero__content}>
            <span className={styles.hero__badge}>✨ New Collection 2026</span>
            <h1 className={styles.hero__title}>
              Discover Products You'll Love
            </h1>
            <p className={styles.hero__subtitle}>
              Browse our curated catalogue of travel gear, electronics, and
              everyday essentials — all in one place.
            </p>
            <div className={styles.hero__actions}>
              <Link
                to="/products"
                className={`${styles.hero__btn} ${styles['hero__btn--primary']}`}
              >
                🛍️ Shop Now
              </Link>
              <a
                href="#featured"
                className={`${styles.hero__btn} ${styles['hero__btn--secondary']}`}
              >
                ↓ See Featured
              </a>
            </div>
          </div>
          <div className={styles.hero__image}>
            <img
              src="https://picsum.photos/seed/hero-banner/600/400"
              alt="Featured products showcase"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ==================== FEATURED ==================== */}
      <section className={styles.featured} id="featured">
        <div className="container">
          <div className={styles.featured__header}>
            <h2 className={styles.featured__title}>Featured Products</h2>
            <p className={styles.featured__subtitle}>
              Hand-picked favourites from our catalogue
            </p>
          </div>

          <div className={styles.featured__grid}>
            {featured.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className={styles.featured__card}
              >
                <img
                  className={styles['featured__card-image']}
                  src={product.image || getProductImage(product.id)}
                  alt={product.name}
                  loading="lazy"
                />
                <div className={styles['featured__card-body']}>
                  <h3 className={styles['featured__card-name']}>
                    {product.name}
                  </h3>
                  <span className={styles['featured__card-price']}>
                    £{product.price.toFixed(2)}
                  </span>
                  <span className={styles['featured__card-category']}>
                    {product.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA BANNER ==================== */}
      <section className={styles.cta}>
        <div className="container">
          <h2 className={styles.cta__title}>Ready to explore?</h2>
          <p className={styles.cta__text}>
            View our full product range, filter by category, and find exactly
            what you need.
          </p>
          <Link to="/products" className={styles.cta__btn}>
            Browse All Products →
          </Link>
        </div>
      </section>
    </>
  );
}
