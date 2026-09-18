-- ============================================================
-- MIGRATION 007: DUAL-LANGUAGE SLUGS & CONTENT MANDATE
-- ============================================================

-- 1. CATEGORIES: Add English slug column and index
alter table public.categories
  add column if not exists slug_en text;

create unique index if not exists categories_slug_en_idx
  on public.categories(slug_en)
  where slug_en is not null;

-- Populate English slugs for existing seeded categories
update public.categories set slug_en = 'coats' where slug = 'manteaux';
update public.categories set slug_en = 'fur-coats' where slug = 'manteaux-de-fourrure';
update public.categories set slug_en = 'cashmere-coats' where slug = 'manteaux-en-cachemire';
update public.categories set slug_en = 'vests' where slug = 'gilets';
update public.categories set slug_en = 'capes' where slug = 'capes';
update public.categories set slug_en = 'accessories' where slug = 'accessoires';
update public.categories set slug_en = 'mink' where slug = 'vison';
update public.categories set slug_en = 'fox' where slug = 'renard';
update public.categories set slug_en = 'chinchilla' where slug = 'chinchilla';
update public.categories set slug_en = 'cashmere' where slug = 'cachemire';
update public.categories set slug_en = 'winter-2024' where slug = 'hiver-2024';
update public.categories set slug_en = 'icons' where slug = 'icones';

-- 2. PRODUCTS: Add English slug column and index
alter table public.products
  add column if not exists slug_en text;

create unique index if not exists products_slug_en_idx
  on public.products(slug_en)
  where slug_en is not null;

-- Populate English slugs for existing seeded products
update public.products set slug_en = 'black-mink-coat' where slug = 'manteau-vison-noir';
update public.products set slug_en = 'cognac-mink-coat' where slug = 'manteau-vison-cognac';
update public.products set slug_en = 'platinum-fox-vest' where slug = 'gilet-renard-platine';
update public.products set slug_en = 'cashmere-chinchilla-cape' where slug = 'cape-cachemire-chinchilla';
update public.products set slug_en = 'black-cashmere-coat' where slug = 'manteau-cachemire-noir';
update public.products set slug_en = 'silver-fox-stole' where slug = 'etole-renard-argente';
update public.products set slug_en = 'white-fox-cape' where slug = 'cape-renard-blanc';
update public.products set slug_en = 'chinchilla-jacket' where slug = 'veste-chinchilla';

-- 3. DISCOUNTS: Add dual-language descriptions
alter table public.discounts
  add column if not exists description_fr text,
  add column if not exists description_en text;
