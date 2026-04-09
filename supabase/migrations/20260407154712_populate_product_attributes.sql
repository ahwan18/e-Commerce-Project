/*
  # Populate product attributes based on product names

  1. Material Mapping
  2. Gender Theme Assignment
  3. Movement Type Classification
  4. Size Categorization
  5. Tags Assignment
*/

UPDATE products
SET material = CASE
  WHEN name ILIKE '%plastik%' THEN 'plastik'
  WHEN name ILIKE '%bambu%' THEN 'bambu'
  WHEN name ILIKE '%kertas%' THEN 'kertas'
  WHEN name ILIKE '%gabus%' THEN 'gabus'
  WHEN name ILIKE '%kain%' THEN 'kain'
  WHEN name ILIKE '%kayu%' THEN 'kayu'
  WHEN name ILIKE '%logam%' OR name ILIKE '%besi%' THEN 'logam'
  ELSE 'campuran'
END
WHERE material = '';

UPDATE products
SET movement_type = CASE
  WHEN name ILIKE '%pegas%' OR name ILIKE '%spring%' THEN 'pegas'
  WHEN name ILIKE '%pullback%' OR name ILIKE '%tarik%' THEN 'pullback'
  WHEN name ILIKE '%terbang%' OR name ILIKE '%parasut%' OR name ILIKE '%terjun%' THEN 'air'
  WHEN name ILIKE '%yoyo%' OR name ILIKE '%latto%' OR name ILIKE '%gelang%' THEN 'manual'
  WHEN name ILIKE '%permainan%' OR name ILIKE '%kartu%' OR name ILIKE '%ular tangga%' THEN 'manual'
  ELSE 'manual'
END
WHERE movement_type = 'manual';

UPDATE products
SET size = CASE
  WHEN name ILIKE '%mini%' OR name ILIKE '%kecil%' OR name ILIKE '%gantungan%' THEN 'saku'
  WHEN name ILIKE '%kantong%' OR name ILIKE '%cup%' THEN 'kecil'
  WHEN name ILIKE '%besar%' OR name ILIKE '%set%' THEN 'sedang'
  ELSE 'sedang'
END
WHERE size = 'sedang';

UPDATE products
SET gender_theme = CASE
  WHEN name ILIKE '%perempuan%' OR name ILIKE '%dress%' OR name ILIKE '%princess%' THEN 'perempuan'
  WHEN name ILIKE '%laki%' OR name ILIKE '%beyblade%' OR name ILIKE '%robot%' THEN 'laki-laki'
  ELSE 'unisex'
END
WHERE gender_theme = 'unisex';

UPDATE products
SET tags = CASE
  WHEN name ILIKE '%yoyo%' THEN 'skill,tradisional'
  WHEN name ILIKE '%latto%' THEN 'skill,tradisional,manual'
  WHEN name ILIKE '%slime%' THEN 'sensorik,sensasi'
  WHEN name ILIKE '%pop it%' THEN 'sensorik,fidget,stress'
  WHEN name ILIKE '%squishy%' THEN 'sensorik,fidget'
  WHEN name ILIKE '%rubik%' THEN 'puzzle,logika,edukasi'
  WHEN name ILIKE '%beyblade%' THEN 'kompetisi,skill,aksion'
  WHEN name ILIKE '%slap bracelet%' OR name ILIKE '%gelang%' THEN 'aksesori,fashion'
  WHEN name ILIKE '%kartu%' THEN 'kartu,permainan,tradisional'
  WHEN name ILIKE '%ular tangga%' THEN 'board game,keluarga,edukasi'
  WHEN name ILIKE '%pesawat%' OR name ILIKE '%glider%' THEN 'diy,fisik,ketangkasan'
  WHEN name ILIKE '%gelembung%' THEN 'outdoor,mainan gelembung'
  WHEN name ILIKE '%balon%' THEN 'klasik,outdoor,sedotan'
  WHEN name ILIKE '%gundu%' OR name ILIKE '%kelereng%' THEN 'tradisional,permainan klasik'
  WHEN name ILIKE '%penghapus%' THEN 'koleksi,aksesori,karakter'
  WHEN name ILIKE '%tato%' THEN 'seni,temporary,transfer'
  WHEN name ILIKE '%kipas%' THEN 'aksesori,fashion,koleksi'
  WHEN name ILIKE '%mobil%' THEN 'kendaraan,mainan mobil,pullback'
  WHEN name ILIKE '%slinky%' THEN 'pegas,klasik,permainan'
  WHEN name ILIKE '%mainan per%' THEN 'pegas,permainan,klasik'
  WHEN name ILIKE '%stiker%' THEN 'kreatif,seni,ganti baju'
  WHEN name ILIKE '%baling%' THEN 'fisik,ketangkasan,mainan tradisional'
  WHEN name ILIKE '%pohon natal%' THEN 'sains,edukasi,magic,growing'
  WHEN name ILIKE '%parasut%' THEN 'fisik,ketangkasan,outdoor'
  WHEN name ILIKE '%rendaman%' THEN 'sains,edukasi,mainan air'
  ELSE ''
END
WHERE tags = '';