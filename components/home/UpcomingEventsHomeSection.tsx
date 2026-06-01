import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllOneTimeEvents, pickLang, type ActivityRow } from '@/lib/activitiesApi';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

const formatDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const UpcomingEventsHomeSection = () => {
  const { t, language } = useLanguage();
  const [rows, setRows] = useState<ActivityRow[] | null>(null);

  useEffect(() => {
    fetchAllOneTimeEvents().then(({ data }) => {
      const today = new Date().toISOString().slice(0, 10);
      const future = (data ?? []).filter((r) => r.event_date && r.event_date >= today);
      setRows(future.slice(0, 8));
    });
  }, []);

  return (
    <section className="bg-background section-padding">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-primary text-center mb-10 border-b-4 border-primary/30 pb-3">
          {t.homeUpcomingTitle}
        </h2>

        {rows === null ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center text-xl text-muted-foreground">{t.homeNoUpcoming}</p>
        ) : (
          <ul className="divide-y-2 divide-border">
            {rows.map((row) => {
              const name = pickLang(row as unknown as Record<string, string | null | undefined>, 'title', language);
              const time = row.event_start_time ? row.event_start_time.slice(0, 5) : '';
              return (
                <li key={row.id} className="py-5">
                  <Link
                    to="/activity-center?tab=upcoming"
                    className="block hover:bg-secondary/40 rounded-lg p-3 transition-colors"
                  >
                    <h3 className="text-2xl font-semibold text-foreground mb-2">
                      {name}
                    </h3>
                    <p className="text-xl text-primary font-bold tabular-nums">
                      {row.event_date ? formatDate(row.event_date) : ''}
                      {time && <span className="text-foreground/70 font-normal"> · {t.homeAtHour} {time}</span>}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="text-center mt-10">
          <Link to="/activity-center?tab=upcoming" className="btn-cta btn-pink">
            {t.homeUpcomingViewAll}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsHomeSection;
