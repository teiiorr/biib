-- «Eskirgan» (boshqa oynada saqlangan) xatosining kodi 40001 dan PT409 ga oʻtadi. PostgREST 40001 ni
-- serializatsiya xatosi deb tranzaksiyani qayta-qayta takrorlaydi: funksiya har safar yana 40001 beradi,
-- soʻrov cheksiz aylanadi va qator qulfini ushlab turadi. PT409 PostgREST da HTTP 409 boʻladi va
-- takrorlanmaydi. Funksiyalar oʻz taʼrifidan qayta yaratiladi: huquqlar va egasi oʻzgarmaydi,
-- qayta ishga tushirilsa hech narsa qilmaydi.

do $$
declare
  f record;
begin
  for f in
    select p.oid
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prokind = 'f' and p.proname like 'admin\_%'
      and pg_get_functiondef(p.oid) like '%errcode = ''40001''%'
  loop
    execute replace(pg_get_functiondef(f.oid), 'errcode = ''40001''', 'errcode = ''PT409''');
  end loop;
end $$;
