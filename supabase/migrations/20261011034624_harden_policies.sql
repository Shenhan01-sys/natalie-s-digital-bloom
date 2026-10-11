-- Security/performance hardening after Supabase advisor review.
-- * is_admin() moves to a private schema so it is no longer callable through the API.
-- * Public read policies are split per role so anon never evaluates the admin check.
-- * Admin write policies are per action (no overlapping permissive SELECT policies).
-- * auth calls in policies are wrapped in (select ...) so they run once per query.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- admins ---------------------------------------------------------------------
drop policy "admins can see themselves" on public.admins;
create policy "admins can see themselves" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- site_settings --------------------------------------------------------------
drop policy "settings are public" on public.site_settings;
drop policy "admins manage settings" on public.site_settings;
create policy "settings are public" on public.site_settings
  for select to anon, authenticated using (true);
create policy "admins insert settings" on public.site_settings
  for insert to authenticated with check ((select private.is_admin()));
create policy "admins update settings" on public.site_settings
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete settings" on public.site_settings
  for delete to authenticated using ((select private.is_admin()));

-- content_items --------------------------------------------------------------
drop policy "visible items are public" on public.content_items;
drop policy "admins manage items" on public.content_items;
create policy "visitors read visible items" on public.content_items
  for select to anon using (visible);
create policy "users read visible items, admins read all" on public.content_items
  for select to authenticated using (visible or (select private.is_admin()));
create policy "admins insert items" on public.content_items
  for insert to authenticated with check ((select private.is_admin()));
create policy "admins update items" on public.content_items
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete items" on public.content_items
  for delete to authenticated using ((select private.is_admin()));

-- products -------------------------------------------------------------------
drop policy "published products are public" on public.products;
drop policy "admins manage products" on public.products;
create policy "visitors read published products" on public.products
  for select to anon using (published);
create policy "users read published, admins read all" on public.products
  for select to authenticated using (published or (select private.is_admin()));
create policy "admins insert products" on public.products
  for insert to authenticated with check ((select private.is_admin()));
create policy "admins update products" on public.products
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete products" on public.products
  for delete to authenticated using ((select private.is_admin()));

-- product_secrets ------------------------------------------------------------
drop policy "admins manage secrets" on public.product_secrets;
create policy "admins manage secrets" on public.product_secrets
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- orders ---------------------------------------------------------------------
drop policy "admins read orders" on public.orders;
drop policy "admins update orders" on public.orders;
drop policy "admins delete orders" on public.orders;
create policy "admins read orders" on public.orders
  for select to authenticated using ((select private.is_admin()));
create policy "admins update orders" on public.orders
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete orders" on public.orders
  for delete to authenticated using ((select private.is_admin()));
create index if not exists orders_product_id on public.orders (product_id);

-- storage --------------------------------------------------------------------
drop policy "admins upload media" on storage.objects;
drop policy "admins update media" on storage.objects;
drop policy "admins delete media" on storage.objects;
drop policy "admins read proofs" on storage.objects;
drop policy "admins delete proofs" on storage.objects;
create policy "admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
create policy "admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
create policy "admins read proofs" on storage.objects for select to authenticated
  using (bucket_id = 'proofs' and (select private.is_admin()));
create policy "admins delete proofs" on storage.objects for delete to authenticated
  using (bucket_id = 'proofs' and (select private.is_admin()));

-- The old public helper is no longer referenced by any policy.
drop function public.is_admin();
