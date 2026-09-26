-- RLS va huquqlar: anon hech bir jadvalni oʻqiy olmaydi, uning yagona yoʻli content_snapshot()

do $$ declare t text; begin
  foreach t in array array['media', 'news', 'news_photos', 'news_slug_redirects', 'people', 'partners',
    'site_contacts', 'social_links', 'milestones', 'projects', 'project_facts', 'project_media',
    'upop_shots', 'site_texts', 'site_word_allowlist', 'artworks'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from public, anon, authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    -- Anonim kirish ham «authenticated» roli oladi: shu sabab rol emas, is_admin() tekshiriladi
    execute format($p$create policy %I on public.%I for all to authenticated
      using ((select private.is_admin())) with check ((select private.is_admin()))$p$, t || '_admin', t);
  end loop;
end $$;

-- Jurnal faqat definer RPC orqali yoziladi va oʻqiladi
alter table private.content_log enable row level security;
revoke all on private.content_log from public, anon, authenticated;
