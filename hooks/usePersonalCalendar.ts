import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CalendarEvent, EventCategory, SimpleCategory } from '@/components/calendar/types';
import type { ActivityRow } from '@/lib/activitiesApi';

interface RegistrationWithActivity {
  id: string;
  activity_id: string;
  occurrence_date: string | null;
  attendance_status: string;
  payment_status: string;
  activity: ActivityRow | null;
}

const VISUAL: EventCategory[] = ['art', 'lecture', 'trip', 'reading', 'fitness', 'music', 'default'];
const toVisual = (v: string | null | undefined): EventCategory =>
  (v && (VISUAL as string[]).includes(v) ? v : 'default') as EventCategory;
const toSimple = (v: string | null | undefined): SimpleCategory =>
  (v === 'sport' || v === 'culture' || v === 'social') ? v : 'social';

const parseHour = (t: string | null) => (t ? Number(t.slice(0, 2)) + Number(t.slice(3, 5)) / 60 : 0);

/**
 * Convert an activity row into a CalendarEvent for a given week.
 * For recurring activities, places them on their day_of_week within the given week.
 * For one-time activities, returns the event only if its event_date falls in [weekStart, weekStart+7).
 */
export const activityToCalendarEvent = (
  row: ActivityRow,
  weekStart: Date,
): CalendarEvent | null => {
  let date: Date;
  let startHour: number;
  let endHour: number;

  if (row.kind === 'recurring' && row.day_of_week !== null) {
    date = new Date(weekStart);
    date.setDate(weekStart.getDate() + row.day_of_week);
    startHour = parseHour(row.start_time);
    endHour = parseHour(row.end_time) || startHour + 1;
  } else if (row.kind === 'one_time' && row.event_date) {
    const eventDate = new Date(row.event_date + 'T00:00:00');
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    if (eventDate < weekStart || eventDate >= weekEnd) return null;
    date = eventDate;
    startHour = parseHour(row.event_start_time);
    endHour = parseHour(row.event_end_time) || startHour + 1;
  } else {
    return null;
  }

  return {
    id: row.id,
    title: row.title_he,
    titleEn: row.title_en ?? undefined,
    description: row.description_he ?? '',
    descriptionEn: row.description_en ?? undefined,
    date,
    startHour,
    endHour,
    category: toVisual(row.visual_category),
    simpleCategory: toSimple(row.simple_category),
    isRecurring: row.kind === 'recurring',
    teacher: row.teacher_he ?? undefined,
    teacherEn: row.teacher_en ?? undefined,
    participants: 0,
    imageUrl: row.image_url ?? undefined,
    instructions: row.instructions_he ?? undefined,
    instructionsEn: row.instructions_en ?? undefined,
  };
};

export const usePersonalCalendar = () => {
  const [registrations, setRegistrations] = useState<RegistrationWithActivity[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setRegistrations([]);
      setAllActivities([]);
      setLoading(false);
      return;
    }
    const [regsRes, actsRes] = await Promise.all([
      supabase
        .from('activity_registrations')
        .select('id, activity_id, occurrence_date, attendance_status, payment_status, activity:activities(*)')
        .eq('user_id', user.id),
      supabase.from('activities').select('*').eq('is_active', true),
    ]);
    setRegistrations((regsRes.data ?? []) as unknown as RegistrationWithActivity[]);
    setAllActivities((actsRes.data ?? []) as ActivityRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const register = useCallback(async (activityId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('activity_registrations')
      .insert({ user_id: user.id, activity_id: activityId });
    await refresh();
  }, [refresh]);

  const unregister = useCallback(async (activityId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('activity_registrations')
      .delete()
      .eq('user_id', user.id)
      .eq('activity_id', activityId);
    await refresh();
  }, [refresh]);

  const isRegistered = useCallback(
    (activityId: string) => registrations.some((r) => r.activity_id === activityId),
    [registrations],
  );

  return { registrations, allActivities, loading, register, unregister, isRegistered, refresh };
};
