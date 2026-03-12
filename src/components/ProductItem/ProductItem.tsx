import { useState } from 'react';
import type { Product, NewProduct } from '../../types/Product';
import { useProducts } from '../../context/ProductContext';
import ProductForm from '../ProductForm/ProductForm';
import styles from './ProductItem.module.scss';

interface ProductItemProps {
  product: Product;
}

export default function ProductItem({ product }: ProductItemProps) {
  const { editProduct, removeProduct } = useProducts();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleEdit = async (data: NewProduct) => {
    await editProduct(product.id, data);
    setEditing(false);
  };

  const handleDelete = async () => {
    await removeProduct(product.id);
  };

  if (editing) {
    return (
      <div className={styles.card}>
        <div className={styles.card__body}>
          <ProductForm
            initialData={product}
            onSubmit={handleEdit}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    );
  }

  if (confirmDelete) {
    return (
      <div className={styles.card}>
        <div className={styles.confirm}>
          <p className={styles.confirm__text}>
            Delete <strong>{product.name}</strong>?
          </p>
          <div className={styles.confirm__actions}>
            <button className={styles.confirm__yes} onClick={handleDelete}>
              Yes, delete
            </button>
            <button
              className={styles.confirm__no}
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className={styles.card}>
      <div className={styles.card__body}>
        <div className={styles.card__header}>
          <h3 className={styles.card__name}>{product.name}</h3>
          <span className={styles.card__price}>
            £{product.price.toFixed(2)}
          </span>
        </div>
        <span className={styles.card__category}>{product.category}</span>
        <p className={styles.card__description}>{product.description}</p>
      </div>
      <div className={styles.card__actions}>
        <button
          className={`${styles.card__btn} ${styles['card__btn--edit']}`}
          onClick={() => setEditing(true)}
        >
          ✏️ Edit
        </button>
        <button
          className={`${styles.card__btn} ${styles['card__btn--delete']}`}
          onClick={() => setConfirmDelete(true)}
        >
          🗑️ Delete
        </button>
      </div>
    </article>
  );
}
