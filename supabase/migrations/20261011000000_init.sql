-- Natalie's site: landing content, shop, orders.
-- Public visitors can read published content and place orders through RPCs.
-- Only users listed in public.admins can change anything.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
create policy "admins can see themselves" on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Landing page content
-- ---------------------------------------------------------------------------
-- Singleton blobs: 'profile', 'shop'
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
create policy "settings are public" on public.site_settings for select using (true);
create policy "admins manage settings" on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create trigger site_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- Repeating items (education rows, experience cards, works, contacts, shop links...)
create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in (
    'education', 'experience', 'language', 'software', 'client',
    'contact', 'category', 'work', 'shop_link'
  )),
  data jsonb not null default '{}'::jsonb,
  sort integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index content_items_section_sort on public.content_items (section, sort);
alter table public.content_items enable row level security;
create policy "visible items are public" on public.content_items for select
  using (visible or public.is_admin());
create policy "admins manage items" on public.content_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create trigger content_items_touch before update on public.content_items
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Shop
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 140),
  subtitle text,
  description text,
  price integer not null default 0 check (price >= 0),
  compare_at_price integer check (compare_at_price is null or compare_at_price >= 0),
  cover_url text,
  gallery jsonb not null default '[]'::jsonb,
  category text,
  badge text,
  published boolean not null default false,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_sort on public.products (sort, created_at desc);
alter table public.products enable row level security;
create policy "published products are public" on public.products for select
  using (published or public.is_admin());
create policy "admins manage products" on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- What the buyer receives. Never readable by the public directly.
create table public.product_secrets (
  product_id uuid primary key references public.products (id) on delete cascade,
  delivery_url text,
  delivery_note text
);
alter table public.product_secrets enable row level security;
create policy "admins manage secrets" on public.product_secrets for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('NT-' || upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 6))),
  product_id uuid references public.products (id) on delete set null,
  product_title text not null,
  amount integer not null check (amount >= 0),
  buyer_name text not null check (char_length(buyer_name) between 1 and 100),
  buyer_email text not null check (buyer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  buyer_whatsapp text check (buyer_whatsapp is null or char_length(buyer_whatsapp) <= 30),
  note text check (note is null or char_length(note) <= 1000),
  proof_path text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_created on public.orders (created_at desc);
alter table public.orders enable row level security;
create policy "admins read orders" on public.orders for select to authenticated using (public.is_admin());
create policy "admins update orders" on public.orders for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admins delete orders" on public.orders for delete to authenticated using (public.is_admin());
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- Buyers create orders only through this function so the price always comes
-- from the database, never from the browser.
create or replace function public.create_order(
  p_product_id uuid,
  p_name text,
  p_email text,
  p_whatsapp text default null,
  p_note text default null,
  p_proof_path text default null
)
returns table (id uuid, code text, status text)
language plpgsql security definer set search_path = public as $$
declare
  v_product public.products;
  v_status text;
begin
  select * into v_product from public.products p where p.id = p_product_id and p.published;
  if not found then
    raise exception 'Product is not available';
  end if;

  if v_product.price > 0 and coalesce(p_proof_path, '') = '' then
    raise exception 'Payment proof is required';
  end if;

  if p_proof_path is not null and p_proof_path !~ '^[0-9a-f-]{36}\.(png|jpe?g|webp|pdf)$' then
    raise exception 'Invalid payment proof';
  end if;

  v_status := case when v_product.price = 0 then 'paid' else 'pending' end;

  return query
  insert into public.orders as o (product_id, product_title, amount, buyer_name, buyer_email, buyer_whatsapp, note, proof_path, status)
  values (
    v_product.id, v_product.title, v_product.price,
    trim(p_name), lower(trim(p_email)), nullif(trim(p_whatsapp), ''), nullif(trim(p_note), ''),
    p_proof_path, v_status
  )
  returning o.id, o.code, o.status;
end $$;
revoke all on function public.create_order(uuid, text, text, text, text, text) from public;
grant execute on function public.create_order(uuid, text, text, text, text, text) to anon, authenticated;

-- Order status page. The order id (a random uuid) acts as the buyer's private
-- link; the download link is only revealed once the order is paid.
create or replace function public.get_order(p_id uuid)
returns table (
  code text, status text, product_title text, product_slug text, amount integer,
  buyer_name text, created_at timestamptz, admin_note text,
  delivery_url text, delivery_note text
)
language sql stable security definer set search_path = public as $$
  select o.code, o.status, o.product_title, p.slug, o.amount, o.buyer_name, o.created_at, o.admin_note,
         case when o.status = 'paid' then s.delivery_url end,
         case when o.status = 'paid' then s.delivery_note end
  from public.orders o
  left join public.products p on p.id = o.product_id
  left join public.product_secrets s on s.product_id = o.product_id
  where o.id = p_id;
$$;
revoke all on function public.get_order(uuid) from public;
grant execute on function public.get_order(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('media', 'media', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('proofs', 'proofs', false, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;

create policy "media is public" on storage.objects for select using (bucket_id = 'media');
create policy "admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
create policy "admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());
create policy "admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

create policy "anyone uploads a payment proof" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'proofs' and name ~ '^[0-9a-f-]{36}\.(png|jpe?g|webp|pdf)$');
create policy "admins read proofs" on storage.objects for select to authenticated
  using (bucket_id = 'proofs' and public.is_admin());
create policy "admins delete proofs" on storage.objects for delete to authenticated
  using (bucket_id = 'proofs' and public.is_admin());
