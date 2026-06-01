import { CalendarEvent, categoryColors } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeeklyGridProps {
  weekDates: Date[];
  events: CalendarEvent[];
  selectedEventId: string | null;
  onEventClick: (event: CalendarEvent) => void;
  overlayEvents?: CalendarEvent[];
  onOverlayEventClick?: (event: CalendarEvent) => void;
}

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const SLOT_HEIGHT = 180;

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const WeeklyGrid = ({ 
  weekDates, 
  events, 
  selectedEventId,
  onEventClick,
  overlayEvents = [],
  onOverlayEventClick
}: WeeklyGridProps) => {
  const { language, t } = useLanguage();
  
  // Get events for a specific day
  const getEventsForDay = (dayIndex: number) => {
    return events.filter(event => event.date.getDay() === dayIndex);
  };
  
  // Get overlay events for a specific day
  const getOverlayEventsForDay = (dayIndex: number) => {
    return overlayEvents.filter(event => event.date.getDay() === dayIndex);
  };

  // Calculate event position and height based on hours
  const getEventStyle = (event: CalendarEvent) => {
    const startRow = event.startHour - 8 + 1; // +1 because grid rows are 1-indexed
    const duration = event.endHour - event.startHour;
    return {
      gridRow: `${startRow} / span ${duration}`,
      height: `${duration * SLOT_HEIGHT - 8}px`
    };
  };

  // Assign each event a lane so overlapping events sit side-by-side
  const assignLanes = (
    list: CalendarEvent[],
  ): Array<CalendarEvent & { lane: number; lanesTotal: number }> => {
    const sorted = [...list].sort((a, b) => a.startHour - b.startHour);
    const laneEnds: number[] = [];
    const placed: Array<CalendarEvent & { lane: number }> = [];
    for (const ev of sorted) {
      let lane = laneEnds.findIndex((end) => end <= ev.startHour);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(ev.endHour);
      } else {
        laneEnds[lane] = ev.endHour;
      }
      placed.push({ ...ev, lane });
    }
    const lanesTotal = Math.max(laneEnds.length, 1);
    return placed.map((p) => ({ ...p, lanesTotal }));
  };

  const eventTitle = (event: CalendarEvent) => {
    return language === 'he' ? event.title : (event.titleEn || event.title);
  };

  return (
    <div className="bg-card rounded-2xl border-2 border-border overflow-hidden shadow-sm">
      {/* Header row - Days */}
      <div className="grid grid-cols-8 border-b-2 border-border">
        {/* Time column header */}
        <div className="p-5 bg-muted/30 text-center border-l-2 border-border">
          <span className="text-xl font-semibold text-foreground">{t.hour}</span>
        </div>
        
        {/* Day headers */}
        {weekDates.map((date, index) => {
          const today = isToday(date);
          return (
            <div
              key={index}
              className={`
                p-5 text-center border-l-2 border-border last:border-l-0
                ${today ? 'bg-primary/15' : 'bg-muted/30'}
              `}
            >
              <div className={`text-2xl font-bold ${today ? 'text-primary' : 'text-foreground'}`}>
                {t.day} {t.daysHebrew[index]}
              </div>
              <div className={`text-xl mt-1 ${today ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                {date.getDate()}/{date.getMonth() + 1}
              </div>
              {today && (
                <span className="inline-block mt-2 px-4 py-1.5 bg-primary text-white text-base font-medium rounded-full">
                  {t.today}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Main grid area - single unified grid */}
      <div className="grid grid-cols-8">
        {/* Time labels column */}
        <div className="border-l-2 border-border bg-muted/20">
          {HOURS.map((hour) => (
            <div 
              key={hour} 
              className="p-4 text-center border-b border-border/60 flex items-center justify-center"
              style={{ height: `${SLOT_HEIGHT}px` }}
            >
              <span className="text-2xl font-semibold text-foreground">
                {hour}:00
              </span>
            </div>
          ))}
        </div>
        
        {/* Day columns - each with its own inner grid for events */}
        {weekDates.map((date, dayIndex) => {
          const dayEvents = getEventsForDay(dayIndex);
          const dayOverlayEvents = getOverlayEventsForDay(dayIndex);
          const today = isToday(date);

          // Combine both lists for lane calculation so registered + overlay events
          // never visually overlap. Tag each with its source so we can render differently.
          type Tagged = CalendarEvent & { _source: 'registered' | 'overlay' };
          const combined: Tagged[] = [
            ...dayEvents.map((e) => ({ ...e, _source: 'registered' as const })),
            ...dayOverlayEvents.map((e) => ({ ...e, _source: 'overlay' as const })),
          ];
          const laned = assignLanes(combined) as Array<Tagged & { lane: number; lanesTotal: number }>;

          return (
            <div
              key={dayIndex}
              className={`
                relative border-l-2 border-border last:border-l-0
                ${today ? 'bg-primary/5' : ''}
              `}
              style={{ height: `${HOURS.length * SLOT_HEIGHT}px` }}
            >
              {/* Hour grid lines */}
              {HOURS.map((hour, hourIndex) => (
                <div 
                  key={hour}
                  className="absolute w-full border-b border-border/50"
                  style={{ 
                    top: `${(hourIndex + 1) * SLOT_HEIGHT}px`,
                    height: '0'
                  }}
                />
              ))}
              
              {/* Empty hour indicators */}
              {HOURS.map((hour, hourIndex) => {
                const hasEvent = dayEvents.some(e => e.startHour <= hour && e.endHour > hour);
                const hasOverlay = dayOverlayEvents.some(e => e.startHour <= hour && e.endHour > hour);
                if (hasEvent || hasOverlay) return null;
                
                return (
                  <div 
                    key={hour}
                    className="absolute w-full flex items-center justify-center pointer-events-none"
                    style={{ 
                      top: `${hourIndex * SLOT_HEIGHT}px`,
                      height: `${SLOT_HEIGHT}px`
                    }}
                  >
                    <span className="text-muted-foreground/30 text-lg">—</span>
                  </div>
                );
              })}

              {/* All events (registered + overlay) rendered with lane positioning */}
              {laned.map((event) => {
                const startOffset = (event.startHour - 8) * SLOT_HEIGHT;
                const duration = event.endHour - event.startHour;
                const eventHeight = duration * SLOT_HEIGHT - 8;
                const colorClass = categoryColors[event.category];
                const widthPct = 100 / event.lanesTotal;
                const leftPct = widthPct * event.lane;

                const isNarrow = event.lanesTotal > 1;
                const padCls = isNarrow ? 'p-2' : 'p-4';
                const titleCls = isNarrow ? 'font-bold text-lg leading-tight line-clamp-3' : 'font-bold text-2xl leading-snug line-clamp-3';
                const timeCls = isNarrow ? 'text-base opacity-90 mt-1' : 'text-xl opacity-90 mt-2';

                if (event._source === 'registered') {
                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={`
                        absolute ${padCls} rounded-xl text-white text-right transition-all duration-200 shadow-md
                        ${colorClass}
                        ${selectedEventId === event.id ? 'ring-4 ring-foreground ring-offset-2 scale-[1.02] z-20' : 'hover:scale-[1.02] hover:shadow-lg z-10'}
                        focus:outline-none focus:ring-4 focus:ring-foreground focus:ring-offset-2
                      `}
                      style={{
                        top: `${startOffset + 6}px`,
                        height: `${eventHeight}px`,
                        left: `calc(${leftPct}% + 4px)`,
                        width: `calc(${widthPct}% - 8px)`,
                      }}
                      aria-label={`${eventTitle(event)}, ${event.startHour}:00 ${t.to} ${event.endHour}:00`}
                    >
                      <div className="flex flex-col h-full justify-start overflow-hidden">
                        <span className={titleCls}>
                          {eventTitle(event)}
                        </span>
                        <span className={timeCls}>
                          {event.startHour}:00 - {event.endHour}:00
                        </span>
                        {event.notifications && event.notifications.length > 0 && !isNarrow && (
                          <span className="mt-auto text-lg bg-white/20 rounded-lg px-3 py-1 w-fit">
                            🔔 {event.notifications.length}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                }

                // Overlay event (available, not registered)
                return (
                  <button
                    key={`overlay-${event.id}`}
                    onClick={() => onOverlayEventClick?.(event)}
                    className={`
                      absolute ${padCls} rounded-xl text-white text-right transition-all duration-200
                      ${colorClass} opacity-40 hover:opacity-70
                      border-2 border-dashed border-white/60
                      focus:outline-none focus:ring-4 focus:ring-foreground focus:ring-offset-2
                    `}
                    style={{
                      top: `${startOffset + 6}px`,
                      height: `${eventHeight}px`,
                      left: `calc(${leftPct}% + 4px)`,
                      width: `calc(${widthPct}% - 8px)`,
                      zIndex: 5,
                    }}
                    aria-label={`${eventTitle(event)}, ${event.startHour}:00 ${t.to} ${event.endHour}:00`}
                  >
                    <div className="flex flex-col h-full justify-start overflow-hidden">
                      <span className={titleCls}>
                        {eventTitle(event)}
                      </span>
                      <span className={timeCls}>
                        {event.startHour}:00 - {event.endHour}:00
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyGrid;
