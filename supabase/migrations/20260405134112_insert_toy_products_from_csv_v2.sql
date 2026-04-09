/*
  # Insert toy products from 2026 CSV data

  1. Data Changes
    - Delete old order items and orders
    - Delete old sample products
    - Insert 25 new toy products with categories, prices, and image URLs
    - Set initial stock to 10 units per product

  2. Products inserted
    - Baling-Baling Bambu Plastik (Fisik)
    - Balon Tiup Sedotan (Klasik)
    - Penghapus Karakter Mini (Koleksi)
    - Stiker Ganti Baju (Kreatif)
    - Gelang Penggaris (Aksesori)
    - Yoyo Plastik Karakter (Skill)
    - Latto-Latto Biasa (Skill)
    - Pohon Natal Ajaib Kertas (Sains)
    - Parasut Terjun Payung Mini (Fisik)
    - Kartu Kwartet / Tepuk (Kartu)
    - Gelembung Sabun (Outdoor)
    - Gundu / Kelereng (Tradisional)
    - Slime Polos (Sensorik)
    - Ular Tangga Kertas + Dadu (Board Game)
    - Mainan Per (Pegas)
    - Pesawat Terbang Gabus (DIY)
    - Tato Tempel Air (Seni)
    - Kipas Tangan Lipat Plastik (Koleksi)
    - BeyBlade / Gasing Plastik (Kompetisi)
    - Mainan Rendaman Binatang (Sains)
    - Pop It Mini (Sensorik)
    - Slinky Rainbow Besar (Pegas)
    - Rubik Snake (Puzzle)
    - Gantungan Kunci Squishy (Sensorik)
    - Mobil-Mobilan Pullback (Kendaraan)
*/

DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;

INSERT INTO products (name, price, stock, image_url, category_id, created_at, updated_at)
VALUES
  ('Baling-Baling Bambu Plastik', 1200, 10, 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg', (SELECT id FROM categories WHERE name = 'Fisik' LIMIT 1), now(), now()),
  ('Balon Tiup Sedotan (Odol)', 1500, 10, 'https://images.pexels.com/photos/3631269/pexels-photo-3631269.jpeg', (SELECT id FROM categories WHERE name = 'Klasik' LIMIT 1), now(), now()),
  ('Penghapus Karakter Mini', 1500, 10, 'https://images.pexels.com/photos/3633286/pexels-photo-3633286.jpeg', (SELECT id FROM categories WHERE name = 'Koleksi' LIMIT 1), now(), now()),
  ('Stiker Ganti Baju (Dress-up)', 2500, 10, 'https://images.pexels.com/photos/3635541/pexels-photo-3635541.jpeg', (SELECT id FROM categories WHERE name = 'Kreatif' LIMIT 1), now(), now()),
  ('Gelang Penggaris (Slap Bracelet)', 2500, 10, 'https://images.pexels.com/photos/3814572/pexels-photo-3814572.jpeg', (SELECT id FROM categories WHERE name = 'Aksesori' LIMIT 1), now(), now()),
  ('Yoyo Plastik Karakter', 3500, 10, 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg', (SELECT id FROM categories WHERE name = 'Skill' LIMIT 1), now(), now()),
  ('Latto-Latto Biasa', 3000, 10, 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg', (SELECT id FROM categories WHERE name = 'Skill' LIMIT 1), now(), now()),
  ('Pohon Natal Ajaib Kertas', 4000, 10, 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg', (SELECT id FROM categories WHERE name = 'Sains' LIMIT 1), now(), now()),
  ('Parasut Terjun Payung Mini', 4500, 10, 'https://images.pexels.com/photos/3807623/pexels-photo-3807623.jpeg', (SELECT id FROM categories WHERE name = 'Fisik' LIMIT 1), now(), now()),
  ('Kartu Kwartet / Tepuk', 2000, 10, 'https://images.pexels.com/photos/3761622/pexels-photo-3761622.jpeg', (SELECT id FROM categories WHERE name = 'Kartu' LIMIT 1), now(), now()),
  ('Gelembung Sabun (Bubble Stick)', 3500, 10, 'https://images.pexels.com/photos/3820517/pexels-photo-3820517.jpeg', (SELECT id FROM categories WHERE name = 'Outdoor' LIMIT 1), now(), now()),
  ('Gundu / Kelereng (1 Kantong)', 6000, 10, 'https://images.pexels.com/photos/3962335/pexels-photo-3962335.jpeg', (SELECT id FROM categories WHERE name = 'Tradisional' LIMIT 1), now(), now()),
  ('Slime Polos (Cup Kecil)', 6500, 10, 'https://images.pexels.com/photos/3761676/pexels-photo-3761676.jpeg', (SELECT id FROM categories WHERE name = 'Sensorik' LIMIT 1), now(), now()),
  ('Ular Tangga Kertas + Dadu', 2000, 10, 'https://images.pexels.com/photos/3962182/pexels-photo-3962182.jpeg', (SELECT id FROM categories WHERE name = 'Board Game' LIMIT 1), now(), now()),
  ('Mainan Per (Magic Spring) Mini', 5000, 10, 'https://images.pexels.com/photos/3814452/pexels-photo-3814452.jpeg', (SELECT id FROM categories WHERE name = 'Pegas' LIMIT 1), now(), now()),
  ('Pesawat Terbang Gabus (Glider)', 8000, 10, 'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg', (SELECT id FROM categories WHERE name = 'DIY' LIMIT 1), now(), now()),
  ('Tato Tempel Air (Temporary)', 1500, 10, 'https://images.pexels.com/photos/3820418/pexels-photo-3820418.jpeg', (SELECT id FROM categories WHERE name = 'Seni' LIMIT 1), now(), now()),
  ('Kipas Tangan Lipat Plastik', 4000, 10, 'https://images.pexels.com/photos/3962334/pexels-photo-3962334.jpeg', (SELECT id FROM categories WHERE name = 'Koleksi' LIMIT 1), now(), now()),
  ('BeyBlade / Gasing Plastik', 9000, 10, 'https://images.pexels.com/photos/3814497/pexels-photo-3814497.jpeg', (SELECT id FROM categories WHERE name = 'Kompetisi' LIMIT 1), now(), now()),
  ('Mainan Rendaman Binatang', 9500, 10, 'https://images.pexels.com/photos/3962333/pexels-photo-3962333.jpeg', (SELECT id FROM categories WHERE name = 'Sains' LIMIT 1), now(), now()),
  ('Pop It Mini (Gantungan Kunci)', 7500, 10, 'https://images.pexels.com/photos/3814572/pexels-photo-3814572.jpeg', (SELECT id FROM categories WHERE name = 'Sensorik' LIMIT 1), now(), now()),
  ('Slinky Rainbow Besar', 10000, 10, 'https://images.pexels.com/photos/3962335/pexels-photo-3962335.jpeg', (SELECT id FROM categories WHERE name = 'Pegas' LIMIT 1), now(), now()),
  ('Rubik Snake (Ular)', 8500, 10, 'https://images.pexels.com/photos/3814452/pexels-photo-3814452.jpeg', (SELECT id FROM categories WHERE name = 'Puzzle' LIMIT 1), now(), now()),
  ('Gantungan Kunci Squishy', 9000, 10, 'https://images.pexels.com/photos/3820517/pexels-photo-3820517.jpeg', (SELECT id FROM categories WHERE name = 'Sensorik' LIMIT 1), now(), now()),
  ('Mobil-Mobilan Pullback', 10000, 10, 'https://images.pexels.com/photos/3962334/pexels-photo-3962334.jpeg', (SELECT id FROM categories WHERE name = 'Kendaraan' LIMIT 1), now(), now());