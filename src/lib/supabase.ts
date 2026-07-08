import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder credentials if env variables are not yet configured
// This prevents Next.js compilation/build crashes on serverless deployments
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project-id.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-12345';

if (typeof window !== 'undefined') {
  console.log('[Supabase Diagnostic] URL:', supabaseUrl.substring(0, 25) + '...');
  console.log('[Supabase Diagnostic] Env URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('[Supabase Diagnostic] Env Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isCloudEnabled = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project-id')
);
