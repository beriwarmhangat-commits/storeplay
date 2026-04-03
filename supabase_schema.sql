-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- RESET SCHEMA (Hapus tabel lama agar schema baru dengan foreign keys ini bisa masuk)
DROP TABLE IF EXISTS public.app_versions CASCADE;
DROP TABLE IF EXISTS public.apps CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create Profiles Table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  developer_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'developer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to handle new user registration automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, developer_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger whenever a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create Apps Table
CREATE TABLE IF NOT EXISTS apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  package_name TEXT UNIQUE NOT NULL,
  category TEXT,
  rating DECIMAL(3,2) DEFAULT 0.0,
  downloads BIGINT DEFAULT 0,
  rating_count BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create App Versions Table
CREATE TABLE IF NOT EXISTS app_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
  version_name TEXT NOT NULL,
  version_code INTEGER NOT NULL,
  release_notes TEXT,
  apk_url TEXT NOT NULL,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(app_id, version_code)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_app_versions_app_id ON app_versions(app_id);
CREATE INDEX IF NOT EXISTS idx_apps_developer_id ON apps(developer_id);

-- -------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- -------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_versions ENABLE ROW LEVEL SECURITY;

-- ==== PROFILES POLICIES ====
-- Users can view all profiles
CREATE POLICY "Public can view profiles" ON profiles FOR SELECT USING (true);
-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ==== APPS POLICIES ====
-- Public can view all apps
CREATE POLICY "Public can view apps" ON apps FOR SELECT USING (true);
-- Developers can insert their own apps
CREATE POLICY "Developers can insert apps" ON apps FOR INSERT WITH CHECK (
  auth.uid() = developer_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('developer', 'admin'))
);
-- Developers can update their own apps
CREATE POLICY "Developers can update own apps" ON apps FOR UPDATE USING (auth.uid() = developer_id) WITH CHECK (auth.uid() = developer_id);
-- Admins can update any app
CREATE POLICY "Admins can update any app" ON apps FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
-- Admins can delete any app
CREATE POLICY "Admins can delete any app" ON apps FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==== RATINGS POLICIES ====
-- Public can view app versions
CREATE POLICY "Public can view app versions" ON app_versions FOR SELECT USING (true);
-- Developers can insert versions for their own apps
CREATE POLICY "Developers can insert versions" ON app_versions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM apps WHERE id = app_id AND developer_id = auth.uid())
);

-- ==== RATINGS TABLE ====
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID REFERENCES public.apps(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_id TEXT, -- ID perangkat (localStorage)
  user_ip TEXT,  -- Alamat IP
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Satu rating per perangkat per aplikasi (untuk Anonim)
  -- Jika user login, Satu rating per akun per aplikasi
  UNIQUE(app_id, device_id),
  UNIQUE(app_id, user_id)
);

-- RLS for ratings
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view ratings" ON ratings FOR SELECT USING (true);
CREATE POLICY "Public can insert ratings" ON ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own ratings" ON ratings FOR UPDATE USING (
  auth.uid() = user_id OR (user_id IS NULL AND device_id = auth.jwt()->>'device_id')
);

-- Function to update app overall rating
CREATE OR REPLACE FUNCTION update_app_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_id UUID;
BEGIN
  target_id := COALESCE(NEW.app_id, OLD.app_id);
  
  UPDATE apps
  SET 
    rating = COALESCE((SELECT AVG(score) FROM ratings WHERE app_id = target_id), 0),
    rating_count = (SELECT COUNT(*) FROM ratings WHERE app_id = target_id)
  WHERE id = target_id;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update app rating
DROP TRIGGER IF EXISTS trg_update_app_rating ON ratings;
CREATE TRIGGER trg_update_app_rating
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW EXECUTE FUNCTION update_app_rating();

-- ==== SITE ALERTS TABLE ====
CREATE TABLE IF NOT EXISTS public.site_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'danger', 'success')),
  location TEXT DEFAULT 'all' CHECK (location IN ('all', 'home', 'app_detail')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for alerts
ALTER TABLE site_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active alerts" ON site_alerts FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage alerts" ON site_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
