import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { getProductThumb } from '../../utils/images';
import type { Product, NewProduct } from '../../types/Product';
import ProductForm from '../../components/ProductForm/ProductForm';
import styles from './AdminPage.module.scss';

export default function AdminPage() {
  const { products, loading, editProduct, removeProduct } = useProducts();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const handleEdit = async (id: number, data: NewProduct) => {
    await editProduct(id, data);
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removeProduct(deleteTarget.id);
    setDeleteTarget(null);
  };

  const editingProduct = products.find((p) => p.id === editingId);

  return (
    <main className={`container ${styles.page}`}>
      {/* ---- Page header ---- */}
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>⚙️ Product Management</h1>
        <Link to="/admin/add" className={styles['page__add-btn']}>
          ➕ Add Product
        </Link>
      </div>

      {/* ---- Inline edit form ---- */}
      {editingProduct && (
        <div className={styles['edit-form']}>
          <h2 className={styles['edit-form__title']}>
            Editing: {editingProduct.name}
          </h2>
          <ProductForm
            initialData={editingProduct}
            onSubmit={(data) => handleEdit(editingProduct.id, data)}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {/* ---- Loading ---- */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.loading__spinner} />
          <p>Loading products…</p>
        </div>
      )}

      {/* ---- Empty ---- */}
      {!loading && products.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.empty__icon}>📭</div>
          <p className={styles.empty__text}>No products yet.</p>
          <Link to="/admin/add" className={styles['page__add-btn']}>
            ➕ Add Your First Product
          </Link>
        </div>
      )}

      {/* ---- Table ---- */}
      {!loading && products.length > 0 && (
        <div className={styles['table-wrap']}>
          <table className={styles.table}>
            <thead className={styles.table__head}>
              <tr>
                <th className={styles.table__th}>ID</th>
                <th className={styles.table__th}>Product</th>
                <th className={styles.table__th}>SKU</th>
                <th className={styles.table__th}>Category</th>
                <th className={styles.table__th}>Price</th>
                <th className={styles.table__th}>Availability</th>
                <th className={styles.table__th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className={styles.table__row}>
                  <td className={styles.table__td}>
                    <span className={styles.table__id}>#{product.id}</span>
                  </td>
                  <td className={styles.table__td}>
                    <div className={styles['table__product-cell']}>
                      <img
                        className={styles['table__product-image']}
                        src={product.image || getProductThumb(product.id)}
                        alt={product.name}
                        loading="lazy"
                      />
                      <span className={styles['table__product-name']}>
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className={styles.table__td}>
                    <span className={styles.table__sku}>{product.sku}</span>
                  </td>
                  <td className={styles.table__td}>
                    <span className={styles.table__category}>
                      {product.category}
                    </span>
                  </td>
                  <td className={styles.table__td}>
                    <span className={styles.table__price}>
                      £{product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className={styles.table__td}>
                    <span
                      className={`${styles.table__availability} ${
                        product.availability === 'In Stock'
                          ? styles['table__availability--in-stock']
                          : product.availability === 'Out of Stock'
                            ? styles['table__availability--out-of-stock']
                            : styles['table__availability--pre-order']
                      }`}
                    >
                      {product.availability}
                    </span>
                  </td>
                  <td className={styles.table__td}>
                    <div className={styles.table__actions}>
                      <button
                        className={`${styles['table__action-btn']} ${styles['table__action-btn--edit']}`}
                        onClick={() => setEditingId(product.id)}
                        aria-label={`Edit ${product.name}`}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className={`${styles['table__action-btn']} ${styles['table__action-btn--delete']}`}
                        onClick={() => setDeleteTarget(product)}
                        aria-label={`Delete ${product.name}`}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---- Delete confirmation modal ---- */}
      {deleteTarget && (
        <div className={styles['modal-overlay']}>
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modal__icon}>⚠️</div>
            <h3 className={styles.modal__title}>Delete Product</h3>
            <p className={styles.modal__text}>
              Are you sure you want to delete{' '}
              <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className={styles.modal__actions}>
              <button
                className={`${styles.modal__btn} ${styles['modal__btn--danger']}`}
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className={`${styles.modal__btn} ${styles['modal__btn--cancel']}`}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
