/*
  # Add Midtrans transaction ID column to orders table

  1. Modified Tables
    - `orders`
      - Add `midtrans_transaction_id` (text, unique, nullable) - To store Midtrans transaction ID for webhook processing
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'midtrans_transaction_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN midtrans_transaction_id text UNIQUE;
  END IF;
END $$;
