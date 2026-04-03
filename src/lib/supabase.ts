import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type AppData = {
  id: string;
  developer_id: string;
  title: string;
  description: string;
  icon_url: string;
  package_name: string;
  category: string;
  rating: number;
  downloads: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    developer_name: string;
  };
};

export type AppVersion = {
  id: string;
  app_id: string;
  version_name: string;
  version_code: number;
  release_notes: string;
  apk_url: string;
  size_bytes: number;
  created_at: string;
};
