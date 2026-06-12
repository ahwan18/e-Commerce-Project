-- MVP hardening for Mode 2 e-commerce:
-- - restrict admin-only operations to explicit admin users
-- - store customer account/order/shipping metadata
-- - make stock updates atomic and reject overselling

CREATE TABLE IF NOT EXISTS admin_users (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO admin_users (email)
VALUES ('ahmadkurniawanibrahim@gmail.com')
ON CONFLICT (email) DO NOTHING;

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DROP POLICY IF EXISTS "Admin users are viewable by admins" ON admin_users;
CREATE POLICY "Admin users are viewable by admins"
  ON admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin());

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS order_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS shipping_address text,
  ADD COLUMN IF NOT EXISTS shipping_city text,
  ADD COLUMN IF NOT EXISTS shipping_postal_code text,
  ADD COLUMN IF NOT EXISTS shipping_method text,
  ADD COLUMN IF NOT EXISTS shipping_cost numeric NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

DROP POLICY IF EXISTS "Categories can be inserted by authenticated admins" ON categories;
CREATE POLICY "Categories can be inserted by admins"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Categories can be updated by authenticated admins" ON categories;
CREATE POLICY "Categories can be updated by admins"
  ON categories FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Categories can be deleted by authenticated admins" ON categories;
CREATE POLICY "Categories can be deleted by admins"
  ON categories FOR DELETE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Products can be inserted by authenticated admins" ON products;
CREATE POLICY "Products can be inserted by admins"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Products can be updated by authenticated admins" ON products;
CREATE POLICY "Products can be updated by admins"
  ON products FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Products can be deleted by authenticated admins" ON products;
CREATE POLICY "Products can be deleted by admins"
  ON products FOR DELETE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Orders are viewable by authenticated admins" ON orders;
CREATE POLICY "Orders are viewable by admins or owner"
  ON orders FOR SELECT
  TO authenticated
  USING (public.is_admin() OR user_id = auth.uid());

DROP POLICY IF EXISTS "Orders can be updated by authenticated admins" ON orders;
CREATE POLICY "Orders can be updated by admins"
  ON orders FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Order items are viewable by authenticated admins" ON order_items;
CREATE POLICY "Order items are viewable by admins or order owner"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Counters can be inserted by authenticated admins" ON counters;
CREATE POLICY "Counters can be inserted by admins"
  ON counters FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Counters can be updated by authenticated admins" ON counters;
CREATE POLICY "Counters can be updated by admins"
  ON counters FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Counters can be deleted by authenticated admins" ON counters;
CREATE POLICY "Counters can be deleted by admins"
  ON counters FOR DELETE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated users to update store_settings" ON store_settings;
CREATE POLICY "Allow admins to update store_settings"
  ON store_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated users to insert store_settings" ON store_settings;
CREATE POLICY "Allow admins to insert store_settings"
  ON store_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.update_product_stock(
  p_product_id uuid,
  p_quantity_change int
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_stock int;
BEGIN
  UPDATE products
  SET stock = stock + p_quantity_change,
      updated_at = now()
  WHERE id = p_product_id
    AND stock + p_quantity_change >= 0
  RETURNING stock INTO new_stock;

  IF new_stock IS NULL THEN
    RAISE EXCEPTION 'Insufficient stock or product not found';
  END IF;

  RETURN new_stock;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_product_stock(uuid, int) TO anon, authenticated;
