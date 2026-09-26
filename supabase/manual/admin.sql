-- Bir martalik qoʻlda sozlash (SQL editor yoki psql). Migratsiya emas: shaxsiy uuid migratsiyalarda saqlanmaydi.
-- Uuid: Authentication > Users dagi administrator foydalanuvchisi.
insert into private.admins (user_id) values ('2d416120-49c9-4ce8-8795-9c2d36ba2cfd') on conflict do nothing;
