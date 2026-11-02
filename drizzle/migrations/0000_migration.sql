create type public.app_role as enum ('admin');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- First account ever created becomes the owner (admin).
create or replace function public.make_first_user_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.make_first_user_admin();

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  pickup_at timestamptz not null,
  items jsonb not null,
  total_eur numeric(10,2) not null,
  free_mekitsa boolean not null default false,
  notes text,
  lang text not null default 'bg',
  status text not null default 'new',
  created_at timestamptz not null default now()
);
grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "admin read orders" on public.orders for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admin update orders" on public.orders for update to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.office_subscriptions (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  people int not null,
  day text not null,
  address text not null,
  notes text,
  created_at timestamptz not null default now()
);
grant select on public.office_subscriptions to authenticated;
grant all on public.office_subscriptions to service_role;
alter table public.office_subscriptions enable row level security;
create policy "admin read subs" on public.office_subscriptions for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.loyalty_cards (
  phone text primary key,
  stamps int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.loyalty_cards to authenticated;
grant all on public.loyalty_cards to service_role;
alter table public.loyalty_cards enable row level security;
create policy "admin read loyalty" on public.loyalty_cards for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.add_stamp(_phone text)
returns int language sql security definer set search_path = public as $$
  insert into public.loyalty_cards (phone, stamps) values (_phone, 1)
  on conflict (phone) do update set stamps = loyalty_cards.stamps + 1, updated_at = now()
  returning stamps
$$;
revoke execute on function public.add_stamp(text) from public, anon, authenticated;
grant execute on function public.add_stamp(text) to service_role;

create table public.site_status (
  id int primary key default 1 check (id = 1),
  fresh_at text,
  updated_at timestamptz not null default now()
);
grant select on public.site_status to anon, authenticated;
grant update on public.site_status to authenticated;
grant all on public.site_status to service_role;
alter table public.site_status enable row level security;
create policy "public read status" on public.site_status for select to anon, authenticated using (true);
create policy "admin update status" on public.site_status for update to authenticated using (public.has_role(auth.uid(), 'admin'));
insert into public.site_status (id, fresh_at) values (1, '07:15');