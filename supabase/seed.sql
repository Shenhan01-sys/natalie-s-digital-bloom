-- Local development only (supabase db reset). Not applied to production.
-- Example products so the shop is not empty while developing.

update public.site_settings
set value = value || '{"banks":[{"bank":"BCA (contoh)","number":"0000000000","holder":"Natalie Netania Sulistio"}]}'::jsonb
where key = 'shop';

with p as (
  insert into public.products (slug, title, subtitle, description, price, compare_at_price, cover_url, gallery, category, badge, published, sort)
  values
    ('template-infografis-kesehatan', 'Template Infografis Kesehatan', 'Canva template · A4 · 3 variasi',
     E'Template infografis siap edit di Canva untuk penyuluhan kesehatan.\n\n• Ukuran A4 portrait\n• 3 variasi warna\n• Font gratis\n• Tinggal ganti teks & foto',
     35000, 50000, '/works/info-ibu-sehat.webp', '["/works/info-ibu-sehat.webp","/works/info-imunisasi.webp","/works/info-kolesterol.webp"]',
     'Infographics', 'Best seller', true, 1),
    ('template-leaflet-lipat', 'Template Leaflet 2 Sisi', 'Canva template · A4 landscape',
     E'Leaflet dua sisi (depan & belakang) yang rapi untuk program kerja, KKN, atau UMKM.',
     45000, null, '/works/leaflet-kehamilan-1.webp', '["/works/leaflet-kehamilan-1.webp","/works/leaflet-kehamilan-2.webp"]',
     'Leaflet', null, true, 2),
    ('kartu-natal-gratis', 'Kartu Natal (Gratis)', 'Canva template · freebie',
     E'Kartu ucapan Natal gratis untuk dibagikan ke keluarga dan teman.',
     0, null, '/works/card-xmas-red.webp', '["/works/card-xmas-red.webp","/works/card-xmas-navy.webp"]',
     'Christmas Cards', 'Free', true, 3)
  returning id, slug
)
insert into public.product_secrets (product_id, delivery_url, delivery_note)
select id, 'https://www.canva.com/design/EXAMPLE/' || slug || '/view?mode=preview',
       'Klik "Use template" di Canva untuk menyalin desainnya ke akunmu.'
from p;
