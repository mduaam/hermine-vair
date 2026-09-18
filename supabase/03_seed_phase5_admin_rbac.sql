-- ============================================================
-- L'HERMINE ET LE VAIR — SEED PHASE 5 (ADMIN PANEL & RBAC)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zahudflqsbloggswvudz/sql/new
-- (Run this AFTER 01_full_schema.sql and 02_seed_data.sql)
-- ============================================================

-- ------------------------------------------------------------
-- 1. STAFF & RBAC INITIALIZATION (public.staff)
-- ------------------------------------------------------------
-- To grant the 'owner' role to your own Supabase user account:
-- 1. Go to Authentication -> Users in your Supabase dashboard.
-- 2. Find your user or sign up on the storefront.
-- 3. Run the query below with your email address:

/*
insert into public.staff (id, role, active)
select id, 'owner', true
from auth.users
where email = 'your-email@domain.com'
on conflict (id) do update set role = 'owner', active = true;
*/

-- Alternatively, if you have any existing auth users, this promotes the first registered user to 'owner':
do $$
declare
  first_user_id uuid;
begin
  select id into first_user_id from auth.users order by created_at asc limit 1;
  if first_user_id is not null then
    insert into public.staff (id, role, active)
    values (first_user_id, 'owner', true)
    on conflict (id) do update set role = 'owner', active = true;
  end if;
end $$;

-- ------------------------------------------------------------
-- 2. DUAL-LANGUAGE PRIVILEGE CODES (public.discounts)
-- ------------------------------------------------------------

insert into public.discounts (
  id, code, type, value, min_order_amount,
  description_fr, description_en,
  starts_at, ends_at, active
) values
  (
    '60000000-0000-0000-0000-000000000001',
    'PRIVILEGE10',
    'percentage',
    10.00,
    3000.00,
    'Remise exclusive de 10% accordée aux membres du Cercle Privé pour toute commande supérieure à 3 000 €.',
    'Exclusive 10% privilege granted to Private Circle members on all orders exceeding €3,000.',
    now() - interval '30 days',
    now() + interval '335 days',
    true
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    'LIVRAISONCONCIERGE',
    'free_shipping',
    0.00,
    0.00,
    'Expédition haute sécurité en véhicule blindé offerte sur l’ensemble de la collection.',
    'Complimentary armored high-security courier delivery across the entire collection.',
    now() - interval '30 days',
    null,
    true
  )
on conflict (code) do update set
  description_fr = excluded.description_fr,
  description_en = excluded.description_en,
  active = true;

-- Update BIENVENUE10 with bilingual descriptions
update public.discounts set
  description_fr = 'Privilège de bienvenue de 10% sur votre première acquisition haute façon.',
  description_en = 'Welcome privilege of 10% on your inaugural haute couture acquisition.'
where code = 'BIENVENUE10';

-- ------------------------------------------------------------
-- 3. FUR RESTRICTION REGION RULES (public.region_rules)
-- ------------------------------------------------------------
-- Legal statutory compliance (Fur ban enforcement: Israel, California AB 44, etc.)

insert into public.region_rules (
  country_code, fur_sales_allowed, currency, default_locale,
  duties_note_fr, duties_note_en
) values
  (
    'IL',
    false,
    'USD',
    'en',
    'Interdiction légale stricte de commercialisation et d’importation de fourrure animale (Loi 2021).',
    'Strict statutory prohibition on the sale and import of animal fur (2021 Animal Protection Amendment).'
  ),
  (
    'FR',
    true,
    'EUR',
    'fr',
    'TVA française 20% incluse. Livraison par coursier dédié en gants blancs.',
    'French 20% VAT included. Complimentary white-glove courier delivery.'
  ),
  (
    'MC',
    true,
    'EUR',
    'fr',
    'TVA monégasque incluse. Livraison privée en Principauté.',
    'Monaco VAT included. Private secure delivery in the Principality.'
  ),
  (
    'GB',
    true,
    'GBP',
    'en',
    'TVA britannique incluse (DDP). Dédouanement et transport haute sécurité pris en charge.',
    'UK VAT included (DDP). Customs clearance and insured high-security transit included.'
  ),
  (
    'US',
    true,
    'USD',
    'en',
    'Droits de douane calculés au paiement (DDP). Restriction territoriale automatique en Californie (Loi AB 44).',
    'Customs duties calculated at checkout (DDP). Automatic statutory restriction in California (AB 44).'
  ),
  (
    'CH',
    true,
    'CHF',
    'fr',
    'Rendu droits acquittés (DDP). Taxes fédérales et dédouanement inclus.',
    'Delivered Duty Paid (DDP). Federal import taxes and Swiss customs clearance included.'
  )
on conflict (country_code) do update set
  fur_sales_allowed = excluded.fur_sales_allowed,
  currency = excluded.currency,
  default_locale = excluded.default_locale,
  duties_note_fr = excluded.duties_note_fr,
  duties_note_en = excluded.duties_note_en;

-- ------------------------------------------------------------
-- 4. REVIEWS MODERATION QUEUE (public.product_reviews)
-- ------------------------------------------------------------

insert into public.product_reviews (
  id, product_id, rating, title, body, status,
  helpful_count, is_featured, created_at
) values
  (
    '70000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    5,
    'Une pièce magistrale',
    'Le toucher du vison est d’une douceur incomparable. La doublure en soie écru et la coupe en font un investissement pour toute une vie. Reçu dans une malle gainée de cuir splendide.',
    'approved',
    12,
    true,
    now() - interval '3 days'
  ),
  (
    '70000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000003',
    5,
    'Légèreté et prestance souveraine',
    'Gilet spectaculaire, porté aussi bien en journée sur une chemise blanche qu’en soirée. Les conseils du concierge privé lors de la prise de mesures étaient impeccables.',
    'pending',
    0,
    false,
    now() - interval '6 hours'
  ),
  (
    '70000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000002',
    4,
    'Élégance discrète et chaude',
    'Teinte cognac très subtile qui s’accorde avec toutes les tenues d’hiver. Le col montant protège idéalement du vent froid.',
    'approved',
    4,
    false,
    now() - interval '10 days'
  )
on conflict (id) do update set
  status = excluded.status,
  is_featured = excluded.is_featured;

-- ------------------------------------------------------------
-- 5. AUDIT LOG SEED ENTRIES (public.audit_log)
-- ------------------------------------------------------------

insert into public.audit_log (
  id, action, resource_type, resource_id,
  before, after, ip, created_at
) values
  (
    '80000000-0000-0000-0000-000000000001',
    'UPDATE_ORDER_STATUS',
    'order',
    'ORD-2026-0891',
    '{"status": "paid"}',
    '{"status": "fulfilled", "fulfilled_by": "Direction Atelier Paris"}',
    '127.0.0.1',
    now() - interval '2 hours'
  ),
  (
    '80000000-0000-0000-0000-000000000002',
    'APPROVE_REVIEW',
    'review',
    '70000000-0000-0000-0000-000000000001',
    '{"status": "pending"}',
    '{"status": "approved", "is_featured": true}',
    '127.0.0.1',
    now() - interval '1 day'
  ),
  (
    '80000000-0000-0000-0000-000000000003',
    'CREATE_DISCOUNT',
    'discount',
    'PRIVILEGE10',
    null,
    '{"code": "PRIVILEGE10", "type": "percentage", "value": 10, "min_order_amount": 3000}',
    '127.0.0.1',
    now() - interval '5 days'
  )
on conflict (id) do nothing;
