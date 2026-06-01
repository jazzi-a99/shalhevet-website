import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeekNavigationProps {
  currentWeekStart: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

const WeekNavigation = ({ 
  currentWeekStart, 
  onPreviousWeek, 
  onNextWeek, 
  onToday 
}: WeekNavigationProps) => {
  const { language, t } = useLanguage();
  
  const formatDateRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = startDate.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', { month: 'long' });
    const year = startDate.getFullYear();
    
    return `${startDay} - ${endDay} ${month} ${year}`;
  };
  
  return (
    <div className="flex items-center justify-between mb-6 bg-card p-4 rounded-xl border-2 border-border">
      <button
        onClick={onPreviousWeek}
        className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-accent rounded-lg transition-colors text-xl font-medium"
        aria-label={t.prevWeek}
      >
        <ChevronRight className="w-6 h-6" />
        <span>{t.prevWeek}</span>
      </button>
      
      <div className="flex items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {formatDateRange(currentWeekStart)}
        </h2>
        <button
          onClick={onToday}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-xl font-medium hover:brightness-105 transition-all"
        >
          {t.today}
        </button>
      </div>
      
      <button
        onClick={onNextWeek}
        className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-accent rounded-lg transition-colors text-xl font-medium"
        aria-label={t.nextWeek}
      >
        <span>{t.nextWeek}</span>
        <ChevronLeft className="w-6 h-6" />
      </button>
    </div>
  );
};

export default WeekNavigation;
