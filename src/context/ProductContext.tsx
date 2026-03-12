import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { Product, NewProduct } from '../types/Product';
import * as api from '../services/api';

/* ------------------------------------------------------------------ */
/*  Toast / notification types                                        */
/* ------------------------------------------------------------------ */
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

/* ------------------------------------------------------------------ */
/*  State                                                             */
/* ------------------------------------------------------------------ */
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  toasts: Toast[];
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  toasts: [],
};

/* ------------------------------------------------------------------ */
/*  Actions                                                           */
/* ------------------------------------------------------------------ */
type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'REMOVE_PRODUCT'; payload: number }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: number };

function reducer(state: ProductState, action: Action): ProductState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
      };
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Context value                                                     */
/* ------------------------------------------------------------------ */
interface ProductContextValue extends ProductState {
  loadProducts: () => Promise<void>;
  addProduct: (product: NewProduct) => Promise<void>;
  editProduct: (id: number, product: NewProduct) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
  dismissToast: (id: number) => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */
let toastId = 0;

export function ProductProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const notify = useCallback(
    (message: string, type: 'success' | 'error') => {
      const id = ++toastId;
      dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
      setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
    },
    [],
  );

  const loadProducts = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await api.fetchProducts();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch products';
      dispatch({ type: 'FETCH_ERROR', payload: msg });
      notify(msg, 'error');
    }
  }, [notify]);

  const addProduct = useCallback(
    async (product: NewProduct) => {
      try {
        const created = await api.createProduct(product);
        dispatch({ type: 'ADD_PRODUCT', payload: created });
        notify(`"${created.name}" added successfully!`, 'success');
      } catch {
        notify('Failed to add product. Please try again.', 'error');
      }
    },
    [notify],
  );

  const editProduct = useCallback(
    async (id: number, product: NewProduct) => {
      try {
        const updated = await api.updateProduct(id, product);
        dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
        notify(`"${updated.name}" updated successfully!`, 'success');
      } catch {
        notify('Failed to update product. Please try again.', 'error');
      }
    },
    [notify],
  );

  const removeProduct = useCallback(
    async (id: number) => {
      try {
        await api.deleteProduct(id);
        dispatch({ type: 'REMOVE_PRODUCT', payload: id });
        notify('Product removed successfully!', 'success');
      } catch {
        notify('Failed to remove product. Please try again.', 'error');
      }
    },
    [notify],
  );

  const dismissToast = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  // Fetch products on mount
  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  return (
    <ProductContext.Provider
      value={{
        ...state,
        loadProducts,
        addProduct,
        editProduct,
        removeProduct,
        dismissToast,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                              */
/* ------------------------------------------------------------------ */
export function useProducts(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return ctx;
}
