import { useProducts } from '../../context/ProductContext';
import styles from './Toast.module.scss';

export default function ToastContainer() {
  const { toasts, dismissToast } = useProducts();

  if (toasts.length === 0) return null;

  return (
    <div className={styles['toast-container']} aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[`toast--${toast.type}`]}`}
          role="alert"
        >
          <span className={styles.toast__message}>{toast.message}</span>
          <button
            className={styles.toast__close}
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
