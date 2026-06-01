import { useState, useMemo, useEffect } from 'react';
import { Calendar, Film, Music, Mic, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';
import { he, enUS } from 'date-fns/locale';
import EventDetailDialog from './EventDetailDialog';
import AnnouncementsBanner from './AnnouncementsBanner';
import { fetchAllOneTimeEvents, type ActivityRow } from '@/lib/activitiesApi';
import { Skeleton } from '@/components/ui/skeleton';

interface UpcomingEvent {
  id: string;
  title: string;
  titleEn: string;
  date: Date;
  dateDisplay: string;
  dateDisplayEn: string;
  description: string;
  descriptionEn: string;
  type: 'lecture' | 'concert' | 'movie';
  imageUrl: string;
  time: string;
  isAvailable: boolean;
}

// Heuristic: map title/visual_category to lecture|concert|movie for the existing UI styling.
const inferType = (row: ActivityRow): UpcomingEvent['type'] => {
  const title = `${row.title_he} ${row.title_en ?? ''}`.toLowerCase();
  if (row.visual_category === 'music' || /קונצרט|concert|концерт/i.test(title)) return 'concert';
  if (/סרט|movie|film|кино/i.test(title)) return 'movie';
  return 'lecture';
};

const fallbackImage = (type: UpcomingEvent['type']) => {
  if (type === 'concert') return 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop';
  if (type === 'movie') return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop';
  return 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop';
};

const toUpcomingEvent = (row: ActivityRow): UpcomingEvent => {
  const date = row.event_date ? new Date(row.event_date + 'T00:00:00') : new Date();
  const startTime = row.event_start_time ? row.event_start_time.slice(0, 5) : '';
  const endTime = row.event_end_time ? row.event_end_time.slice(0, 5) : '';
  const time = startTime && endTime ? `${startTime} - ${endTime}` : startTime;
  const type = inferType(row);
  return {
    id: row.id,
    title: row.title_he,
    titleEn: row.title_en ?? row.title_he,
    date,
    dateDisplay: format(date, 'dd/MM/yy'),
    dateDisplayEn: format(date, 'dd/MM/yy'),
    description: row.description_he ?? '',
    descriptionEn: row.description_en ?? row.description_he ?? '',
    type,
    imageUrl: row.image_url ?? fallbackImage(type),
    time,
    isAvailable: row.capacity === null || (row.capacity ?? 0) > 0,
  };
};

const getEventIcon = (type: UpcomingEvent['type']) => {
  switch (type) {
    case 'lecture': return <Mic className="w-8 h-8" />;
    case 'concert': return <Music className="w-8 h-8" />;
    case 'movie': return <Film className="w-8 h-8" />;
  }
};

const getEventColor = (type: UpcomingEvent['type']) => {
  switch (type) {
    case 'lecture': return { bg: 'bg-amber-50', border: 'border-amber-300', icon: 'bg-amber-100 text-amber-700', badge: 'bg-amber-100 text-amber-800' };
    case 'concert': return { bg: 'bg-rose-50', border: 'border-rose-300', icon: 'bg-rose-100 text-rose-700', badge: 'bg-rose-100 text-rose-800' };
    case 'movie': return { bg: 'bg-indigo-50', border: 'border-indigo-300', icon: 'bg-indigo-100 text-indigo-700', badge: 'bg-indigo-100 text-indigo-800' };
  }
};

const UpcomingEvents = () => {
  const { language, t } = useLanguage();
  const [events, setEvents] = useState<UpcomingEvent[] | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);

  useEffect(() => {
    fetchAllOneTimeEvents().then(({ data }) => {
      const mapped = data
        .map(toUpcomingEvent)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
      setEvents(mapped);
      if (mapped.length > 0) setCurrentMonth(startOfMonth(mapped[0].date));
    });
  }, []);

  const locale = language === 'en' ? enUS : he;

  const getEventLabel = (type: UpcomingEvent['type']) =>
    type === 'lecture' ? t.lectureLabel : type === 'concert' ? t.concertLabel : t.movieLabel;
  const getTitle = (e: UpcomingEvent) =>
    language === 'en' ? e.titleEn : e.title;
  const getDateDisplay = (e: UpcomingEvent) =>
    language === 'en' ? e.dateDisplayEn : e.dateDisplay;
  const getDescription = (e: UpcomingEvent) =>
    language === 'en' ? e.descriptionEn : e.description;

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const startDay = getDay(start);
    return [...Array(startDay).fill(null), ...days];
  }, [currentMonth]);

  const getEventsOnDate = (date: Date) =>
    (events ?? []).filter((event) => isSameDay(event.date, date));

  const goToPreviousMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

  const dayLabels = language === 'en'
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

  const translatedSelected = selectedEvent
    ? { ...selectedEvent, title: getTitle(selectedEvent), dateDisplay: getDateDisplay(selectedEvent), description: getDescription(selectedEvent) }
    : null;

  if (events === null) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-80 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <AnnouncementsBanner />

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
        <p className="text-xl font-medium text-blue-800">👆 {t.clickEventForDetails}</p>
      </div>

      <p className="text-xl md:text-2xl text-muted-foreground text-center mb-10">
        {t.upcomingEventsIntro}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => {
          const colors = getEventColor(event.type);
          return (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`text-right rounded-2xl border-2 ${colors.bg} ${colors.border} overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer`}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={event.imageUrl} alt={getTitle(event)} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className={`absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold ${colors.badge}`}>
                  {getEventIcon(event.type)}
                  {getEventLabel(event.type)}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">{getTitle(event)}</h3>

                <div className="flex items-center gap-3 mb-3 bg-white rounded-lg px-4 py-3 border border-border">
                  <Calendar className="w-7 h-7 text-primary flex-shrink-0" />
                  <span className="text-xl font-bold text-primary">{getDateDisplay(event)}</span>
                </div>

                <div className="flex items-center gap-3 mb-4 bg-white/50 rounded-lg px-4 py-2 border border-border/50">
                  <Clock className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                  <span className="text-lg font-semibold text-foreground">{t.timeColon} {event.time}</span>
                </div>

                <div className={`flex items-center gap-3 mb-4 rounded-lg px-4 py-3 border ${event.isAvailable ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  {event.isAvailable
                    ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    : <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />}
                  <span className={`text-lg font-bold ${event.isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                    {event.isAvailable ? t.seatsAvailable : t.eventFull}
                  </span>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">{getDescription(event)}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-card rounded-2xl border-2 border-border p-6 md:p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{t.eventCalendar}</h2>
        <p className="text-center text-lg text-muted-foreground mb-6">{t.calendarPickHint}</p>

        <div className="flex items-center justify-between mb-6">
          <button onClick={goToPreviousMonth} className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors" aria-label={t.previousMonth}>
            <ChevronRight className="w-8 h-8" />
          </button>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">{format(currentMonth, 'MMMM yyyy', { locale })}</h3>
          <button onClick={goToNextMonth} className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors" aria-label={t.nextMonth}>
            <ChevronLeft className="w-8 h-8" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-3 mb-4">
          {dayLabels.map((day, idx) => (
            <div key={idx} className="text-center text-xl md:text-2xl font-bold text-muted-foreground py-3">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="min-h-[196px] md:min-h-[224px]" />;
            const eventsOnDay = getEventsOnDate(day);
            const hasEvent = eventsOnDay.length > 0;
            const isCurrentMonth = isSameMonth(day, currentMonth);
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[196px] md:min-h-[224px] rounded-xl p-4 flex flex-col text-xl md:text-2xl font-medium transition-all ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/50'} ${hasEvent ? 'bg-primary/10 border-2 border-primary cursor-pointer hover:bg-primary/20' : 'bg-secondary/30'}`}
                onClick={() => { if (eventsOnDay.length > 0) setSelectedEvent(eventsOnDay[0]); }}
              >
                <span className={`text-center font-bold text-3xl mb-2 ${hasEvent ? 'text-primary' : ''}`}>{format(day, 'd')}</span>
                {eventsOnDay.map((event, eventIdx) => {
                  const eventColor = getEventColor(event.type);
                  return (
                    <div key={eventIdx} className={`mt-3 px-3 py-3 rounded-xl text-base md:text-lg font-semibold ${eventColor.badge}`}>
                      <div className="font-bold text-lg md:text-xl mb-1">{event.time}</div>
                      <div className="leading-snug">{getTitle(event)}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-lg">
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-amber-100 border border-amber-300" /><span className="text-muted-foreground">{t.lectureLabel}</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-rose-100 border border-rose-300" /><span className="text-muted-foreground">{t.concertLabel}</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-indigo-100 border border-indigo-300" /><span className="text-muted-foreground">{t.movieLabel}</span></div>
        </div>
      </div>

      <EventDetailDialog event={translatedSelected} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} showPurchase={true} />
    </div>
  );
};

export default UpcomingEvents;
