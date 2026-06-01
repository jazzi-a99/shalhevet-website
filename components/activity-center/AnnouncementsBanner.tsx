import { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Announcement {
  id: string;
  title_he: string;
  title_en: string | null;
  message_he: string;
  message_en: string | null;
  created_at: string;
  activity_id: string | null;
  activity?: { title_he: string; title_en: string | null } | null;
}

const AnnouncementsBanner = () => {
  const { language } = useLanguage();
  const [items, setItems] = useState<Announcement[] | null>(null);

  const load = async () => {
    const { data: anns } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (!anns) { setItems([]); return; }

    const actIds = Array.from(
      new Set(anns.map((a) => a.activity_id).filter(Boolean) as string[]),
    );
    let actMap = new Map<string, any>();
    if (actIds.length > 0) {
      const { data: acts } = await supabase
        .from('activities')
        .select('id, title_he, title_en')
        .in('id', actIds);
      actMap = new Map((acts ?? []).map((a: any) => [a.id, a]));
    }
    setItems(
      anns.map((a) => ({
        ...a,
        activity: a.activity_id ? actMap.get(a.activity_id) ?? null : null,
      })),
    );
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel('announcements-board')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        () => load(),
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  if (!items || items.length === 0) return null;

  const heading = language === 'en' ? 'Announcements' : 'הודעות והכרזות';
  const dateLocale = language === 'en' ? 'en-US' : 'he-IL';

  return (
    <section
      aria-label={heading}
      className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-5">
        <Megaphone className="w-8 h-8 text-amber-700" aria-hidden="true" />
        <h2 className="text-2xl md:text-3xl font-bold text-amber-900">{heading}</h2>
      </div>

      <ul className="space-y-4">
        {items.map((a) => {
          const title = (language === 'en' && a.title_en) ? a.title_en : a.title_he;
          const message = (language === 'en' && a.message_en) ? a.message_en : a.message_he;
          const actTitle = a.activity
            ? (language === 'en' && a.activity.title_en ? a.activity.title_en : a.activity.title_he)
            : null;
          return (
            <li
              key={a.id}
              className="rounded-xl bg-white border-2 border-amber-200 p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <h3 className="text-xl md:text-2xl font-bold text-foreground">{title}</h3>
                <span className="text-base text-muted-foreground">
                  {new Date(a.created_at).toLocaleDateString(dateLocale)}
                </span>
              </div>
              {actTitle && (
                <div className="text-base font-semibold text-amber-800 mb-2">
                  {language === 'en' ? 'Related to: ' : 'קשור לפעילות: '}{actTitle}
                </div>
              )}
              <p className="text-lg text-foreground leading-relaxed whitespace-pre-line">
                {message}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AnnouncementsBanner;
