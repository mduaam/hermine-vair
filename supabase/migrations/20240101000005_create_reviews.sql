-- ORDER ITEMS: add invitation tracking column
alter table public.order_items
  add column review_invitation_sent boolean default false not null;

-- PRODUCT REVIEWS
create table public.product_reviews (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid references public.products(id) on delete cascade not null,
  order_item_id    uuid references public.order_items(id) on delete set null,
  customer_id      uuid references auth.users(id) on delete set null,
  rating           int check (rating between 1 and 5) not null,
  title            text check (char_length(title) <= 150),
  body             text check (char_length(body) <= 1500),
  status           text check (status in ('pending','approved','rejected'))
                   default 'pending' not null,
  helpful_count    int default 0 not null,
  is_featured      boolean default false not null,
  rejection_reason text,
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null,
  unique(order_item_id)   -- one review per purchased item, enforced at DB level
);

create index product_reviews_product_idx
  on public.product_reviews(product_id) where status = 'approved';
create index product_reviews_customer_idx
  on public.product_reviews(customer_id);
create index product_reviews_pending_idx
  on public.product_reviews(created_at) where status = 'pending';

create trigger product_reviews_updated_at
  before update on public.product_reviews
  for each row execute procedure public.handle_updated_at();

alter table public.product_reviews enable row level security;

-- Public: read approved reviews only
create policy "public read approved reviews"
  on public.product_reviews for select
  using (status = 'approved');

-- Customers: read their own reviews at any status
create policy "customers read own reviews"
  on public.product_reviews for select
  using (auth.uid() = customer_id);

-- Customers: insert — verified purchase enforced both in app layer AND in this RLS policy
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

-- Staff: read all reviews (for moderation queue)
create policy "staff read all reviews"
  on public.product_reviews for select
  using (public.is_staff_role(array['owner','admin','order_manager','support_agent']));

-- Staff: moderate (approve / reject / feature)
create policy "staff moderate reviews"
  on public.product_reviews for update
  using (public.is_staff_role(array['owner','admin','order_manager']));

-- REVIEW VOTES (helpfulness)
create table public.review_votes (
  review_id  uuid references public.product_reviews(id) on delete cascade,
  voter_id   uuid references auth.users(id) on delete cascade,
  primary key (review_id, voter_id)
);

alter table public.review_votes enable row level security;

create policy "authenticated insert vote"
  on public.review_votes for insert
  with check (auth.uid() = voter_id);

create policy "authenticated read own vote"
  on public.review_votes for select
  using (auth.uid() = voter_id);

-- RPC: increment helpful count (called by /api/reviews/[id]/helpful)
create or replace function public.increment_review_helpful(p_review_id uuid)
returns void language sql security definer as $$
  update public.product_reviews
  set helpful_count = helpful_count + 1
  where id = p_review_id;
$$;
