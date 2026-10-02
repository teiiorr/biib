-- Kontent jadvallari: src/content/types.ts faylidagi turlarning maʼlumotlar bazasidagi shakli

create table public.media (
  id uuid primary key default gen_random_uuid(),
  kind public.media_kind not null,
  origin public.media_origin not null,          -- static: public/ papkasidagi fayl; storage: yuklangan fayl
  -- CSP tashqi manzilni bloklaydi: faqat sayt ichidagi yoʻl
  src text not null unique check (src ~ '^/[A-Za-z0-9._/-]+$'),
  storage_prefix text,                          -- 'i/<hash>': oʻchirishda barcha nusxalar shu bilan topiladi
  variant_base text,                            -- '/img/news-teatr' | '/uploads/i/<hash>'
  variant_widths smallint[] not null default '{}',
  width integer check (width > 0),
  height integer check (height > 0),
  blur text check (blur is null or blur like 'data:image/webp;base64,%'),
  bright boolean not null default false,
  bytes integer check (bytes >= 0),
  duration_s numeric(7, 2) check (duration_s >= 0),
  poster_id uuid references public.media (id) on delete restrict,
  created_at timestamptz not null default now(),
  check (kind <> 'image' or (width is not null and height is not null)),
  check (origin <> 'storage' or storage_prefix is not null),
  -- Yuklangan rasm snapshot ichidagi media xaritasiga tushadi: <picture> uchun asos va kengliklar shart
  check (origin <> 'storage' or kind <> 'image'
         or (variant_base is not null and cardinality(variant_widths) > 0))
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 80),
  status public.content_status not null default 'confirmed',
  published_on date not null default current_date,
  topic public.l10n_text not null,
  title public.l10n_text not null,
  lead public.l10n_text not null,
  body public.l10n_list not null,
  quote public.l10n_text,
  cover_id uuid references public.media (id) on delete restrict,
  cover_alt public.l10n_text not null,
  cover_status public.content_status not null default 'confirmed',
  story_primary public.art_slot not null default 'art-1',
  story_secondary public.art_slot not null default 'art-2',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index news_order on public.news (published_on desc, created_at desc);   -- barqaror tartib

create table public.news_photos (
  news_id uuid not null references public.news (id) on delete cascade,
  position smallint not null check (position between 1 and 40),
  media_id uuid not null references public.media (id) on delete restrict,
  primary key (news_id, position),
  unique (news_id, media_id)
);

create table public.news_slug_redirects (
  old_slug text primary key check (old_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  news_id uuid not null references public.news (id) on delete cascade
);

create table public.people (
  id uuid primary key default gen_random_uuid(),
  key text not null unique default private.new_key('p')
      check (key ~ '^[a-z][a-z0-9-]*$'),        -- DOM id asosi; mavjud yozuvlar eski id bilan
  kind public.person_kind not null,
  status public.content_status not null default 'confirmed',
  name public.l10n_text,
  role public.l10n_text not null,
  field public.l10n_text,
  bio public.l10n_text,
  photo_id uuid references public.media (id) on delete restrict,
  email text check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  check (status <> 'confirmed' or name is not null)
);
create index people_order on public.people (kind, sort_order);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  key text not null unique default private.new_key('h') check (key ~ '^[a-z][a-z0-9-]*$'),
  status public.content_status not null default 'confirmed',
  "group" public.partner_group not null,
  name public.l10n_text,
  logo_id uuid references public.media (id) on delete restrict,
  href text check (href ~ '^https://'),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.site_contacts (
  id smallint primary key default 1 check (id = 1),
  address public.l10n_text,
  address_status public.content_status not null default 'pending',
  postal_code text check (postal_code ~ '^[0-9]{6}$'),
  locality text,                                -- hozircha jsonld.ts faylida qattiq yozilgan
  phones text[] not null default '{}',
  phones_status public.content_status not null default 'pending',
  email text check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  email_status public.content_status not null default 'pending',
  telegram text check (telegram ~ '^https://t\.me/'),
  telegram_status public.content_status not null default 'pending',
  hours public.l10n_text,
  hours_status public.content_status not null default 'pending',
  map_lat numeric(9, 6) check (map_lat between -90 and 90),
  map_lng numeric(9, 6) check (map_lng between -180 and 180),
  map_status public.content_status not null default 'pending',
  updated_at timestamptz not null default now(),
  check ((map_lat is null) = (map_lng is null))
);

create table public.social_links (
  network public.social_network primary key,
  href text not null check (href ~ '^https://'),
  label text not null check (length(btrim(label)) > 0),
  status public.content_status not null,
  sort_order smallint not null default 0
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  key text not null unique default private.new_key('m') check (key ~ '^[a-z][a-z0-9-]*$'),
  status public.content_status not null default 'confirmed',
  year smallint check (year between 1990 and 2100),
  title public.l10n_text not null,
  icon text not null default 'calendar' check (icon ~ '^[a-z-]+$'),  -- FeatureIcon nomi (zod roʻyxati)
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.projects (                  -- faqat UPOP TREND: loyiha qoʻshilmaydi va oʻchmaydi
  key text primary key check (key = 'upop-trend'),
  status public.content_status not null,
  flagship boolean not null default true check (flagship),
  name public.l10n_text not null,
  tagline public.l10n_text not null,
  age_from smallint not null check (age_from between 0 and 99),
  age_to smallint not null check (age_to >= age_from and age_to <= 99),
  age_status public.content_status not null,
  cost_free boolean,
  cost_status public.content_status not null,
  highlights public.l10n_list not null,         -- zod: har tilda teng, ≤ 3 (belgi tartib boʻyicha)
  external_href text not null check (external_href ~ '^https://'),
  external_label text not null check (length(btrim(external_label)) > 0),
  updated_at timestamptz not null default now()
);

create table public.project_facts (
  project_key text not null references public.projects (key) on delete cascade,
  fact public.project_fact not null,
  value public.l10n_text,
  status public.content_status not null,
  primary key (project_key, fact)
);

-- loop | film | wordmark; video fayllari hozircha kodda, admin faqat tavsif va holatni oʻzgartiradi
create table public.project_media (
  project_key text not null references public.projects (key) on delete cascade,
  role text not null check (role in ('loop', 'film', 'wordmark')),
  main_id uuid not null references public.media (id) on delete restrict,   -- loop: kompyuter mp4
  webm_id uuid references public.media (id) on delete restrict,
  mobile_mp4_id uuid references public.media (id) on delete restrict,
  mobile_webm_id uuid references public.media (id) on delete restrict,
  poster_id uuid references public.media (id) on delete restrict,
  alt public.l10n_text not null,
  status public.content_status,
  primary key (project_key, role),
  -- Shakl types.ts faylidagi LoopMedia, FilmMedia va WordmarkMedia bilan bir xil boʻlishi uchun
  check (role <> 'loop' or (webm_id is not null and mobile_mp4_id is not null
                            and mobile_webm_id is not null and poster_id is not null)),
  check (role <> 'film' or poster_id is not null),
  check ((role = 'wordmark') = (status is null))
);

create table public.upop_shots (
  position smallint primary key check (position between 1 and 8),   -- 1 = eng katta ramka
  kind public.media_kind not null,
  media_id uuid not null references public.media (id) on delete restrict,
  poster_id uuid references public.media (id) on delete restrict,
  frame public.upop_frame not null,
  motion public.upop_motion not null,
  alt public.l10n_text,                         -- null: lugʻatdagi projects.galleryAlt
  check (kind = 'image' or poster_id is not null)
);

-- Lugʻat ustidan almashtirish: kalit uz lugʻatida boʻlishi va shakli mos kelishi ilovada tekshiriladi
create table public.site_texts (
  key text primary key check (key ~ '^[a-z][A-Za-z0-9]*(\.[A-Za-z0-9]+)+$'),
  value jsonb not null check (private.is_l10n(value, false) or private.is_l10n(value, true)),
  updated_at timestamptz not null default now()
);

-- Tasdiqlangan nom va atamalar: saqlashdagi va G3 tekshiruvidagi «inglizcha soʻz» qoidasi ularga tegmaydi
create table public.site_word_allowlist (
  word text primary key check (word ~ '^[A-Za-z][A-Za-z0-9-]{1,40}$')
);

create table public.artworks (                  -- ixtiyoriy jadval: rozilik cheklov orqali tekshiriladi
  id uuid primary key default gen_random_uuid(),
  status public.content_status not null default 'pending',
  media_id uuid not null references public.media (id) on delete restrict,
  first_name text not null check (first_name !~ '\s' and length(first_name) > 0),
  age smallint not null check (age between 3 and 19),
  region public.l10n_text not null,
  title public.l10n_text not null,
  consent_parent boolean not null check (consent_parent),
  consent_child boolean not null check (consent_child),
  consent_date date not null,
  sort_order integer not null default 0
);

create table private.content_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor uuid default auth.uid(),
  entity text not null,
  entity_key text not null,
  action text not null check (action in ('create', 'update', 'delete', 'restore')),
  before jsonb,
  after jsonb                                   -- admin shaklidagi JSON: qaytarish shu RPC bilan
);

-- Tashqi kalit ustunlari: media oʻchirilganda restrict tekshiruvi butun jadvalni oʻqimasin
create index media_poster_id on public.media (poster_id);
create index news_cover_id on public.news (cover_id);
create index news_photos_media_id on public.news_photos (media_id);
create index news_slug_redirects_news_id on public.news_slug_redirects (news_id);
create index people_photo_id on public.people (photo_id);
create index partners_logo_id on public.partners (logo_id);
create index project_media_main_id on public.project_media (main_id);
create index project_media_webm_id on public.project_media (webm_id);
create index project_media_mobile_mp4_id on public.project_media (mobile_mp4_id);
create index project_media_mobile_webm_id on public.project_media (mobile_webm_id);
create index project_media_poster_id on public.project_media (poster_id);
create index upop_shots_media_id on public.upop_shots (media_id);
create index upop_shots_poster_id on public.upop_shots (poster_id);
create index artworks_media_id on public.artworks (media_id);

do $$ declare t text; begin
  foreach t in array array['news', 'people', 'partners', 'site_contacts', 'milestones', 'projects',
                           'site_texts'] loop
    execute format('create trigger touch before update on public.%I '
                   'for each row execute function private.touch()', t);
  end loop;
end $$;
