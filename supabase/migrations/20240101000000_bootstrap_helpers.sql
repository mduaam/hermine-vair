-- Helper: updated_at trigger (reusable)
create or replace function public.handle_updated_at()
returns trigger language plpgsql security definer as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Helper: staff role checker (used by all downstream RLS policies)
-- NOTE: staff table must exist before this is called by other policies.
-- This function is created here; policies on other tables reference it after
-- the staff table migration (001) has been applied.
create or replace function public.is_staff_role(allowed_roles text[])
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.staff
    where id = auth.uid()
      and role = any(allowed_roles)
      and active = true
  );
$$;
