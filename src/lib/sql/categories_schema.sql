-- 1. Tabel Kategori
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon_name TEXT, -- Nama ikon lucide
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tambahkan Data Awal (Contoh)
INSERT INTO categories (name, slug, icon_name) VALUES 
('Games', 'games', 'Gamepad2'),
('Tools', 'tools', 'Wrench'),
('Social', 'social', 'Users'),
('Productivity', 'productivity', 'Briefcase'),
('Entertainment', 'entertainment', 'PlayCircle'),
('Education', 'education', 'GraduationCap')
ON CONFLICT (slug) DO NOTHING;

-- 3. Ubah kolom category di tabel apps agar berelasi (Opsional, tapi lebih baik)
-- Karena tabel apps sudah ada, kita biarkan dulu kolom category-nya teks, 
-- tapi kita bisa buatkan relasi di masa depan.

-- 4. Aktifkan RLS untuk Kategori
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Publik bisa melihat
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);

-- Admin bisa CRUD
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
