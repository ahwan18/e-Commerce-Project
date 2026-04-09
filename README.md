# Toko Mainan Jalan Dongi

A full-stack e-commerce web application for a toy store built with React and Supabase, following strict MVC architecture and clean code principles.

## Overview

This is a comprehensive e-commerce platform designed for a toy store with two distinct user roles:

- **Customer**: Browse products, add to cart, and complete purchases without authentication
- **Admin**: Manage products, categories, and view sales analytics (authentication required)

## Tech Stack

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Vite** - Build tool and development server

### Backend
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Authentication (Admin only)
  - Row Level Security (RLS)
  - Real-time subscriptions

### Architecture
- **MVC Pattern** - Strict separation of concerns
- **Context API** - State management
- **Clean Code Principles** - Single Responsibility Principle

## Features

### Customer Features
- Browse product catalog with category filtering
- View detailed product information
- Add products to shopping cart (stored in local storage)
- Update cart quantities and remove items
- Complete checkout with customer information
- Dummy payment processing (ready for Midtrans integration)

### Admin Features
- Secure login with Supabase Auth
- Dashboard with sales statistics and recent orders
- Product management (Create, Read, Update, Delete)
- Category management (Create, Read, Update, Delete)
- Order management and status updates
- Protected routes requiring authentication

## Project Structure

```
src/
├── models/                 # Data layer - Database operations
│   ├── productModel.js
│   ├── orderModel.js
│   └── categoryModel.js
├── controllers/            # Business logic layer
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── authController.js
├── views/                  # Presentation layer - UI components
│   ├── customer/
│   │   ├── Catalog.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   └── Checkout.jsx
│   └── admin/
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       ├── ManageProducts.jsx
│       ├── ManageCategories.jsx
│       └── Orders.jsx
├── components/             # Reusable UI components
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── Button.jsx
│   └── Loading.jsx
├── routes/                 # Routing configuration
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── context/                # State management
│   ├── CartContext.jsx
│   └── AuthContext.jsx
├── services/               # External services
│   ├── supabaseClient.js
│   └── paymentService.js
└── utils/                  # Utility functions
    └── helpers.js
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account (database already configured)

### Step 1: Clone and Install

```bash
# Install dependencies
npm install
```

### Step 2: Environment Variables

The `.env` file is already configured with Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**DO NOT modify these values unless you're changing to a different Supabase project.**

### Step 3: Database Setup

The database schema is already set up with the following tables:
- `categories` - Product categories
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items

All tables have Row Level Security (RLS) enabled with appropriate policies.

### Step 4: Create Admin User

To create an admin user for the admin panel:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" → "Create new user"
4. Enter email and password
5. Use these credentials to login at `/admin/login`

### Step 5: Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Step 6: Build for Production

```bash
npm run build
```

## Usage

### Customer Flow

1. Visit `/shop` (simulates QR code access)
2. Browse products and filter by category
3. Click on products to view details
4. Add items to cart
5. Navigate to cart via the cart icon
6. Proceed to checkout
7. Enter name and phone number
8. Complete payment (dummy mode)

### Admin Flow

1. Visit `/admin/login`
2. Login with admin credentials
3. Access dashboard to view statistics
4. Manage products via "Kelola Produk"
5. Manage categories via "Kelola Kategori"
6. View and update orders via "Lihat Pesanan"

## Database Schema

### Categories Table
```sql
- id (uuid, primary key)
- name (text, unique)
- description (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### Products Table
```sql
- id (uuid, primary key)
- name (text)
- description (text)
- price (numeric)
- stock (integer)
- image_url (text)
- category_id (uuid, foreign key)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### Orders Table
```sql
- id (uuid, primary key)
- customer_name (text)
- customer_phone (text)
- total_amount (numeric)
- status (text: pending, paid, completed, cancelled)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### Order Items Table
```sql
- id (uuid, primary key)
- order_id (uuid, foreign key)
- product_id (uuid, foreign key)
- quantity (integer)
- price (numeric)
- created_at (timestamptz)
```

## Security

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

**Categories & Products:**
- Public read access (SELECT)
- Admin-only write access (INSERT, UPDATE, DELETE)

**Orders:**
- Anyone can create orders (INSERT) - for customer checkout
- Admin-only read and update access (SELECT, UPDATE)

**Order Items:**
- Anyone can create order items (INSERT) - for customer checkout
- Admin-only read access (SELECT)

### Authentication

- Admin routes are protected using `ProtectedRoute` component
- Supabase Auth handles authentication state
- Session management via Context API
- Automatic redirect to login for unauthorized access

## What You Should NOT Modify

### Core Architecture
- **MVC Structure** - The separation between models, controllers, and views
- **Supabase Client** - The client configuration in `src/services/supabaseClient.js`
- **Authentication Flow** - The auth controller and context implementation
- **RLS Policies** - Database security policies (modify only if you understand implications)
- **Core Controllers** - The single responsibility of each controller function

### Critical Files
- `src/services/supabaseClient.js` - Supabase initialization
- `src/controllers/authController.js` - Authentication logic
- `src/routes/ProtectedRoute.jsx` - Route protection logic
- `.env` - Environment variables (unless changing projects)

## What You CAN Modify

### UI/UX
- **Styling** - Tailwind classes in components and views
- **Layout** - Component structure and arrangement
- **Colors** - Color schemes and themes
- **Icons** - Icon choices (currently using Lucide React)
- **Typography** - Fonts and text sizes

### Features
- **New Routes** - Add new pages in `src/routes/AppRoutes.jsx`
- **Additional Fields** - Add fields to forms and database (via migrations)
- **New Categories** - Add more product categories
- **Cart Logic** - Enhance cart functionality in `cartController.js`
- **Validation** - Add more validation rules in controllers

### Business Logic
- **Product Rules** - Modify product constraints in `productController.js`
- **Order Processing** - Enhance order workflow in `orderController.js`
- **Pricing Logic** - Update pricing calculations
- **Stock Management** - Modify stock handling rules

### Components
- **New Components** - Create additional reusable components
- **Component Props** - Extend existing component props
- **Component Variants** - Add new button variants, etc.

## TODO: Future Enhancements

### 1. Payment Gateway Integration (Midtrans)

**Current State:** Dummy payment implementation in `src/services/paymentService.js`

**Steps to Integrate:**

1. **Install Midtrans SDK**
   ```bash
   npm install midtrans-client
   ```

2. **Add Environment Variables**
   ```env
   VITE_MIDTRANS_CLIENT_KEY=your_client_key
   VITE_MIDTRANS_SERVER_KEY=your_server_key
   VITE_MIDTRANS_IS_PRODUCTION=false
   ```

3. **Load Snap.js in `index.html`**
   ```html
   <script src="https://app.sandbox.midtrans.com/snap/snap.js"
           data-client-key="YOUR_CLIENT_KEY"></script>
   ```

4. **Create Supabase Edge Function**
   - Function name: `create-midtrans-transaction`
   - Purpose: Generate snap_token securely
   - Use Midtrans Server Key (never expose in frontend)

5. **Create Webhook Handler**
   - Function name: `midtrans-webhook`
   - Purpose: Receive payment notifications from Midtrans
   - Update order status based on payment result

6. **Update Frontend**
   - Uncomment the real implementation in `paymentService.js`
   - Replace dummy payment call in `orderController.js`

**Files to Modify:**
- `src/services/paymentService.js` - Uncomment real implementation
- Create Edge Functions for snap token and webhook
- `src/controllers/orderController.js` - Update payment flow

### 2. QR Code Generator

**Implementation:**

1. Install QR code library:
   ```bash
   npm install qrcode.react
   ```

2. Create QR code component for each product:
   ```jsx
   import QRCode from 'qrcode.react';

   <QRCode value={`${window.location.origin}/shop/product/${productId}`} />
   ```

3. Add "Generate QR" button in admin product management
4. Allow printing QR codes for physical display

**Use Case:** Generate QR codes for each product that customers can scan to view product details directly.

### 3. Order Status Tracking

**Features to Add:**

1. Create order tracking page for customers
2. Add order ID lookup without authentication
3. Show order status timeline
4. Send notifications on status changes

**Files to Create:**
- `src/views/customer/OrderTracking.jsx`
- `src/controllers/trackingController.js`

**Implementation:**
- Add `/track/:orderId` route
- Display order status history
- Show estimated completion time

### 4. Image Upload (Supabase Storage)

**Current:** Products use image URLs only

**Enhancement:**
1. Set up Supabase Storage bucket
2. Add image upload in admin product form
3. Generate and use Supabase Storage URLs
4. Add image compression before upload

**Benefits:**
- Better control over images
- Consistent image sizing
- Faster loading times

### 5. Advanced Validation

**Areas to Improve:**

1. **Product Validation:**
   - Duplicate product name detection
   - Price range validation
   - Stock threshold warnings

2. **Order Validation:**
   - Prevent ordering out-of-stock items
   - Minimum order amount
   - Maximum quantity per order

3. **User Input Validation:**
   - Phone number format standardization
   - Name character restrictions
   - XSS prevention

### 6. Analytics & Reporting

**Features:**
1. Sales reports by date range
2. Best-selling products
3. Revenue charts
4. Customer analytics
5. Export reports to CSV/PDF

**Libraries to Consider:**
- Chart.js or Recharts for visualizations
- jsPDF for PDF generation

### 7. Search & Filters

**Enhancements:**
1. Product search by name
2. Price range filter
3. Sort by price/name/popularity
4. Advanced category filters

### 8. Customer Notifications

**Implementation:**
1. Email notifications for order confirmation
2. SMS notifications for order status
3. Admin notifications for new orders

**Services:**
- Supabase Edge Functions + email service
- SMS gateway integration

### 9. Inventory Alerts

**Features:**
1. Low stock warnings in admin panel
2. Out-of-stock notifications
3. Automatic reorder suggestions
4. Stock history tracking

### 10. Multi-language Support

**Implementation:**
1. Add i18n library (react-i18next)
2. Support Indonesian and English
3. Language switcher component
4. Translate all text content

## Troubleshooting

### Common Issues

**Issue: "Missing Supabase environment variables"**
- Solution: Check that `.env` file exists and contains valid values

**Issue: "Cannot login as admin"**
- Solution: Ensure admin user is created in Supabase Auth dashboard

**Issue: "Products not loading"**
- Solution: Check Supabase database has products table with sample data

**Issue: "Cart not persisting"**
- Solution: Check browser's local storage is enabled

**Issue: "Admin routes accessible without login"**
- Solution: Verify `ProtectedRoute` component is wrapping admin routes

## Development Guidelines

### Adding a New Feature

1. **Model Layer** - If feature requires database, add functions to appropriate model
2. **Controller Layer** - Add business logic to appropriate controller
3. **View Layer** - Create UI components
4. **Routes** - Add route if needed
5. **Context** - Add to context if shared state is needed

### Code Style

- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Add comments for complex logic
- Follow existing file structure patterns
- Use async/await for asynchronous operations
- Handle errors appropriately

### Testing

Before deploying:
1. Test all customer flows (browse → cart → checkout)
2. Test all admin flows (login → CRUD operations)
3. Test on mobile devices (responsive design)
4. Test with different browsers
5. Check console for errors
6. Verify RLS policies are working

## Performance Optimization

### Current Optimizations
- Image lazy loading
- React Context for state management
- Local storage for cart (reduces database calls)
- Database indexes on foreign keys

### Future Optimizations
- Implement React.memo for expensive components
- Add pagination for product list
- Optimize images (WebP format, compression)
- Implement service worker for offline support
- Add caching strategies

## Contributing

When contributing to this project:

1. Follow the MVC architecture strictly
2. Maintain single responsibility principle
3. Add comments for non-obvious code
4. Test thoroughly before committing
5. Update README if adding new features

## License

This project is created for educational purposes.

## Support

For issues or questions:
1. Check this README first
2. Review Supabase documentation
3. Check React documentation
4. Review code comments for guidance

## Credits

- Built with React and Supabase
- Icons by Lucide React
- Styled with Tailwind CSS
- Sample images from Pexels

## Modern Best Practices & Architecture

### Feature-Based Structure
- Organize domain logic under `src/features/` (e.g., `features/products`, `features/cart`, `features/filters`).
- Keep `src/components/` for presentational, reusable UI only.
- Place custom hooks in `src/hooks/` (e.g., `useProducts`, `useFilters`).
- Move all Supabase queries and filtering logic into hooks/services, not components.

### Rendering Performance
- Use `React.memo` for heavy presentational components (e.g., `ProductCard`, `ProductList`).
- Use `useMemo` for computed values (e.g., filtered product lists).
- Use `useCallback` for event handlers.
- Implement lazy loading for pages using `React.lazy` and `Suspense`.

### Tailwind CSS Standardization
- Follow class order: layout → spacing → sizing → typography → background → effects.
- Convert reusable components (Button, Badge, etc.) to variant-based pattern.
- Centralize conditional styling logic (avoid inline ternaries).
- Use mobile-first classes as default.

### Data Fetching & State Management
- Extract all Supabase queries into a dedicated layer (hooks or services).
- Never call Supabase directly in components.
- Memoize/cached repeated queries.
- Centralize filtering logic in a hook (e.g., `useFilters`).
- Add comments where Row Level Security (RLS) is enforced.

### Supabase Security
- Only use anon key (`VITE_SUPABASE_ANON_KEY`) in frontend. **Never expose service_role_key.**
- Add comments to highlight RLS enforcement in code.
- Avoid querying sensitive fields in frontend.

### Node.js/Edge Functions (if present)
- Keep all external integrations (payment, webhook) in backend only.
- Use schema-based validation (e.g., Zod pattern) for all inputs.
- Standardize error responses (JSON, no stack traces).
- Access sensitive keys only from server environment variables.

### Environment Variables
- Only public-safe variables use `VITE_` prefix.
- Add comments to `.env` and code for server-only variables.

### Example Structure
```
src/
  features/
    products/
      useProducts.js
      productService.js
    cart/
      useCart.js
    filters/
      useFilters.js
  components/
    Button.jsx
    ProductCard.jsx
    Badge.jsx
  hooks/
    useSupabaseQuery.js
  views/
    customer/
      Catalog.jsx
      ProductDetail.jsx
```

### Example: Supabase Query Layer
```js
// src/features/products/productService.js
import { supabase } from '../../services/supabaseClient';
// Only use anon key, never service_role_key
// RLS must be enabled for all queries
export async function fetchAllProducts() {
  return supabase.from('products').select('id, name, price, ...');
}
```

### Example: Presentational Component
```jsx
import React from 'react';
const ProductCard = React.memo(({ product, onAddToCart, onViewDetails }) => (
  // ...presentational code only...
));
export default ProductCard;
```

### Example: Node.js/Edge Function Error Handling
```js
// In edge function
if (!isValid) {
  return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
}
```
