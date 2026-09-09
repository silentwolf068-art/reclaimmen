import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://xjsbyfmssxbfuhhgkwcz.supabase.co';
const defaultKey = 'sb_publishable_aqRbrQOhQ2Zn15_1HSZ35Q_JC-Cv0VR';

function getSupabaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (envUrl && envUrl.startsWith('http') && !envUrl.includes('your-project')) {
    return envUrl;
  }
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('custom_supabase_url');
    if (customUrl && customUrl.startsWith('http')) return customUrl;
  }
  return defaultUrl;
}

function getSupabaseKey(): string {
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (envKey && envKey.length > 10 && !envKey.includes('your-actual')) {
    return envKey;
  }
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem('custom_supabase_anon_key');
    if (customKey && customKey.length > 10) return customKey;
  }
  return defaultKey;
}

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseKey();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
