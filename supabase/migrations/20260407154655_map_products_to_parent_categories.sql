/*
  # Map existing products to parent categories

  1. Category Mapping
    Maps original granular categories to 5 parent categories:
    
    - Mainan Klasik & Tradisional:
      Klasik, Tradisional, Kartu, Board Game
    
    - Mainan Kreativitas & Seni:
      Kreatif, Seni, Koleksi
    
    - Mainan Fisik & Ketangkasan:
      Fisik, Skill, Outdoor, Kompetisi
    
    - Mainan Edukasi & Sains:
      Sains, Puzzle
    
    - Mainan Koleksi & Aksesori:
      Aksesori, Kendaraan, Pegas, DIY, Sensorik
*/

UPDATE products
SET parent_category = 'Mainan Klasik & Tradisional'
WHERE category_id IN (
  SELECT id FROM categories WHERE name IN ('Klasik', 'Tradisional', 'Kartu', 'Board Game')
);

UPDATE products
SET parent_category = 'Mainan Kreativitas & Seni'
WHERE category_id IN (
  SELECT id FROM categories WHERE name IN ('Kreatif', 'Seni', 'Koleksi')
);

UPDATE products
SET parent_category = 'Mainan Fisik & Ketangkasan'
WHERE category_id IN (
  SELECT id FROM categories WHERE name IN ('Fisik', 'Skill', 'Outdoor', 'Kompetisi')
);

UPDATE products
SET parent_category = 'Mainan Edukasi & Sains'
WHERE category_id IN (
  SELECT id FROM categories WHERE name IN ('Sains', 'Puzzle')
);

UPDATE products
SET parent_category = 'Mainan Koleksi & Aksesori'
WHERE category_id IN (
  SELECT id FROM categories WHERE name IN ('Aksesori', 'Kendaraan', 'Pegas', 'DIY', 'Sensorik')
);