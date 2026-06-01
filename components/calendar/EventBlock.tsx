import { CalendarEvent, categoryColors } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface EventBlockProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  isSelected: boolean;
}

const EventBlock = ({ event, onClick, isSelected }: EventBlockProps) => {
  const { language, t } = useLanguage();
  const colorClass = categoryColors[event.category];
  const duration = event.endHour - event.startHour;
  
  // Fixed height: 70px per hour slot for consistent sizing
  const slotHeight = 70;
  const calculatedHeight = duration * slotHeight - 8;
  
  const eventTitle = language === 'he' ? event.title : (event.titleEn || event.title);
  
  return (
    <button
      onClick={() => onClick(event)}
      className={`
        w-full p-3 rounded-xl text-white text-right transition-all duration-200
        ${colorClass}
        ${isSelected ? 'ring-4 ring-foreground ring-offset-2 scale-[1.02]' : 'hover:scale-[1.02] hover:shadow-lg'}
        focus:outline-none focus:ring-4 focus:ring-foreground focus:ring-offset-2
      `}
      style={{ 
        height: `${calculatedHeight}px`
      }}
      aria-label={`${eventTitle}, ${event.startHour}:00 ${t.to} ${event.endHour}:00`}
    >
      <div className="flex flex-col h-full justify-start">
        <span className="font-bold text-lg leading-tight line-clamp-2">
          {eventTitle}
        </span>
        <span className="text-base opacity-90 mt-1">
          {event.startHour}:00 - {event.endHour}:00
        </span>
        {event.notifications && event.notifications.length > 0 && (
          <span className="mt-auto text-sm bg-white/20 rounded px-2 py-0.5 w-fit">
            🔔 {event.notifications.length}
          </span>
        )}
      </div>
    </button>
  );
};

export default EventBlock;
