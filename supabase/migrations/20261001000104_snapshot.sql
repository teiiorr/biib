-- Yagona ommaviy oʻqish: content_snapshot() butun kontentni src/content/types.ts shaklida qaytaradi
-- (camelCase kalitlar, Localized = {uz, oz, ozbekca, ru, en}); ommaviy sahifalar faqat shu RPC ni chaqiradi

create function private.media_src(p uuid) returns text
language sql stable set search_path = '' as $$
  select m.src from public.media m where m.id = p
$$;

-- NewsArticle: quote va photos ixtiyoriy, yoʻq boʻlsa kalit umuman chiqmaydi
create function private.news_json(n public.news) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
      'slug', n.slug, 'status', n.status, 'date', n.published_on,
      'topic', n.topic, 'title', n.title, 'lead', n.lead, 'body', n.body,
      'cover', jsonb_build_object('src', private.media_src(n.cover_id), 'alt', n.cover_alt,
                                  'status', n.cover_status),
      'story', jsonb_build_object('primary', n.story_primary, 'secondary', n.story_secondary))
    || case when n.quote is null then '{}'::jsonb else jsonb_build_object('quote', n.quote) end
    || coalesce((select jsonb_build_object('photos', jsonb_agg(m.src order by p.position))
                 from public.news_photos p join public.media m on m.id = p.media_id
                 where p.news_id = n.id having count(*) > 0), '{}'::jsonb)
$$;

-- Person: id = key (DOM id), qabul jadvali saqlanmaydi (egasi, 4-davra)
create function private.person_json(x public.people) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', x.key, 'kind', x.kind, 'status', x.status, 'name', x.name, 'role', x.role,
    'field', x.field, 'bio', x.bio, 'photo', private.media_src(x.photo_id), 'email', x.email)
$$;

create function private.partner_json(x public.partners) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', x.key, 'status', x.status, 'group', x."group", 'name', x.name,
    'logo', private.media_src(x.logo_id), 'href', x.href)
$$;

-- Qator hali yoʻq boʻlsa ham shakl toʻliq: har bir maydon pending, sayt sinmaydi
create function private.contacts_json(c public.site_contacts) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
      'address', jsonb_build_object('value', c.address,
                                    'status', coalesce(c.address_status, 'pending')),
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
                                'status', coalesce(c.map_status, 'pending')),
      'socials', coalesce((select jsonb_agg(jsonb_build_object('id', s.network, 'href', s.href,
                                                               'label', s.label, 'status', s.status)
                                            order by s.sort_order, s.network)
                           from public.social_links s), '[]'::jsonb))
    || case when c.postal_code is null then '{}'::jsonb
            else jsonb_build_object('postalCode', c.postal_code) end
    || case when c.locality is null then '{}'::jsonb
            else jsonb_build_object('locality', c.locality) end
$$;

create function private.milestone_json(x public.milestones) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', x.key, 'status', x.status, 'year', x.year, 'title', x.title, 'icon', x.icon)
$$;

-- Yozuvi yoʻq fakt ham ProjectFact shaklida: qiymat null, holat pending
create function private.fact_json(k text, f public.project_fact) returns jsonb
language sql stable set search_path = '' as $$
  select coalesce(
    (select jsonb_build_object('value', x.value, 'status', x.status)
     from public.project_facts x where x.project_key = k and x.fact = f),
    jsonb_build_object('value', null, 'status', 'pending'))
$$;

-- ProjectMedia: asosiy fayl oʻlchami va davomiyligi media jadvalidan olinadi
create function private.project_media_json(k text) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'loop', (select jsonb_build_object(
                'desktop', jsonb_build_object('webm', private.media_src(pm.webm_id), 'mp4', m.src),
                'mobile', jsonb_build_object('webm', private.media_src(pm.mobile_webm_id),
                                             'mp4', private.media_src(pm.mobile_mp4_id)),
                'poster', private.media_src(pm.poster_id),
                'width', m.width, 'height', m.height, 'alt', pm.alt, 'status', pm.status)
             from public.project_media pm join public.media m on m.id = pm.main_id
             where pm.project_key = k and pm.role = 'loop'),
    'film', (select jsonb_build_object(
                'src', m.src, 'poster', private.media_src(pm.poster_id), 'duration', m.duration_s,
                'alt', pm.alt, 'status', pm.status)
             from public.project_media pm join public.media m on m.id = pm.main_id
             where pm.project_key = k and pm.role = 'film'),
    'wordmark', (select jsonb_build_object(
                    'src', m.src, 'width', m.width, 'height', m.height, 'alt', pm.alt)
                 from public.project_media pm join public.media m on m.id = pm.main_id
                 where pm.project_key = k and pm.role = 'wordmark'))
$$;

create function private.project_json(x public.projects) returns jsonb
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
    'media', private.project_media_json(x.key))
$$;

-- UpopShot: saytdagi tur nomi «photo» (bazada media_kind «image»); poster va alt ixtiyoriy
create function private.shot_json(s public.upop_shots) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
      'kind', case s.kind when 'image' then 'photo' else 'video' end,
      'src', private.media_src(s.media_id), 'frame', s.frame, 'motion', s.motion)
    || case when s.poster_id is null then '{}'::jsonb
            else jsonb_build_object('poster', private.media_src(s.poster_id)) end
    || case when s.alt is null then '{}'::jsonb else jsonb_build_object('alt', s.alt) end
$$;

create function private.artwork_json(a public.artworks) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', a.id, 'status', a.status, 'src', m.src, 'width', m.width, 'height', m.height,
    'firstName', a.first_name, 'age', a.age, 'region', a.region, 'title', a.title,
    'consent', jsonb_build_object('parent', a.consent_parent, 'child', a.consent_child,
                                  'date', a.consent_date))
  from public.media m where m.id = a.media_id
$$;

create function public.content_snapshot() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'version', 1,
    'generatedAt', to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'projects', coalesce((select jsonb_agg(private.project_json(p) order by p.key)
                          from public.projects p), '[]'::jsonb),
    'news', coalesce((select jsonb_agg(private.news_json(n)
                                       order by n.published_on desc, n.created_at desc, n.slug)
                      from public.news n), '[]'::jsonb),
    'leadership', coalesce((select jsonb_agg(private.person_json(x) order by x.sort_order, x.key)
                            from public.people x where x.kind = 'leader'), '[]'::jsonb),
    'experts', coalesce((select jsonb_agg(private.person_json(x) order by x.sort_order, x.key)
                         from public.people x where x.kind = 'expert'), '[]'::jsonb),
    'partners', coalesce((select jsonb_agg(private.partner_json(p) order by p.sort_order, p.key)
                          from public.partners p), '[]'::jsonb),
    'contacts', coalesce((select private.contacts_json(c) from public.site_contacts c where c.id = 1),
                         private.contacts_json(null)),
    'milestones', coalesce((select jsonb_agg(private.milestone_json(m) order by m.sort_order, m.key)
                            from public.milestones m), '[]'::jsonb),
    'upopGallery', coalesce((select jsonb_agg(private.shot_json(s) order by s.position)
                             from public.upop_shots s), '[]'::jsonb),
    -- Ikkala rozilik boʻlmagan bolalar ishi bazadan tashqariga chiqmaydi
    'artworks', coalesce((select jsonb_agg(private.artwork_json(a) order by a.sort_order, a.id)
                          from public.artworks a
                          where a.status = 'confirmed' and a.consent_parent and a.consent_child),
                         '[]'::jsonb),
    -- Faqat yuklangan rasmlar: statik rasmlar kodda (src/lib/images/manifest.ts, PreparedImage shakli)
    'media', coalesce((select jsonb_object_agg(m.src,
                                jsonb_build_object('width', m.width, 'height', m.height,
                                                   'base', m.variant_base,
                                                   'widths', to_jsonb(m.variant_widths))
                                || case when m.blur is null then '{}'::jsonb
                                        else jsonb_build_object('blur', m.blur) end
                                || case when m.bright then '{"bright": true}'::jsonb
                                        else '{}'::jsonb end)
                       from public.media m where m.origin = 'storage' and m.kind = 'image'),
                      '{}'::jsonb),
    'redirects', coalesce((select jsonb_object_agg(r.old_slug, n.slug)
                           from public.news_slug_redirects r join public.news n on n.id = r.news_id),
                          '{}'::jsonb),
    'texts', coalesce((select jsonb_object_agg(t.key, t.value) from public.site_texts t), '{}'::jsonb),
    'allowWords', coalesce((select jsonb_agg(w.word order by w.word) from public.site_word_allowlist w),
                           '[]'::jsonb))
$$;

-- Yordamchilarni faqat definer egasi (content_snapshot) chaqiradi
revoke all on function private.media_src(uuid) from public, anon, authenticated;
revoke all on function private.news_json(public.news) from public, anon, authenticated;
revoke all on function private.person_json(public.people) from public, anon, authenticated;
revoke all on function private.partner_json(public.partners) from public, anon, authenticated;
revoke all on function private.contacts_json(public.site_contacts) from public, anon, authenticated;
revoke all on function private.milestone_json(public.milestones) from public, anon, authenticated;
revoke all on function private.fact_json(text, public.project_fact) from public, anon, authenticated;
revoke all on function private.project_media_json(text) from public, anon, authenticated;
revoke all on function private.project_json(public.projects) from public, anon, authenticated;
revoke all on function private.shot_json(public.upop_shots) from public, anon, authenticated;
revoke all on function private.artwork_json(public.artworks) from public, anon, authenticated;

-- Maslahatchi «security definer anon uchun ochiq» deb ogohlantiradi: ataylab, bu yagona ommaviy yoʻl
revoke all on function public.content_snapshot() from public;
grant execute on function public.content_snapshot() to anon, authenticated, service_role;
