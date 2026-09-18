-- CATEGORIES
create table public.categories (
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

create index categories_parent_idx on public.categories(parent_id);
create index categories_slug_idx   on public.categories(slug);

create trigger categories_updated_at
  before update on public.categories
  for each row execute procedure public.handle_updated_at();

alter table public.categories enable row level security;
create policy "public read categories"
  on public.categories for select using (true);
create policy "product_specialist write categories"
  on public.categories for all
  using (public.is_staff_role(array['owner','admin','product_specialist']));

-- PRODUCTS
create table public.products (
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

create index products_category_idx    on public.products(category_id);
create index products_status_idx      on public.products(status);
create index products_material_idx    on public.products(material);
create index products_best_seller_idx on public.products(is_best_seller) where is_best_seller = true;

create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.handle_updated_at();

alter table public.products enable row level security;
create policy "public read active products"
  on public.products for select using (status = 'active');
create policy "staff read all products"
  on public.products for select
  using (public.is_staff_role(array['owner','admin','product_specialist','order_manager']));
create policy "product_specialist write products"
  on public.products for all
  using (public.is_staff_role(array['owner','admin','product_specialist']));

-- PRODUCT CATEGORIES (secondary / many-to-many)
create table public.product_categories (
  product_id  uuid references public.products(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

alter table public.product_categories enable row level security;
create policy "public read product_categories"
  on public.product_categories for select using (true);
create policy "product_specialist write product_categories"
  on public.product_categories for all
  using (public.is_staff_role(array['owner','admin','product_specialist']));

-- PRODUCT VARIANTS
create table public.product_variants (
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

create index product_variants_product_idx on public.product_variants(product_id);

create trigger product_variants_updated_at
  before update on public.product_variants
  for each row execute procedure public.handle_updated_at();

alter table public.product_variants enable row level security;
create policy "public read variants"
  on public.product_variants for select using (true);
create policy "product_specialist write variants"
  on public.product_variants for all
  using (public.is_staff_role(array['owner','admin','product_specialist']));

-- PRODUCT IMAGES
create table public.product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid references public.products(id) on delete cascade not null,
  url          text not null,
  alt_text_fr  text not null,   -- NOT NULL enforced at DB level
  alt_text_en  text not null,   -- NOT NULL enforced at DB level
  position     int default 0 not null,
  created_at   timestamptz default now() not null
);

create index product_images_product_idx on public.product_images(product_id, position);

alter table public.product_images enable row level security;
create policy "public read product_images"
  on public.product_images for select using (true);
create policy "product_specialist write product_images"
  on public.product_images for all
  using (public.is_staff_role(array['owner','admin','product_specialist']));

-- INVENTORY LOCATIONS
create table public.inventory_locations (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  country   text not null,
  created_at timestamptz default now() not null
);

alter table public.inventory_locations enable row level security;
create policy "public read locations"
  on public.inventory_locations for select using (true);
create policy "owner_admin write locations"
  on public.inventory_locations for all
  using (public.is_staff_role(array['owner','admin']));

-- INVENTORY STOCK
create table public.inventory_stock (
  variant_id  uuid references public.product_variants(id) on delete cascade,
  location_id uuid references public.inventory_locations(id) on delete cascade,
  quantity    int default 0 not null,
  primary key (variant_id, location_id)
);

alter table public.inventory_stock enable row level security;
create policy "public read inventory_stock"
  on public.inventory_stock for select using (true);
create policy "product_specialist write inventory_stock"
  on public.inventory_stock for all
  using (public.is_staff_role(array['owner','admin','product_specialist','order_manager']));
