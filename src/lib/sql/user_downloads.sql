CREATE TABLE IF NOT EXISTS user_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
  last_version_code INTEGER NOT NULL,
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;

-- User hanya bisa melihat datanya sendiri
CREATE POLICY "Users can view own downloads" ON user_downloads FOR SELECT USING (auth.uid() = user_id);

-- User bisa mencatat downloadnya sendiri
CREATE POLICY "Users can insert own downloads" ON user_downloads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User bisa update versi yang terinstall
CREATE POLICY "Users can update own downloads" ON user_downloads FOR UPDATE USING (auth.uid() = user_id);

-- User bisa menghapus (Uninstall) datanya sendiri
CREATE POLICY "Users can delete own downloads" ON user_downloads FOR DELETE USING (auth.uid() = user_id);
