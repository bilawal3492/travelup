import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { getProductImage, getProductGallery } from '../../utils/images';
import styles from './ProductDetailPage.module.scss';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === Number(id));

  // Build gallery: main image + 3 gallery shots
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const mainImg = product.image || getProductImage(product.id);
    const extras = getProductGallery(product.id, 3);
    return [mainImg, ...extras];
  }, [product]);

  const [activeImage, setActiveImage] = useState(0);

  // Reset active image when product changes
  useMemo(() => setActiveImage(0), [product?.id]);

  if (loading) {
    return (
      <main className={`container ${styles.page}`}>
        <p>Loading…</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={`container ${styles.page}`}>
        <div className={styles['not-found']}>
          <div className={styles['not-found__icon']}>🔍</div>
          <h2 className={styles['not-found__title']}>Product Not Found</h2>
          <p className={styles['not-found__text']}>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/products" className={styles['not-found__link']}>
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`container ${styles.page}`}>
      {/* ---- Breadcrumb ---- */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/" className={styles.breadcrumb__link}>Home</Link>
        <span className={styles.breadcrumb__separator}>/</span>
        <Link to="/products" className={styles.breadcrumb__link}>Products</Link>
        <span className={styles.breadcrumb__separator}>/</span>
        <span className={styles.breadcrumb__current}>{product.name}</span>
      </nav>

      {/* ---- Detail grid ---- */}
      <div className={styles.detail}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <div className={styles.gallery__main}>
            <img
              className={styles['gallery__main-image']}
              src={galleryImages[activeImage]}
              alt={`${product.name} – image ${activeImage + 1}`}
            />
          </div>
          <div className={styles.gallery__thumbs}>
            {galleryImages.map((src, idx) => (
              <button
                key={idx}
                className={`${styles.gallery__thumb} ${idx === activeImage ? styles['gallery__thumb--active'] : ''}`}
                onClick={() => setActiveImage(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <img
                  className={styles['gallery__thumb-image']}
                  src={src}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className={styles.info}>
          <span className={styles.info__category}>{product.category}</span>
          <h1 className={styles.info__name}>{product.name}</h1>
          <span className={styles.info__price}>
            £{product.price.toFixed(2)}
          </span>

          <hr className={styles.info__divider} />

          <span className={styles['info__description-label']}>Description</span>
          <p className={styles.info__description}>{product.description}</p>

          <div className={styles.info__meta}>
            <div className={styles['info__meta-row']}>
              <span className={styles['info__meta-label']}>Product ID:</span>
              <span className={styles['info__meta-value']}>#{product.id}</span>
            </div>
            <div className={styles['info__meta-row']}>
              <span className={styles['info__meta-label']}>SKU:</span>
              <span className={styles['info__meta-value']}>{product.sku}</span>
            </div>
            <div className={styles['info__meta-row']}>
              <span className={styles['info__meta-label']}>Category:</span>
              <span className={styles['info__meta-value']}>
                {product.category}
              </span>
            </div>
            <div className={styles['info__meta-row']}>
              <span className={styles['info__meta-label']}>Availability:</span>
              <span
                className={`${styles['info__meta-value']} ${styles['info__availability']} ${
                  product.availability === 'In Stock'
                    ? styles['info__availability--in-stock']
                    : product.availability === 'Out of Stock'
                      ? styles['info__availability--out-of-stock']
                      : styles['info__availability--pre-order']
                }`}
              >
                {product.availability}
              </span>
            </div>
          </div>

          <div className={styles.info__actions}>
            <button
              className={`${styles.info__btn} ${styles['info__btn--primary']}`}
            >
              🛒 Add to Cart
            </button>
            <button
              className={`${styles.info__btn} ${styles['info__btn--secondary']}`}
            >
              ♡ Wishlist
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
