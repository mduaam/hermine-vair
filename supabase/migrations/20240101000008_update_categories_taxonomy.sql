-- ============================================================
-- MIGRATION 008: UPDATE CATEGORIES TAXONOMY & DUAL-LANGUAGE SLUGS
-- ============================================================

-- Ensure slug_en column exists on categories
alter table public.categories
  add column if not exists slug_en text;

create unique index if not exists categories_slug_en_idx
  on public.categories(slug_en)
  where slug_en is not null;

-- Ensure root 'accessoires' category exists
insert into public.categories (id, slug, slug_en, name_fr, name_en, kind, position)
values (
  '10000000-0000-0000-0000-000000000004',
  'accessoires',
  'accessories',
  'Accessoires',
  'Accessories',
  'type',
  4
)
on conflict (slug) do update set
  slug_en = excluded.slug_en,
  name_fr = excluded.name_fr,
  name_en = excluded.name_en;

-- 1. MAIN COLLECTIONS (8 Categories)
insert into public.categories (id, slug, slug_en, name_fr, name_en, parent_id, kind, position) values
  ('10000000-0000-0000-0000-000000000021', 'manteau-fourrure-femme',   'womens-fur-coat',        'Manteau Fourrure Femme',   'Women''s Fur Coat',        null, 'type', 1),
  ('10000000-0000-0000-0000-000000000022', 'veste-fourrure-femme',     'womens-fur-jacket',      'Veste Fourrure Femme',     'Women''s Fur Jacket',      null, 'type', 2),
  ('10000000-0000-0000-0000-000000000023', 'gilet-fourrure-femme',     'womens-fur-vest',        'Gilet Fourrure Femme',     'Women''s Fur Vest',        null, 'type', 3),
  ('10000000-0000-0000-0000-000000000024', 'doudoune-fourrure-femme',  'womens-fur-down-jacket', 'Doudoune Fourrure Femme',  'Women''s Fur Down Jacket', null, 'type', 4),
  ('10000000-0000-0000-0000-000000000025', 'parka-fourrure-femme',     'womens-fur-parka',       'Parka Fourrure Femme',     'Women''s Fur Parka',       null, 'type', 5),
  ('10000000-0000-0000-0000-000000000026', 'blouson-fourrure-femme',   'womens-fur-bomber',      'Blouson Fourrure Femme',   'Women''s Fur Bomber',      null, 'type', 6),
  ('10000000-0000-0000-0000-000000000027', 'bolero-en-fourrure',       'fur-bolero',             'Boléro en Fourrure',       'Fur Bolero',               null, 'type', 7),
  ('10000000-0000-0000-0000-000000000028', 'cape-fourrure-femme',      'womens-fur-cape',        'Cape Fourrure Femme',      'Women''s Fur Cape',        null, 'type', 8)
on conflict (slug) do update set
  slug_en   = excluded.slug_en,
  name_fr   = excluded.name_fr,
  name_en   = excluded.name_en,
  parent_id = excluded.parent_id,
  kind      = excluded.kind,
  position  = excluded.position;

-- 2. ACCESSORIES COLLECTIONS (5 Categories under parent 'accessoires')
insert into public.categories (id, slug, slug_en, name_fr, name_en, parent_id, kind, position) values
  ('10000000-0000-0000-0000-000000000031', 'chapeau-fourrure-femme',   'womens-fur-hat',         'Chapeau Fourrure Femme',   'Women''s Fur Hat',         '10000000-0000-0000-0000-000000000004', 'type', 11),
  ('10000000-0000-0000-0000-000000000032', 'toque-fourrure-femme',     'womens-fur-toque',       'Toque Fourrure Femme',     'Women''s Fur Toque',       '10000000-0000-0000-0000-000000000004', 'type', 12),
  ('10000000-0000-0000-0000-000000000033', 'bandeau-en-fourrure',       'fur-headband',           'Bandeau en Fourrure',      'Fur Headband',             '10000000-0000-0000-0000-000000000004', 'type', 13),
  ('10000000-0000-0000-0000-000000000034', 'bonnet-fourrure-femme',    'womens-fur-beanie',      'Bonnet Fourrure Femme',    'Women''s Fur Beanie',      '10000000-0000-0000-0000-000000000004', 'type', 14),
  ('10000000-0000-0000-0000-000000000035', 'chapka-fourrure-femme',    'womens-fur-chapka',      'Chapka Fourrure Femme',    'Women''s Fur Chapka',      '10000000-0000-0000-0000-000000000004', 'type', 15)
on conflict (slug) do update set
  slug_en   = excluded.slug_en,
  name_fr   = excluded.name_fr,
  name_en   = excluded.name_en,
  parent_id = excluded.parent_id,
  kind      = excluded.kind,
  position  = excluded.position;

-- 3. Update existing products to point to new category taxonomy where appropriate
update public.products
set category_id = '10000000-0000-0000-0000-000000000021'
where slug in ('manteau-vison-noir', 'manteau-vison-cognac');

update public.products
set category_id = '10000000-0000-0000-0000-000000000022'
where slug = 'veste-chinchilla';

update public.products
set category_id = '10000000-0000-0000-0000-000000000023'
where slug = 'gilet-renard-platine';

update public.products
set category_id = '10000000-0000-0000-0000-000000000028'
where slug = 'cape-renard-blanc';
