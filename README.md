# TravelUp — Product Catalogue

A responsive, multi-page single-page application for browsing and managing a product catalogue.  
Built with **React 18**, **TypeScript**, **React Router**, and **Sass**, using **json-server** as a mock REST API.

---

## ✨ Features

| Area | Details |
|------|---------|
| **Public storefront** | Home page with hero banner, featured products, and CTA sections |
| **Product listing** | Grid & list view toggle, real-time search, responsive layout |
| **Product detail** | Image gallery with thumbnails, breadcrumb navigation, product info panel |
| **Admin dashboard** | Management table with inline edit, modal delete confirmation |
| **Separate add page** | Dedicated page for adding new products with validation |
| **CRUD operations** | Add, edit (inline), and delete products with confirmation dialogs |
| **Data validation** | Client-side validation for name, price, category, and description |
| **RESTful API** | Full GET / POST / PUT / DELETE integration via `json-server` |
| **State management** | Centralised state with React Context + `useReducer` |
| **Responsive design** | CSS Grid / Flexbox layout that adapts across mobile, tablet, and desktop |
| **Navigation** | Full header with nav links + mobile hamburger menu; multi-column footer |
| **Product images** | Random images from picsum.photos with gallery on detail page |
| **User feedback** | Toast notifications for success & error states; loading spinner; error retry |
| **Testing** | 11 integration tests using Vitest + React Testing Library + MSW |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (ships with Node)

### Installation

```bash
# Clone the repository (or unzip)
cd travelup

# Install dependencies
npm install
```

### Running the Application

The easiest way is to start **both** the mock API and the dev server together:

```bash
npm start
```

This runs two processes in parallel via `concurrently`:

| Process | URL | Description |
|---------|-----|-------------|
| **Vite dev server** | `http://localhost:5173` | The React front-end |
| **json-server** | `http://localhost:3001` | Mock REST API serving `db.json` |

> Vite is configured to proxy `/api/*` requests to json-server, so the app fetches data from `/api/products` seamlessly.

#### Running individually

```bash
# Start the mock API only
npm run api

# Start the dev server only (in another terminal)
npm run dev
```

### Building for Production

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

---

## 🧪 Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Test Coverage

The integration test suite (`src/__tests__/integration.test.tsx`) covers:

| # | Test Case | What it verifies |
|---|-----------|------------------|
| 1 | Fetches and displays products | GET request, product cards rendered on /products |
| 2 | Filters products by search | Client-side search across name/category/description |
| 3 | Toggles grid/list view | View mode switch, products visible in both layouts |
| 4 | Shows product detail + gallery | Product info, price, description, 4 gallery thumbnails |
| 5 | Shows not-found for invalid ID | "Product Not Found" rendered for non-existent product |
| 6 | Admin displays management table | Products shown in table on /admin |
| 7 | Admin removes a product | Confirmation modal → DELETE request → row removed |
| 8 | Admin edits a product inline | Inline form pre-populated → PUT request → row updated |
| 9 | Validates empty product name | Client-side validation fires on /admin/add |
| 10 | Validates invalid price | Client-side validation fires on /admin/add |
| 11 | Adds a product and navigates | POST request → navigates to /admin → product in table |

Tests use **MSW (Mock Service Worker)** to intercept network requests at the service-worker level, keeping tests isolated from json-server.

---

## 📁 Project Structure

```
travelup/
├── public/                        # Static assets
├── src/
│   ├── __tests__/
│   │   └── integration.test.tsx   # 11 integration tests (Vitest + RTL + MSW)
│   ├── components/
│   │   ├── Header/                # Nav bar with links + mobile hamburger
│   │   ├── Footer/                # Multi-column footer with link groups
│   │   ├── ProductForm/           # Reusable form for add & edit
│   │   └── Toast/                 # Toast notification container
│   ├── context/
│   │   └── ProductContext.tsx     # React Context + useReducer (state management)
│   ├── pages/
│   │   ├── HomePage/              # Hero banner, featured products, CTA
│   │   ├── ProductsPage/          # Grid/list view, search, product cards
│   │   ├── ProductDetailPage/     # Image gallery, breadcrumb, product info
│   │   ├── AdminPage/             # Management table, inline edit, delete modal
│   │   └── AddProductPage/        # Dedicated add-product form
│   ├── services/
│   │   └── api.ts                 # Fetch-based REST client (GET/POST/PUT/DELETE)
│   ├── types/
│   │   └── Product.ts             # TypeScript interfaces
│   ├── utils/
│   │   └── images.ts              # Image URL helpers (picsum.photos)
│   ├── App.tsx                    # Root component with React Router
│   ├── index.scss                 # Global styles, CSS variables, reset
│   ├── main.tsx                   # Entry point
│   └── test-setup.ts              # Vitest setup (jest-dom matchers)
├── db.json                        # Mock database for json-server
├── index.html                     # HTML shell
├── package.json
├── tsconfig.json
├── vite.config.ts                 # Vite config (React plugin + API proxy)
└── vitest.config.ts               # Vitest config (jsdom, CSS modules)
```

## 🗺️ Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Hero banner, featured products, CTA sections |
| `/products` | Products | Full product listing with grid/list toggle + search |
| `/products/:id` | Product Detail | Image gallery, breadcrumb, product info panel |
| `/admin` | Admin | Management table with edit/delete actions |
| `/admin/add` | Add Product | Dedicated form for creating new products |

---

## 🏗️ Design Choices

### Framework & Tooling
- **Vite** for fast HMR and optimised production builds.
- **TypeScript** throughout for type safety and better DX.
- **React Router DOM** for client-side multi-page routing.
- **Sass** (SCSS) with CSS Modules for scoped, maintainable styles.

### State Management
- **React Context + `useReducer`** provides a lightweight, Redux-like pattern without extra dependencies. Actions are dispatched for every state transition (fetch, add, update, remove, toast).

### API Layer
- A thin `services/api.ts` module wraps `fetch` with error handling, keeping components decoupled from HTTP concerns.
- **json-server** serves `db.json` as a fully functional REST API — no custom backend needed.
- Vite's dev-server proxy rewrites `/api/*` → `http://localhost:3001/*`, avoiding CORS issues.

### Styling
- **CSS custom properties** (design tokens) defined in `:root` for consistent colours, spacing, and typography.
- **CSS Grid** for the responsive product grid; **Flexbox** for component-level layouts.
- **Media queries** at 640 px (tablet) and 1024 px (desktop) breakpoints.
- **BEM-inspired naming** with flat selectors (`block__element`, `block__element--modifier`) for easy overrides and maintainability.
- Each component/page has its own SCSS module with meaningful class names (e.g. `.card__image`, `.table__action-btn--edit`).

### Testing
- **Vitest** (Vite-native test runner) for zero-config integration with the build tool.
- **React Testing Library** for user-centric, DOM-based assertions.
- **MSW** intercepts HTTP at the network level, providing realistic API mocking without coupling tests to implementation details.

---

## ⚠️ Known Limitations

- **No authentication** — the app is a prototype; there is no user login or access control.
- **No pagination** — all products are loaded at once. For a large catalogue a paginated or virtualised list would be needed.
- **Placeholder images** — product images come from picsum.photos; no actual image upload is supported.
- **Placeholder nav links** — Deals, About, and Contact link to `#` (not yet implemented).
- **json-server v0.17** — uses the legacy (but stable) version; the newer v1.x has a different API surface.
- **Sass legacy JS API warnings** — Dart Sass emits deprecation warnings via Vite's current Sass integration; these are cosmetic and will resolve in a future Vite release.

---

## 📜 Licence

This project is provided for assessment purposes only.
