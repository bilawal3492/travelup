import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { getRandomProductImage } from '../../utils/images';
import type { NewProduct } from '../../types/Product';
import ProductForm from '../../components/ProductForm/ProductForm';
import styles from './AddProductPage.module.scss';

export default function AddProductPage() {
  const { addProduct } = useProducts();
  const navigate = useNavigate();

  const handleSubmit = async (data: NewProduct) => {
    // Attach a random placeholder image if none provided
    const finalData: NewProduct = {
      ...data,
      image: data.image || getRandomProductImage(),
    };
    await addProduct(finalData);
    navigate('/admin');
  };

  return (
    <main className={`container ${styles.page}`}>
      <Link to="/admin" className={styles.page__back}>
        ← Back to Admin
      </Link>
      <h1 className={styles.page__title}>Add New Product</h1>
      <p className={styles.page__subtitle}>
        Fill in the details below to add a new product to the catalogue.
      </p>
      <ProductForm onSubmit={handleSubmit} />
    </main>
  );
}
