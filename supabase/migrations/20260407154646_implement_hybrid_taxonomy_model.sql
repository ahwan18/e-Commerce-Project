/*
  # Implement Hybrid Taxonomy Model for Products

  1. Schema Changes
    - Replace granular category_id with parent_category (enum/string)
    - Add dynamic filter attributes to products table:
      - material (string)
      - gender_theme (string: laki-laki, perempuan, unisex)
      - movement_type (string: manual, pullback, pegas, air)
      - size (string: saku, kecil, sedang)
      - tags (text, comma-separated)
    - Deprecate old category_id (keep for backward compatibility)

  2. Parent Categories (Max 5-6)
    - Mainan Klasik & Tradisional
    - Mainan Kreativitas & Seni
    - Mainan Fisik & Ketangkasan
    - Mainan Edukasi & Sains
    - Mainan Koleksi & Aksesori

  3. Backward Compatibility
    - Keep category_id for existing reads
    - New columns optional
    - Support filtering by both old and new taxonomy

  4. Indexes
    - Add indexes on new filter columns for query efficiency
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'parent_category'
  ) THEN
    ALTER TABLE products ADD COLUMN parent_category text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'material'
  ) THEN
    ALTER TABLE products ADD COLUMN material text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'gender_theme'
  ) THEN
    ALTER TABLE products ADD COLUMN gender_theme text DEFAULT 'unisex';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'movement_type'
  ) THEN
    ALTER TABLE products ADD COLUMN movement_type text DEFAULT 'manual';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size'
  ) THEN
    ALTER TABLE products ADD COLUMN size text DEFAULT 'sedang';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'tags'
  ) THEN
    ALTER TABLE products ADD COLUMN tags text DEFAULT '';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_parent_category ON products(parent_category);
CREATE INDEX IF NOT EXISTS idx_products_material ON products(material);
CREATE INDEX IF NOT EXISTS idx_products_gender_theme ON products(gender_theme);
CREATE INDEX IF NOT EXISTS idx_products_movement_type ON products(movement_type);
CREATE INDEX IF NOT EXISTS idx_products_size ON products(size);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);