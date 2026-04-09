/*
  # Toko Mainan Jalan Dongi - Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null) - Category name
      - `description` (text) - Category description
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Product name
      - `description` (text) - Product description
      - `price` (numeric, not null) - Product price
      - `stock` (integer, not null, default 0) - Available stock
      - `image_url` (text) - Product image URL
      - `category_id` (uuid, foreign key) - Reference to categories
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text, not null) - Customer name
      - `customer_phone` (text, not null) - Customer phone number
      - `total_amount` (numeric, not null) - Total order amount
      - `status` (text, not null, default 'pending') - Order status (pending, paid, completed, cancelled)
      - `created_at` (timestamptz) - Order creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key) - Reference to orders
      - `product_id` (uuid, foreign key) - Reference to products
      - `quantity` (integer, not null) - Quantity ordered
      - `price` (numeric, not null) - Price at time of order
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Categories: Public read access, admin write access
    - Products: Public read access, admin write access
    - Orders: Public insert (for customer orders), admin read/update access
    - Order Items: Public insert (for customer orders), admin read access

  3. Important Notes
    - Customer orders are stored without authentication
    - Admin operations require authentication
    - Price is stored in order_items to preserve historical pricing
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Categories can be inserted by authenticated admins"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Categories can be updated by authenticated admins"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Categories can be deleted by authenticated admins"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Products can be inserted by authenticated admins"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Products can be updated by authenticated admins"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Products can be deleted by authenticated admins"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for orders
CREATE POLICY "Orders are viewable by authenticated admins"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Orders can be created by anyone (for customer checkout)"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Orders can be updated by authenticated admins"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for order_items
CREATE POLICY "Order items are viewable by authenticated admins"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Order items can be created by anyone (for customer checkout)"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Action Figures', 'Superhero and action figure toys'),
  ('Dolls', 'Dolls and accessories'),
  ('Educational', 'Educational and learning toys'),
  ('Vehicles', 'Cars, trucks, and vehicle toys'),
  ('Puzzles', 'Jigsaw puzzles and brain teasers')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, stock, category_id, image_url)
SELECT 
  'Robot Transformer',
  'Transform from robot to vehicle',
  150000,
  20,
  id,
  'https://images.pexels.com/photos/8088495/pexels-photo-8088495.jpeg'
FROM categories WHERE name = 'Action Figures'
UNION ALL
SELECT 
  'Princess Doll Set',
  'Beautiful princess doll with accessories',
  85000,
  15,
  id,
  'https://images.pexels.com/photos/8877727/pexels-photo-8877727.jpeg'
FROM categories WHERE name = 'Dolls'
UNION ALL
SELECT 
  'Building Blocks 500pcs',
  'Creative building blocks set',
  200000,
  30,
  id,
  'https://images.pexels.com/photos/5872188/pexels-photo-5872188.jpeg'
FROM categories WHERE name = 'Educational'
UNION ALL
SELECT 
  'Race Car Collection',
  'Set of 10 racing cars',
  120000,
  25,
  id,
  'https://images.pexels.com/photos/35967/mini-cooper-auto-model-vehicle.jpg'
FROM categories WHERE name = 'Vehicles'
UNION ALL
SELECT 
  'Animal Puzzle 100pcs',
  'Colorful animal jigsaw puzzle',
  45000,
  40,
  id,
  'https://images.pexels.com/photos/5691488/pexels-photo-5691488.jpeg'
FROM categories WHERE name = 'Puzzles';
