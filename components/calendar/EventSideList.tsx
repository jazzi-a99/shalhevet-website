import { CalendarEvent, categoryColors, categoryLabels, categoryLabelsEn } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus } from 'lucide-react';

interface EventSideListProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDiscoverMore?: () => void;
  isDiscoveryMode?: boolean;
}

const EventSideList = ({ 
  events, 
  onEventClick,
  onDiscoverMore,
  isDiscoveryMode = false
}: EventSideListProps) => {
  const { language, t } = useLanguage();
  
  const formatEventDate = (date: Date) => {
    const locale = language === 'he' ? 'he-IL' : 'en-US';
    return date.toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };
  
  return (
    <div className="bg-card rounded-2xl border-2 border-border p-8 h-fit sticky top-4 shadow-sm">
      <h3 className="text-3xl font-bold text-foreground mb-6">
        {t.myActivities}
      </h3>
      
      {/* Click hint */}
      <p className="text-xl text-primary font-semibold mb-8 bg-primary/10 rounded-xl p-4">
        👆 {t.clickToViewDetails}
      </p>
      
      <div className="space-y-5">
        {events.map((event) => {
          const colorClass = categoryColors[event.category];
          const categoryLabel = language === 'he' 
            ? categoryLabels[event.category] 
            : categoryLabelsEn[event.category];
          const eventTitle = language === 'he' ? event.title : (event.titleEn || event.title);
          
          return (
            <button
              key={event.id}
              onClick={() => onEventClick(event)}
              className="w-full flex items-start gap-5 p-5 rounded-2xl border-2 border-border bg-secondary/40 hover:border-primary hover:bg-secondary transition-all text-right shadow-sm"
            >
              {/* Color indicator */}
              <span className={`flex-shrink-0 w-5 h-5 rounded-full mt-1.5 ${colorClass}`} />
              
              {/* Event info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-medium text-muted-foreground">
                    {categoryLabel}
                  </span>
                  {event.isRecurring && (
                    <span className="text-sm bg-accent px-3 py-1 rounded-full">
                      🔄
                    </span>
                  )}
                </div>
                <h4 className="text-2xl font-bold text-foreground mb-2">
                  {eventTitle}
                </h4>
                <p className="text-xl text-muted-foreground">
                  {formatEventDate(event.date)} • {event.startHour}:00 - {event.endHour}:00
                </p>
              </div>
            </button>
          );
        })}
        
        {/* Discover More Events card */}
        {onDiscoverMore && (
          <button
            onClick={onDiscoverMore}
            className={`
              w-full flex items-center justify-center gap-5 p-8 rounded-2xl border-2 border-dashed transition-all
              ${isDiscoveryMode 
                ? 'border-primary bg-primary/10 text-primary shadow-md' 
                : 'border-border hover:border-primary hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <div className={`
              w-14 h-14 rounded-full flex items-center justify-center
              ${isDiscoveryMode ? 'bg-primary text-white' : 'bg-secondary'}
            `}>
              <Plus className="w-10 h-10" />
            </div>
            <span className="text-2xl font-bold">
              {t.moreEvents}
            </span>
          </button>
        )}
      </div>
      
      {events.length === 0 && !onDiscoverMore && (
        <div className="text-center py-10">
          <p className="text-2xl text-muted-foreground">
            {t.noActivitiesThisWeek}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventSideList;
