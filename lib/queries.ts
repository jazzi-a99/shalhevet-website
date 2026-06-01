import { supabase } from './supabaseClient';

// Auth functions
export const auth_sign_up = async (email: string, password: string, full_name?: string) => {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: full_name ? { full_name } : undefined,
    },
  });
};

export const profiles_create_me = async (userId: string, email: string, full_name?: string) => {
  // The DB trigger handle_new_user() already creates the profile from auth metadata.
  // We upsert here as a fallback to guarantee full_name is stored even if metadata was missing.
  return supabase
    .from('profiles')
    .upsert({ id: userId, email, full_name: full_name || null }, { onConflict: 'id' })
    .select()
    .maybeSingle();
};

export const auth_sign_in = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const auth_sign_out = async () => {
  return supabase.auth.signOut();
};

// Profile functions
export const profiles_get_me = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };
  
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
};

export const profiles_update_me = async (full_name: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };
  
  return supabase
    .from('profiles')
    .update({ full_name })
    .eq('id', user.id)
    .select()
    .maybeSingle();
};

// Get current session
export const get_session = async () => {
  return supabase.auth.getSession();
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
