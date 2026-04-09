/*
  # Create update_product_stock RPC function

  1. New Functions
    - `update_product_stock(product_id uuid, quantity_change int)`
      - Decrements the product stock by the specified quantity
      - Used during order processing to reduce available inventory
      - Returns the new stock value

  2. Security
    - Function allows stock updates from orders via RPC call
*/

CREATE OR REPLACE FUNCTION update_product_stock(
  p_product_id uuid,
  p_quantity_change int
)
RETURNS int AS $$
DECLARE
  new_stock int;
BEGIN
  UPDATE products
  SET stock = stock - p_quantity_change,
      updated_at = now()
  WHERE id = p_product_id
  RETURNING stock INTO new_stock;
  
  RETURN COALESCE(new_stock, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;