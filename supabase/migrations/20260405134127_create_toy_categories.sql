/*
  # Create toy store categories

  1. New Categories
    - Fisik - Physical/Building toys
    - Klasik - Classic toys
    - Koleksi - Collectible items
    - Kreatif - Creative toys
    - Aksesori - Accessories
    - Skill - Skill-building toys
    - Sains - Science toys
    - Kartu - Card games
    - Outdoor - Outdoor toys
    - Tradisional - Traditional toys
    - Sensorik - Sensory toys
    - Board Game - Board games
    - Pegas - Spring/coil toys
    - DIY - DIY toys
    - Seni - Art/craft toys
    - Kompetisi - Competitive toys
    - Puzzle - Puzzle toys
    - Kendaraan - Vehicle toys
*/

INSERT INTO categories (name, description, created_at, updated_at)
VALUES
  ('Fisik', 'Mainan fisik dan bangunan', now(), now()),
  ('Klasik', 'Mainan klasik jadul', now(), now()),
  ('Koleksi', 'Item koleksi', now(), now()),
  ('Kreatif', 'Mainan kreatif', now(), now()),
  ('Aksesori', 'Aksesori mainan', now(), now()),
  ('Skill', 'Mainan pengembang keterampilan', now(), now()),
  ('Sains', 'Mainan sains dan edukasi', now(), now()),
  ('Kartu', 'Permainan kartu', now(), now()),
  ('Outdoor', 'Mainan outdoor', now(), now()),
  ('Tradisional', 'Mainan tradisional', now(), now()),
  ('Sensorik', 'Mainan sensorik', now(), now()),
  ('Board Game', 'Permainan papan', now(), now()),
  ('Pegas', 'Mainan dengan pegas/spring', now(), now()),
  ('DIY', 'Mainan DIY', now(), now()),
  ('Seni', 'Mainan seni dan kreatif', now(), now()),
  ('Kompetisi', 'Mainan kompetisi', now(), now()),
  ('Puzzle', 'Puzzle dan mainan puzzle', now(), now()),
  ('Kendaraan', 'Mainan kendaraan', now(), now())
ON CONFLICT (name) DO NOTHING;