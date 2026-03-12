import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ToastContainer from './components/Toast/Toast';
import HomePage from './pages/HomePage/HomePage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import AdminPage from './pages/AdminPage/AdminPage';
import AddProductPage from './pages/AddProductPage/AddProductPage';
import styles from './App.module.scss';

export default function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <div className={styles.app}>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/add" element={<AddProductPage />} />
          </Routes>
          <Footer />
          <ToastContainer />
        </div>
      </ProductProvider>
    </BrowserRouter>
  );
}
