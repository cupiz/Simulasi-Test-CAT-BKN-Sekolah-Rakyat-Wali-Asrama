import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder credentials if env variables are not yet configured
// This prevents Next.js compilation/build crashes on serverless deployments
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project-id.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-12345';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isCloudEnabled = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
