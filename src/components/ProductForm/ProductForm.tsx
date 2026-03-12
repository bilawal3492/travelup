import { useState, type FormEvent } from 'react';
import type { Product, NewProduct, ValidationErrors } from '../../types/Product';
import styles from './ProductForm.module.scss';

const CATEGORIES = ['Electronics', 'Sports', 'Food & Drink', 'Home', 'Travel', 'Other'];
const AVAILABILITY_OPTIONS: Product['availability'][] = ['In Stock', 'Out of Stock', 'Pre-order'];

interface ProductFormProps {
  /** If provided the form is in "edit" mode */
  initialData?: Product;
  onSubmit: (data: NewProduct) => Promise<void>;
  onCancel?: () => void;
}

function validate(data: NewProduct): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Product name is required.';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required.';
  }

  if (data.price <= 0 || Number.isNaN(data.price)) {
    errors.price = 'Price must be a positive number.';
  }

  if (!data.category) {
    errors.category = 'Please select a category.';
  }

  if (!data.sku.trim()) {
    errors.sku = 'SKU is required.';
  }

  if (!data.availability) {
    errors.availability = 'Please select availability.';
  }

  return errors;
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [price, setPrice] = useState(initialData?.price?.toString() ?? '');
  const [category, setCategory] = useState(initialData?.category ?? '');
  const [image, setImage] = useState(initialData?.image ?? '');
  const [sku, setSku] = useState(initialData?.sku ?? '');
  const [availability, setAvailability] = useState<Product['availability']>(
    initialData?.availability ?? 'In Stock',
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(initialData);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data: NewProduct = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      image,
      sku: sku.trim(),
      availability,
    };

    const validationErrors = validate(data);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(data);
      if (!isEdit) {
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setImage('');
        setSku('');
        setAvailability('In Stock');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof ValidationErrors) =>
    `${styles.form__input} ${errors[field] ? styles['form__input--error'] : ''}`;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.form__title}>
        {isEdit ? 'Edit Product' : '➕ Add New Product'}
      </h2>

      {/* Show Product ID in edit mode */}
      {isEdit && initialData && (
        <div className={styles['form__id-banner']}>
          <span className={styles['form__id-label']}>Product ID:</span>
          <span className={styles['form__id-value']}>#{initialData.id}</span>
        </div>
      )}

      <div className={styles.form__grid}>
        {/* Name */}
        <div className={styles.form__field}>
          <label className={styles.form__label} htmlFor="product-name">
            Name
          </label>
          <input
            id="product-name"
            className={inputClass('name')}
            type="text"
            placeholder="e.g. Wireless Headphones"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span className={styles.form__error}>{errors.name ?? ''}</span>
        </div>

        {/* Price */}
        <div className={styles.form__field}>
          <label className={styles.form__label} htmlFor="product-price">
            Price (£)
          </label>
          <input
            id="product-price"
            className={inputClass('price')}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <span className={styles.form__error}>{errors.price ?? ''}</span>
        </div>

        {/* Category */}
        <div className={styles.form__field}>
          <label className={styles.form__label} htmlFor="product-category">
            Category
          </label>
          <select
            id="product-category"
            className={`${styles.form__select} ${errors.category ? styles['form__input--error'] : ''}`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className={styles.form__error}>{errors.category ?? ''}</span>
        </div>

        {/* SKU */}
        <div className={styles.form__field}>
          <label className={styles.form__label} htmlFor="product-sku">
            SKU
          </label>
          <input
            id="product-sku"
            className={inputClass('sku')}
            type="text"
            placeholder="e.g. ELEC-WH-001"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <span className={styles.form__error}>{errors.sku ?? ''}</span>
        </div>

        {/* Availability */}
        <div className={styles.form__field}>
          <label className={styles.form__label} htmlFor="product-availability">
            Availability
          </label>
          <select
            id="product-availability"
            className={`${styles.form__select} ${errors.availability ? styles['form__input--error'] : ''}`}
            value={availability}
            onChange={(e) => setAvailability(e.target.value as Product['availability'])}
          >
            {AVAILABILITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className={styles.form__error}>{errors.availability ?? ''}</span>
        </div>

        {/* Image URL */}
        <div className={`${styles.form__field} ${styles['form__field--wide']}`}>
          <label className={styles.form__label} htmlFor="product-image">
            Image URL
          </label>
          <input
            id="product-image"
            className={inputClass('image')}
            type="url"
            placeholder="https://example.com/image.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <span className={styles.form__hint}>
            Leave blank for an auto-generated placeholder image.
          </span>
        </div>

        {/* Image preview */}
        {image && (
          <div className={styles['form__image-preview']}>
            <span className={styles.form__label}>Preview</span>
            <img
              className={styles['form__preview-img']}
              src={image}
              alt="Product preview"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Description */}
        <div className={`${styles.form__field} ${styles['form__field--full']}`}>
          <label className={styles.form__label} htmlFor="product-description">
            Description
          </label>
          <textarea
            id="product-description"
            className={`${styles.form__textarea} ${errors.description ? styles['form__input--error'] : ''}`}
            placeholder="Brief product description…"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span className={styles.form__error}>{errors.description ?? ''}</span>
        </div>
      </div>

      <div className={styles.form__actions}>
        <button
          type="submit"
          className={styles.form__submit}
          disabled={submitting}
        >
          {submitting
            ? 'Saving…'
            : isEdit
              ? 'Save Changes'
              : 'Add Product'}
        </button>
        {onCancel && (
          <button
            type="button"
            className={styles.form__cancel}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
