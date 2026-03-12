import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from '../context/ProductContext';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage';
import AdminPage from '../pages/AdminPage/AdminPage';
import AddProductPage from '../pages/AddProductPage/AddProductPage';
import ToastContainer from '../components/Toast/Toast';
import type { Product } from '../types/Product';

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */
const seedProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones.',
    price: 149.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/product-1/640/480',
    sku: 'ELEC-WH-001',
    availability: 'In Stock',
  },
  {
    id: 2,
    name: 'Running Shoes',
    description: 'Lightweight breathable running shoes.',
    price: 89.95,
    category: 'Sports',
    image: 'https://picsum.photos/seed/product-2/640/480',
    sku: 'SPRT-RS-002',
    availability: 'In Stock',
  },
];

let products: Product[] = [];
let nextId = 10;

/* ------------------------------------------------------------------ */
/*  MSW request handlers                                              */
/* ------------------------------------------------------------------ */
const handlers = [
  http.get('/api/products', () => HttpResponse.json(products)),

  http.post('/api/products', async ({ request }) => {
    const body = (await request.json()) as Omit<Product, 'id'>;
    const created: Product = { ...body, id: nextId++ };
    products.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as Omit<Product, 'id'>;
    products = products.map((p) => (p.id === id ? { ...body, id } : p));
    return HttpResponse.json({ ...body, id });
  }),

  http.delete('/api/products/:id', ({ params }) => {
    const id = Number(params.id);
    products = products.filter((p) => p.id !== id);
    return new HttpResponse(null, { status: 200 });
  }),
];

const server = setupServer(...handlers);

/* ------------------------------------------------------------------ */
/*  Lifecycle                                                         */
/* ------------------------------------------------------------------ */
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  products = [...seedProducts];
  nextId = 10;
});
afterAll(() => server.close());

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
const user = userEvent.setup();

/** Render a specific route within the app providers */
function renderRoute(initialRoute: string) {
  products = [...seedProducts];
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ProductProvider>
        <Routes>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/add" element={<AddProductPage />} />
        </Routes>
        <ToastContainer />
      </ProductProvider>
    </MemoryRouter>,
  );
}

async function waitForProducts() {
  await waitFor(() => {
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });
}

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('Product Listing (public)', () => {
  it('fetches and displays products on the products page', async () => {
    renderRoute('/products');
    await waitForProducts();

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
    expect(screen.getByText('£149.99')).toBeInTheDocument();
    expect(screen.getByText('£89.95')).toBeInTheDocument();
  });

  it('filters products by search term', async () => {
    renderRoute('/products');
    await waitForProducts();

    const searchInput = screen.getByPlaceholderText(/search products/i);
    await user.type(searchInput, 'headphones');

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.queryByText('Running Shoes')).not.toBeInTheDocument();
  });

  it('toggles between grid and list view', async () => {
    renderRoute('/products');
    await waitForProducts();

    // Default is grid
    const listBtn = screen.getByRole('button', { name: /list view/i });
    await user.click(listBtn);

    // Products should still be visible in list view
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();

    // Switch back to grid
    const gridBtn = screen.getByRole('button', { name: /grid view/i });
    await user.click(gridBtn);

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });
});

describe('Product Detail (public)', () => {
  it('shows product details and image gallery', async () => {
    renderRoute('/products/1');

    // Product name appears in breadcrumb + <h1>, so use getAllByText
    await waitFor(() => {
      expect(screen.getAllByText('Wireless Headphones').length).toBeGreaterThanOrEqual(1);
    });

    // The heading specifically
    expect(screen.getByRole('heading', { name: 'Wireless Headphones' })).toBeInTheDocument();
    expect(screen.getByText('£149.99')).toBeInTheDocument();
    expect(screen.getByText('Premium noise-cancelling headphones.')).toBeInTheDocument();

    // Gallery thumbnails should be present (4 images: main + 3 gallery)
    const thumbButtons = screen.getAllByRole('button', { name: /view image/i });
    expect(thumbButtons.length).toBe(4);
  });

  it('shows not-found for invalid product id', async () => {
    renderRoute('/products/999');

    await waitFor(() => {
      expect(screen.getByText('Product Not Found')).toBeInTheDocument();
    });
  });
});

describe('Admin — Product Management', () => {
  it('displays products in a management table', async () => {
    renderRoute('/admin');
    await waitForProducts();

    // Table should show product names
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
  });

  it('removes a product after confirmation', async () => {
    renderRoute('/admin');
    await waitForProducts();

    // Click delete on "Wireless Headphones"
    const deleteBtn = screen.getByRole('button', { name: /delete wireless headphones/i });
    await user.click(deleteBtn);

    // Confirm in the modal
    const confirmBtn = screen.getByRole('button', { name: /yes, delete/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument();
    });
  });

  it('edits a product inline', async () => {
    renderRoute('/admin');
    await waitForProducts();

    // Click edit on "Running Shoes"
    const editBtn = screen.getByRole('button', { name: /edit running shoes/i });
    await user.click(editBtn);

    // The inline edit form should show pre-filled values
    const nameInput = screen.getByDisplayValue('Running Shoes');
    await user.clear(nameInput);
    await user.type(nameInput, 'Trail Shoes');

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText('Trail Shoes')).toBeInTheDocument();
    });
    expect(screen.queryByText('Running Shoes')).not.toBeInTheDocument();
  });
});

describe('Admin — Add Product Page', () => {
  it('shows validation error for empty product name', async () => {
    renderRoute('/admin/add');

    await user.type(screen.getByLabelText(/price/i), '10');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Home');
    await user.type(screen.getByLabelText(/sku/i), 'TEST-001');
    await user.type(screen.getByLabelText(/description/i), 'desc');

    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(screen.getByText('Product name is required.')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid price', async () => {
    renderRoute('/admin/add');

    await user.type(screen.getByLabelText('Name'), 'Test');
    await user.type(screen.getByLabelText(/description/i), 'desc');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Home');
    await user.type(screen.getByLabelText(/sku/i), 'TEST-002');

    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(screen.getByText('Price must be a positive number.')).toBeInTheDocument();
    });
  });

  it('adds a new product and navigates to admin', async () => {
    renderRoute('/admin/add');

    await user.type(screen.getByLabelText('Name'), 'New Widget');
    await user.type(screen.getByLabelText(/price/i), '25.50');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Home');
    await user.type(screen.getByLabelText(/sku/i), 'HOME-NW-010');
    await user.type(screen.getByLabelText(/description/i), 'A shiny new widget.');

    await user.click(screen.getByRole('button', { name: /add product/i }));

    // After success, should navigate to /admin and show the product in table
    await waitFor(() => {
      expect(screen.getByText('New Widget')).toBeInTheDocument();
    });
  });
});
