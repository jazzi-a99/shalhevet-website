import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type ActivityRow = Tables<'activities'>;
export type ActivityInsert = TablesInsert<'activities'>;
export type ActivityUpdate = TablesUpdate<'activities'>;
export type CategoryRow = Tables<'activity_categories'>;
export type RegistrationRow = Tables<'activity_registrations'>;
export type AnnouncementRow = Tables<'announcements'>;
export type AnnouncementInsert = TablesInsert<'announcements'>;


export const adminApi = {
  // ---- Categories ----
  listCategories: async () => {
    const { data, error } = await supabase
      .from('activity_categories')
      .select('*')
      .order('display_order');
    return { data: (data ?? []) as CategoryRow[], error };
  },

  // ---- Activities (admins see all, including inactive) ----
  listActivities: async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*, category:activity_categories(name_he, name_en, slug)')
      .order('created_at', { ascending: false });
    return { data: data ?? [], error };
  },

  createActivity: async (payload: ActivityInsert) => {
    return supabase.from('activities').insert(payload).select().maybeSingle();
  },

  updateActivity: async (id: string, payload: ActivityUpdate) => {
    return supabase.from('activities').update(payload).eq('id', id).select().maybeSingle();
  },

  deleteActivity: async (id: string) => {
    return supabase.from('activities').delete().eq('id', id);
  },

  setActivityActive: async (id: string, is_active: boolean) => {
    return supabase.from('activities').update({ is_active }).eq('id', id);
  },

  setActivityCancelled: async (id: string, is_cancelled: boolean) => {
    return supabase.from('activities').update({ is_cancelled }).eq('id', id);
  },

  // ---- Registrations ----
  listRegistrationsForActivity: async (activity_id: string) => {
    const { data, error } = await supabase
      .from('activity_registrations')
      .select('*, profile:profiles(full_name, email)')
      .eq('activity_id', activity_id)
      .order('created_at', { ascending: false });
    return { data: data ?? [], error };
  },

  listAllRegistrations: async () => {
    const { data: regs, error } = await (supabase.rpc as any)('admin_list_registrations');
    if (error || !regs || regs.length === 0) return { data: [], error };

    const activityIds: string[] = Array.from(new Set(regs.map((r: any) => String(r.activity_id))));
    const { data: activities } = await supabase
      .from('activities')
      .select('id, title_he, title_en, kind, event_date, day_of_week, start_time, event_start_time')
      .in('id', activityIds);
    const aMap = new Map((activities ?? []).map((a: any) => [a.id, a]));

    const enriched = regs.map((r: any) => ({
      ...r,
      profile: { full_name: r.full_name, email: r.email },
      activity: aMap.get(r.activity_id) ?? null,
    }));
    return { data: enriched, error: null };
  },

  updateRegistration: async (
    id: string,
    payload: { attendance_status?: string; payment_status?: string; notes?: string },
  ) => {
    return supabase.from('activity_registrations').update(payload as never).eq('id', id);
  },

  // ---- Announcements ----
  listAnnouncements: async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*, activity:activities(title_he, title_en)')
      .order('created_at', { ascending: false });
    return { data: data ?? [], error };
  },

  createAnnouncement: async (payload: AnnouncementInsert) => {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
      .from('announcements')
      .insert({ ...payload, created_by: user?.id ?? null })
      .select()
      .maybeSingle();
  },

  updateAnnouncement: async (
    id: string,
    payload: { title_he?: string; message_he?: string; title_en?: string | null; message_en?: string | null; activity_id?: string | null },
  ) => {
    return supabase.from('announcements').update(payload as never).eq('id', id);
  },

  deleteAnnouncement: async (id: string) => {
    return supabase.from('announcements').delete().eq('id', id);
  },

  // ---- Stats for overview ----
  getOverviewStats: async () => {
    const [activitiesRes, registrationsRes, adminsRes, upcomingRes] = await Promise.all([
      supabase.from('activities').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('activity_registrations').select('id', { count: 'exact', head: true }),
      supabase
        .from('user_roles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'admin'),
      supabase
        .from('activities')
        .select('id', { count: 'exact', head: true })
        .eq('kind', 'one_time')
        .gte('event_date', new Date().toISOString().slice(0, 10)),
    ]);
    return {
      activeActivities: activitiesRes.count ?? 0,
      totalRegistrations: registrationsRes.count ?? 0,
      totalAdmins: adminsRes.count ?? 0,
      upcomingEvents: upcomingRes.count ?? 0,
    };
  },
};
