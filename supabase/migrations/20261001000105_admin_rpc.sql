-- Admin RPC lari. Hammasi security invoker (RLS amal qiladi, faqat jurnal definer), birinchi qator
-- is_admin tekshiruvi. Mavjud yozuv kutilgan updated_at bilan oʻzgaradi: boshqa oynada saqlangan boʻlsa
-- 40001 «eskirgan». Har oʻzgarish private.content_log ga admin shaklidagi JSON bilan yoziladi, shu sabab
-- jurnaldan qaytarish = oʻsha saqlash RPC sini before bilan chaqirish.

-- Yordamchilar ------------------------------------------------------------------------------------

create function private.log_change(p_entity text, p_key text, p_action text,
                                   p_before jsonb, p_after jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not (select private.is_admin()) then
    raise exception 'ruxsat yoʻq' using errcode = '42501';
  end if;
  insert into private.content_log (entity, entity_key, action, before, after)
  values (p_entity, p_key, p_action, p_before, p_after);
end $$;

-- JSON null va yoʻq kalit bir xil: ustunga SQL NULL yoziladi (aks holda domen tekshiruvi yiqiladi)
create function private.jnull(v jsonb) returns jsonb
language sql immutable set search_path = '' as $$
  select nullif(v, 'null'::jsonb)
$$;

create function private.text_array(v jsonb) returns text[]
language sql immutable set search_path = '' as $$
  select case when jsonb_typeof(v) = 'array' then array(select jsonb_array_elements_text(v)) end
$$;

-- Muqova, surat, portret va logotip joyiga video tushmasin
create function private.assert_images(ids uuid[]) returns void
language plpgsql stable set search_path = '' as $$
begin
  if exists (select 1 from public.media m where m.id = any (ids) and m.kind <> 'image') then
    raise exception 'bu joyga faqat rasm qoʻyiladi' using errcode = '22023';
  end if;
end $$;

-- Admin shakli: saqlash RPC siga beriladigan kirish bilan aynan bir xil --------------------------

create function private.news_admin_json(n public.news) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', n.id, 'slug', n.slug, 'status', n.status, 'date', n.published_on,
    'topic', n.topic, 'title', n.title, 'lead', n.lead, 'body', n.body, 'quote', n.quote,
    'cover', jsonb_build_object('mediaId', n.cover_id, 'alt', n.cover_alt, 'status', n.cover_status),
    'story', jsonb_build_object('primary', n.story_primary, 'secondary', n.story_secondary),
    'photos', coalesce((select jsonb_agg(jsonb_build_object('mediaId', p.media_id) order by p.position)
                        from public.news_photos p where p.news_id = n.id), '[]'::jsonb))
$$;

create function private.person_admin_json(x public.people) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', x.id, 'key', x.key, 'kind', x.kind, 'status', x.status, 'name', x.name, 'role', x.role,
    'field', x.field, 'bio', x.bio, 'photoId', x.photo_id, 'email', x.email, 'sortOrder', x.sort_order)
$$;

create function private.partner_admin_json(x public.partners) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', x.id, 'key', x.key, 'status', x.status, 'group', x."group", 'name', x.name,
    'logoId', x.logo_id, 'href', x.href, 'sortOrder', x.sort_order)
$$;

create function private.milestone_admin_json(x public.milestones) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', x.id, 'key', x.key, 'status', x.status, 'year', x.year, 'title', x.title,
    'icon', x.icon, 'sortOrder', x.sort_order)
$$;

create function private.contacts_admin_json(c public.site_contacts) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'address', jsonb_build_object('value', c.address, 'status', coalesce(c.address_status, 'pending')),
    'postalCode', c.postal_code,
    'locality', c.locality,
    'phones', jsonb_build_object('value', case when cardinality(c.phones) > 0
                                               then to_jsonb(c.phones) end,
                                 'status', coalesce(c.phones_status, 'pending')),
    'email', jsonb_build_object('value', c.email, 'status', coalesce(c.email_status, 'pending')),
    'telegram', jsonb_build_object('value', c.telegram,
                                   'status', coalesce(c.telegram_status, 'pending')),
    'hours', jsonb_build_object('value', c.hours, 'status', coalesce(c.hours_status, 'pending')),
    'map', jsonb_build_object('value', case when c.map_lat is not null
                                            then jsonb_build_object('lat', c.map_lat,
                                                                    'lng', c.map_lng) end,
                              'status', coalesce(c.map_status, 'pending')))
$$;

create function private.socials_admin_json() returns jsonb
language sql stable set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object('id', s.network, 'href', s.href, 'label', s.label,
                                               'status', s.status)
                            order by s.sort_order, s.network), '[]'::jsonb)
  from public.social_links s
$$;

-- Videolar hozircha kodda boshqariladi: admin faqat tavsif va holatni oʻzgartiradi
create function private.project_admin_json(x public.projects) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'key', x.key, 'status', x.status, 'flagship', x.flagship, 'name', x.name, 'tagline', x.tagline,
    'age', jsonb_build_object('from', x.age_from, 'to', x.age_to, 'status', x.age_status),
    'format', private.fact_json(x.key, 'format'),
    'place', private.fact_json(x.key, 'place'),
    'schedule', private.fact_json(x.key, 'schedule'),
    'cost', jsonb_build_object('free', x.cost_free, 'status', x.cost_status),
    'teacher', private.fact_json(x.key, 'teacher'),
    'highlights', x.highlights,
    'external', jsonb_build_object('href', x.external_href, 'label', x.external_label),
    'media', coalesce((select jsonb_object_agg(pm.role,
                                case when pm.status is null then jsonb_build_object('alt', pm.alt)
                                     else jsonb_build_object('alt', pm.alt, 'status', pm.status) end)
                       from public.project_media pm where pm.project_key = x.key), '{}'::jsonb))
$$;

create function private.upop_admin_json() returns jsonb
language sql stable set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object(
                    'position', s.position, 'mediaId', s.media_id, 'posterId', s.poster_id,
                    'frame', s.frame, 'motion', s.motion, 'alt', s.alt) order by s.position),
                  '[]'::jsonb)
  from public.upop_shots s
$$;

create function private.media_admin_json(m public.media) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', m.id, 'kind', m.kind, 'origin', m.origin, 'src', m.src, 'storagePrefix', m.storage_prefix,
    'variantBase', m.variant_base, 'variantWidths', to_jsonb(m.variant_widths),
    'width', m.width, 'height', m.height, 'blur', m.blur, 'bright', m.bright, 'bytes', m.bytes,
    'durationS', m.duration_s, 'posterId', m.poster_id)
$$;

-- Yangiliklar -------------------------------------------------------------------------------------

create function public.admin_save_news(p jsonb, expected timestamptz default null)
returns table (id uuid, slug text, old_slug text, updated_at timestamptz)
language plpgsql security invoker set search_path = '' as $$
#variable_conflict use_column
declare
  v_id uuid;
  v_before jsonb;
  v_row public.news;
begin
  perform private.require_admin();
  v_id := nullif(p ->> 'id', '')::uuid;
  if v_id is not null then
    select private.news_admin_json(n) into v_before from public.news n where n.id = v_id for update;
  end if;
  -- expected berilgan, lekin yozuv yoʻq: uni boshqa oynada oʻchirishgan (yangi yozuv expected qiymatisiz keladi)
  if v_before is null and expected is not null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;
  perform private.assert_images(
    array(select (e ->> 'mediaId')::uuid
          from jsonb_array_elements(coalesce(private.jnull(p -> 'photos'), '[]'::jsonb)) e)
    || nullif(p #>> '{cover,mediaId}', '')::uuid);

  insert into public.news as n (id, slug, status, published_on, topic, title, lead, body, quote,
                                cover_id, cover_alt, cover_status, story_primary, story_secondary)
  values (coalesce(v_id, gen_random_uuid()), p ->> 'slug', (p ->> 'status')::public.content_status,
          coalesce((p ->> 'date')::date, current_date),
          p -> 'topic', p -> 'title', p -> 'lead', p -> 'body', private.jnull(p -> 'quote'),
          nullif(p #>> '{cover,mediaId}', '')::uuid, p #> '{cover,alt}',
          coalesce((p #>> '{cover,status}')::public.content_status, 'confirmed'),
          coalesce((p #>> '{story,primary}')::public.art_slot, 'art-1'),
          coalesce((p #>> '{story,secondary}')::public.art_slot, 'art-2'))
  on conflict (id) do update set
    slug = excluded.slug, status = excluded.status, published_on = excluded.published_on,
    topic = excluded.topic, title = excluded.title, lead = excluded.lead, body = excluded.body,
    quote = excluded.quote, cover_id = excluded.cover_id, cover_alt = excluded.cover_alt,
    cover_status = excluded.cover_status, story_primary = excluded.story_primary,
    story_secondary = excluded.story_secondary
    where n.updated_at = expected
  returning n.* into v_row;
  -- Boshqa oynada saqlangan boʻlsa ustidan yozilmaydi
  if not found then
    raise exception 'eskirgan' using errcode = '40001';
  end if;

  -- Yangi slug eski yoʻnaltirishga toʻgʻri kelsa: oʻzining eski nomi boʻlsa yoʻnaltirish oʻchadi,
  -- begona boʻlsa xato
  delete from public.news_slug_redirects r where r.old_slug = v_row.slug and r.news_id = v_row.id;
  if exists (select 1 from public.news_slug_redirects r where r.old_slug = v_row.slug) then
    raise exception 'slug band' using errcode = '23505';
  end if;
  -- Tasdiqlangan maqola havolasi tarqalgan boʻlishi mumkin: eski manzil yangisiga 308 bilan oʻtadi
  if v_before is not null and v_before ->> 'slug' <> v_row.slug
     and v_before ->> 'status' = 'confirmed' then
    insert into public.news_slug_redirects as r (old_slug, news_id) values (v_before ->> 'slug', v_row.id)
    on conflict (old_slug) do update set news_id = excluded.news_id;
  end if;

  delete from public.news_photos ph where ph.news_id = v_row.id;
  insert into public.news_photos (news_id, position, media_id)
    select v_row.id, e.ord, (e.value ->> 'mediaId')::uuid
    from jsonb_array_elements(coalesce(private.jnull(p -> 'photos'), '[]'::jsonb))
         with ordinality e(value, ord);

  perform private.log_change('news', v_row.id::text,
                             case when v_before is null then 'create' else 'update' end,
                             v_before, private.news_admin_json(v_row));
  return query select v_row.id, v_row.slug,
    case when v_before ->> 'slug' <> v_row.slug then v_before ->> 'slug' end, v_row.updated_at;
end $$;

create function public.admin_delete_news(target uuid, expected timestamptz)
returns text
language plpgsql security invoker set search_path = '' as $$
declare
  v_before jsonb;
begin
  perform private.require_admin();
  select private.news_admin_json(n) into v_before from public.news n where n.id = target for update;
  if v_before is null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;
  delete from public.news n where n.id = target and n.updated_at = expected;
  if not found then
    raise exception 'eskirgan' using errcode = '40001';
  end if;
  perform private.log_change('news', target::text, 'delete', v_before, null);
  return v_before ->> 'slug';
end $$;

-- Slug jonli tekshiruvi: boshqa maqola ham, boshqa maqolaning eski manzili ham band hisoblanadi
create function public.admin_slug_available(candidate text, own uuid default null)
returns boolean
language plpgsql stable security invoker set search_path = '' as $$
begin
  perform private.require_admin();
  return candidate ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(candidate) <= 80
    and not exists (select 1 from public.news n where n.slug = candidate and n.id is distinct from own)
    and not exists (select 1 from public.news_slug_redirects r
                    where r.old_slug = candidate and r.news_id is distinct from own);
end $$;

-- Rahbariyat va ekspertlar ------------------------------------------------------------------------

create function public.admin_save_person(p jsonb, expected timestamptz default null)
returns table (id uuid, key text, updated_at timestamptz)
language plpgsql security invoker set search_path = '' as $$
#variable_conflict use_column
declare
  v_id uuid;
  v_kind public.person_kind;
  v_before jsonb;
  v_row public.people;
begin
  perform private.require_admin();
  v_id := nullif(p ->> 'id', '')::uuid;
  v_kind := (p ->> 'kind')::public.person_kind;
  if v_id is not null then
    select private.person_admin_json(x) into v_before from public.people x where x.id = v_id for update;
  end if;
  if v_before is null and expected is not null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;
  perform private.assert_images(array[nullif(p ->> 'photoId', '')::uuid]);

  insert into public.people as x (id, key, kind, status, name, role, field, bio, photo_id, email,
                                  sort_order)
  values (coalesce(v_id, gen_random_uuid()),
          coalesce(nullif(p ->> 'key', ''), v_before ->> 'key', private.new_key('p')),
          v_kind, (p ->> 'status')::public.content_status,
          private.jnull(p -> 'name'), p -> 'role', private.jnull(p -> 'field'),
          private.jnull(p -> 'bio'), nullif(p ->> 'photoId', '')::uuid,
          nullif(btrim(p ->> 'email'), ''),
          -- Yangi odam roʻyxat oxiriga qoʻshiladi
          coalesce((p ->> 'sortOrder')::integer, (v_before ->> 'sortOrder')::integer,
                   (select coalesce(max(y.sort_order), 0) + 10 from public.people y
                    where y.kind = v_kind)))
  on conflict (id) do update set
    key = excluded.key, kind = excluded.kind, status = excluded.status, name = excluded.name,
    role = excluded.role, field = excluded.field, bio = excluded.bio, photo_id = excluded.photo_id,
    email = excluded.email, sort_order = excluded.sort_order
    where x.updated_at = expected
  returning x.* into v_row;
  if not found then
    raise exception 'eskirgan' using errcode = '40001';
  end if;

  perform private.log_change('person', v_row.id::text,
                             case when v_before is null then 'create' else 'update' end,
                             v_before, private.person_admin_json(v_row));
  return query select v_row.id, v_row.key, v_row.updated_at;
end $$;

create function public.admin_delete_person(target uuid, expected timestamptz)
returns text
language plpgsql security invoker set search_path = '' as $$
declare
  v_before jsonb;
begin
  perform private.require_admin();
  select private.person_admin_json(x) into v_before from public.people x where x.id = target for update;
  if v_before is null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;
  delete from public.people x where x.id = target and x.updated_at = expected;
  if not found then
    raise exception 'eskirgan' using errcode = '40001';
  end if;
  perform private.log_change('person', target::text, 'delete', v_before, null);
  return v_before ->> 'key';
end $$;

-- Hamkorlar ---------------------------------------------------------------------------------------

create function public.admin_save_partner(p jsonb, expected timestamptz default null)
returns table (id uuid, key text, updated_at timestamptz)
language plpgsql security invoker set search_path = '' as $$
#variable_conflict use_column
declare
  v_id uuid;
  v_before jsonb;
  v_row public.partners;
begin
  perform private.require_admin();
  v_id := nullif(p ->> 'id', '')::uuid;
  if v_id is not null then
    select private.partner_admin_json(x) into v_before from public.partners x where x.id = v_id for update;
  end if;
  if v_before is null and expected is not null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;
  perform private.assert_images(array[nullif(p ->> 'logoId', '')::uuid]);

  insert into public.partners as x (id, key, status, "group", name, logo_id, href, sort_order)
  values (coalesce(v_id, gen_random_uuid()),
          coalesce(nullif(p ->> 'key', ''), v_before ->> 'key', private.new_key('h')),
          (p ->> 'status')::public.content_status, (p ->> 'group')::public.partner_group,
          private.jnull(p -> 'name'), nullif(p ->> 'logoId', '')::uuid,
          nullif(btrim(p ->> 'href'), ''),
          coalesce((p ->> 'sortOrder')::integer, (v_before ->> 'sortOrder')::integer,
                   (select coalesce(max(y.sort_order), 0) + 10 from public.partners y)))
  on conflict (id) do update set
    key = excluded.key, status = excluded.status, "group" = excluded."group", name = excluded.name,
    logo_id = excluded.logo_id, href = excluded.href, sort_order = excluded.sort_order
    where x.updated_at = expected
  returning x.* into v_row;
  if not found then
    raise exception 'eskirgan' using errcode = '40001';
  end if;

  perform private.log_change('partner', v_row.id::text,
                             case when v_before is null then 'create' else 'update' end,
                             v_before, private.partner_admin_json(v_row));
  return query select v_row.id, v_row.key, v_row.updated_at;
end $$;

create function public.admin_delete_partner(target uuid, expected timestamptz)
returns text
language plpgsql security invoker set search_path = '' as $$
declare
  v_before jsonb;
begin
  perform private.require_admin();
  select private.partner_admin_json(x) into v_before from public.partners x
  where x.id = target for update;
  if v_before is null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;
  delete from public.partners x where x.id = target and x.updated_at = expected;
  if not found then
    raise exception 'eskirgan' using errcode = '40001';
  end if;
  perform private.log_change('partner', target::text, 'delete', v_before, null);
  return v_before ->> 'key';
end $$;

-- Aloqa va ijtimoiy tarmoqlar ---------------------------------------------------------------------

create function public.admin_save_contacts(p jsonb, expected timestamptz default null)
returns timestamptz
language plpgsql security invoker set search_path = '' as $$
declare
  v_before jsonb;
  v_row public.site_contacts;
begin
  perform private.require_admin();
  select private.contacts_admin_json(c) into v_before from public.site_contacts c
  where c.id = 1 for update;
  if v_before is null and expected is not null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;

  insert into public.site_contacts as c (id, address, address_status, postal_code, locality,
                                         phones, phones_status, email, email_status,
                                         telegram, telegram_status, hours, hours_status,
                                         map_lat, map_lng, map_status)
  values (1, private.jnull(p #> '{address,value}'),
          (p #>> '{address,status}')::public.content_status,
          nullif(btrim(p ->> 'postalCode'), ''), nullif(btrim(p ->> 'locality'), ''),
          coalesce(private.text_array(p #> '{phones,value}'), '{}'),
          (p #>> '{phones,status}')::public.content_status,
          nullif(btrim(p #>> '{email,value}'), ''), (p #>> '{email,status}')::public.content_status,
          nullif(btrim(p #>> '{telegram,value}'), ''),
          (p #>> '{telegram,status}')::public.content_status,
          private.jnull(p #> '{hours,value}'), (p #>> '{hours,status}')::public.content_status,
          (p #>> '{map,value,lat}')::numeric, (p #>> '{map,value,lng}')::numeric,
          (p #>> '{map,status}')::public.content_status)
  on conflict (id) do update set
    address = excluded.address, address_status = excluded.address_status,
    postal_code = excluded.postal_code, locality = excluded.locality,
    phones = excluded.phones, phones_status = excluded.phones_status,
    email = excluded.email, email_status = excluded.email_status,
    telegram = excluded.telegram, telegram_status = excluded.telegram_status,
    hours = excluded.hours, hours_status = excluded.hours_status,
    map_lat = excluded.map_lat, map_lng = excluded.map_lng, map_status = excluded.map_status
    where c.updated_at = expected
  returning c.* into v_row;
  if not found then
    raise exception 'eskirgan' using errcode = '40001';
  end if;

  perform private.log_change('contacts', '1', case when v_before is null then 'create' else 'update' end,
                             v_before, private.contacts_admin_json(v_row));
  return v_row.updated_at;
end $$;

-- Toʻrtta tarmoq bitta roʻyxat: massiv tartibi saytdagi tartib, roʻyxatda yoʻq tarmoq oʻchadi
create function public.admin_save_socials(p jsonb)
returns void
language plpgsql security invoker set search_path = '' as $$
declare
  v_before jsonb;
begin
  perform private.require_admin();
  if jsonb_typeof(p) is distinct from 'array' then
    raise exception 'roʻyxat kutilgan' using errcode = '22023';
  end if;
  v_before := private.socials_admin_json();

  delete from public.social_links s
  where s.network::text <> all (array(select e ->> 'id' from jsonb_array_elements(p) e));
  insert into public.social_links as s (network, href, label, status, sort_order)
    select (e.value ->> 'id')::public.social_network, e.value ->> 'href', e.value ->> 'label',
           (e.value ->> 'status')::public.content_status, e.ord
    from jsonb_array_elements(p) with ordinality e(value, ord)
  on conflict (network) do update set
    href = excluded.href, label = excluded.label, status = excluded.status,
    sort_order = excluded.sort_order;

  perform private.log_change('socials', 'all', 'update', v_before, private.socials_admin_json());
end $$;

-- Tarix -------------------------------------------------------------------------------------------

create function public.admin_save_milestone(p jsonb, expected timestamptz default null)
returns table (id uuid, key text, updated_at timestamptz)
language plpgsql security invoker set search_path = '' as $$
#variable_conflict use_column
declare
  v_id uuid;
  v_before jsonb;
  v_row public.milestones;
begin
  perform private.require_admin();
  v_id := nullif(p ->> 'id', '')::uuid;
  if v_id is not null then
    select private.milestone_admin_json(x) into v_before from public.milestones x
    where x.id = v_id for update;
  end if;
  if v_before is null and expected is not null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;

  insert into public.milestones as x (id, key, status, year, title, icon, sort_order)
  values (coalesce(v_id, gen_random_uuid()),
          coalesce(nullif(p ->> 'key', ''), v_before ->> 'key', private.new_key('m')),
          (p ->> 'status')::public.content_status, (p ->> 'year')::smallint, p -> 'title',
          coalesce(nullif(p ->> 'icon', ''), 'calendar'),
          coalesce((p ->> 'sortOrder')::integer, (v_before ->> 'sortOrder')::integer,
                   (select coalesce(max(y.sort_order), 0) + 10 from public.milestones y)))
  on conflict (id) do update set
    key = excluded.key, status = excluded.status, year = excluded.year, title = excluded.title,
    icon = excluded.icon, sort_order = excluded.sort_order
    where x.updated_at = expected
  returning x.* into v_row;
  if not found then
    raise exception 'eskirgan' using errcode = '40001';
  end if;

  perform private.log_change('milestone', v_row.id::text,
                             case when v_before is null then 'create' else 'update' end,
                             v_before, private.milestone_admin_json(v_row));
  return query select v_row.id, v_row.key, v_row.updated_at;
end $$;

create function public.admin_delete_milestone(target uuid, expected timestamptz)
returns text
language plpgsql security invoker set search_path = '' as $$
declare
  v_before jsonb;
begin
  perform private.require_admin();
  select private.milestone_admin_json(x) into v_before from public.milestones x
  where x.id = target for update;
  if v_before is null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;
  delete from public.milestones x where x.id = target and x.updated_at = expected;
  if not found then
    raise exception 'eskirgan' using errcode = '40001';
  end if;
  perform private.log_change('milestone', target::text, 'delete', v_before, null);
  return v_before ->> 'key';
end $$;

-- UPOP TREND --------------------------------------------------------------------------------------

-- Qator, faktlar va media tavsiflari bitta tranzaksiyada: yarim saqlangan loyiha saytga chiqmaydi
create function public.admin_save_project(p jsonb, expected timestamptz default null)
returns timestamptz
language plpgsql security invoker set search_path = '' as $$
declare
  v_key text;
  v_before jsonb;
  v_row public.projects;
  v_fact public.project_fact;
  v_role text;
begin
  perform private.require_admin();
  v_key := coalesce(nullif(p ->> 'key', ''), 'upop-trend');
  select private.project_admin_json(x) into v_before from public.projects x
  where x.key = v_key for update;
  if v_before is null and expected is not null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;

  insert into public.projects as x (key, status, flagship, name, tagline, age_from, age_to, age_status,
                                    cost_free, cost_status, highlights, external_href, external_label)
  values (v_key, (p ->> 'status')::public.content_status, coalesce((p ->> 'flagship')::boolean, true),
          p -> 'name', p -> 'tagline', (p #>> '{age,from}')::smallint, (p #>> '{age,to}')::smallint,
          (p #>> '{age,status}')::public.content_status,
          (p #>> '{cost,free}')::boolean, (p #>> '{cost,status}')::public.content_status,
          p -> 'highlights', p #>> '{external,href}', p #>> '{external,label}')
  on conflict (key) do update set
    status = excluded.status, flagship = excluded.flagship, name = excluded.name,
    tagline = excluded.tagline, age_from = excluded.age_from, age_to = excluded.age_to,
    age_status = excluded.age_status, cost_free = excluded.cost_free,
    cost_status = excluded.cost_status, highlights = excluded.highlights,
    external_href = excluded.external_href, external_label = excluded.external_label
    where x.updated_at = expected
  returning x.* into v_row;
  if not found then
    raise exception 'eskirgan' using errcode = '40001';
  end if;

  foreach v_fact in array enum_range(null::public.project_fact) loop
    if p ? v_fact::text then
      insert into public.project_facts as f (project_key, fact, value, status)
      values (v_key, v_fact, private.jnull(p #> array[v_fact::text, 'value']),
              (p #>> array[v_fact::text, 'status'])::public.content_status)
      on conflict (project_key, fact) do update set value = excluded.value, status = excluded.status;
    end if;
  end loop;

  foreach v_role in array array['loop', 'film', 'wordmark'] loop
    if p -> 'media' ? v_role then
      update public.project_media pm set
        alt = p #> array['media', v_role, 'alt'],
        status = case when v_role = 'wordmark' then null
                      else (p #>> array['media', v_role, 'status'])::public.content_status end
      where pm.project_key = v_key and pm.role = v_role;
    end if;
  end loop;

  perform private.log_change('project', v_key, case when v_before is null then 'create' else 'update' end,
                             v_before, private.project_admin_json(v_row));
  return v_row.updated_at;
end $$;

-- Sakkiz joy birdaniga almashadi: joylar oʻrni almashganda birlamchi kalit toʻqnashmaydi
create function public.admin_save_upop_shots(p jsonb)
returns void
language plpgsql security invoker set search_path = '' as $$
declare
  v_before jsonb;
begin
  perform private.require_admin();
  if jsonb_typeof(p) is distinct from 'array' or jsonb_array_length(p) > 8 then
    raise exception 'eng koʻpi 8 joyli roʻyxat kutilgan' using errcode = '22023';
  end if;
  if exists (select 1 from jsonb_array_elements(p) e
             where not exists (select 1 from public.media m
                               where m.id = nullif(e ->> 'mediaId', '')::uuid)) then
    raise exception 'media topilmadi' using errcode = '23503';
  end if;
  perform private.assert_images(
    array(select nullif(e ->> 'posterId', '')::uuid from jsonb_array_elements(p) e));
  v_before := private.upop_admin_json();

  delete from public.upop_shots s where true;
  insert into public.upop_shots (position, kind, media_id, poster_id, frame, motion, alt)
    select coalesce((e.value ->> 'position')::smallint, e.ord),
           (select m.kind from public.media m where m.id = (e.value ->> 'mediaId')::uuid),
           (e.value ->> 'mediaId')::uuid, nullif(e.value ->> 'posterId', '')::uuid,
           (e.value ->> 'frame')::public.upop_frame, (e.value ->> 'motion')::public.upop_motion,
           private.jnull(e.value -> 'alt')
    from jsonb_array_elements(p) with ordinality e(value, ord);

  perform private.log_change('upop_shots', 'all', 'update', v_before, private.upop_admin_json());
end $$;

-- Tartib -----------------------------------------------------------------------------------------

-- Faqat toʻliq roʻyxat qabul qilinadi (odamlar uchun bitta tur ichida): qisman tartib noaniq boʻlardi
create function public.admin_reorder(entity text, keys text[])
returns void
language plpgsql security invoker set search_path = '' as $$
declare
  v_scope text;
  v_before jsonb;
  v_count integer;
begin
  perform private.require_admin();
  if coalesce(cardinality(keys), 0) = 0
     or cardinality(keys) <> (select count(distinct k) from unnest(keys) k) then
    raise exception 'kalitlar roʻyxati notoʻgʻri' using errcode = '22023';
  end if;

  case entity
    when 'people' then
      select x.kind::text into v_scope from public.people x where x.key = keys[1];
      select jsonb_agg(x.key order by x.sort_order, x.key), count(*) into v_before, v_count
      from public.people x where x.kind::text = v_scope;
      if v_count is distinct from cardinality(keys)
         or exists (select 1 from unnest(keys) k where not exists (
                      select 1 from public.people x where x.key = k and x.kind::text = v_scope)) then
        raise exception 'kalitlar roʻyxati notoʻgʻri' using errcode = '22023';
      end if;
      update public.people x set sort_order = o.ord * 10
      from unnest(keys) with ordinality o(k, ord) where x.key = o.k;
    when 'partners' then
      select jsonb_agg(x.key order by x.sort_order, x.key), count(*) into v_before, v_count
      from public.partners x;
      if v_count is distinct from cardinality(keys)
         or exists (select 1 from unnest(keys) k
                    where not exists (select 1 from public.partners x where x.key = k)) then
        raise exception 'kalitlar roʻyxati notoʻgʻri' using errcode = '22023';
      end if;
      update public.partners x set sort_order = o.ord * 10
      from unnest(keys) with ordinality o(k, ord) where x.key = o.k;
    when 'milestones' then
      select jsonb_agg(x.key order by x.sort_order, x.key), count(*) into v_before, v_count
      from public.milestones x;
      if v_count is distinct from cardinality(keys)
         or exists (select 1 from unnest(keys) k
                    where not exists (select 1 from public.milestones x where x.key = k)) then
        raise exception 'kalitlar roʻyxati notoʻgʻri' using errcode = '22023';
      end if;
      update public.milestones x set sort_order = o.ord * 10
      from unnest(keys) with ordinality o(k, ord) where x.key = o.k;
    else
      raise exception 'bu obyekt tartiblanmaydi' using errcode = '22023';
  end case;

  perform private.log_change('order', entity || coalesce(':' || v_scope, ''), 'update',
                             jsonb_build_object('entity', entity, 'keys', v_before),
                             jsonb_build_object('entity', entity, 'keys', to_jsonb(keys)));
end $$;

-- Matnlar va soʻzlar ------------------------------------------------------------------------------

create function public.admin_save_text(text_key text, text_value jsonb, expected timestamptz default null)
returns timestamptz
language plpgsql security invoker set search_path = '' as $$
declare
  v_before jsonb;
  v_row public.site_texts;
begin
  perform private.require_admin();
  select jsonb_build_object('key', t.key, 'value', t.value) into v_before from public.site_texts t
  where t.key = text_key for update;
  if v_before is null and expected is not null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;
  insert into public.site_texts as t (key, value) values (text_key, text_value)
  on conflict (key) do update set value = excluded.value where t.updated_at = expected
  returning t.* into v_row;
  if not found then
    raise exception 'eskirgan' using errcode = '40001';
  end if;
  perform private.log_change('text', text_key, case when v_before is null then 'create' else 'update' end,
                             v_before, jsonb_build_object('key', v_row.key, 'value', v_row.value));
  return v_row.updated_at;
end $$;

-- «Asliga qaytarish»: almashtirish oʻchadi, saytda lugʻatdagi asl matn qoladi
create function public.admin_delete_text(text_key text)
returns boolean
language plpgsql security invoker set search_path = '' as $$
declare
  v_before jsonb;
begin
  perform private.require_admin();
  delete from public.site_texts t where t.key = text_key
  returning jsonb_build_object('key', t.key, 'value', t.value) into v_before;
  if v_before is null then
    return false;
  end if;
  perform private.log_change('text', text_key, 'delete', v_before, null);
  return true;
end $$;

create function public.admin_allow_words(words text[])
returns integer
language plpgsql security invoker set search_path = '' as $$
declare
  v_added jsonb;
  v_count integer;
begin
  perform private.require_admin();
  with added as (
    insert into public.site_word_allowlist (word)
    select distinct btrim(w) from unnest(words) w where btrim(w) <> ''
    on conflict (word) do nothing
    returning word
  )
  select coalesce(jsonb_agg(a.word order by a.word), '[]'::jsonb), count(*) into v_added, v_count
  from added a;
  if v_count > 0 then
    perform private.log_change('allow_words', 'all', 'create', null, v_added);
  end if;
  return v_count;
end $$;

-- Media -------------------------------------------------------------------------------------------

create function public.admin_register_media(p jsonb)
returns public.media
language plpgsql security invoker set search_path = '' as $$
declare
  v_row public.media;
begin
  perform private.require_admin();
  perform private.assert_images(array[nullif(p ->> 'posterId', '')::uuid]);
  insert into public.media as m (id, kind, origin, src, storage_prefix, variant_base, variant_widths,
                                 width, height, blur, bright, bytes, duration_s, poster_id)
  values (coalesce(nullif(p ->> 'id', '')::uuid, gen_random_uuid()),
          (p ->> 'kind')::public.media_kind,
          coalesce((p ->> 'origin')::public.media_origin, 'storage'),
          p ->> 'src', nullif(p ->> 'storagePrefix', ''), nullif(p ->> 'variantBase', ''),
          coalesce(private.text_array(p -> 'variantWidths')::smallint[], '{}'),
          (p ->> 'width')::integer, (p ->> 'height')::integer, nullif(p ->> 'blur', ''),
          coalesce((p ->> 'bright')::boolean, false), (p ->> 'bytes')::integer,
          (p ->> 'durationS')::numeric, nullif(p ->> 'posterId', '')::uuid)
  -- Bir xil fayl qayta yuklansa (xesh bir xil) yangi qator ochilmaydi, mavjudi qaytadi
  on conflict (src) do nothing
  returning m.* into v_row;
  if not found then
    select m.* into v_row from public.media m where m.src = p ->> 'src';
    return v_row;
  end if;
  perform private.log_change('media', v_row.id::text, 'create', null, private.media_admin_json(v_row));
  return v_row;
end $$;

-- Ishlatilayotgan media tashqi kalit restrict bilan rad etiladi (23503); javob: Storage dan oʻchiriladigan prefiks
create function public.admin_delete_media(target uuid)
returns text
language plpgsql security invoker set search_path = '' as $$
declare
  v_before jsonb;
  v_prefix text;
begin
  perform private.require_admin();
  select private.media_admin_json(m), m.storage_prefix into v_before, v_prefix
  from public.media m where m.id = target for update;
  if v_before is null then
    raise exception 'topilmadi' using errcode = 'P0002';
  end if;
  delete from public.media m where m.id = target;
  perform private.log_change('media', target::text, 'delete', v_before, null);
  return v_prefix;
end $$;

create function public.admin_media_usage()
returns table (media_id uuid, uses integer)
language plpgsql stable security invoker set search_path = '' as $$
#variable_conflict use_column
begin
  perform private.require_admin();
  return query
  select m.id,
    ((select count(*) from public.news x where x.cover_id = m.id)
     + (select count(*) from public.news_photos x where x.media_id = m.id)
     + (select count(*) from public.people x where x.photo_id = m.id)
     + (select count(*) from public.partners x where x.logo_id = m.id)
     + (select count(*) from public.project_media x
        where m.id in (x.main_id, x.webm_id, x.mobile_mp4_id, x.mobile_webm_id, x.poster_id))
     + (select count(*) from public.upop_shots x where m.id in (x.media_id, x.poster_id))
     + (select count(*) from public.artworks x where x.media_id = m.id)
     + (select count(*) from public.media x where x.poster_id = m.id))::integer
  from public.media m;
end $$;

-- Tahrirlash oynasi uchun: admin shakli va kutilgan updated_at bitta chaqiruvda ---------------------

create function public.admin_get(entity text, entity_key text default null)
returns jsonb
language plpgsql stable security invoker set search_path = '' as $$
begin
  perform private.require_admin();
  case entity
    when 'news' then
      return (select jsonb_build_object('data', private.news_admin_json(n), 'updatedAt', n.updated_at)
              from public.news n where n.id = entity_key::uuid);
    when 'person' then
      return (select jsonb_build_object('data', private.person_admin_json(x), 'updatedAt', x.updated_at)
              from public.people x where x.id = entity_key::uuid);
    when 'partner' then
      return (select jsonb_build_object('data', private.partner_admin_json(x), 'updatedAt', x.updated_at)
              from public.partners x where x.id = entity_key::uuid);
    when 'milestone' then
      return (select jsonb_build_object('data', private.milestone_admin_json(x),
                                        'updatedAt', x.updated_at)
              from public.milestones x where x.id = entity_key::uuid);
    when 'contacts' then
      return coalesce((select jsonb_build_object('data', private.contacts_admin_json(c),
                                                 'updatedAt', c.updated_at)
                       from public.site_contacts c where c.id = 1),
                      jsonb_build_object('data', private.contacts_admin_json(null), 'updatedAt', null));
    when 'socials' then
      return jsonb_build_object('data', private.socials_admin_json(), 'updatedAt', null);
    when 'project' then
      return (select jsonb_build_object('data', private.project_admin_json(x), 'updatedAt', x.updated_at)
              from public.projects x where x.key = coalesce(entity_key, 'upop-trend'));
    when 'upop_shots' then
      return jsonb_build_object('data', private.upop_admin_json(), 'updatedAt', null);
    when 'text' then
      return (select jsonb_build_object('data', jsonb_build_object('key', t.key, 'value', t.value),
                                        'updatedAt', t.updated_at)
              from public.site_texts t where t.key = entity_key);
    when 'media' then
      return (select jsonb_build_object('data', private.media_admin_json(m), 'updatedAt', null)
              from public.media m where m.id = entity_key::uuid);
    else
      raise exception 'nomaʼlum obyekt' using errcode = '22023';
  end case;
end $$;

-- Jurnal: private sxema PostgREST da ochiq emas, shu sabab definer va ichida is_admin tekshiruvi
create function public.admin_content_log(max_rows integer default 50, before_id bigint default null)
returns table (id bigint, at timestamptz, actor uuid, entity text, entity_key text, action text,
               before jsonb, after jsonb)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not (select private.is_admin()) then
    raise exception 'ruxsat yoʻq' using errcode = '42501';
  end if;
  return query
  select l.id, l.at, l.actor, l.entity, l.entity_key, l.action, l.before, l.after
  from private.content_log l
  where before_id is null or l.id < before_id
  order by l.id desc
  limit least(greatest(coalesce(max_rows, 50), 1), 200);
end $$;

-- Huquqlar ---------------------------------------------------------------------------------------

-- Yordamchilarni invoker RPC lar admin nomidan chaqiradi: authenticated ga ochiq, tekshiruv ichkarida
revoke all on function private.log_change(text, text, text, jsonb, jsonb) from public, anon;
grant execute on function private.log_change(text, text, text, jsonb, jsonb) to authenticated;
revoke all on function private.jnull(jsonb) from public, anon;
grant execute on function private.jnull(jsonb) to authenticated;
revoke all on function private.text_array(jsonb) from public, anon;
grant execute on function private.text_array(jsonb) to authenticated;
revoke all on function private.assert_images(uuid[]) from public, anon;
grant execute on function private.assert_images(uuid[]) to authenticated;
grant execute on function private.fact_json(text, public.project_fact) to authenticated;
revoke all on function private.news_admin_json(public.news) from public, anon;
grant execute on function private.news_admin_json(public.news) to authenticated;
revoke all on function private.person_admin_json(public.people) from public, anon;
grant execute on function private.person_admin_json(public.people) to authenticated;
revoke all on function private.partner_admin_json(public.partners) from public, anon;
grant execute on function private.partner_admin_json(public.partners) to authenticated;
revoke all on function private.milestone_admin_json(public.milestones) from public, anon;
grant execute on function private.milestone_admin_json(public.milestones) to authenticated;
revoke all on function private.contacts_admin_json(public.site_contacts) from public, anon;
grant execute on function private.contacts_admin_json(public.site_contacts) to authenticated;
revoke all on function private.socials_admin_json() from public, anon;
grant execute on function private.socials_admin_json() to authenticated;
revoke all on function private.project_admin_json(public.projects) from public, anon;
grant execute on function private.project_admin_json(public.projects) to authenticated;
revoke all on function private.upop_admin_json() from public, anon;
grant execute on function private.upop_admin_json() to authenticated;
revoke all on function private.media_admin_json(public.media) from public, anon;
grant execute on function private.media_admin_json(public.media) to authenticated;

-- Admin RPC lari faqat kirgan foydalanuvchiga; administrator ekani har birining ichida tekshiriladi
revoke all on function public.admin_save_news(jsonb, timestamptz) from public, anon, service_role;
grant execute on function public.admin_save_news(jsonb, timestamptz) to authenticated;
revoke all on function public.admin_delete_news(uuid, timestamptz) from public, anon, service_role;
grant execute on function public.admin_delete_news(uuid, timestamptz) to authenticated;
revoke all on function public.admin_slug_available(text, uuid) from public, anon, service_role;
grant execute on function public.admin_slug_available(text, uuid) to authenticated;
revoke all on function public.admin_save_person(jsonb, timestamptz) from public, anon, service_role;
grant execute on function public.admin_save_person(jsonb, timestamptz) to authenticated;
revoke all on function public.admin_delete_person(uuid, timestamptz) from public, anon, service_role;
grant execute on function public.admin_delete_person(uuid, timestamptz) to authenticated;
revoke all on function public.admin_save_partner(jsonb, timestamptz) from public, anon, service_role;
grant execute on function public.admin_save_partner(jsonb, timestamptz) to authenticated;
revoke all on function public.admin_delete_partner(uuid, timestamptz) from public, anon, service_role;
grant execute on function public.admin_delete_partner(uuid, timestamptz) to authenticated;
revoke all on function public.admin_save_contacts(jsonb, timestamptz) from public, anon, service_role;
grant execute on function public.admin_save_contacts(jsonb, timestamptz) to authenticated;
revoke all on function public.admin_save_socials(jsonb) from public, anon, service_role;
grant execute on function public.admin_save_socials(jsonb) to authenticated;
revoke all on function public.admin_save_milestone(jsonb, timestamptz) from public, anon, service_role;
grant execute on function public.admin_save_milestone(jsonb, timestamptz) to authenticated;
revoke all on function public.admin_delete_milestone(uuid, timestamptz) from public, anon, service_role;
grant execute on function public.admin_delete_milestone(uuid, timestamptz) to authenticated;
revoke all on function public.admin_save_project(jsonb, timestamptz) from public, anon, service_role;
grant execute on function public.admin_save_project(jsonb, timestamptz) to authenticated;
revoke all on function public.admin_save_upop_shots(jsonb) from public, anon, service_role;
grant execute on function public.admin_save_upop_shots(jsonb) to authenticated;
revoke all on function public.admin_reorder(text, text[]) from public, anon, service_role;
grant execute on function public.admin_reorder(text, text[]) to authenticated;
revoke all on function public.admin_save_text(text, jsonb, timestamptz) from public, anon, service_role;
grant execute on function public.admin_save_text(text, jsonb, timestamptz) to authenticated;
revoke all on function public.admin_delete_text(text) from public, anon, service_role;
grant execute on function public.admin_delete_text(text) to authenticated;
revoke all on function public.admin_allow_words(text[]) from public, anon, service_role;
grant execute on function public.admin_allow_words(text[]) to authenticated;
revoke all on function public.admin_register_media(jsonb) from public, anon, service_role;
grant execute on function public.admin_register_media(jsonb) to authenticated;
revoke all on function public.admin_delete_media(uuid) from public, anon, service_role;
grant execute on function public.admin_delete_media(uuid) to authenticated;
revoke all on function public.admin_media_usage() from public, anon, service_role;
grant execute on function public.admin_media_usage() to authenticated;
revoke all on function public.admin_get(text, text) from public, anon, service_role;
grant execute on function public.admin_get(text, text) to authenticated;
revoke all on function public.admin_content_log(integer, bigint) from public, anon, service_role;
grant execute on function public.admin_content_log(integer, bigint) to authenticated;
