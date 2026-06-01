import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type ActivityRow = Tables<'activities'>;
export type CategoryRow = Tables<'activity_categories'>;
export type RegistrationRow = Tables<'activity_registrations'>;

export type CategorySlug = 'lectures-and-classes' | 'health-club' | 'upcoming-events';

export const fetchActivitiesByCategory = async (slug: CategorySlug) => {
  const { data: cat, error: catErr } = await supabase
    .from('activity_categories')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (catErr || !cat) return { data: [] as ActivityRow[], error: catErr };

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('category_id', cat.id)
    .eq('is_active', true)
    .order('day_of_week', { ascending: true, nullsFirst: false })
    .order('event_date', { ascending: true, nullsFirst: false })
    .order('start_time', { ascending: true, nullsFirst: false });

  return { data: (data ?? []) as ActivityRow[], error };
};

// Fetch all one-time events across every category (for the "Upcoming Events" page)
export const fetchAllOneTimeEvents = async () => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('is_active', true)
    .eq('kind', 'one_time')
    .not('event_date', 'is', null)
    .order('event_date', { ascending: true })
    .order('event_start_time', { ascending: true });
  return { data: (data ?? []) as ActivityRow[], error };
};

export const fetchActivityById = async (id: string) => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return { data: data as ActivityRow | null, error };
};

// Personal calendar (registrations)
export const fetchMyRegistrations = async () => {
  const { data, error } = await supabase
    .from('activity_registrations')
    .select('*, activity:activities(*)')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
};

export const registerForActivity = async (activityId: string, occurrenceDate: string | null = null) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };
  return supabase
    .from('activity_registrations')
    .insert({ user_id: user.id, activity_id: activityId, occurrence_date: occurrenceDate })
    .select()
    .maybeSingle();
};

export const cancelRegistration = async (registrationId: string) => {
  return supabase.from('activity_registrations').delete().eq('id', registrationId);
};

// ---- Helpers for displaying localized fields ----
export const pickLang = (
  row: Partial<Record<string, string | null | undefined>>,
  base: string,
  language: 'he' | 'en',
): string => {
  const key = language === 'en' ? `${base}_en` : `${base}_he`;
  return (row[key] as string) || (row[`${base}_he`] as string) || '';
};
