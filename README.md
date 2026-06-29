# Toko Mainan Jalan Dongi

Toko Mainan Jalan Dongi is a full-stack e-commerce web application for a toy store. It supports a customer shopping flow and an admin dashboard for managing products, categories, orders, and sales analytics.

## Problem

Small stores need a simple way to show products, accept customer orders, and manage inventory without relying only on manual chat-based transactions. This project demonstrates an e-commerce workflow with separate customer and admin responsibilities.

## What I Built

- Product catalog with category filtering
- Product detail pages
- Shopping cart with local storage persistence
- Checkout flow with customer information
- Dummy payment flow prepared for Midtrans integration
- Admin login with protected routes
- Admin dashboard for sales statistics and recent orders
- Product, category, and order management
- Supabase database integration with Row Level Security

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Supabase
- PostgreSQL
- Supabase Auth
- Lucide React

## Architecture

The project follows a simple MVC-inspired structure:

```text
src/models       Data access and database operations
src/controllers  Business logic and workflow handling
src/views        Customer and admin UI screens
src/components   Reusable UI components
src/routes       App routing and protected routes
src/context      Cart and authentication state
src/services     Supabase and payment service integration
```

## Main Features

### Customer

- Browse products by category
- View product details
- Add items to cart
- Update quantity or remove cart items
- Submit checkout information
- Complete dummy payment flow

### Admin

- Secure admin login
- View dashboard statistics
- Manage products and categories
- View and update order status
- Access protected admin routes only after authentication

## Database Overview

- `categories` for product grouping
- `products` for product catalog data
- `orders` for customer order records
- `order_items` for purchased item details

Row Level Security is used to allow public product browsing while keeping admin write operations protected.

## Role

Full-stack developer. I worked on the storefront flow, admin dashboard, Supabase integration, authentication flow, MVC structure, and deployment-ready Vite setup.

## Future Improvements

- Integrate real Midtrans payment processing
- Add customer order tracking page
- Add QR code generation for product pages
- Add image upload for product management
- Add automated tests for checkout and admin flows

## Local Development

```bash
npm install
npm run dev
```

Create a local `.env` file with your Supabase project values before running the app:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
