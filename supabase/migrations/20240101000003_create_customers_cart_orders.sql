-- CUSTOMER PROFILES
create table public.customer_profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  first_name          text,
  last_name           text,
  phone               text,
  locale              text default 'fr' not null,
  preferred_currency  text default 'EUR' not null,
  marketing_opt_in    boolean default false not null,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);

create trigger customer_profiles_updated_at
  before update on public.customer_profiles
  for each row execute procedure public.handle_updated_at();

alter table public.customer_profiles enable row level security;
create policy "customers manage own profile"
  on public.customer_profiles for all using (auth.uid() = id);
create policy "staff read customer profiles"
  on public.customer_profiles for select
  using (public.is_staff_role(array['owner','admin','order_manager','support_agent']));

-- ADDRESSES
create table public.addresses (
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

create index addresses_customer_idx on public.addresses(customer_id);

create trigger addresses_updated_at
  before update on public.addresses
  for each row execute procedure public.handle_updated_at();

alter table public.addresses enable row level security;
create policy "customers manage own addresses"
  on public.addresses for all using (auth.uid() = customer_id);
create policy "order_manager read addresses"
  on public.addresses for select
  using (public.is_staff_role(array['owner','admin','order_manager']));

-- CARTS
create table public.carts (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid references auth.users(id) on delete set null,
  session_token   text,
  currency        text default 'EUR' not null,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null,
  constraint carts_has_owner check (customer_id is not null or session_token is not null)
);

create index carts_customer_idx       on public.carts(customer_id) where customer_id is not null;
create index carts_session_token_idx  on public.carts(session_token) where session_token is not null;

create trigger carts_updated_at
  before update on public.carts
  for each row execute procedure public.handle_updated_at();

alter table public.carts enable row level security;
create policy "customers access own cart"
  on public.carts for all
  using (
    auth.uid() = customer_id
    OR session_token = current_setting('app.session_token', true)
  );

-- CART ITEMS
create table public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  cart_id     uuid references public.carts(id) on delete cascade not null,
  variant_id  uuid references public.product_variants(id) on delete cascade not null,
  quantity    int not null check (quantity > 0),
  unit_price  numeric(10,2) not null,
  created_at  timestamptz default now() not null
);

create index cart_items_cart_idx on public.cart_items(cart_id);

alter table public.cart_items enable row level security;
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

-- WISHLISTS
create table public.wishlists (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete cascade not null,
  product_id  uuid references public.products(id) on delete cascade not null,
  created_at  timestamptz default now() not null,
  unique(customer_id, product_id)
);

alter table public.wishlists enable row level security;
create policy "customers manage own wishlist"
  on public.wishlists for all using (auth.uid() = customer_id);

-- ORDERS
create table public.orders (
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

create index orders_customer_idx    on public.orders(customer_id) where customer_id is not null;
create index orders_status_idx      on public.orders(status);
create index orders_created_idx     on public.orders(created_at desc);
create index orders_number_idx      on public.orders(order_number);

create trigger orders_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();

alter table public.orders enable row level security;
create policy "customers read own orders"
  on public.orders for select
  using (auth.uid() = customer_id);
create policy "staff read all orders"
  on public.orders for select
  using (public.is_staff_role(array['owner','admin','order_manager','support_agent']));
create policy "order_manager update orders"
  on public.orders for update
  using (public.is_staff_role(array['owner','admin','order_manager']));

-- ORDER ITEMS
create table public.order_items (
  id                      uuid primary key default gen_random_uuid(),
  order_id                uuid references public.orders(id) on delete cascade not null,
  variant_id              uuid references public.product_variants(id) on delete set null,
  product_name_snapshot   text not null,
  quantity                int not null check (quantity > 0),
  unit_price              numeric(10,2) not null,
  total                   numeric(10,2) not null,
  created_at              timestamptz default now() not null
);

create index order_items_order_idx on public.order_items(order_id);

alter table public.order_items enable row level security;
create policy "customers read own order_items"
  on public.order_items for select
  using (exists (select 1 from public.orders where id = order_id and customer_id = auth.uid()));
create policy "staff read all order_items"
  on public.order_items for select
  using (public.is_staff_role(array['owner','admin','order_manager','support_agent']));

-- ORDER EVENTS
create table public.order_events (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references public.orders(id) on delete cascade not null,
  type        text not null,
  message     text,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz default now() not null
);

create index order_events_order_idx on public.order_events(order_id, created_at);

alter table public.order_events enable row level security;
create policy "customers read own order_events"
  on public.order_events for select
  using (exists (select 1 from public.orders where id = order_id and customer_id = auth.uid()));
create policy "staff manage order_events"
  on public.order_events for all
  using (public.is_staff_role(array['owner','admin','order_manager','support_agent']));

-- RETURNS
create table public.returns (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid references public.orders(id) on delete cascade not null,
  status          text check (status in ('requested','approved','denied','refunded')) default 'requested' not null,
  reason          text,
  refund_amount   numeric(10,2),
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

create trigger returns_updated_at
  before update on public.returns
  for each row execute procedure public.handle_updated_at();

alter table public.returns enable row level security;
create policy "customers read own returns"
  on public.returns for select
  using (exists (select 1 from public.orders where id = order_id and customer_id = auth.uid()));
create policy "customers insert own returns"
  on public.returns for insert
  with check (exists (select 1 from public.orders where id = order_id and customer_id = auth.uid()));
create policy "order_manager manage returns"
  on public.returns for all
  using (public.is_staff_role(array['owner','admin','order_manager']));
