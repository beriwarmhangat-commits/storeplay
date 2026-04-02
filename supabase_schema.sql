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
  role TEXT DEFAULT 'developer' CHECK (role IN ('developer', 'admin')),
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
    COALESCE((new.raw_user_meta_data->>'role')::TEXT, 'developer')
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

-- ==== APP VERSIONS POLICIES ====
-- Public can view all versions
CREATE POLICY "Public can view app versions" ON app_versions FOR SELECT USING (true);
-- Developers can insert versions for their own apps
CREATE POLICY "Developers can insert versions" ON app_versions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM apps WHERE id = app_id AND developer_id = auth.uid())
);
-- Developers can update their own versions
CREATE POLICY "Developers can update own versions" ON app_versions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM apps WHERE id = app_id AND developer_id = auth.uid())
);
-- Admins can delete and update any version
CREATE POLICY "Admins can update any version" ON app_versions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete any version" ON app_versions FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
