-- Asos: turlar, beshta til domeni, administratorlar roʻyxati va umumiy yordamchi funksiyalar

-- Keyin qoʻshiladigan jadval va funksiyalar anon rolga oʻz-oʻzidan ochilmasin: har biriga aniq GRANT beriladi
alter default privileges for role postgres in schema public revoke all on tables from anon;
alter default privileges for role postgres in schema public revoke all on sequences from anon;
alter default privileges for role postgres in schema public revoke all on functions from anon;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create type public.content_status as enum ('confirmed', 'draft', 'pending');
create type public.art_slot as enum ('art-1', 'art-2', 'art-3', 'art-4', 'art-5', 'art-6', 'art-7');
create type public.person_kind as enum ('leader', 'expert');
create type public.partner_group as enum ('state', 'international', 'creative', 'sponsors');
create type public.social_network as enum ('telegram', 'instagram', 'youtube', 'facebook');
create type public.media_kind as enum ('image', 'video');
create type public.media_origin as enum ('static', 'storage');
create type public.upop_frame as enum ('stage', 'gold', 'glass', 'ticket', 'film', 'mat');
create type public.upop_motion as enum (
  'curtain', 'slide-end', 'wipe', 'rise', 'iris', 'tilt', 'slide-start', 'zoom'
);
create type public.project_fact as enum ('format', 'place', 'schedule', 'teacher');

-- Beshta til kaliti aniq, boʻsh satr yoʻq; CASE tartibi skalyarga jsonb_array_elements tegmasligini kafolatlaydi
create function private.is_l10n(v jsonb, list boolean) returns boolean
language sql immutable set search_path = '' as $$
  select case
    when v is null then true
    when jsonb_typeof(v) <> 'object' then false
    when not (v ?& array['uz', 'oz', 'ozbekca', 'ru', 'en'])
      or (select count(*) from jsonb_object_keys(v)) <> 5 then false
    when not list then coalesce((select bool_and(jsonb_typeof(e.value) = 'string'
                                   and length(btrim(e.value #>> '{}')) > 0)
                                 from jsonb_each(v) e), false)
    when (select bool_and(jsonb_typeof(e.value) = 'array') from jsonb_each(v) e) then
      coalesce((select bool_and(jsonb_typeof(x) = 'string' and length(btrim(x #>> '{}')) > 0)
                from jsonb_each(v) e, jsonb_array_elements(e.value) x), true)
    else false end
$$;

create domain public.l10n_text as jsonb check (private.is_l10n(value, false));
create domain public.l10n_list as jsonb check (private.is_l10n(value, true));

create table private.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table private.admins enable row level security;
revoke all on private.admins from public, anon, authenticated;

-- Yagona administrator: jadvalda boʻlmagan har qanday «authenticated» (masalan anonim) yozolmaydi
create function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from private.admins a where a.user_id = (select auth.uid()))
  -- TOTP yoqilgach: and (select auth.jwt() ->> 'aal') = 'aal2'
$$;

create function private.require_admin() returns void
language plpgsql stable set search_path = '' as $$
begin
  if not (select private.is_admin()) then
    raise exception 'ruxsat yoʻq' using errcode = '42501';
  end if;
end $$;

-- Kalit DOM id asosi boʻladi: faqat kichik lotin harf va raqam
create function private.new_key(prefix text) returns text
language sql volatile set search_path = '' as $$
  select prefix || '-' || substr(md5(gen_random_uuid()::text), 1, 8)
$$;

-- now() emas: bir-birini qoplagan tranzaksiyalarda ham har saqlash yangi, oʻsuvchi qiymat oladi
create function private.touch() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end $$;

revoke all on function private.is_l10n(jsonb, boolean) from public, anon;
grant execute on function private.is_l10n(jsonb, boolean) to authenticated, service_role;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated, service_role;
revoke all on function private.require_admin() from public, anon;
grant execute on function private.require_admin() to authenticated;
revoke all on function private.new_key(text) from public, anon;
grant execute on function private.new_key(text) to authenticated, service_role;
revoke all on function private.touch() from public, anon, authenticated;
