-- Add Stripe Customer ID to customer profiles
alter table public.customer_profiles
  add column stripe_customer_id text unique;

create index customer_profiles_stripe_idx
  on public.customer_profiles(stripe_customer_id) where stripe_customer_id is not null;

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
