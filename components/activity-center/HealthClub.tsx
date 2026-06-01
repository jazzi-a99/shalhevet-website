import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import WeeklyCalendarGrid from './WeeklyCalendarGrid';
import { fetchActivitiesByCategory, type ActivityRow } from '@/lib/activitiesApi';
import { Skeleton } from '@/components/ui/skeleton';
import { buildSchedule } from './LecturesAndClasses';

const HealthClub = () => {
  const { t } = useLanguage();
  const [rows, setRows] = useState<ActivityRow[] | null>(null);

  useEffect(() => {
    fetchActivitiesByCategory('health-club').then(({ data }) => setRows(data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-teal-100 text-teal-800 px-6 py-3 rounded-full mb-4">
          <Heart className="w-8 h-8" />
          <span className="text-xl font-bold">{t.healthAndFitness}</span>
        </div>
        <p className="text-xl md:text-2xl text-muted-foreground">{t.healthIntro}</p>
      </div>
      {rows === null ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <WeeklyCalendarGrid schedule={buildSchedule(rows, 5)} colorScheme="health" />
      )}
    </div>
  );
};

export default HealthClub;
