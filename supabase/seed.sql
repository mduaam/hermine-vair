-- =============================================================
-- L'HERMINE ET LE VAIR — SEED CATALOG & COMPLIANCE DATA
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zahudflqsbloggswvudz/sql/new
-- (Run this AFTER 01_full_schema.sql)
-- =============================================================

-- ------------------------------------------------------------
-- 1. INVENTORY LOCATION
-- ------------------------------------------------------------

insert into public.inventory_locations (id, name, country) values
  ('20000000-0000-0000-0000-000000000001', 'Atelier Paris — 15 Rue de la Paix', 'FR')
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 2. CATEGORIES
-- ------------------------------------------------------------

-- Level 1: Root categories (Types, Materials, Collections)
insert into public.categories (id, slug, name_fr, name_en, kind, position) values
  ('10000000-0000-0000-0000-000000000001', 'manteaux',     'Manteaux',    'Coats',        'type',     1),
  ('10000000-0000-0000-0000-000000000002', 'gilets',       'Gilets',      'Vests',        'type',     2),
  ('10000000-0000-0000-0000-000000000003', 'capes',        'Capes',       'Capes',        'type',     3),
  ('10000000-0000-0000-0000-000000000004', 'accessoires',  'Accessoires', 'Accessories',  'type',     4),
  ('10000000-0000-0000-0000-000000000005', 'vison',        'Vison',       'Mink',         'material', 5),
  ('10000000-0000-0000-0000-000000000006', 'renard',       'Renard',      'Fox',          'material', 6),
  ('10000000-0000-0000-0000-000000000007', 'chinchilla',   'Chinchilla',  'Chinchilla',   'material', 7),
  ('10000000-0000-0000-0000-000000000008', 'cachemire',    'Cachemire',   'Cashmere',     'material', 8),
  ('10000000-0000-0000-0000-000000000009', 'hiver-2025',   'Hiver 2025',  'Winter 2025',  'season',   9),
  ('10000000-0000-0000-0000-000000000010', 'icones',       'Les Icônes',  'The Icons',    'season',   10)
on conflict (id) do nothing;

-- Level 2: Sub-categories
insert into public.categories (id, slug, name_fr, name_en, parent_id, kind, position) values
  ('10000000-0000-0000-0000-000000000011', 'manteaux-de-fourrure',  'Manteaux de Fourrure',  'Fur Coats',      '10000000-0000-0000-0000-000000000001', 'type', 1),
  ('10000000-0000-0000-0000-000000000012', 'manteaux-en-cachemire', 'Manteaux en Cachemire', 'Cashmere Coats', '10000000-0000-0000-0000-000000000001', 'type', 2)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 3. PRODUCTS
-- ------------------------------------------------------------

insert into public.products (
  id, slug, sku, name_fr, name_en,
  description_fr, description_en,
  category_id, material,
  price_amount, price_currency,
  status, is_best_seller,
  care_instructions_fr, care_instructions_en,
  origin_atelier,
  meta_title_fr, meta_title_en,
  meta_description_fr, meta_description_en
) values
  (
    '30000000-0000-0000-0000-000000000001', 'manteau-vison-noir', 'SKU-VIS-001',
    'Manteau en Vison Noir Impérial', 'Imperial Black Mink Coat',
    'Un manteau d’exception taillé dans le vison le plus soyeux, signé de la main de nos maîtres artisans parisiens. La doublure en soie ivoire révèle l’attention portée à chaque détail.',
    'An exceptional coat cut from the finest silky mink, signed by our Parisian master artisans. The ivory silk lining reveals the attention paid to every detail.',
    '10000000-0000-0000-0000-000000000011', 'vison',
    8900.00, 'EUR',
    'active', true,
    'Confier à un professionnel de la fourrure. Ne pas mouiller. Conserver dans une housse respirante, à l’abri de la lumière.',
    'Entrust to a professional furrier. Do not wet. Store in a breathable garment bag, away from light.',
    'Atelier Paris',
    'Manteau en Vison Noir | L’Hermine et le Vair', 'Black Mink Coat | L’Hermine et le Vair',
    'Manteau en vison noir, créé à la main dans notre atelier parisien. Fourrure d’exception, doublure soie.', 'Black mink coat, handcrafted in our Parisian atelier. Exceptional fur, silk lining.'
  ),
  (
    '30000000-0000-0000-0000-000000000002', 'manteau-vison-cognac', 'SKU-VIS-002',
    'Manteau en Vison Cognac', 'Cognac Mink Coat',
    'La chaleur cuivrée du cognac rencontre la douceur incomparable du vison scandinave. Une pièce intemporelle pour les femmes qui cultivent l’élégance souveraine.',
    'The copper warmth of cognac meets the incomparable softness of Scandinavian mink. A timeless piece for women who cultivate elegance.',
    '10000000-0000-0000-0000-000000000011', 'vison',
    9800.00, 'EUR',
    'active', false,
    'Confier à un professionnel de la fourrure. Sécher naturellement si mouillé.',
    'Entrust to a professional furrier. Dry naturally if wet.',
    'Atelier Paris',
    'Manteau en Vison Cognac | L’Hermine et le Vair', 'Cognac Mink Coat | L’Hermine et le Vair',
    'Manteau en vison cognac, teinte chaude et lumineuse. Artisanat parisien d’exception.', 'Cognac mink coat in a warm and luminous hue. Exceptional Parisian craftsmanship.'
  ),
  (
    '30000000-0000-0000-0000-000000000003', 'gilet-renard-platine', 'SKU-REN-001',
    'Gilet en Renard Platine', 'Platinum Fox Vest',
    'La légèreté du renard platine sublimée en gilet couture. Porté seul sur un chemisier en soie ou sous un manteau d’apparat, cette pièce métamorphose toute silhouette.',
    'The lightness of platinum fox sublimated in a vest. Worn alone over a silk blouse or under a coat, this piece transforms any outfit.',
    '10000000-0000-0000-0000-000000000002', 'renard',
    4800.00, 'EUR',
    'active', true,
    'Confier à un professionnel de la fourrure. Éviter l’humidité prolongée.',
    'Entrust to a professional furrier. Avoid prolonged moisture.',
    'Atelier Paris',
    'Gilet en Renard Platine | L’Hermine et le Vair', 'Platinum Fox Vest | L’Hermine et le Vair',
    'Gilet en renard platine, pièce intemporelle de la maison L’Hermine et le Vair.', 'Platinum fox fur vest, a timeless piece by L’Hermine et le Vair.'
  ),
  (
    '30000000-0000-0000-0000-000000000004', 'cape-renard-blanc', 'SKU-REN-002',
    'Cape en Renard Blanc Boréal', 'Boreal White Fox Cape',
    'La blancheur immaculée du renard arctique, sculptée en cape fluide. Une déclaration de majesté pour les grandes réceptions.',
    'The immaculate whiteness of Arctic fox, sculpted into a fluid cape. A declaration of elegance for special occasions.',
    '10000000-0000-0000-0000-000000000003', 'renard',
    5600.00, 'EUR',
    'active', false,
    'Confier à un professionnel de la fourrure. Conserver sur cintre rembourré.',
    'Entrust to a professional furrier. Never fold — store on a padded hanger.',
    'Atelier Paris',
    'Cape en Renard Blanc | L’Hermine et le Vair', 'White Fox Cape | L’Hermine et le Vair',
    'Cape en renard blanc arctique, élégance pure pour les grandes occasions.', 'White Arctic fox cape, pure elegance for special occasions.'
  ),
  (
    '30000000-0000-0000-0000-000000000005', 'veste-chinchilla', 'SKU-CHI-001',
    'Veste en Chinchilla Impérial', 'Imperial Chinchilla Jacket',
    'La fourrure la plus soyeuse et précieuse au monde, tissée en veste structurée. La légèreté du chinchilla est incomparable ; chaque pièce est unique.',
    'The world’s most precious fur, woven into a structured jacket. The lightness of chinchilla is incomparable; each piece is unique.',
    '10000000-0000-0000-0000-000000000011', 'chinchilla',
    12500.00, 'EUR',
    'active', true,
    'Réservé aux professionnels de la fourrure uniquement. Extrêmement délicat.',
    'Professional furriers only. Extremely delicate.',
    'Atelier Paris',
    'Veste en Chinchilla | L’Hermine et le Vair', 'Chinchilla Jacket | L’Hermine et le Vair',
    'Veste en chinchilla, la fourrure la plus rare et précieuse. Artisanat d’exception, Paris.', 'Chinchilla jacket — the rarest and most precious fur.'
  ),
  (
    '30000000-0000-0000-0000-000000000006', 'etole-chinchilla', 'SKU-CHI-002',
    'Étole d’Apparat en Chinchilla', 'Chinchilla Stole',
    'Une étole en chinchilla pour illuminer une tenue de gala. Posée sur les épaules, elle incarne le sommet du raffinement.',
    'A chinchilla stole to transform an evening outfit into a work of art. Gently draped over the shoulders.',
    '10000000-0000-0000-0000-000000000004', 'chinchilla',
    4200.00, 'EUR',
    'active', false,
    'Réservé aux professionnels. Conserver dans une housse en tissu naturel.',
    'Professional furriers only. Store in a natural fabric garment bag.',
    'Atelier Paris',
    'Étole en Chinchilla | L’Hermine et le Vair', 'Chinchilla Stole | L’Hermine et le Vair',
    'Étole en chinchilla pour soirées d’exception. Douceur souveraine.', 'Chinchilla stole for exceptional evenings.'
  ),
  (
    '30000000-0000-0000-0000-000000000007', 'manteau-cachemire-ivoire', 'SKU-CAS-001',
    'Manteau en Cachemire Double-Face Ivoire', 'Ivory Double-Faced Cashmere Coat',
    'Pur cachemire de Mongolie filé et cousu à la main. L’élégance fluide et la douceur thermique pour celles qui recherchent le luxe discret.',
    'First-quality Gobi cashmere, hand-spun and double-faced. The irreplaceable alternative for quiet luxury.',
    '10000000-0000-0000-0000-000000000012', 'cachemire',
    3400.00, 'EUR',
    'active', true,
    'Nettoyage à sec exclusivement. Repassage doux à la vapeur sans contact direct.',
    'Dry clean only. Gentle steam pressing without direct contact.',
    'Atelier Paris',
    'Manteau en Cachemire Ivoire | L’Hermine et le Vair', 'Ivory Cashmere Coat | L’Hermine et le Vair',
    'Manteau en cachemire ivoire haut de gamme, confectionné en France.', 'High-end ivory cashmere coat, made in France.'
  ),
  (
    '30000000-0000-0000-0000-000000000008', 'cape-cachemire-noir', 'SKU-CAS-002',
    'Cape en Cachemire & Vison Noir', 'Cashmere & Mink Trim Cape',
    'Une cape enveloppante en cachemire noir lourd, bordée d’une passementerie de vison soyeux. L’alliance parfaite du tombé couture et du confort absolu.',
    'An enveloping cape in heavy black cashmere, bordered with silky mink trim.',
    '10000000-0000-0000-0000-000000000003', 'cachemire',
    3900.00, 'EUR',
    'active', false,
    'Nettoyage à sec spécialisé chez un maître fourreur.',
    'Specialist dry clean by a master furrier.',
    'Atelier Paris',
    'Cape en Cachemire & Vison | L’Hermine et le Vair', 'Cashmere & Mink Cape | L’Hermine et le Vair',
    'Cape en cachemire et vison, élégance souveraine pour la saison fraîche.', 'Cashmere and mink cape, royal elegance for the cool season.'
  )
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 4. PRODUCT VARIANTS (Sizes 36, 38, 40, 42)
-- ------------------------------------------------------------

insert into public.product_variants (id, product_id, size, sku, stock_quantity) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '36', 'SKU-VIS-001-36', 2),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '38', 'SKU-VIS-001-38', 3),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '40', 'SKU-VIS-001-40', 1),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', '42', 'SKU-VIS-001-42', 1),

  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', '36', 'SKU-VIS-002-36', 1),
  ('40000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000002', '38', 'SKU-VIS-002-38', 2),
  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000002', '40', 'SKU-VIS-002-40', 1),

  ('40000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000003', '36', 'SKU-REN-001-36', 2),
  ('40000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000003', '38', 'SKU-REN-001-38', 3),
  ('40000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000003', '40', 'SKU-REN-001-40', 1),

  ('40000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000004', 'TU', 'SKU-REN-002-TU', 3),

  ('40000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000005', '36', 'SKU-CHI-001-36', 1),
  ('40000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000005', '38', 'SKU-CHI-001-38', 1),
  ('40000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000005', '40', 'SKU-CHI-001-40', 1),

  ('40000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000006', 'TU', 'SKU-CHI-002-TU', 4),

  ('40000000-0000-0000-0000-000000000016', '30000000-0000-0000-0000-000000000007', '36', 'SKU-CAS-001-36', 3),
  ('40000000-0000-0000-0000-000000000017', '30000000-0000-0000-0000-000000000007', '38', 'SKU-CAS-001-38', 4),
  ('40000000-0000-0000-0000-000000000018', '30000000-0000-0000-0000-000000000007', '40', 'SKU-CAS-001-40', 2),

  ('40000000-0000-0000-0000-000000000019', '30000000-0000-0000-0000-000000000008', 'TU', 'SKU-CAS-002-TU', 3)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 5. PRODUCT IMAGES
-- ------------------------------------------------------------

insert into public.product_images (id, product_id, url, alt_text_fr, alt_text_en, position) values
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', 'Manteau en vison noir impérial face', 'Imperial black mink coat front view', 1),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', 'Manteau en vison noir impérial profil', 'Imperial black mink coat profile', 2),

  ('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', 'Manteau en vison cognac', 'Cognac mink coat front', 1),
  ('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', 'Manteau en vison cognac dos', 'Cognac mink coat back', 2),

  ('50000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop', 'Gilet en renard platine', 'Platinum fox vest', 1),
  ('50000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', 'Gilet en renard platine détail poil', 'Platinum fox vest fur detail', 2),

  ('50000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', 'Cape en renard blanc boréal', 'White fox cape', 1),
  ('50000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', 'Cape en renard blanc tombé', 'White fox cape drape', 2),

  ('50000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop', 'Veste en chinchilla impérial', 'Chinchilla jacket front', 1),
  ('50000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', 'Veste en chinchilla détail col', 'Chinchilla jacket collar', 2),

  ('50000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1200&auto=format&fit=crop', 'Étole en chinchilla', 'Chinchilla stole drape', 1),
  ('50000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', 'Étole en chinchilla portée soirée', 'Chinchilla stole evening', 2),

  ('50000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop', 'Manteau en cachemire ivoire', 'Ivory cashmere coat front', 1),
  ('50000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', 'Manteau en cachemire ivoire détail ceinture', 'Ivory cashmere coat belt', 2),

  ('50000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', 'Cape en cachemire & vison', 'Cashmere & mink cape', 1),
  ('50000000-0000-0000-0000-000000000016', '30000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', 'Cape en cachemire & vison dos', 'Cashmere & mink cape back', 2)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 6. REGIONAL COMPLIANCE RULES
-- ------------------------------------------------------------

insert into public.region_rules (country_code, fur_sales_allowed, currency, default_locale, duties_note_fr, duties_note_en) values
  ('FR', true,  'EUR', 'fr', 'TVA 20% incluse. Livraison offerte.', '20% VAT included. Complimentary courier delivery.'),
  ('MC', true,  'EUR', 'fr', 'TVA incluse. Livraison dédiée.', 'VAT included. Dedicated courier delivery.'),
  ('US', true,  'USD', 'en', 'Droits de douane calculés au paiement (DDP).', 'Duties & taxes calculated at checkout (DDP).'),
  ('GB', true,  'GBP', 'en', 'TVA UK incluse. Transporteur sécurisé.', 'UK VAT included. Insured courier delivery.'),
  ('IT', true,  'EUR', 'en', 'TVA 22% incluse. Livraison offerte.', '22% VAT included. Complimentary delivery.'),
  ('DE', true,  'EUR', 'en', 'TVA 19% incluse. Livraison offerte.', '19% VAT included. Complimentary delivery.'),
  ('CH', true,  'CHF', 'fr', 'Dédouanement et taxes inclus.', 'Customs clearance and taxes included.'),
  ('AE', true,  'USD', 'en', 'Livraison privée sécurisée vers Dubaï et Abu Dhabi.', 'Private secure delivery to Dubai and Abu Dhabi.'),
  ('JP', true,  'JPY', 'en', 'Livraison express assurée vers Tokyo.', 'Insured express courier delivery to Tokyo.')
on conflict (country_code) do nothing;

-- ------------------------------------------------------------
-- 7. INITIAL DISCOUNT
-- ------------------------------------------------------------

insert into public.discounts (code, type, value, min_order_amount, applies_to, active) values
  ('BIENVENUE10', 'percentage', 10.00, 1000.00, 'all', true)
on conflict (code) do nothing;
