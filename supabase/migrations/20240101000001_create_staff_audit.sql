-- STAFF TABLE (must come before all other tables that use is_staff_role)
create table public.staff (
  id      uuid primary key references auth.users(id) on delete cascade,
  role    text check (role in (
            'owner','admin','product_specialist',
            'order_manager','content_editor','support_agent'
          )) not null,
  active  boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger staff_updated_at
  before update on public.staff
  for each row execute procedure public.handle_updated_at();

alter table public.staff enable row level security;

create policy "staff read own row"
  on public.staff for select
  using (auth.uid() = id);

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

-- AUDIT LOG
create table public.audit_log (
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

create index audit_log_actor_idx    on public.audit_log(actor_id);
create index audit_log_resource_idx on public.audit_log(resource_type, resource_id);
create index audit_log_created_idx  on public.audit_log(created_at desc);

alter table public.audit_log enable row level security;

create policy "owner_admin read audit_log"
  on public.audit_log for select
  using (public.is_staff_role(array['owner','admin']));
-- Insert is performed by service_role (withAudit wrapper) — bypasses RLS.
