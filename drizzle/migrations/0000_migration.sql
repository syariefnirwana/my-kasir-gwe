create type public.app_role as enum ('buyer','seller','admin','superadmin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone_number text unique,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Own roles read" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Onboarding: user picks buyer or seller once
create or replace function public.choose_initial_role(_role public.app_role)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if _role not in ('buyer','seller') then raise exception 'Invalid role'; end if;
  if exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('buyer','seller')) then
    raise exception 'Role already chosen';
  end if;
  insert into public.user_roles (user_id, role) values (auth.uid(), _role);
end $$;
revoke execute on function public.choose_initial_role(public.app_role) from public, anon;
grant execute on function public.choose_initial_role(public.app_role) to authenticated;

-- Locked super admin
create or replace function public.protect_superadmin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.role = 'superadmin' and exists (
    select 1 from auth.users where id = old.user_id and lower(email) = 'syariefnirwana35@gmail.com'
  ) then
    raise exception 'Super Admin role is locked';
  end if;
  return old;
end $$;
create trigger protect_superadmin_delete before delete or update on public.user_roles
for each row execute function public.protect_superadmin();

-- Profile + superadmin on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, phone_number, email, full_name)
  values (new.id, new.raw_user_meta_data->>'phone_number', new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  if lower(new.email) = 'syariefnirwana35@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'superadmin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- OTP store (server only)
create table public.otp_codes (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null,
  code_hash text not null,
  attempts int not null default 0,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index otp_codes_phone_idx on public.otp_codes (phone_number, created_at desc);
grant all on public.otp_codes to service_role;
alter table public.otp_codes enable row level security;