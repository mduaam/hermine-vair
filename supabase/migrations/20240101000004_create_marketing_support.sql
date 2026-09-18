-- NEWSLETTER SUBSCRIBERS
create table public.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  locale          text not null,
  source          text,
  subscribed_at   timestamptz default now() not null
);

alter table public.newsletter_subscribers enable row level security;
create policy "public insert newsletter"
  on public.newsletter_subscribers for insert with check (true);
create policy "staff manage newsletter"
  on public.newsletter_subscribers for all
  using (public.is_staff_role(array['owner','admin','order_manager']));

-- CONTACT REQUESTS
create table public.contact_requests (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  email     text not null,
  subject   text not null,
  message   text not null,
  status    text default 'new' not null,
  created_at timestamptz default now() not null
);

alter table public.contact_requests enable row level security;
create policy "public insert contact_requests"
  on public.contact_requests for insert with check (true);
create policy "staff manage contact_requests"
  on public.contact_requests for all
  using (public.is_staff_role(array['owner','admin','support_agent']));

-- DISCOUNTS
create table public.discounts (
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

create trigger discounts_updated_at
  before update on public.discounts
  for each row execute procedure public.handle_updated_at();

alter table public.discounts enable row level security;
create policy "public read active discounts"
  on public.discounts for select
  using (
    active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at   IS NULL OR ends_at   >= now())
  );
create policy "admin manage discounts"
  on public.discounts for all
  using (public.is_staff_role(array['owner','admin','order_manager']));

-- REGION RULES (fur compliance + currency/locale defaults)
create table public.region_rules (
  id                  uuid primary key default gen_random_uuid(),
  country_code        text unique not null,  -- ISO 3166-1 alpha-2
  fur_sales_allowed   boolean default true not null,
  currency            text default 'EUR' not null,
  default_locale      text default 'fr' not null,
  duties_note_fr      text,
  duties_note_en      text,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);

create trigger region_rules_updated_at
  before update on public.region_rules
  for each row execute procedure public.handle_updated_at();

alter table public.region_rules enable row level security;
create policy "public read region_rules"
  on public.region_rules for select using (true);
create policy "owner_admin manage region_rules"
  on public.region_rules for all
  using (public.is_staff_role(array['owner','admin']));
