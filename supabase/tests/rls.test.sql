-- RLS, huquqlar va admin RPC sinovi (pgTAP). Ishga tushirish: supabase test db yoki psql -f.
-- Hammasi bitta tranzaksiyada va oxirida ROLLBACK: bazada sinov maʼlumoti qolmaydi.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select * from no_plan();

-- 0. Maslahatchi tekshiruvlari ---------------------------------------------------------------------

select is_empty($$
  select c.relname from pg_class c
  where c.relnamespace in ('public'::regnamespace, 'private'::regnamespace)
    and c.relkind in ('r', 'p') and not c.relrowsecurity
$$, 'public va private dagi har bir jadvalda RLS yoqilgan');

select is_empty($$
  select c.relname from pg_class c
  where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'p', 'v', 'm')
    and (has_table_privilege('anon', c.oid, 'SELECT') or has_table_privilege('anon', c.oid, 'INSERT')
         or has_table_privilege('anon', c.oid, 'UPDATE') or has_table_privilege('anon', c.oid, 'DELETE'))
$$, 'anon hech bir public jadvalga huquqqa ega emas');

select is_empty($$
  select c.relname from pg_class c
  where c.relnamespace = 'public'::regnamespace and c.relkind = 'r'
    and not exists (select 1 from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname)
$$, 'RLS yoqilgan har bir jadvalda siyosat bor');

select is_empty($$
  select p.schemaname || '.' || p.tablename || ':' || p.policyname from pg_policies p
  where p.schemaname = 'public'
    and (p.qual is distinct from '( SELECT private.is_admin() AS is_admin)'
         or p.with_check is distinct from '( SELECT private.is_admin() AS is_admin)'
         or p.roles <> array['authenticated']::name[])
$$, 'har bir public siyosat faqat authenticated va is_admin() orqali');

select is_empty($$
  select p.oid::regprocedure::text from pg_proc p
  where p.pronamespace in ('public'::regnamespace, 'private'::regnamespace)
    and not exists (select 1 from unnest(p.proconfig) c where c like 'search_path=%')
$$, 'har bir funksiyada search_path qatʼiy');

select is_empty($$
  select p.oid::regprocedure::text from pg_proc p
  where p.pronamespace in ('public'::regnamespace, 'private'::regnamespace)
    and has_function_privilege('anon', p.oid, 'EXECUTE')
    and p.oid <> 'public.content_snapshot()'::regprocedure
$$, 'anon faqat content_snapshot() ni chaqira oladi');

select is_empty($$
  select p.oid::regprocedure::text from pg_proc p
  where p.pronamespace = 'public'::regnamespace and p.prosecdef
    and p.oid not in ('public.content_snapshot()'::regprocedure,
                      'public.admin_content_log(integer, bigint)'::regprocedure)
$$, 'public da definer faqat content_snapshot va admin_content_log');

select results_eq($$
  select b.id::text, b.public from storage.buckets b where b.id in ('originals', 'media') order by b.id
$$, $$ values ('media', true), ('originals', false) $$, 'media ochiq, originals yopiq');

select is_empty($$
  select p.policyname from pg_policies p
  where p.schemaname = 'storage' and p.tablename = 'objects'
    and (p.roles && array['anon', 'public']::name[]
         or (p.cmd in ('SELECT', 'ALL') and p.policyname <> 'biib_storage_admin'
             and (p.qual like '%''media''%' or p.qual like '%''originals''%')))
$$, 'storage.objects da bucketlarni ochadigan ommaviy siyosat yoʻq');

select ok(not has_schema_privilege('anon', 'private', 'USAGE'), 'anon private sxemaga kira olmaydi');

-- 1. anon ----------------------------------------------------------------------------------------

set local role anon;

select throws_ok(format('select 1 from public.%I', t), '42501', null, 'anon oʻqiy olmaydi: ' || t)
from unnest(array['media', 'news', 'news_photos', 'news_slug_redirects', 'people', 'partners',
                  'site_contacts', 'social_links', 'milestones', 'projects', 'project_facts',
                  'project_media', 'upop_shots', 'site_texts', 'site_word_allowlist', 'artworks']) t;
select throws_ok($$insert into public.site_word_allowlist (word) values ('Sinov')$$, '42501', null,
                 'anon yoza olmaydi');
select throws_ok($$select 1 from private.content_log$$, '42501', null, 'anon jurnalni oʻqiy olmaydi');
select lives_ok($$select public.content_snapshot()$$, 'anon content_snapshot() ni chaqira oladi');
select is((select array_agg(k order by k) from jsonb_object_keys(public.content_snapshot()) k),
          array['allowWords', 'artworks', 'contacts', 'experts', 'generatedAt', 'leadership', 'media',
                'milestones', 'news', 'partners', 'projects', 'redirects', 'texts', 'upopGallery',
                'version'],
          'snapshot kalitlari toʻliq va ortiqchasiz');
select throws_ok($$select * from public.admin_save_news('{}'::jsonb, null)$$, '42501', null,
                 'anon admin RPC ni chaqira olmaydi');
select throws_ok($$select * from public.admin_content_log()$$, '42501', null,
                 'anon jurnal RPC sini chaqira olmaydi');

reset role;

-- 2. Administrator: toʻliq aylanish ---------------------------------------------------------------

-- private.admins dagi yagona foydalanuvchi (supabase/manual/admin.sql); usiz bu boʻlim yiqiladi
set local request.jwt.claims = '{"sub":"2d416120-49c9-4ce8-8795-9c2d36ba2cfd","role":"authenticated"}';
set local role authenticated;

select ok(private.is_admin(), 'administrator taniladi');

-- Media: ikki yuklangan rasm va sayt ichidagi statik fayllar
select isnt(set_config('t.a', (public.admin_register_media($j${
  "kind": "image", "origin": "storage", "src": "/uploads/i/sinova-640.webp", "storagePrefix": "i/sinova",
  "variantBase": "/uploads/i/sinova", "variantWidths": [320, 640], "width": 640, "height": 427,
  "blur": "data:image/webp;base64,AAAA", "bytes": 1000}$j$)).id::text, true), null, 'rasm A qoʻshildi');
select isnt(set_config('t.b', (public.admin_register_media($j${
  "kind": "image", "origin": "storage", "src": "/uploads/i/sinovb-800.webp", "storagePrefix": "i/sinovb",
  "variantBase": "/uploads/i/sinovb", "variantWidths": [400, 800], "width": 800, "height": 533,
  "bright": true}$j$)).id::text, true), null, 'rasm B qoʻshildi');
select is((public.admin_register_media($j${"kind": "image", "origin": "storage",
  "src": "/uploads/i/sinova-640.webp", "storagePrefix": "i/x", "variantBase": "/uploads/i/x",
  "variantWidths": [1], "width": 1, "height": 1}$j$)).id::text, current_setting('t.a'),
  'bir xil src qayta yuklansa mavjud qator qaytadi');
select lives_ok($$
  select public.admin_register_media(m::jsonb) from unnest(array[
    '{"kind":"video","origin":"static","src":"/media/sinov-d.mp4","width":1280,"height":720}',
    '{"kind":"video","origin":"static","src":"/media/sinov-d.webm"}',
    '{"kind":"video","origin":"static","src":"/media/sinov-m.mp4"}',
    '{"kind":"video","origin":"static","src":"/media/sinov-m.webm"}',
    '{"kind":"image","origin":"static","src":"/media/sinov-poster.avif","width":1280,"height":720}',
    '{"kind":"video","origin":"static","src":"/media/sinov-film.mp4","durationS":54}',
    '{"kind":"image","origin":"static","src":"/media/sinov-film-poster.avif","width":1280,"height":720}',
    '{"kind":"image","origin":"static","src":"/brand/sinov-logo.png","width":900,"height":703}',
    '{"kind":"video","origin":"static","src":"/upop/1.mp4"}',
    '{"kind":"image","origin":"static","src":"/upop/1.jpg","width":1600,"height":900}',
    '{"kind":"image","origin":"static","src":"/upop/2.jpg","width":1600,"height":900}']) m
$$, 'statik media qoʻshildi');
select throws_ok($$select public.admin_register_media('{"kind":"image","origin":"static","src":"https://example.com/a.jpg","width":1,"height":1}')$$,
                 '23514', null, 'tashqi manzil media sifatida qabul qilinmaydi');

-- Yangilik: yaratish
select isnt(set_config('t.news', (select x.id::text from public.admin_save_news(
  jsonb_set(jsonb_set($j${
    "slug": "sinov-maqola", "status": "confirmed", "date": "2026-09-01",
    "topic": {"uz": "Sinov", "oz": "Синов", "ozbekca": "Sinov", "ru": "Тест", "en": "Test"},
    "title": {"uz": "Sarlavha", "oz": "Сарлавҳа", "ozbekca": "Sarlavha", "ru": "Заголовок", "en": "Title"},
    "lead": {"uz": "Qisqa", "oz": "Қисқа", "ozbekca": "Qisqa", "ru": "Кратко", "en": "Short"},
    "body": {"uz": ["Bir", "Ikki"], "oz": ["Бир", "Икки"], "ozbekca": ["Bir", "Ikki"], "ru": ["Раз", "Два"],
             "en": ["One", "Two"]},
    "quote": {"uz": "Iqtibos", "oz": "Иқтибос", "ozbekca": "Iqtibos", "ru": "Цитата", "en": "Quote"},
    "cover": {"alt": {"uz": "Muqova", "oz": "Муқова", "ozbekca": "Muqova", "ru": "Обложка", "en": "Cover"},
              "status": "confirmed"},
    "story": {"primary": "art-3", "secondary": "art-4"},
    "photos": [{}]}$j$,
    '{cover,mediaId}', to_jsonb(current_setting('t.a'))),
    '{photos,0,mediaId}', to_jsonb(current_setting('t.b'))), null) x), true), null,
  'administrator yangilik yaratadi');

select is((public.content_snapshot() -> 'news' -> 0), $j${
    "slug": "sinov-maqola", "status": "confirmed", "date": "2026-09-01",
    "topic": {"uz": "Sinov", "oz": "Синов", "ozbekca": "Sinov", "ru": "Тест", "en": "Test"},
    "title": {"uz": "Sarlavha", "oz": "Сарлавҳа", "ozbekca": "Sarlavha", "ru": "Заголовок", "en": "Title"},
    "lead": {"uz": "Qisqa", "oz": "Қисқа", "ozbekca": "Qisqa", "ru": "Кратко", "en": "Short"},
    "body": {"uz": ["Bir", "Ikki"], "oz": ["Бир", "Икки"], "ozbekca": ["Bir", "Ikki"], "ru": ["Раз", "Два"],
             "en": ["One", "Two"]},
    "quote": {"uz": "Iqtibos", "oz": "Иқтибос", "ozbekca": "Iqtibos", "ru": "Цитата", "en": "Quote"},
    "cover": {"src": "/uploads/i/sinova-640.webp",
              "alt": {"uz": "Muqova", "oz": "Муқова", "ozbekca": "Muqova", "ru": "Обложка", "en": "Cover"},
              "status": "confirmed"},
    "story": {"primary": "art-3", "secondary": "art-4"},
    "photos": ["/uploads/i/sinovb-800.webp"]}$j$::jsonb,
  'snapshot dagi yangilik NewsArticle shaklida');

select is(public.content_snapshot() -> 'media', $j${
    "/uploads/i/sinova-640.webp": {"width": 640, "height": 427, "base": "/uploads/i/sinova",
                                    "widths": [320, 640], "blur": "data:image/webp;base64,AAAA"},
    "/uploads/i/sinovb-800.webp": {"width": 800, "height": 533, "base": "/uploads/i/sinovb",
                                    "widths": [400, 800], "bright": true}}$j$::jsonb,
  'snapshot dagi media xaritasi PreparedImage shaklida (faqat yuklangan rasmlar)');

select throws_ok($$select * from public.admin_save_news(
    (public.admin_get('news', current_setting('t.news'))) -> 'data', '2000-01-01T00:00:00Z')$$,
  '40001', 'eskirgan', 'eskirgan updated_at bilan saqlash rad etiladi');
select throws_ok($$select * from public.admin_save_news(
    (public.admin_get('news', current_setting('t.news'))) -> 'data', null)$$,
  '40001', 'eskirgan', 'mavjud yozuvni expected siz saqlab boʻlmaydi');
select throws_ok($$select * from public.admin_save_news(
    jsonb_set((public.admin_get('news', current_setting('t.news'))) -> 'data', '{id}',
              to_jsonb(gen_random_uuid())), now())$$,
  'P0002', 'topilmadi', 'oʻchirilgan yozuvni tahrirlash «topilmadi» beradi');
select throws_ok($$select * from public.admin_save_news(
    jsonb_set((public.admin_get('news', current_setting('t.news'))) -> 'data', '{cover,mediaId}',
              to_jsonb((select m.id from public.media m where m.src = '/media/sinov-d.mp4'))),
    ((public.admin_get('news', current_setting('t.news'))) ->> 'updatedAt')::timestamptz)$$,
  '22023', null, 'muqovaga video qoʻyib boʻlmaydi');
select throws_ok($$select * from public.admin_save_news(
    jsonb_set((public.admin_get('news', current_setting('t.news'))) -> 'data', '{title,en}', '""'),
    ((public.admin_get('news', current_setting('t.news'))) ->> 'updatedAt')::timestamptz)$$,
  '23514', null, 'boʻsh tarjima rad etiladi');

-- Yangilik: slug oʻzgaradi, eski manzil yoʻnaltiriladi
select is((select x.old_slug from public.admin_save_news(
    jsonb_set((public.admin_get('news', current_setting('t.news'))) -> 'data', '{slug}', '"sinov-maqola-2"'),
    ((public.admin_get('news', current_setting('t.news'))) ->> 'updatedAt')::timestamptz) x),
  'sinov-maqola', 'slug oʻzgarganda eski slug qaytadi');
select is(public.content_snapshot() -> 'redirects', '{"sinov-maqola": "sinov-maqola-2"}'::jsonb,
          'tasdiqlangan maqolaning eski manzili yoʻnaltiriladi');
select is(public.admin_slug_available('sinov-maqola', null), false, 'eski manzil begona uchun band');
select is(public.admin_slug_available('sinov-maqola', current_setting('t.news')::uuid), true,
          'eski manzil oʻzi uchun boʻsh');

-- Jurnal va qaytarish
select is((select count(*)::integer from public.admin_content_log() l
           where l.entity = 'news' and l.entity_key = current_setting('t.news')), 2,
          'jurnalda yaratish va oʻzgartirish bor');
select is((select x.slug from public.admin_save_news(
    (select l.before from public.admin_content_log(1) l),
    ((public.admin_get('news', current_setting('t.news'))) ->> 'updatedAt')::timestamptz) x),
  'sinov-maqola', 'jurnaldagi before bilan qaytarish ishlaydi');
select is(public.content_snapshot() -> 'redirects', '{"sinov-maqola-2": "sinov-maqola"}'::jsonb,
          'qaytarishdan keyin yoʻnaltirish teskari');
select is((public.admin_get('news', current_setting('t.news'))) -> 'data',
          (select l.after from public.admin_content_log(1) l),
          'admin_get jurnaldagi after bilan bir xil shakl');

-- Ishlatilayotgan media oʻchmaydi
select throws_ok($$select public.admin_delete_media(current_setting('t.a')::uuid)$$, '23503', null,
                 'ishlatilayotgan rasm oʻchirilmaydi');
select is((select u.uses from public.admin_media_usage() u where u.media_id = current_setting('t.a')::uuid),
          1, 'media ishlatilishi sanaladi');

-- Odamlar, tartib
select isnt(set_config('t.p1', (select x.id::text from public.admin_save_person($j${
    "key": "leader-chair", "kind": "leader", "status": "confirmed",
    "name": {"uz": "Ism", "oz": "Исм", "ozbekca": "Ism", "ru": "Имя", "en": "Name"},
    "role": {"uz": "Rais", "oz": "Раис", "ozbekca": "Rais", "ru": "Председатель", "en": "Chair"},
    "field": null, "bio": null, "photoId": null, "email": null}$j$, null) x), true), null,
  'rahbar qoʻshildi');
select isnt(set_config('t.p2', (select x.id::text from public.admin_save_person($j${
    "key": "leader-audit", "kind": "leader", "status": "pending", "name": null,
    "role": {"uz": "Taftish", "oz": "Тафтиш", "ozbekca": "Taftiş", "ru": "Ревизия", "en": "Audit"},
    "email": "sinov@example.com"}$j$, null) x), true), null, 'kutilayotgan rahbar qoʻshildi');
select throws_ok($$select * from public.admin_save_person('{"kind":"expert","status":"confirmed","name":null,
    "role":{"uz":"A","oz":"А","ozbekca":"A","ru":"А","en":"A"}}', null)$$, '23514', null,
  'tasdiqlangan odamda ism shart');
select lives_ok($$select public.admin_reorder('people', array['leader-audit', 'leader-chair'])$$,
                'rahbarlar tartibi oʻzgaradi');
select throws_ok($$select public.admin_reorder('people', array['leader-audit'])$$, '22023', null,
                 'qisman tartib rad etiladi');
select throws_ok($$select public.admin_reorder('news', array['x'])$$, '22023', null,
                 'ruxsat etilmagan obyekt tartiblanmaydi');
select is(public.content_snapshot() -> 'leadership', $j$[
    {"id": "leader-audit", "kind": "leader", "status": "pending", "name": null,
     "role": {"uz": "Taftish", "oz": "Тафтиш", "ozbekca": "Taftiş", "ru": "Ревизия", "en": "Audit"},
     "field": null, "bio": null, "photo": null, "email": "sinov@example.com"},
    {"id": "leader-chair", "kind": "leader", "status": "confirmed",
     "name": {"uz": "Ism", "oz": "Исм", "ozbekca": "Ism", "ru": "Имя", "en": "Name"},
     "role": {"uz": "Rais", "oz": "Раис", "ozbekca": "Rais", "ru": "Председатель", "en": "Chair"},
     "field": null, "bio": null, "photo": null, "email": null}]$j$::jsonb,
  'snapshot dagi rahbariyat Person shaklida va yangi tartibda');
select is(public.content_snapshot() -> 'experts', '[]'::jsonb, 'ekspertlar alohida roʻyxat');

-- Hamkor, tarix
select lives_ok($$select * from public.admin_save_partner(jsonb_set($j${
    "key": "uzbekgidroenergo", "status": "confirmed", "group": "state",
    "name": {"uz": "Oʻzbekgidroenergo", "oz": "Ўзбекгидроэнерго", "ozbekca": "Özbekgidroenergo",
             "ru": "Узбекгидроэнерго", "en": "Uzbekhydroenergo"}, "href": null}$j$,
    '{logoId}', to_jsonb((select m.id from public.media m where m.src = '/brand/sinov-logo.png'))), null)$$,
  'hamkor qoʻshildi');
select is(public.content_snapshot() -> 'partners', $j$[{"id": "uzbekgidroenergo", "status": "confirmed",
    "group": "state", "name": {"uz": "Oʻzbekgidroenergo", "oz": "Ўзбекгидроэнерго",
    "ozbekca": "Özbekgidroenergo", "ru": "Узбекгидроэнерго", "en": "Uzbekhydroenergo"},
    "logo": "/brand/sinov-logo.png", "href": null}]$j$::jsonb, 'snapshot dagi hamkor Partner shaklida');
select lives_ok($$select * from public.admin_save_milestone($j${"key": "founding", "status": "confirmed",
    "year": 2026, "icon": "users",
    "title": {"uz": "Ustav", "oz": "Устав", "ozbekca": "Ustav", "ru": "Устав", "en": "Charter"}}$j$, null)$$,
  'tarix bosqichi qoʻshildi');
select is(public.content_snapshot() -> 'milestones', $j$[{"id": "founding", "status": "confirmed",
    "year": 2026, "icon": "users",
    "title": {"uz": "Ustav", "oz": "Устав", "ozbekca": "Ustav", "ru": "Устав", "en": "Charter"}}]$j$::jsonb,
  'snapshot dagi tarix Milestone shaklida');

-- Aloqa va tarmoqlar
select lives_ok($$select public.admin_save_contacts($j${
    "address": {"value": {"uz": "Manzil", "oz": "Манзил", "ozbekca": "Manzil", "ru": "Адрес", "en": "Address"},
                "status": "confirmed"},
    "postalCode": "100011", "locality": "Tashkent",
    "phones": {"value": ["+998 55 511 15 05"], "status": "confirmed"},
    "email": {"value": "sinov@example.com", "status": "confirmed"},
    "telegram": {"value": "https://t.me/sinov", "status": "confirmed"},
    "hours": {"value": null, "status": "pending"},
    "map": {"value": {"lat": 41.311081, "lng": 69.240562}, "status": "draft"}}$j$, null)$$,
  'aloqa saqlandi');
select lives_ok($$select public.admin_save_socials($j$[
    {"id": "telegram", "href": "https://t.me/sinov", "label": "Telegram", "status": "confirmed"},
    {"id": "youtube", "href": "https://www.youtube.com/@sinov", "label": "YouTube", "status": "confirmed"}]$j$)$$,
  'tarmoqlar saqlandi');
select is(public.content_snapshot() -> 'contacts', $j${
    "address": {"value": {"uz": "Manzil", "oz": "Манзил", "ozbekca": "Manzil", "ru": "Адрес", "en": "Address"},
                "status": "confirmed"},
    "phones": {"value": ["+998 55 511 15 05"], "status": "confirmed"},
    "email": {"value": "sinov@example.com", "status": "confirmed"},
    "telegram": {"value": "https://t.me/sinov", "status": "confirmed"},
    "hours": {"value": null, "status": "pending"},
    "map": {"value": {"lat": 41.311081, "lng": 69.240562}, "status": "draft"},
    "socials": [
      {"id": "telegram", "href": "https://t.me/sinov", "label": "Telegram", "status": "confirmed"},
      {"id": "youtube", "href": "https://www.youtube.com/@sinov", "label": "YouTube", "status": "confirmed"}],
    "postalCode": "100011", "locality": "Tashkent"}$j$::jsonb,
  'snapshot dagi aloqa Contacts shaklida');

-- UPOP TREND: qator va faktlar, keyin media qatorlari, keyin tavsiflar
select lives_ok($$select public.admin_save_project($j${
    "key": "upop-trend", "status": "draft", "flagship": true,
    "name": {"uz": "UPOP TREND", "oz": "UPOP TREND", "ozbekca": "UPOP TREND", "ru": "UPOP TREND",
             "en": "UPOP TREND"},
    "tagline": {"uz": "Kasting", "oz": "Кастинг", "ozbekca": "Kasting", "ru": "Кастинг", "en": "Auditions"},
    "age": {"from": 14, "to": 19, "status": "draft"},
    "format": {"value": {"uz": "Bosqich", "oz": "Босқич", "ozbekca": "Bosqiç", "ru": "Этап", "en": "Round"},
               "status": "draft"},
    "place": {"value": null, "status": "pending"},
    "schedule": {"value": null, "status": "pending"},
    "cost": {"free": true, "status": "draft"},
    "teacher": {"value": null, "status": "pending"},
    "highlights": {"uz": ["Bepul"], "oz": ["Бепул"], "ozbekca": ["Bepul"], "ru": ["Бесплатно"], "en": ["Free"]},
    "external": {"href": "https://upop.uz", "label": "upop.uz"}}$j$, null)$$, 'loyiha yaratildi');
select lives_ok($$
  insert into public.project_media (project_key, role, main_id, webm_id, mobile_mp4_id, mobile_webm_id,
                                    poster_id, alt, status)
  select 'upop-trend', r.role, (select m.id from public.media m where m.src = r.main),
         (select m.id from public.media m where m.src = r.webm),
         (select m.id from public.media m where m.src = r.mmp4),
         (select m.id from public.media m where m.src = r.mwebm),
         (select m.id from public.media m where m.src = r.poster),
         '{"uz":"Eski","oz":"Эски","ozbekca":"Eski","ru":"Старое","en":"Old"}', r.status::public.content_status
  from (values ('loop', '/media/sinov-d.mp4', '/media/sinov-d.webm', '/media/sinov-m.mp4',
                '/media/sinov-m.webm', '/media/sinov-poster.avif', 'draft'),
               ('film', '/media/sinov-film.mp4', null, null, null, '/media/sinov-film-poster.avif', 'draft'),
               ('wordmark', '/brand/sinov-logo.png', null, null, null, null, null))
       r(role, main, webm, mmp4, mwebm, poster, status)
$$, 'administrator loyiha media qatorlarini jadvalga yoza oladi');
select lives_ok($$select public.admin_save_project(
    (public.admin_get('project', 'upop-trend') -> 'data')
      || $j${"media": {"loop": {"alt": {"uz": "Halqa", "oz": "Ҳалқа", "ozbekca": "Halqa", "ru": "Петля",
                                       "en": "Loop"}, "status": "draft"},
                       "film": {"alt": {"uz": "Film", "oz": "Фильм", "ozbekca": "Film", "ru": "Фильм",
                                       "en": "Film"}, "status": "draft"},
                       "wordmark": {"alt": {"uz": "Logotip", "oz": "Логотип", "ozbekca": "Logotip",
                                           "ru": "Логотип", "en": "Logo"}}}}$j$::jsonb,
    (public.admin_get('project', 'upop-trend') ->> 'updatedAt')::timestamptz)$$,
  'loyiha media tavsiflari saqlandi');
select is(public.content_snapshot() -> 'projects', $j$[{
    "key": "upop-trend", "status": "draft", "flagship": true,
    "name": {"uz": "UPOP TREND", "oz": "UPOP TREND", "ozbekca": "UPOP TREND", "ru": "UPOP TREND",
             "en": "UPOP TREND"},
    "tagline": {"uz": "Kasting", "oz": "Кастинг", "ozbekca": "Kasting", "ru": "Кастинг", "en": "Auditions"},
    "age": {"from": 14, "to": 19, "status": "draft"},
    "format": {"value": {"uz": "Bosqich", "oz": "Босқич", "ozbekca": "Bosqiç", "ru": "Этап", "en": "Round"},
               "status": "draft"},
    "place": {"value": null, "status": "pending"},
    "schedule": {"value": null, "status": "pending"},
    "cost": {"free": true, "status": "draft"},
    "teacher": {"value": null, "status": "pending"},
    "highlights": {"uz": ["Bepul"], "oz": ["Бепул"], "ozbekca": ["Bepul"], "ru": ["Бесплатно"], "en": ["Free"]},
    "external": {"href": "https://upop.uz", "label": "upop.uz"},
    "media": {
      "loop": {"desktop": {"webm": "/media/sinov-d.webm", "mp4": "/media/sinov-d.mp4"},
               "mobile": {"webm": "/media/sinov-m.webm", "mp4": "/media/sinov-m.mp4"},
               "poster": "/media/sinov-poster.avif", "width": 1280, "height": 720,
               "alt": {"uz": "Halqa", "oz": "Ҳалқа", "ozbekca": "Halqa", "ru": "Петля", "en": "Loop"},
               "status": "draft"},
      "film": {"src": "/media/sinov-film.mp4", "poster": "/media/sinov-film-poster.avif", "duration": 54,
               "alt": {"uz": "Film", "oz": "Фильм", "ozbekca": "Film", "ru": "Фильм", "en": "Film"},
               "status": "draft"},
      "wordmark": {"src": "/brand/sinov-logo.png", "width": 900, "height": 703,
                   "alt": {"uz": "Logotip", "oz": "Логотип", "ozbekca": "Logotip", "ru": "Логотип",
                           "en": "Logo"}}}}]$j$::jsonb,
  'snapshot dagi loyiha Project shaklida');

-- UPOP galereyasi
select lives_ok($$select public.admin_save_upop_shots(jsonb_build_array(
    jsonb_build_object('position', 1, 'frame', 'stage', 'motion', 'curtain',
      'mediaId', (select m.id from public.media m where m.src = '/upop/1.mp4'),
      'posterId', (select m.id from public.media m where m.src = '/upop/1.jpg')),
    jsonb_build_object('position', 2, 'frame', 'gold', 'motion', 'slide-end',
      'mediaId', (select m.id from public.media m where m.src = '/upop/2.jpg'),
      'alt', '{"uz":"Sahna","oz":"Саҳна","ozbekca":"Sahna","ru":"Сцена","en":"Stage"}'::jsonb)))$$,
  'galereya joylari saqlandi');
select throws_ok($$select public.admin_save_upop_shots(jsonb_build_array(
    jsonb_build_object('position', 1, 'frame', 'stage', 'motion', 'curtain',
      'mediaId', (select m.id from public.media m where m.src = '/upop/1.mp4'))))$$,
  '23514', null, 'postersiz video joyi rad etiladi');
select is(public.content_snapshot() -> 'upopGallery', $j$[
    {"kind": "video", "src": "/upop/1.mp4", "poster": "/upop/1.jpg", "frame": "stage", "motion": "curtain"},
    {"kind": "photo", "src": "/upop/2.jpg", "frame": "gold", "motion": "slide-end",
     "alt": {"uz": "Sahna", "oz": "Саҳна", "ozbekca": "Sahna", "ru": "Сцена", "en": "Stage"}}]$j$::jsonb,
  'snapshot dagi galereya UpopShot shaklida');

-- Matnlar va soʻzlar
select lives_ok($$select public.admin_save_text('home.hero.mission',
    '{"uz":"Matn","oz":"Матн","ozbekca":"Matn","ru":"Текст","en":"Text"}', null)$$, 'matn almashtirildi');
select throws_ok($$select public.admin_save_text('home.hero.mission',
    '{"uz":"Boshqa","oz":"Бошқа","ozbekca":"Boşqa","ru":"Другой","en":"Other"}', null)$$,
  '40001', null, 'mavjud matnni expected siz saqlab boʻlmaydi');
select throws_ok($$select public.admin_save_text('home.hero.about', '{"uz":"Faqat"}', null)$$,
                 '23514', null, 'beshta tildan kam matn rad etiladi');
select is(public.content_snapshot() -> 'texts',
          '{"home.hero.mission": {"uz":"Matn","oz":"Матн","ozbekca":"Matn","ru":"Текст","en":"Text"}}'::jsonb,
          'snapshot dagi matnlar');
select is(public.admin_allow_words(array['Hasan', 'Salihov', 'Hasan']), 2, 'soʻzlar roʻyxatga qoʻshildi');
select is(public.content_snapshot() -> 'allowWords', '["Hasan", "Salihov"]'::jsonb, 'snapshot dagi soʻzlar');
select is(public.admin_delete_text('home.hero.mission'), true, 'matn asliga qaytdi');

-- Storage: administrator yoza oladi
select lives_ok($$insert into storage.objects (bucket_id, name) values ('originals', 'inbox/sinov.webp')$$,
                'administrator originals ga yoza oladi');

-- 3. Begona kirgan foydalanuvchi ------------------------------------------------------------------

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000000","role":"authenticated"}';
set local role authenticated;

select ok(not private.is_admin(), 'begona foydalanuvchi administrator emas');
select is_empty(format('select 1 from public.%I', t), 'begona foydalanuvchi qator koʻrmaydi: ' || t)
from unnest(array['media', 'news', 'news_photos', 'news_slug_redirects', 'people', 'partners',
                  'site_contacts', 'social_links', 'milestones', 'projects', 'project_facts',
                  'project_media', 'upop_shots', 'site_texts', 'site_word_allowlist']) t;
select throws_ok(format('insert into public.%I default values', t), '42501', null,
                 'begona foydalanuvchi qoʻsha olmaydi: ' || t)
from unnest(array['media', 'news', 'news_photos', 'news_slug_redirects', 'people', 'partners',
                  'site_contacts', 'social_links', 'milestones', 'projects', 'project_facts',
                  'project_media', 'upop_shots', 'site_texts', 'site_word_allowlist', 'artworks']) t;
select is_empty($$update public.news set status = 'draft' returning 1$$,
                'begona foydalanuvchi yangilikni oʻzgartira olmaydi');
select is_empty($$delete from public.people returning 1$$, 'begona foydalanuvchi odamni oʻchira olmaydi');
select is_empty($$delete from public.media returning 1$$, 'begona foydalanuvchi mediani oʻchira olmaydi');
select throws_ok(s, '42501', null, 'begona foydalanuvchi RPC chaqira olmaydi: ' || left(s, 40))
from unnest(array[
  $$select * from public.admin_save_news('{}', null)$$,
  $$select public.admin_delete_news(gen_random_uuid(), now())$$,
  $$select public.admin_slug_available('x', null)$$,
  $$select * from public.admin_save_person('{}', null)$$,
  $$select public.admin_delete_person(gen_random_uuid(), now())$$,
  $$select * from public.admin_save_partner('{}', null)$$,
  $$select public.admin_delete_partner(gen_random_uuid(), now())$$,
  $$select public.admin_save_contacts('{}', null)$$,
  $$select public.admin_save_socials('[]')$$,
  $$select * from public.admin_save_milestone('{}', null)$$,
  $$select public.admin_delete_milestone(gen_random_uuid(), now())$$,
  $$select public.admin_save_project('{}', null)$$,
  $$select public.admin_save_upop_shots('[]')$$,
  $$select public.admin_reorder('people', array['x'])$$,
  $$select public.admin_save_text('a.b', '{}', null)$$,
  $$select public.admin_delete_text('a.b')$$,
  $$select public.admin_allow_words(array['Sinov'])$$,
  $$select public.admin_register_media('{}')$$,
  $$select public.admin_delete_media(gen_random_uuid())$$,
  $$select * from public.admin_media_usage()$$,
  $$select public.admin_get('news', null)$$,
  $$select * from public.admin_content_log()$$,
  $$select private.log_change('news', 'x', 'update', null, null)$$]) s;
select throws_ok($$select 1 from private.content_log$$, '42501', null,
                 'begona foydalanuvchi jurnalni oʻqiy olmaydi');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('media', 'i/begona.webp')$$,
                 '42501', null, 'begona foydalanuvchi media bucketga yoza olmaydi');
select is_empty($$select 1 from storage.objects where bucket_id in ('originals', 'media')$$,
                'begona foydalanuvchi bucket roʻyxatini koʻrmaydi');
select lives_ok($$select public.content_snapshot()$$, 'begona foydalanuvchi ham snapshot oʻqiydi');

reset role;

-- 4. Administrator: oʻchirish -------------------------------------------------------------------

set local request.jwt.claims = '{"sub":"2d416120-49c9-4ce8-8795-9c2d36ba2cfd","role":"authenticated"}';
set local role authenticated;

select is(public.admin_delete_news(current_setting('t.news')::uuid,
            ((public.admin_get('news', current_setting('t.news'))) ->> 'updatedAt')::timestamptz),
          'sinov-maqola', 'oʻchirish slug qaytaradi');
select is(public.content_snapshot() -> 'news', '[]'::jsonb, 'oʻchirilgan yangilik snapshot da yoʻq');
select is(public.content_snapshot() -> 'redirects', '{}'::jsonb, 'yoʻnaltirishlar ham oʻchdi');
select is(public.admin_delete_media(current_setting('t.a')::uuid), 'i/sinova',
          'boʻshagan media oʻchadi va prefiks qaytadi');

reset role;

-- 5. anon snapshot orqali faqat ommaviy kontentni koʻradi ----------------------------------------

set local role anon;
select is(jsonb_array_length(public.content_snapshot() -> 'leadership'), 2,
          'anon kontentni faqat snapshot orqali oladi');
reset role;

select * from finish();
rollback;
