import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityAnnouncement {
  id: string;
  title_he: string;
  title_en: string | null;
  message_he: string;
  message_en: string | null;
  created_at: string;
  activity_id: string | null;
}

export const useActivityDetails = (activityId: string | null | undefined) => {
  const [count, setCount] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<ActivityAnnouncement[]>([]);

  useEffect(() => {
    if (!activityId) {
      setCount(null);
      setAnnouncements([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      const [cRes, aRes] = await Promise.all([
        supabase.rpc('get_activity_registration_count', { _activity_id: activityId }),
        supabase.rpc('get_announcements_for_activity', { _activity_id: activityId }),
      ]);
      if (cancelled) return;
      setCount(typeof cRes.data === 'number' ? cRes.data : 0);
      setAnnouncements((aRes.data ?? []) as ActivityAnnouncement[]);
    };

    load();

    const channel = supabase
      .channel(`activity-details-${activityId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activity_registrations', filter: `activity_id=eq.${activityId}` },
        () => load(),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        () => load(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [activityId]);

  return { count, announcements };
};
