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
-- 2. CATEGORIES (Taxonomy with Dual-Language Slugs)
-- ------------------------------------------------------------

-- Level 1: Root & Materials
insert into public.categories (id, slug, slug_en, name_fr, name_en, kind, position) values
  ('10000000-0000-0000-0000-000000000001', 'manteaux',    'coats',       'Manteaux',    'Coats',        'type',     1),
  ('10000000-0000-0000-0000-000000000002', 'gilets',      'vests',       'Gilets',      'Vests',        'type',     2),
  ('10000000-0000-0000-0000-000000000003', 'capes',       'capes',       'Capes',       'Capes',        'type',     3),
  ('10000000-0000-0000-0000-000000000004', 'accessoires', 'accessories', 'Accessoires', 'Accessories',  'type',     4),
  ('10000000-0000-0000-0000-000000000005', 'vison',       'mink',        'Vison',       'Mink',         'material', 5),
  ('10000000-0000-0000-0000-000000000006', 'renard',      'fox',         'Renard',      'Fox',          'material', 6),
  ('10000000-0000-0000-0000-000000000007', 'chinchilla',  'chinchilla',  'Chinchilla',  'Chinchilla',   'material', 7),
  ('10000000-0000-0000-0000-000000000008', 'cachemire',   'cashmere',    'Cachemire',   'Cashmere',     'material', 8),
  ('10000000-0000-0000-0000-000000000009', 'hiver-2025',  'winter-2025', 'Hiver 2025',  'Winter 2025',  'season',   9),
  ('10000000-0000-0000-0000-000000000010', 'icones',      'icons',       'Les Icônes',  'The Icons',    'season',   10)
on conflict (id) do update set
  slug_en = excluded.slug_en,
  name_fr = excluded.name_fr,
  name_en = excluded.name_en;

-- Level 2: Sub-categories & Collections (13 target categories)
insert into public.categories (id, slug, slug_en, name_fr, name_en, parent_id, kind, position) values
  ('10000000-0000-0000-0000-000000000011', 'manteaux-de-fourrure',  'fur-coats',              'Manteaux de Fourrure',  'Fur Coats',              '10000000-0000-0000-0000-000000000001', 'type', 1),
  ('10000000-0000-0000-0000-000000000012', 'manteaux-en-cachemire', 'cashmere-coats',         'Manteaux en Cachemire', 'Cashmere Coats',         '10000000-0000-0000-0000-000000000001', 'type', 2),
  ('10000000-0000-0000-0000-000000000021', 'manteau-fourrure-femme',   'womens-fur-coat',        'Manteau Fourrure Femme',   'Women''s Fur Coat',        null, 'type', 21),
  ('10000000-0000-0000-0000-000000000022', 'veste-fourrure-femme',     'womens-fur-jacket',      'Veste Fourrure Femme',     'Women''s Fur Jacket',      null, 'type', 22),
  ('10000000-0000-0000-0000-000000000023', 'gilet-fourrure-femme',     'womens-fur-vest',        'Gilet Fourrure Femme',     'Women''s Fur Vest',        null, 'type', 23),
  ('10000000-0000-0000-0000-000000000024', 'doudoune-fourrure-femme',  'womens-fur-down-jacket', 'Doudoune Fourrure Femme',  'Women''s Fur Down Jacket', null, 'type', 24),
  ('10000000-0000-0000-0000-000000000025', 'parka-fourrure-femme',     'womens-fur-parka',       'Parka Fourrure Femme',     'Women''s Fur Parka',       null, 'type', 25),
  ('10000000-0000-0000-0000-000000000026', 'blouson-fourrure-femme',   'womens-fur-bomber',      'Blouson Fourrure Femme',   'Women''s Fur Bomber',      null, 'type', 26),
  ('10000000-0000-0000-0000-000000000027', 'bolero-en-fourrure',       'fur-bolero',             'Boléro en Fourrure',       'Fur Bolero',               null, 'type', 27),
  ('10000000-0000-0000-0000-000000000028', 'cape-fourrure-femme',      'womens-fur-cape',        'Cape Fourrure Femme',      'Women''s Fur Cape',        null, 'type', 28),
  ('10000000-0000-0000-0000-000000000031', 'chapeau-fourrure-femme',   'womens-fur-hat',         'Chapeau Fourrure Femme',   'Women''s Fur Hat',         '10000000-0000-0000-0000-000000000004', 'type', 31),
  ('10000000-0000-0000-0000-000000000032', 'toque-fourrure-femme',     'womens-fur-toque',       'Toque Fourrure Femme',     'Women''s Fur Toque',       '10000000-0000-0000-0000-000000000004', 'type', 32),
  ('10000000-0000-0000-0000-000000000033', 'bandeau-en-fourrure',       'fur-headband',           'Bandeau en Fourrure',      'Fur Headband',             '10000000-0000-0000-0000-000000000004', 'type', 33),
  ('10000000-0000-0000-0000-000000000034', 'bonnet-fourrure-femme',    'womens-fur-beanie',      'Bonnet Fourrure Femme',    'Women''s Fur Beanie',      '10000000-0000-0000-0000-000000000004', 'type', 34),
  ('10000000-0000-0000-0000-000000000035', 'chapka-fourrure-femme',    'womens-fur-chapka',      'Chapka Fourrure Femme',    'Women''s Fur Chapka',      '10000000-0000-0000-0000-000000000004', 'type', 35)
on conflict (id) do update set
  slug_en   = excluded.slug_en,
  name_fr   = excluded.name_fr,
  name_en   = excluded.name_en,
  parent_id = excluded.parent_id,
  kind      = excluded.kind,
  position  = excluded.position;

-- ------------------------------------------------------------
-- 3. PRODUCTS (18 Products across all 13 categories)
-- ------------------------------------------------------------

insert into public.products (
  id, slug, slug_en, sku, name_fr, name_en,
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
    '30000000-0000-0000-0000-000000000001', 'manteau-vison-noir', 'black-mink-coat', 'SKU-VIS-001',
    'Manteau en Vison Noir Impérial', 'Imperial Black Mink Coat',
    'Un manteau d’exception taillé dans le vison le plus soyeux, signé de la main de nos maîtres artisans parisiens. La doublure en soie ivoire révèle l’attention portée à chaque détail.', 'An exceptional coat cut from the finest silky mink, signed by our Parisian master artisans. The ivory silk lining reveals the attention paid to every detail.',
    '10000000-0000-0000-0000-000000000021', 'vison',
    8900.00, 'EUR',
    'active', true,
    'Confier à un professionnel de la fourrure. Ne pas mouiller. Conserver dans une housse respirante.', 'Entrust to a professional furrier. Do not wet. Store in a breathable garment bag.',
    'Atelier Paris',
    'Manteau en Vison Noir | L’Hermine et le Vair', 'Black Mink Coat | L’Hermine et le Vair',
    'Manteau en vison noir d''exception, créé à la main dans notre atelier parisien. Doublure soie.', 'Exceptional black mink coat, handcrafted in our Parisian atelier. Silk lining.'
  ),
  (
    '30000000-0000-0000-0000-000000000002', 'manteau-vison-cognac', 'cognac-mink-coat', 'SKU-VIS-002',
    'Manteau en Vison Cognac', 'Cognac Mink Coat',
    'La chaleur cuivrée du cognac rencontre la douceur incomparable du vison scandinave. Une pièce intemporelle pour les femmes qui cultivent l’élégance souveraine.', 'The copper warmth of cognac meets the incomparable softness of Scandinavian mink. A timeless piece for women who cultivate elegance.',
    '10000000-0000-0000-0000-000000000021', 'vison',
    9800.00, 'EUR',
    'active', false,
    'Confier à un professionnel de la fourrure. Sécher naturellement si mouillé.', 'Entrust to a professional furrier. Dry naturally if wet.',
    'Atelier Paris',
    'Manteau en Vison Cognac | L’Hermine et le Vair', 'Cognac Mink Coat | L’Hermine et le Vair',
    'Manteau en vison cognac, teinte chaude et lumineuse. Artisanat d''exception parisien.', 'Cognac mink coat in a warm and luminous hue. Exceptional Parisian craftsmanship.'
  ),
  (
    '30000000-0000-0000-0000-000000000005', 'veste-chinchilla', 'chinchilla-jacket', 'SKU-CHI-001',
    'Veste en Chinchilla Impérial', 'Imperial Chinchilla Jacket',
    'La fourrure la plus soyeuse et précieuse au monde, tissée en veste structurée. La légèreté du chinchilla est incomparable ; chaque pièce est unique.', 'The world’s most precious fur, woven into a structured jacket. The lightness of chinchilla is incomparable; each piece is unique.',
    '10000000-0000-0000-0000-000000000022', 'chinchilla',
    12500.00, 'EUR',
    'active', true,
    'Réservé aux professionnels de la fourrure uniquement. Extrêmement délicat.', 'Professional furriers only. Extremely delicate.',
    'Atelier Paris',
    'Veste en Chinchilla | L’Hermine et le Vair', 'Chinchilla Jacket | L’Hermine et le Vair',
    'Veste en chinchilla, la fourrure la plus rare et précieuse. Artisanat d''art, Paris.', 'Chinchilla jacket, the rarest and most precious fur. High craftsmanship, Paris.'
  ),
  (
    '30000000-0000-0000-0000-000000000022', 'veste-renard-dore', 'golden-fox-jacket', 'SKU-REN-003',
    'Veste Cintrée en Renard Doré', 'Tailored Golden Fox Jacket',
    'Coupe cintrée contemporaine taillée dans un somptueux renard doré aux reflets ambrés. Col tailleur montant et finitions cuir nappa.', 'Contemporary tailored cut in sumptuous golden fox with amber highlights. Stand collar and nappa leather detailing.',
    '10000000-0000-0000-0000-000000000022', 'renard',
    6800.00, 'EUR',
    'active', false,
    'Nettoyage chez un maître fourreur agréé. Conserver sur cintre large.', 'Specialist cleaning by an authorized master furrier. Store on a broad hanger.',
    'Atelier Paris',
    'Veste en Renard Doré | L’Hermine et le Vair', 'Golden Fox Jacket | L’Hermine et le Vair',
    'Veste haute couture en renard doré cintrée. Nuances ambrées et finitions nappa.', 'Tailored golden fox couture jacket. Amber hues with refined nappa accents.'
  ),
  (
    '30000000-0000-0000-0000-000000000003', 'gilet-renard-platine', 'platinum-fox-vest', 'SKU-REN-001',
    'Gilet en Renard Platine', 'Platinum Fox Vest',
    'La légèreté du renard platine sublimée en gilet couture. Porté seul sur un chemisier en soie ou sous un manteau d’apparat, cette pièce métamorphose toute silhouette.', 'The lightness of platinum fox sublimated in a vest. Worn alone over a silk blouse or under a coat, this piece transforms any outfit.',
    '10000000-0000-0000-0000-000000000023', 'renard',
    4800.00, 'EUR',
    'active', true,
    'Confier à un professionnel de la fourrure. Éviter l’humidité prolongée.', 'Entrust to a professional furrier. Avoid prolonged moisture.',
    'Atelier Paris',
    'Gilet en Renard Platine | L’Hermine et le Vair', 'Platinum Fox Vest | L’Hermine et le Vair',
    'Gilet en renard platine, pièce intemporelle de la maison L’Hermine et le Vair.', 'Platinum fox fur vest, a timeless piece by L’Hermine et le Vair.'
  ),
  (
    '30000000-0000-0000-0000-000000000023', 'gilet-vison-saphir', 'sapphire-mink-vest', 'SKU-VIS-003',
    'Gilet Long en Vison Saphir', 'Sapphire Mink Long Vest',
    'Gilet sans manches long en vison bleu saphir d’élevage scandinave certifié. Coupe droite architecturale rehaussée de poches dissimulées.', 'Sleeveless long vest in certified Scandinavian sapphire blue mink. Architectural straight cut with concealed pockets.',
    '10000000-0000-0000-0000-000000000023', 'vison',
    5200.00, 'EUR',
    'active', false,
    'Nettoyage professionnel de la fourrure uniquement. Aérer à l''ombre.', 'Professional fur clean only. Air dry in the shade.',
    'Atelier Paris',
    'Gilet Long en Vison Saphir | L’Hermine et le Vair', 'Sapphire Mink Long Vest | L’Hermine et le Vair',
    'Gilet long en vison saphir scandinave. Allure architecturale et pureté des lignes.', 'Long vest in Scandinavian sapphire mink. Architectural lines and quiet luxury.'
  ),
  (
    '30000000-0000-0000-0000-000000000024', 'doudoune-duvet-vison', 'mink-trimmed-down-jacket', 'SKU-DOU-001',
    'Doudoune Soie & Vison Impérial', 'Silk & Imperial Mink Down Jacket',
    'Doudoune matelassée en faille de soie hydrofuge, garnie de duvet d''oie blanc immaculé et couronnée d''un col châle amovible en vison impérial.', 'Water-repellent silk faille quilted down jacket, padded with pure white goose down and finished with a detachable imperial mink shawl collar.',
    '10000000-0000-0000-0000-000000000024', 'vison',
    6400.00, 'EUR',
    'active', true,
    'Détacher le col fourrure avant tout entretien textile spécialisé.', 'Detach fur collar prior to specialized textile dry cleaning.',
    'Atelier Paris',
    'Doudoune Soie & Vison | L’Hermine et le Vair', 'Silk & Mink Down Jacket | L’Hermine et le Vair',
    'Doudoune en faille de soie et col vison amovible. Duvet blanc et élégance hivernale.', 'Water-repellent silk down jacket with detachable mink collar. Pure winter luxury.'
  ),
  (
    '30000000-0000-0000-0000-000000000025', 'parka-grand-froid-renard', 'fox-lined-winter-parka', 'SKU-PAR-001',
    'Parka Grand Froid Doublée Renard', 'Sub-Zero Fox-Lined Parka',
    'Parka technique en gabardine de coton enduite imperméable, entièrement doublée d''une fourrure de renard argenté amovible. Conçue pour affronter les hivers les plus rigoureux avec panache.', 'Technical weatherproof coated cotton gabardine parka, fully lined with detachable silver fox fur. Engineered for severe winter climates with absolute elegance.',
    '10000000-0000-0000-0000-000000000025', 'renard',
    7200.00, 'EUR',
    'active', true,
    'Nettoyage à sec spécialisé. Retirer la doublure en fourrure avant entretien.', 'Specialist dry clean. Remove fur lining before garment care.',
    'Atelier Paris',
    'Parka Doublée Renard Argenté | L’Hermine et le Vair', 'Fox-Lined Winter Parka | L’Hermine et le Vair',
    'Parka grand froid doublée en renard argenté. Gabardine technique imperméable.', 'Weatherproof technical parka lined with detachable silver fox fur. Alpine luxury.'
  ),
  (
    '30000000-0000-0000-0000-000000000026', 'blouson-court-vison-noir', 'cropped-black-mink-bomber', 'SKU-BLO-001',
    'Blouson Bomber en Vison Noir', 'Cropped Black Mink Bomber Jacket',
    'Réinterprétation haute couture du bomber : vison rasé noir mat rehaussé de bord-côtes en cachemire tricoté main et zip double curseur en laiton doré.', 'Haute couture bomber reinterpretation: sheared black mink complemented by hand-knit cashmere ribbing and double gold-finish brass zip.',
    '10000000-0000-0000-0000-000000000026', 'vison',
    8200.00, 'EUR',
    'active', false,
    'Confier exclusivement à un spécialiste fourrure. Ne pas repasser.', 'Entrust exclusively to a fur specialist. Do not iron.',
    'Atelier Paris',
    'Blouson Bomber en Vison Noir | L’Hermine et le Vair', 'Cropped Black Mink Bomber | L’Hermine et le Vair',
    'Bomber de luxe en vison rasé noir et cachemire tricoté main. Zip or brossé.', 'Luxury sheared black mink bomber with hand-knit cashmere trim. Brushed gold zip.'
  ),
  (
    '30000000-0000-0000-0000-000000000006', 'etole-chinchilla', 'chinchilla-stole', 'SKU-CHI-002',
    'Étole d’Apparat en Chinchilla', 'Chinchilla Evening Stole',
    'Une étole en chinchilla pour illuminer une tenue de gala. Posée sur les épaules, elle incarne le sommet du raffinement.', 'A chinchilla stole to transform an evening outfit into a work of art. Gently draped over the shoulders.',
    '10000000-0000-0000-0000-000000000027', 'chinchilla',
    4200.00, 'EUR',
    'active', false,
    'Réservé aux professionnels. Conserver dans une housse en tissu naturel.', 'Professional furriers only. Store in a natural fabric garment bag.',
    'Atelier Paris',
    'Étole en Chinchilla | L’Hermine et le Vair', 'Chinchilla Stole | L’Hermine et le Vair',
    'Étole en chinchilla pour soirées d’exception. Douceur souveraine.', 'Chinchilla stole for exceptional evenings.'
  ),
  (
    '30000000-0000-0000-0000-000000000027', 'bolero-fourrure-vison-ivoire', 'ivory-mink-bolero', 'SKU-BOL-001',
    'Boléro en Vison Blanc Pur', 'Pure White Mink Bolero',
    'Boléro court pour robe de mariée ou de soirée, façonné en vison blanc immaculé. Manches trois-quarts et fermeture aimantée invisible.', 'Cropped bolero for bridal or evening gowns, crafted in pure white mink. Three-quarter sleeves and invisible magnetic closure.',
    '10000000-0000-0000-0000-000000000027', 'vison',
    5400.00, 'EUR',
    'active', true,
    'Conserver à l''abri de la lumière naturelle. Nettoyage professionnel spécialisé.', 'Store away from natural light. Specialist professional cleaning only.',
    'Atelier Paris',
    'Boléro en Vison Blanc Pur | L’Hermine et le Vair', 'Pure White Mink Bolero | L’Hermine et le Vair',
    'Boléro en vison blanc pur pour mariée et soirées d''apparat. Manches trois-quarts.', 'Pure white mink bridal and evening bolero. Three-quarter sleeves, magnetic clasp.'
  ),
  (
    '30000000-0000-0000-0000-000000000004', 'cape-renard-blanc', 'white-fox-cape', 'SKU-REN-002',
    'Cape en Renard Blanc Boréal', 'Boreal White Fox Cape',
    'La blancheur immaculée du renard arctique, sculptée en cape fluide. Une déclaration de majesté pour les grandes réceptions.', 'The immaculate whiteness of Arctic fox, sculpted into a fluid cape. A declaration of elegance for special occasions.',
    '10000000-0000-0000-0000-000000000028', 'renard',
    5600.00, 'EUR',
    'active', false,
    'Confier à un professionnel de la fourrure. Conserver sur cintre rembourré.', 'Entrust to a professional furrier. Never fold — store on a padded hanger.',
    'Atelier Paris',
    'Cape en Renard Blanc | L’Hermine et le Vair', 'White Fox Cape | L’Hermine et le Vair',
    'Cape en renard blanc arctique, élégance pure pour les grandes occasions.', 'White Arctic fox cape, pure elegance for special occasions.'
  ),
  (
    '30000000-0000-0000-0000-000000000028', 'cape-cachemire-chinchilla-royale', 'royal-cashmere-chinchilla-cape', 'SKU-CAP-001',
    'Cape Cachemire & Col Chinchilla', 'Royal Cashmere & Chinchilla Cape',
    'Drap de cachemire double-face noir impérial bordé d’un opulent col en chinchilla. L’accord suprême de la légèreté et de la volupté.', 'Double-faced imperial black cashmere fabric edged with an opulent chinchilla collar. The supreme harmony of lightness and warmth.',
    '10000000-0000-0000-0000-000000000028', 'cachemire',
    7900.00, 'EUR',
    'active', true,
    'Nettoyage chez un spécialiste haute fourrure uniquement.', 'Cleaning by a high fur specialist exclusively.',
    'Atelier Paris',
    'Cape Cachemire & Col Chinchilla | L’Hermine et le Vair', 'Royal Cashmere & Chinchilla Cape | L’Hermine et le Vair',
    'Cape en drap de cachemire noir et col chinchilla impérial. Tombé majestueux.', 'Black cashmere cape with imperial chinchilla collar. Majestic drape and feel.'
  ),
  (
    '30000000-0000-0000-0000-000000000031', 'chapeau-cloche-vison-noir', 'black-mink-cloche-hat', 'SKU-ACC-001',
    'Chapeau Cloche en Vison Noir', 'Black Mink Cloche Hat',
    'Inspiré des années folles, ce chapeau cloche en vison rasé noir sublime le port de tête. Doublure soie satinée et ruban gros-grain discret.', 'Inspired by the Roaring Twenties, this sheared black mink cloche hat elevates any silhouette. Satin silk lining and subtle grosgrain band.',
    '10000000-0000-0000-0000-000000000031', 'vison',
    1450.00, 'EUR',
    'active', false,
    'Conserver dans sa boîte à chapeau d''origine avec forme adaptée.', 'Store in its original hatbox with proper shaping support.',
    'Atelier Paris',
    'Chapeau Cloche en Vison Noir | L’Hermine et le Vair', 'Black Mink Cloche Hat | L’Hermine et le Vair',
    'Chapeau cloche en vison noir rasé et doublure soie. Élégance intemporelle.', 'Sheared black mink cloche hat with satin silk lining. Timeless Parisian style.'
  ),
  (
    '30000000-0000-0000-0000-000000000032', 'toque-imperiale-vison-noir', 'imperial-black-mink-toque', 'SKU-ACC-002',
    'Toque Impériale en Vison Noir', 'Imperial Black Mink Toque',
    'Toque cylindrique majestueuse en vison d''élevage sélectionné. Doublée de soie matelassée pour une isolation thermique parfaite et un maintien impérial.', 'Stately cylindrical toque in premium selected mink. Quilted silk lining for superior thermal comfort and regal presence.',
    '10000000-0000-0000-0000-000000000032', 'vison',
    1850.00, 'EUR',
    'active', true,
    'Brosser délicatement dans le sens du poil avec une brosse en poils naturels.', 'Brush gently along the fur grain with a natural bristle brush.',
    'Atelier Paris',
    'Toque Impériale en Vison Noir | L’Hermine et le Vair', 'Imperial Black Mink Toque | L’Hermine et le Vair',
    'Toque impériale en vison noir d''exception doublée soie matelassée.', 'Imperial black mink toque with quilted silk lining. Regal winter headwear.'
  ),
  (
    '30000000-0000-0000-0000-000000000033', 'bandeau-fourrure-renard-argente', 'silver-fox-fur-headband', 'SKU-ACC-003',
    'Bandeau en Renard Argenté', 'Silver Fox Fur Headband',
    'Bandeau d''hiver luxueux en renard argenté aux longues soies chatoyantes. Élastique ajustable dissimulé sous un ruban de velours de soie noir.', 'Luxurious winter headband in silver fox with shimmering long guard hairs. Adjustable stretch band concealed under black silk velvet.',
    '10000000-0000-0000-0000-000000000033', 'renard',
    950.00, 'EUR',
    'active', false,
    'Secouer doucement pour regonfler le poil après usage. Éviter la pluie.', 'Shake gently to fluff fur after wear. Avoid rain and heavy humidity.',
    'Atelier Paris',
    'Bandeau en Renard Argenté | L’Hermine et le Vair', 'Silver Fox Fur Headband | L’Hermine et le Vair',
    'Bandeau de luxe en renard argenté et velours de soie. Confort alpin raffiné.', 'Luxury silver fox and silk velvet headband. Alpine chic and warmth.'
  ),
  (
    '30000000-0000-0000-0000-000000000034', 'bonnet-cachemire-pompon-renard', 'cashmere-beanie-fox-pompon', 'SKU-ACC-004',
    'Bonnet Cachemire & Pompon Renard', 'Cashmere Beanie with Fox Pompon',
    'Tricoté en côte anglaise dans un pur cachemire 4 fils ultra-doux, ce bonnet d''hiver est surmonté d''un généreux pompon amovible en renard arctique blanc.', 'Rib-knitted in ultra-soft 4-ply pure cashmere, this winter beanie is crowned with a generous detachable Arctic white fox pompon.',
    '10000000-0000-0000-0000-000000000034', 'cachemire',
    580.00, 'EUR',
    'active', true,
    'Détacher le pompon avant lavage du bonnet à la main à l''eau froide.', 'Detach the pompon before washing the cashmere beanie by hand in cold water.',
    'Atelier Paris',
    'Bonnet Cachemire & Pompon Renard | L’Hermine et le Vair', 'Cashmere Beanie & Fox Pompon | L’Hermine et le Vair',
    'Bonnet en pur cachemire 4 fils avec pompon amovible en renard arctique.', 'Pure 4-ply cashmere beanie with detachable Arctic fox pompon.'
  ),
  (
    '30000000-0000-0000-0000-000000000035', 'chapka-vison-cuir-noir', 'mink-and-leather-ushanka', 'SKU-ACC-005',
    'Chapka d’Exception Vison & Nappa', 'Exceptional Mink & Nappa Ushanka',
    'Chapka traditionnelle réinventée en cuir d''agneau plongé nappa souple et vison noir impérial. Rabats modulables attachables par brides en cuir à boucle dorée.', 'Traditional ushanka reinvented in supple plunged nappa lambskin and imperial black mink. Modular ear flaps with gold-buckled leather straps.',
    '10000000-0000-0000-0000-000000000035', 'vison',
    2400.00, 'EUR',
    'active', false,
    'Entretien cuir et fourrure chez un artisan spécialiste uniquement.', 'Leather and fur care by a specialist artisan exclusively.',
    'Atelier Paris',
    'Chapka Vison & Cuir Nappa | L’Hermine et le Vair', 'Mink & Nappa Ushanka | L’Hermine et le Vair',
    'Chapka d''exception en vison noir et agneau plongé nappa. Brides boucle or.', 'Exceptional ushanka in black mink and plunged nappa leather. Gold buckle straps.'
  )
on conflict (id) do update set
  slug = excluded.slug,
  slug_en = excluded.slug_en,
  sku = excluded.sku,
  name_fr = excluded.name_fr,
  name_en = excluded.name_en,
  description_fr = excluded.description_fr,
  description_en = excluded.description_en,
  category_id = excluded.category_id,
  material = excluded.material,
  price_amount = excluded.price_amount,
  status = excluded.status,
  is_best_seller = excluded.is_best_seller,
  care_instructions_fr = excluded.care_instructions_fr,
  care_instructions_en = excluded.care_instructions_en,
  origin_atelier = excluded.origin_atelier,
  meta_title_fr = excluded.meta_title_fr,
  meta_title_en = excluded.meta_title_en,
  meta_description_fr = excluded.meta_description_fr,
  meta_description_en = excluded.meta_description_en;

-- ------------------------------------------------------------
-- 4. PRODUCT VARIANTS
-- ------------------------------------------------------------

insert into public.product_variants (id, product_id, size, color, sku, stock_quantity) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '36', 'Noir Impérial', 'SKU-VIS-001-36', 2),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '38', 'Noir Impérial', 'SKU-VIS-001-38', 3),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '40', 'Noir Impérial', 'SKU-VIS-001-40', 1),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', '42', 'Noir Impérial', 'SKU-VIS-001-42', 1),
  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', '36', 'Cognac', 'SKU-VIS-002-36', 1),
  ('40000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000002', '38', 'Cognac', 'SKU-VIS-002-38', 2),
  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000002', '40', 'Cognac', 'SKU-VIS-002-40', 1),
  ('40000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000005', '36', 'Gris Ombré', 'SKU-CHI-001-36', 1),
  ('40000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000005', '38', 'Gris Ombré', 'SKU-CHI-001-38', 1),
  ('40000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000005', '40', 'Gris Ombré', 'SKU-CHI-001-40', 1),
  ('40000000-0000-0000-0000-000000000022', '30000000-0000-0000-0000-000000000022', '36', 'Or Ambré', 'SKU-REN-003-36', 2),
  ('40000000-0000-0000-0000-000000000023', '30000000-0000-0000-0000-000000000022', '38', 'Or Ambré', 'SKU-REN-003-38', 2),
  ('40000000-0000-0000-0000-000000000024', '30000000-0000-0000-0000-000000000022', '40', 'Or Ambré', 'SKU-REN-003-40', 1),
  ('40000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000003', '36', 'Platine', 'SKU-REN-001-36', 2),
  ('40000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000003', '38', 'Platine', 'SKU-REN-001-38', 3),
  ('40000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000003', '40', 'Platine', 'SKU-REN-001-40', 1),
  ('40000000-0000-0000-0000-000000000025', '30000000-0000-0000-0000-000000000023', '36', 'Bleu Saphir', 'SKU-VIS-003-36', 2),
  ('40000000-0000-0000-0000-000000000026', '30000000-0000-0000-0000-000000000023', '38', 'Bleu Saphir', 'SKU-VIS-003-38', 2),
  ('40000000-0000-0000-0000-000000000027', '30000000-0000-0000-0000-000000000023', '40', 'Bleu Saphir', 'SKU-VIS-003-40', 1),
  ('40000000-0000-0000-0000-000000000028', '30000000-0000-0000-0000-000000000024', '36', 'Blanc Perle', 'SKU-DOU-001-36', 2),
  ('40000000-0000-0000-0000-000000000029', '30000000-0000-0000-0000-000000000024', '38', 'Blanc Perle', 'SKU-DOU-001-38', 3),
  ('40000000-0000-0000-0000-000000000030', '30000000-0000-0000-0000-000000000024', '40', 'Blanc Perle', 'SKU-DOU-001-40', 2),
  ('40000000-0000-0000-0000-000000000031', '30000000-0000-0000-0000-000000000024', '42', 'Blanc Perle', 'SKU-DOU-001-42', 1),
  ('40000000-0000-0000-0000-000000000032', '30000000-0000-0000-0000-000000000025', '36', 'Kaki & Renard Naturel', 'SKU-PAR-001-36', 2),
  ('40000000-0000-0000-0000-000000000033', '30000000-0000-0000-0000-000000000025', '38', 'Kaki & Renard Naturel', 'SKU-PAR-001-38', 3),
  ('40000000-0000-0000-0000-000000000034', '30000000-0000-0000-0000-000000000025', '40', 'Kaki & Renard Naturel', 'SKU-PAR-001-40', 2),
  ('40000000-0000-0000-0000-000000000035', '30000000-0000-0000-0000-000000000026', '36', 'Noir Ébène', 'SKU-BLO-001-36', 1),
  ('40000000-0000-0000-0000-000000000036', '30000000-0000-0000-0000-000000000026', '38', 'Noir Ébène', 'SKU-BLO-001-38', 2),
  ('40000000-0000-0000-0000-000000000037', '30000000-0000-0000-0000-000000000026', '40', 'Noir Ébène', 'SKU-BLO-001-40', 1),
  ('40000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000006', 'TU', 'Gris Ombré', 'SKU-CHI-002-TU', 4),
  ('40000000-0000-0000-0000-000000000038', '30000000-0000-0000-0000-000000000027', '36', 'Blanc Pur', 'SKU-BOL-001-36', 2),
  ('40000000-0000-0000-0000-000000000039', '30000000-0000-0000-0000-000000000027', '38', 'Blanc Pur', 'SKU-BOL-001-38', 2),
  ('40000000-0000-0000-0000-000000000040', '30000000-0000-0000-0000-000000000027', '40', 'Blanc Pur', 'SKU-BOL-001-40', 1),
  ('40000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000004', 'TU', 'Blanc Boréal', 'SKU-REN-002-TU', 3),
  ('40000000-0000-0000-0000-000000000041', '30000000-0000-0000-0000-000000000028', 'TU', 'Noir & Chinchilla', 'SKU-CAP-001-TU', 2),
  ('40000000-0000-0000-0000-000000000042', '30000000-0000-0000-0000-000000000031', '56', 'Noir', 'SKU-ACC-001-56', 2),
  ('40000000-0000-0000-0000-000000000043', '30000000-0000-0000-0000-000000000031', '58', 'Noir', 'SKU-ACC-001-58', 3),
  ('40000000-0000-0000-0000-000000000044', '30000000-0000-0000-0000-000000000032', '56', 'Noir Impérial', 'SKU-ACC-002-56', 2),
  ('40000000-0000-0000-0000-000000000045', '30000000-0000-0000-0000-000000000032', '58', 'Noir Impérial', 'SKU-ACC-002-58', 2),
  ('40000000-0000-0000-0000-000000000046', '30000000-0000-0000-0000-000000000033', 'TU', 'Argenté Naturel', 'SKU-ACC-003-TU', 5),
  ('40000000-0000-0000-0000-000000000047', '30000000-0000-0000-0000-000000000034', 'TU', 'Blanc Écru', 'SKU-ACC-004-TU', 6),
  ('40000000-0000-0000-0000-000000000048', '30000000-0000-0000-0000-000000000035', '56', 'Noir & Cuir Noir', 'SKU-ACC-005-56', 2),
  ('40000000-0000-0000-0000-000000000049', '30000000-0000-0000-0000-000000000035', '58', 'Noir & Cuir Noir', 'SKU-ACC-005-58', 2)
on conflict (id) do update set
  product_id = excluded.product_id,
  size = excluded.size,
  color = excluded.color,
  sku = excluded.sku,
  stock_quantity = excluded.stock_quantity;

-- ------------------------------------------------------------
-- 5. PRODUCT IMAGES
-- ------------------------------------------------------------

insert into public.product_images (id, product_id, url, alt_text_fr, alt_text_en, position) values
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', 'Manteau en vison noir impérial face', 'Imperial black mink coat front view', 1),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', 'Manteau en vison noir impérial profil', 'Imperial black mink coat profile', 2),
  ('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', 'Manteau en vison cognac face', 'Cognac mink coat front', 1),
  ('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', 'Manteau en vison cognac dos', 'Cognac mink coat back', 2),
  ('50000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop', 'Veste en chinchilla impérial face', 'Imperial chinchilla jacket front', 1),
  ('50000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop', 'Veste en chinchilla impérial détail', 'Imperial chinchilla jacket detail', 2),
  ('50000000-0000-0000-0000-000000000022', '30000000-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', 'Veste cintrée en renard doré face', 'Tailored golden fox jacket front', 1),
  ('50000000-0000-0000-0000-000000000023', '30000000-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop', 'Veste cintrée en renard doré dos', 'Tailored golden fox jacket back', 2),
  ('50000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop', 'Gilet en renard platine face', 'Platinum fox vest front', 1),
  ('50000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', 'Gilet en renard platine détail', 'Platinum fox vest detail', 2),
  ('50000000-0000-0000-0000-000000000024', '30000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', 'Gilet long en vison saphir face', 'Sapphire mink long vest front', 1),
  ('50000000-0000-0000-0000-000000000025', '30000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', 'Gilet long en vison saphir profil', 'Sapphire mink long vest profile', 2),
  ('50000000-0000-0000-0000-000000000026', '30000000-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1200&auto=format&fit=crop', 'Doudoune soie et vison blanc perle', 'Silk and mink down jacket pearl white', 1),
  ('50000000-0000-0000-0000-000000000027', '30000000-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', 'Doudoune col vison détail matelassage', 'Mink collar down jacket quilting detail', 2),
  ('50000000-0000-0000-0000-000000000028', '30000000-0000-0000-0000-000000000025', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200&auto=format&fit=crop', 'Parka grand froid doublée renard vue face', 'Fox-lined winter parka front view', 1),
  ('50000000-0000-0000-0000-000000000029', '30000000-0000-0000-0000-000000000025', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', 'Capuche fourrure renard parka détail', 'Parka fox fur hood detail', 2),
  ('50000000-0000-0000-0000-000000000030', '30000000-0000-0000-0000-000000000026', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop', 'Blouson bomber en vison noir face', 'Black mink bomber jacket front', 1),
  ('50000000-0000-0000-0000-000000000031', '30000000-0000-0000-0000-000000000026', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', 'Blouson bomber en vison noir porté', 'Black mink bomber jacket styling', 2),
  ('50000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', 'Étole en chinchilla d’apparat', 'Chinchilla evening stole drape', 1),
  ('50000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', 'Étole en chinchilla portée', 'Chinchilla stole worn', 2),
  ('50000000-0000-0000-0000-000000000032', '30000000-0000-0000-0000-000000000027', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', 'Boléro en vison blanc pur face', 'Pure white mink bolero front view', 1),
  ('50000000-0000-0000-0000-000000000033', '30000000-0000-0000-0000-000000000027', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', 'Boléro en vison blanc pur détail dos', 'Pure white mink bolero back detail', 2),
  ('50000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', 'Cape en renard blanc boréal face', 'White fox cape front', 1),
  ('50000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', 'Cape en renard blanc tombé', 'White fox cape drape', 2),
  ('50000000-0000-0000-0000-000000000034', '30000000-0000-0000-0000-000000000028', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', 'Cape cachemire col chinchilla impérial', 'Royal cashmere chinchilla cape front', 1),
  ('50000000-0000-0000-0000-000000000035', '30000000-0000-0000-0000-000000000028', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', 'Cape cachemire col chinchilla détail col', 'Cashmere chinchilla cape collar detail', 2),
  ('50000000-0000-0000-0000-000000000036', '30000000-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1200&auto=format&fit=crop', 'Chapeau cloche en vison noir', 'Black mink cloche hat front view', 1),
  ('50000000-0000-0000-0000-000000000037', '30000000-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=1200&auto=format&fit=crop', 'Chapeau cloche en vison porté', 'Black mink cloche hat styled', 2),
  ('50000000-0000-0000-0000-000000000038', '30000000-0000-0000-0000-000000000032', 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=1200&auto=format&fit=crop', 'Toque impériale en vison noir', 'Imperial black mink toque front', 1),
  ('50000000-0000-0000-0000-000000000039', '30000000-0000-0000-0000-000000000032', 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1200&auto=format&fit=crop', 'Toque impériale en vison noir portée', 'Imperial black mink toque worn', 2),
  ('50000000-0000-0000-0000-000000000040', '30000000-0000-0000-0000-000000000033', 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop', 'Bandeau en renard argenté', 'Silver fox fur headband', 1),
  ('50000000-0000-0000-0000-000000000041', '30000000-0000-0000-0000-000000000033', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', 'Bandeau en renard argenté porté', 'Silver fox fur headband styled', 2),
  ('50000000-0000-0000-0000-000000000042', '30000000-0000-0000-0000-000000000034', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1200&auto=format&fit=crop', 'Bonnet cachemire et pompon renard blanc', 'Cashmere beanie with white fox pompon', 1),
  ('50000000-0000-0000-0000-000000000043', '30000000-0000-0000-0000-000000000034', 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=1200&auto=format&fit=crop', 'Bonnet cachemire pompon détail maille', 'Cashmere beanie knitwear detail', 2),
  ('50000000-0000-0000-0000-000000000044', '30000000-0000-0000-0000-000000000035', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop', 'Chapka d’exception vison et cuir noir', 'Exceptional mink and leather ushanka front', 1),
  ('50000000-0000-0000-0000-000000000045', '30000000-0000-0000-0000-000000000035', 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1200&auto=format&fit=crop', 'Chapka vison et cuir rabats relevés', 'Mink ushanka with flaps fastened up', 2)
on conflict (id) do update set
  product_id = excluded.product_id,
  url = excluded.url,
  alt_text_fr = excluded.alt_text_fr,
  alt_text_en = excluded.alt_text_en,
  position = excluded.position;

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
