-- ============================================================
-- L'HERMINE ET LE VAIR — COMPLETE DATABASE SCHEMA & RLS
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zahudflqsbloggswvudz/sql/new
-- ============================================================

-- ------------------------------------------------------------
-- 1. BOOTSTRAP HELPER FUNCTIONS
-- ------------------------------------------------------------

create or replace function public.handle_updated_at()
returns trigger language plpgsql security definer as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- 2. STAFF TABLE (Created first so is_staff_role can reference it)
-- ------------------------------------------------------------

create table if not exists public.staff (
  id      uuid primary key references auth.users(id) on delete cascade,
  role    text check (role in (
            'owner','admin','product_specialist',
            'order_manager','content_editor','support_agent'
          )) not null,
  active  boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

drop trigger if exists staff_updated_at on public.staff;
create trigger staff_updated_at
  before update on public.staff
  for each row execute procedure public.handle_updated_at();

-- Staff role checker helper
create or replace function public.is_staff_role(allowed_roles text[])
returns boolean language plpgsql stable security definer as $$
begin
  return exists (
    select 1 from public.staff
    where id = auth.uid()
      and role = any(allowed_roles)
      and active = true
  );
end;
$$;

alter table public.staff enable row level security;

drop policy if exists "staff read own row" on public.staff;
create policy "staff read own row"
  on public.staff for select
  using (auth.uid() = id);

drop policy if exists "owner_admin manage staff" on public.staff;
create policy "owner_admin manage staff"
  on public.staff for all
  using (
    exists (
      select 1 from public.staff s2
      where s2.id = auth.uid()
        and s2.role in ('owner','admin')
        and s2.active = true
    )
  );


create table if not exists public.audit_log (
  id            uuid primary key default gen_random_uuid(),
  actor_id      uuid references auth.users(id) on delete set null,
  action        text not null,
  resource_type text not null,
  resource_id   text not null,
  before        jsonb,
  after         jsonb,
  ip            text,
  created_at    timestamptz default now() not null
);

create index if not exists audit_log_actor_idx    on public.audit_log(actor_id);
create index if not exists audit_log_resource_idx on public.audit_log(resource_type, resource_id);
create index if not exists audit_log_created_idx  on public.audit_log(created_at desc);

alter table public.audit_log enable row level security;

drop policy if exists "owner_admin read audit_log" on public.audit_log;
create policy "owner_admin read audit_log"
  on public.audit_log for select
  using (public.is_staff_role(array['owner','admin']));

-- ------------------------------------------------------------
-- 3. CATALOG (Categories, Products, Variants, Images, Stock)
-- ------------------------------------------------------------

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_fr     text not null,
  name_en     text not null,
  parent_id   uuid references public.categories(id) on delete set null,
  kind        text check (kind in ('type','material','season')) not null,
  position    int default 0 not null,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

create index if not exists categories_parent_idx on public.categories(parent_id);
create index if not exists categories_slug_idx   on public.categories(slug);

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at
  before update on public.categories
  for each row execute procedure public.handle_updated_at();

alter table public.categories enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories"
  on public.categories for select using (true);

drop policy if exists "product_specialist write categories" on public.categories;
create policy "product_specialist write categories"
  on public.categories for all
  using (public.is_staff_role(array['owner','admin','product_specialist']));

create table if not exists public.products (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text unique not null,
  sku                   text unique not null,
  name_fr               text not null,
  name_en               text not null,
  description_fr        text,
  description_en        text,
  category_id           uuid references public.categories(id) not null,
  material              text check (material in ('vison','renard','chinchilla','cachemire','laine','autre')),
  price_amount          numeric(10,2) not null,
  price_currency        text default 'EUR' not null,
  status                text check (status in ('draft','active','archived')) default 'draft' not null,
  is_best_seller        boolean default false not null,
  care_instructions_fr  text,
  care_instructions_en  text,
  origin_atelier        text,
  meta_title_fr         text,
  meta_title_en         text,
  meta_description_fr   text check (char_length(meta_description_fr) <= 160),
  meta_description_en   text check (char_length(meta_description_en) <= 160),
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

create index if not exists products_category_idx    on public.products(category_id);
create index if not exists products_status_idx      on public.products(status);
create index if not exists products_material_idx    on public.products(material);
create index if not exists products_best_seller_idx on public.products(is_best_seller) where is_best_seller = true;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.handle_updated_at();

alter table public.products enable row level security;

drop policy if exists "public read active products" on public.products;
create policy "public read active products"
  on public.products for select using (status = 'active');

drop policy if exists "staff read all products" on public.products;
create policy "staff read all products"
  on public.products for select
  using (public.is_staff_role(array['owner','admin','product_specialist','order_manager']));

drop policy if exists "product_specialist write products" on public.products;
create policy "product_specialist write products"
  on public.products for all
  using (public.is_staff_role(array['owner','admin','product_specialist']));

create table if not exists public.product_categories (
  product_id  uuid references public.products(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

alter table public.product_categories enable row level security;

drop policy if exists "public read product_categories" on public.product_categories;
create policy "public read product_categories"
  on public.product_categories for select using (true);

drop policy if exists "product_specialist write product_categories" on public.product_categories;
create policy "product_specialist write product_categories"
  on public.product_categories for all
  using (public.is_staff_role(array['owner','admin','product_specialist']));

create table if not exists public.product_variants (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid references public.products(id) on delete cascade not null,
  size            text,
  color           text,
  sku             text unique not null,
  stock_quantity  int default 0 not null,
  price_override  numeric(10,2),
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

create index if not exists product_variants_product_idx on public.product_variants(product_id);

drop trigger if exists product_variants_updated_at on public.product_variants;
create trigger product_variants_updated_at
  before update on public.product_variants
  for each row execute procedure public.handle_updated_at();

alter table public.product_variants enable row level security;

drop policy if exists "public read variants" on public.product_variants;
create policy "public read variants"
  on public.product_variants for select using (true);

drop policy if exists "product_specialist write variants" on public.product_variants;
create policy "product_specialist write variants"
  on public.product_variants for all
  using (public.is_staff_role(array['owner','admin','product_specialist']));

create table if not exists public.product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid references public.products(id) on delete cascade not null,
  url          text not null,
  alt_text_fr  text not null,
  alt_text_en  text not null,
  position     int default 0 not null,
  created_at   timestamptz default now() not null
);

create index if not exists product_images_product_idx on public.product_images(product_id, position);

alter table public.product_images enable row level security;

drop policy if exists "public read product_images" on public.product_images;
create policy "public read product_images"
  on public.product_images for select using (true);

drop policy if exists "product_specialist write product_images" on public.product_images;
create policy "product_specialist write product_images"
  on public.product_images for all
  using (public.is_staff_role(array['owner','admin','product_specialist']));

create table if not exists public.inventory_locations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  country    text not null,
  created_at timestamptz default now() not null
);

alter table public.inventory_locations enable row level security;

drop policy if exists "public read locations" on public.inventory_locations;
create policy "public read locations"
  on public.inventory_locations for select using (true);

drop policy if exists "owner_admin write locations" on public.inventory_locations;
create policy "owner_admin write locations"
  on public.inventory_locations for all
  using (public.is_staff_role(array['owner','admin']));

create table if not exists public.inventory_stock (
  variant_id  uuid references public.product_variants(id) on delete cascade,
  location_id uuid references public.inventory_locations(id) on delete cascade,
  quantity    int default 0 not null,
  primary key (variant_id, location_id)
);

alter table public.inventory_stock enable row level security;

drop policy if exists "public read inventory_stock" on public.inventory_stock;
create policy "public read inventory_stock"
  on public.inventory_stock for select using (true);

drop policy if exists "product_specialist write inventory_stock" on public.inventory_stock;
create policy "product_specialist write inventory_stock"
  on public.inventory_stock for all
  using (public.is_staff_role(array['owner','admin','product_specialist','order_manager']));

-- ------------------------------------------------------------
-- 4. CUSTOMERS, ADDRESSES, CARTS, WISHLISTS & ORDERS
-- ------------------------------------------------------------

create table if not exists public.customer_profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  first_name          text,
  last_name           text,
  phone               text,
  locale              text default 'fr' not null,
  preferred_currency  text default 'EUR' not null,
  marketing_opt_in    boolean default false not null,
  stripe_customer_id  text unique,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);

create index if not exists customer_profiles_stripe_idx
  on public.customer_profiles(stripe_customer_id) where stripe_customer_id is not null;

drop trigger if exists customer_profiles_updated_at on public.customer_profiles;
create trigger customer_profiles_updated_at
  before update on public.customer_profiles
  for each row execute procedure public.handle_updated_at();

alter table public.customer_profiles enable row level security;

drop policy if exists "customers manage own profile" on public.customer_profiles;
create policy "customers manage own profile"
  on public.customer_profiles for all using (auth.uid() = id);

drop policy if exists "staff read customer profiles" on public.customer_profiles;
create policy "staff read customer profiles"
  on public.customer_profiles for select
  using (public.is_staff_role(array['owner','admin','order_manager','support_agent']));

create table if not exists public.addresses (
  id                    uuid primary key default gen_random_uuid(),
  customer_id           uuid references auth.users(id) on delete cascade not null,
  label                 text,
  full_name             text not null,
  line1                 text not null,
  line2                 text,
  city                  text not null,
  region                text,
  postal_code           text not null,
  country               text not null,
  is_default_shipping   boolean default false,
  is_default_billing    boolean default false,
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

create index if not exists addresses_customer_idx on public.addresses(customer_id);

drop trigger if exists addresses_updated_at on public.addresses;
create trigger addresses_updated_at
  before update on public.addresses
  for each row execute procedure public.handle_updated_at();

alter table public.addresses enable row level security;

drop policy if exists "customers manage own addresses" on public.addresses;
create policy "customers manage own addresses"
  on public.addresses for all using (auth.uid() = customer_id);

drop policy if exists "order_manager read addresses" on public.addresses;
create policy "order_manager read addresses"
  on public.addresses for select
  using (public.is_staff_role(array['owner','admin','order_manager']));

create table if not exists public.carts (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid references auth.users(id) on delete set null,
  session_token   text,
  currency        text default 'EUR' not null,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null,
  constraint carts_has_owner check (customer_id is not null or session_token is not null)
);

create index if not exists carts_customer_idx       on public.carts(customer_id) where customer_id is not null;
create index if not exists carts_session_token_idx  on public.carts(session_token) where session_token is not null;

drop trigger if exists carts_updated_at on public.carts;
create trigger carts_updated_at
  before update on public.carts
  for each row execute procedure public.handle_updated_at();

alter table public.carts enable row level security;

drop policy if exists "customers access own cart" on public.carts;
create policy "customers access own cart"
  on public.carts for all
  using (
    auth.uid() = customer_id
    OR session_token = current_setting('app.session_token', true)
  );

create table if not exists public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  cart_id     uuid references public.carts(id) on delete cascade not null,
  variant_id  uuid references public.product_variants(id) on delete cascade not null,
  quantity    int not null check (quantity > 0),
  unit_price  numeric(10,2) not null,
  created_at  timestamptz default now() not null
);

create index if not exists cart_items_cart_idx on public.cart_items(cart_id);

alter table public.cart_items enable row level security;

drop policy if exists "cart owner access cart_items" on public.cart_items;
create policy "cart owner access cart_items"
  on public.cart_items for all
  using (
    exists (
      select 1 from public.carts
      where id = cart_id
        and (customer_id = auth.uid()
             or session_token = current_setting('app.session_token', true))
    )
  );

create table if not exists public.wishlists (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete cascade not null,
  product_id  uuid references public.products(id) on delete cascade not null,
  created_at  timestamptz default now() not null,
  unique(customer_id, product_id)
);

alter table public.wishlists enable row level security;

drop policy if exists "customers manage own wishlist" on public.wishlists;
create policy "customers manage own wishlist"
  on public.wishlists for all using (auth.uid() = customer_id);

create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  order_number          text unique not null,
  customer_id           uuid references auth.users(id) on delete set null,
  email                 text not null,
  locale                text not null,
  currency              text not null,
  status                text check (status in (
                          'pending','paid','fulfilled','shipped',
                          'delivered','cancelled','refunded'
                        )) default 'pending' not null,
  subtotal              numeric(10,2) not null,
  shipping_total        numeric(10,2) default 0 not null,
  duties_estimate       numeric(10,2) default 0 not null,
  tax_total             numeric(10,2) default 0 not null,
  total                 numeric(10,2) not null,
  shipping_address_id   uuid references public.addresses(id) on delete set null,
  billing_address_id    uuid references public.addresses(id) on delete set null,
  payment_provider      text,
  payment_reference     text,
  notes                 text,
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

create index if not exists orders_customer_idx    on public.orders(customer_id) where customer_id is not null;
create index if not exists orders_status_idx      on public.orders(status);
create index if not exists orders_created_idx     on public.orders(created_at desc);
create index if not exists orders_number_idx      on public.orders(order_number);

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();

alter table public.orders enable row level security;

drop policy if exists "customers read own orders" on public.orders;
create policy "customers read own orders"
  on public.orders for select
  using (auth.uid() = customer_id);

drop policy if exists "staff read all orders" on public.orders;
create policy "staff read all orders"
  on public.orders for select
  using (public.is_staff_role(array['owner','admin','order_manager','support_agent']));

drop policy if exists "order_manager update orders" on public.orders;
create policy "order_manager update orders"
  on public.orders for update
  using (public.is_staff_role(array['owner','admin','order_manager']));

create table if not exists public.order_items (
  id                      uuid primary key default gen_random_uuid(),
  order_id                uuid references public.orders(id) on delete cascade not null,
  variant_id              uuid references public.product_variants(id) on delete set null,
  product_name_snapshot   text not null,
  quantity                int not null check (quantity > 0),
  unit_price              numeric(10,2) not null,
  total                   numeric(10,2) not null,
  review_invitation_sent  boolean default false not null,
  created_at              timestamptz default now() not null
);

create index if not exists order_items_order_idx on public.order_items(order_id);

alter table public.order_items enable row level security;

drop policy if exists "customers read own order_items" on public.order_items;
create policy "customers read own order_items"
  on public.order_items for select
  using (exists (select 1 from public.orders where id = order_id and customer_id = auth.uid()));

drop policy if exists "staff read all order_items" on public.order_items;
create policy "staff read all order_items"
  on public.order_items for select
  using (public.is_staff_role(array['owner','admin','order_manager','support_agent']));

create table if not exists public.order_events (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references public.orders(id) on delete cascade not null,
  type        text not null,
  message     text,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz default now() not null
);

create index if not exists order_events_order_idx on public.order_events(order_id, created_at);

alter table public.order_events enable row level security;

drop policy if exists "customers read own order_events" on public.order_events;
create policy "customers read own order_events"
  on public.order_events for select
  using (exists (select 1 from public.orders where id = order_id and customer_id = auth.uid()));

drop policy if exists "staff manage order_events" on public.order_events;
create policy "staff manage order_events"
  on public.order_events for all
  using (public.is_staff_role(array['owner','admin','order_manager','support_agent']));

create table if not exists public.returns (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid references public.orders(id) on delete cascade not null,
  status          text check (status in ('requested','approved','denied','refunded')) default 'requested' not null,
  reason          text,
  refund_amount   numeric(10,2),
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

drop trigger if exists returns_updated_at on public.returns;
create trigger returns_updated_at
  before update on public.returns
  for each row execute procedure public.handle_updated_at();

alter table public.returns enable row level security;

drop policy if exists "customers read own returns" on public.returns;
create policy "customers read own returns"
  on public.returns for select
  using (exists (select 1 from public.orders where id = order_id and customer_id = auth.uid()));

drop policy if exists "customers insert own returns" on public.returns;
create policy "customers insert own returns"
  on public.returns for insert
  with check (exists (select 1 from public.orders where id = order_id and customer_id = auth.uid()));

drop policy if exists "order_manager manage returns" on public.returns;
create policy "order_manager manage returns"
  on public.returns for all
  using (public.is_staff_role(array['owner','admin','order_manager']));

-- ------------------------------------------------------------
-- 5. MARKETING & REGIONAL RULES
-- ------------------------------------------------------------

create table if not exists public.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  locale          text not null,
  source          text,
  subscribed_at   timestamptz default now() not null
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "public insert newsletter" on public.newsletter_subscribers;
create policy "public insert newsletter"
  on public.newsletter_subscribers for insert with check (true);

drop policy if exists "staff manage newsletter" on public.newsletter_subscribers;
create policy "staff manage newsletter"
  on public.newsletter_subscribers for all
  using (public.is_staff_role(array['owner','admin','order_manager']));

create table if not exists public.contact_requests (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  email     text not null,
  subject   text not null,
  message   text not null,
  status    text default 'new' not null,
  created_at timestamptz default now() not null
);

alter table public.contact_requests enable row level security;

drop policy if exists "public insert contact_requests" on public.contact_requests;
create policy "public insert contact_requests"
  on public.contact_requests for insert with check (true);

drop policy if exists "staff manage contact_requests" on public.contact_requests;
create policy "staff manage contact_requests"
  on public.contact_requests for all
  using (public.is_staff_role(array['owner','admin','support_agent']));

create table if not exists public.discounts (
  id                uuid primary key default gen_random_uuid(),
  code              text unique not null,
  type              text check (type in ('percentage','fixed','free_shipping')) not null,
  value             numeric(10,2) not null,
  min_order_amount  numeric(10,2),
  applies_to        text check (applies_to in ('all','category','product')) default 'all',
  applies_to_id     uuid,
  starts_at         timestamptz,
  ends_at           timestamptz,
  active            boolean default true not null,
  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null
);

drop trigger if exists discounts_updated_at on public.discounts;
create trigger discounts_updated_at
  before update on public.discounts
  for each row execute procedure public.handle_updated_at();

alter table public.discounts enable row level security;

drop policy if exists "public read active discounts" on public.discounts;
create policy "public read active discounts"
  on public.discounts for select
  using (
    active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at   IS NULL OR ends_at   >= now())
  );

drop policy if exists "admin manage discounts" on public.discounts;
create policy "admin manage discounts"
  on public.discounts for all
  using (public.is_staff_role(array['owner','admin','order_manager']));

create table if not exists public.region_rules (
  id                  uuid primary key default gen_random_uuid(),
  country_code        text unique not null,
  fur_sales_allowed   boolean default true not null,
  currency            text default 'EUR' not null,
  default_locale      text default 'fr' not null,
  duties_note_fr      text,
  duties_note_en      text,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);

drop trigger if exists region_rules_updated_at on public.region_rules;
create trigger region_rules_updated_at
  before update on public.region_rules
  for each row execute procedure public.handle_updated_at();

alter table public.region_rules enable row level security;

drop policy if exists "public read region_rules" on public.region_rules;
create policy "public read region_rules"
  on public.region_rules for select using (true);

drop policy if exists "owner_admin manage region_rules" on public.region_rules;
create policy "owner_admin manage region_rules"
  on public.region_rules for all
  using (public.is_staff_role(array['owner','admin']));

-- ------------------------------------------------------------
-- 6. VERIFIED REVIEWS & HELPFUL VOTES
-- ------------------------------------------------------------

create table if not exists public.product_reviews (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid references public.products(id) on delete cascade not null,
  order_item_id    uuid references public.order_items(id) on delete set null,
  customer_id      uuid references auth.users(id) on delete set null,
  rating           int check (rating between 1 and 5) not null,
  title            text check (char_length(title) <= 150),
  body             text check (char_length(body) <= 1500),
  status           text check (status in ('pending','approved','rejected')) default 'pending' not null,
  helpful_count    int default 0 not null,
  is_featured      boolean default false not null,
  rejection_reason text,
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null,
  unique(order_item_id)
);

create index if not exists product_reviews_product_idx
  on public.product_reviews(product_id) where status = 'approved';
create index if not exists product_reviews_customer_idx
  on public.product_reviews(customer_id);
create index if not exists product_reviews_pending_idx
  on public.product_reviews(created_at) where status = 'pending';

drop trigger if exists product_reviews_updated_at on public.product_reviews;
create trigger product_reviews_updated_at
  before update on public.product_reviews
  for each row execute procedure public.handle_updated_at();

alter table public.product_reviews enable row level security;

drop policy if exists "public read approved reviews" on public.product_reviews;
create policy "public read approved reviews"
  on public.product_reviews for select
  using (status = 'approved');

drop policy if exists "customers read own reviews" on public.product_reviews;
create policy "customers read own reviews"
  on public.product_reviews for select
  using (auth.uid() = customer_id);

drop policy if exists "customers insert verified reviews" on public.product_reviews;
create policy "customers insert verified reviews"
  on public.product_reviews for insert
  with check (
    auth.uid() = customer_id
    AND exists (
      select 1 from public.order_items oi
      join public.orders o on o.id = oi.order_id
      where oi.id = order_item_id
        and o.customer_id = auth.uid()
        and o.status in ('delivered','fulfilled')
    )
  );

drop policy if exists "staff read all reviews" on public.product_reviews;
create policy "staff read all reviews"
  on public.product_reviews for select
  using (public.is_staff_role(array['owner','admin','order_manager','support_agent']));

drop policy if exists "staff moderate reviews" on public.product_reviews;
create policy "staff moderate reviews"
  on public.product_reviews for update
  using (public.is_staff_role(array['owner','admin','order_manager']));

create table if not exists public.review_votes (
  review_id  uuid references public.product_reviews(id) on delete cascade,
  voter_id   uuid references auth.users(id) on delete cascade,
  primary key (review_id, voter_id)
);

alter table public.review_votes enable row level security;

drop policy if exists "authenticated insert vote" on public.review_votes;
create policy "authenticated insert vote"
  on public.review_votes for insert
  with check (auth.uid() = voter_id);

drop policy if exists "authenticated read own vote" on public.review_votes;
create policy "authenticated read own vote"
  on public.review_votes for select
  using (auth.uid() = voter_id);

create or replace function public.increment_review_helpful(p_review_id uuid)
returns void language sql security definer as $$
  update public.product_reviews
  set helpful_count = helpful_count + 1
  where id = p_review_id;
$$;

-- Atomic inventory decrement (called by Stripe webhook handler via service_role)
create or replace function public.decrement_inventory(p_variant_id uuid, p_quantity int)
returns void language sql security definer as $$
  update public.inventory_stock
  set quantity = greatest(0, quantity - p_quantity)
  where variant_id = p_variant_id;

  update public.product_variants
  set stock_quantity = greatest(0, stock_quantity - p_quantity)
  where id = p_variant_id;
$$;
