import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Skeleton } from '@/components/ui/skeleton';

export const AdminOverview = () => {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminApi.getOverviewStats>> | null>(null);

  useEffect(() => {
    adminApi.getOverviewStats().then(setStats);
  }, []);

  if (!stats) return <Skeleton className="h-48 w-full" />;

  const cards = [
    { label: 'פעילויות פעילות', value: stats.activeActivities, color: 'bg-blue-50 border-blue-300 text-blue-900' },
    { label: 'אירועים קרובים', value: stats.upcomingEvents, color: 'bg-amber-50 border-amber-300 text-amber-900' },
    { label: 'סך הרשמות', value: stats.totalRegistrations, color: 'bg-green-50 border-green-300 text-green-900' },
    { label: 'מנהלים במערכת', value: stats.totalAdmins, color: 'bg-rose-50 border-rose-300 text-rose-900' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">סקירה כללית</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-xl border-2 p-6 ${c.color}`}>
            <div className="text-5xl font-bold">{c.value}</div>
            <div className="text-lg mt-2">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
