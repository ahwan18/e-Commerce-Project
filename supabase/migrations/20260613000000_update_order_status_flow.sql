ALTER TABLE orders
  ALTER COLUMN status SET DEFAULT 'pending_payment';

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

UPDATE orders
SET status = 'pending_payment'
WHERE status = 'pending';

ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (
    status IN (
      'pending',
      'pending_payment',
      'paid',
      'processing',
      'shipped',
      'completed',
      'cancelled'
    )
  );
