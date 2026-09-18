const fs = require('fs');
const path = require('path');

// Require products list
const seedProductsScript = fs.readFileSync(path.resolve(__dirname, 'seed_products.cjs'), 'utf-8');
// Extract products array using eval in a sandbox or safe execution
const productsMatch = seedProductsScript.match(/const products = (\[[\s\S]*?\]);\r?\n\r?\nasync function seed/);
if (!productsMatch) {
  console.error('Could not extract products array');
  process.exit(1);
}

const products = eval(productsMatch[1]);

function escapeSql(str) {
  if (str === null || str === undefined) return 'null';
  return `'${str.replace(/'/g, "''")}'`;
}

let sql = `-- =============================================================
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
-- 3. PRODUCTS (${products.length} Products across all 13 categories)
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
`;

const prodValues = products.map((p) => {
  return `  (
    ${escapeSql(p.id)}, ${escapeSql(p.slug)}, ${escapeSql(p.slug_en)}, ${escapeSql(p.sku)},
    ${escapeSql(p.name_fr)}, ${escapeSql(p.name_en)},
    ${escapeSql(p.description_fr)}, ${escapeSql(p.description_en)},
    ${escapeSql(p.category_id)}, ${escapeSql(p.material)},
    ${p.price_amount.toFixed(2)}, ${escapeSql(p.price_currency || 'EUR')},
    ${escapeSql(p.status || 'active')}, ${p.is_best_seller ? 'true' : 'false'},
    ${escapeSql(p.care_instructions_fr)}, ${escapeSql(p.care_instructions_en)},
    ${escapeSql(p.origin_atelier || 'Atelier Paris')},
    ${escapeSql(p.meta_title_fr)}, ${escapeSql(p.meta_title_en)},
    ${escapeSql(p.meta_description_fr)}, ${escapeSql(p.meta_description_en)}
  )`;
});

sql += prodValues.join(',\n');
sql += `\non conflict (id) do update set
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
`;

const variantRows = [];
for (const p of products) {
  for (const v of p.variants || []) {
    variantRows.push(`  (${escapeSql(v.id)}, ${escapeSql(p.id)}, ${escapeSql(v.size)}, ${escapeSql(v.color || 'Standard')}, ${escapeSql(v.sku)}, ${v.stock_quantity})`);
  }
}

sql += variantRows.join(',\n');
sql += `\non conflict (id) do update set
  product_id = excluded.product_id,
  size = excluded.size,
  color = excluded.color,
  sku = excluded.sku,
  stock_quantity = excluded.stock_quantity;

-- ------------------------------------------------------------
-- 5. PRODUCT IMAGES
-- ------------------------------------------------------------

insert into public.product_images (id, product_id, url, alt_text_fr, alt_text_en, position) values
`;

const imageRows = [];
for (const p of products) {
  for (const img of p.images || []) {
    imageRows.push(`  (${escapeSql(img.id)}, ${escapeSql(p.id)}, ${escapeSql(img.url)}, ${escapeSql(img.alt_text_fr)}, ${escapeSql(img.alt_text_en)}, ${img.position})`);
  }
}

sql += imageRows.join(',\n');
sql += `\non conflict (id) do update set
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
`;

fs.writeFileSync(path.resolve(__dirname, '..', 'supabase', '02_seed_data.sql'), sql, 'utf-8');
fs.writeFileSync(path.resolve(__dirname, '..', 'supabase', 'seed.sql'), sql, 'utf-8');

console.log('✓ Successfully regenerated supabase/02_seed_data.sql and supabase/seed.sql');
