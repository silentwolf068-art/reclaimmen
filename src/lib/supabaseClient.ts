import { createClient } from '@supabase/supabase-js';

function getSupabaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (envUrl && envUrl.startsWith('http') && !envUrl.includes('your-project')) {
    return envUrl;
  }
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('custom_supabase_url');
    if (customUrl && customUrl.startsWith('http')) return customUrl;
  }
  return '';
}

function getSupabaseKey(): string {
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (envKey && envKey.length > 20 && !envKey.includes('your-actual')) {
    return envKey;
  }
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem('custom_supabase_anon_key');
    if (customKey && customKey.length > 20) return customKey;
  }
  return '';
}

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseKey();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
