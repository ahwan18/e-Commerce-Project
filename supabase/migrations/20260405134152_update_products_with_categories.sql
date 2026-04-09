/*
  # Update products with correct category assignments

  1. Updates
    - Assigns category_id to all products based on their category names
    - Uses the correct UUIDs for each category
*/

UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Fisik') WHERE name = 'Baling-Baling Bambu Plastik';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Klasik') WHERE name = 'Balon Tiup Sedotan (Odol)';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Koleksi') WHERE name = 'Penghapus Karakter Mini';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Kreatif') WHERE name = 'Stiker Ganti Baju (Dress-up)';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Aksesori') WHERE name = 'Gelang Penggaris (Slap Bracelet)';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Skill') WHERE name = 'Yoyo Plastik Karakter';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Skill') WHERE name = 'Latto-Latto Biasa';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Sains') WHERE name = 'Pohon Natal Ajaib Kertas';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Fisik') WHERE name = 'Parasut Terjun Payung Mini';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Kartu') WHERE name = 'Kartu Kwartet / Tepuk';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Outdoor') WHERE name = 'Gelembung Sabun (Bubble Stick)';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Tradisional') WHERE name = 'Gundu / Kelereng (1 Kantong)';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Sensorik') WHERE name = 'Slime Polos (Cup Kecil)';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Board Game') WHERE name = 'Ular Tangga Kertas + Dadu';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Pegas') WHERE name = 'Mainan Per (Magic Spring) Mini';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'DIY') WHERE name = 'Pesawat Terbang Gabus (Glider)';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Seni') WHERE name = 'Tato Tempel Air (Temporary)';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Koleksi') WHERE name = 'Kipas Tangan Lipat Plastik';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Kompetisi') WHERE name = 'BeyBlade / Gasing Plastik';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Sains') WHERE name = 'Mainan Rendaman Binatang';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Sensorik') WHERE name = 'Pop It Mini (Gantungan Kunci)';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Pegas') WHERE name = 'Slinky Rainbow Besar';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Puzzle') WHERE name = 'Rubik Snake (Ular)';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Sensorik') WHERE name = 'Gantungan Kunci Squishy';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Kendaraan') WHERE name = 'Mobil-Mobilan Pullback';