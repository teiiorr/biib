-- Fayl saqlash: originals yopiq (brauzer yuklagan asl nusxa), media ochiq (tayyor variantlar)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('originals', 'originals', false, 26214400,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('media', 'media', true, 5242880,
   array['image/avif', 'image/webp', 'image/png', 'video/mp4', 'video/webm']);

-- Ochiq SELECT siyosati yoʻq: ochiq URL usiz ishlaydi, siyosat esa bucket roʻyxatini ochib qoʻyardi
create policy biib_storage_admin on storage.objects for all to authenticated
  using (bucket_id in ('originals', 'media') and (select private.is_admin()))
  with check (bucket_id in ('originals', 'media') and (select private.is_admin()));
