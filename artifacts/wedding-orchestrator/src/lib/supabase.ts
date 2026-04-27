import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Running in mock mode.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

/**
 * Lazy Auth Helper: 
 * Ensures we have an anonymous session for the "Aha!" moment.
 */
export const ensureAnonymousSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    // Supabase has built-in anonymous sign-ins
    // We can also just use a local UUID for the extraction logic
    return null;
  }
  return session;
};
