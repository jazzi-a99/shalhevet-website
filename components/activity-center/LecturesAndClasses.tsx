import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import WeeklyCalendarGrid, { DaySchedule } from './WeeklyCalendarGrid';
import { fetchActivitiesByCategory, type ActivityRow } from '@/lib/activitiesApi';
import { Skeleton } from '@/components/ui/skeleton';

const DAY_NAMES_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatTime = (t: string | null) => (t ? t.slice(0, 5) : '');

export const buildSchedule = (rows: ActivityRow[], maxDay = 5): DaySchedule[] => {
  const schedule: DaySchedule[] = [];
  for (let d = 0; d <= maxDay; d++) {
    const acts = rows
      .filter((r) => r.kind === 'recurring' && r.day_of_week === d)
      .sort((a, b) => (a.start_time ?? '').localeCompare(b.start_time ?? ''))
      .map((r) => ({
        id: r.id,
        name: r.title_he,
        nameEn: r.title_en ?? undefined,
        startTime: formatTime(r.start_time),
        endTime: formatTime(r.end_time),
        instructor: r.teacher_he ?? '',
        instructorEn: r.teacher_en ?? undefined,
        location: r.location_he ?? '',
        locationEn: r.location_en ?? undefined,
        category: r.sub_category ?? r.visual_category ?? 'default',
      }));
    if (acts.length > 0) {
      schedule.push({
        day: DAY_NAMES_HE[d],
        dayEn: DAY_NAMES_EN[d],
        activities: acts,
      });
    }
  }
  return schedule;
};

const LecturesAndClasses = () => {
  const { t } = useLanguage();
  const [rows, setRows] = useState<ActivityRow[] | null>(null);

  useEffect(() => {
    fetchActivitiesByCategory('lectures-and-classes').then(({ data }) => setRows(data));
  }, []);

  if (rows === null) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3 mx-auto" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xl md:text-2xl text-muted-foreground text-center mb-8">{t.weeklyActivitiesIntro}</p>
      <WeeklyCalendarGrid schedule={buildSchedule(rows, 5)} colorScheme="lectures" />
    </div>
  );
};

export default LecturesAndClasses;
