import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WeekNavigation from '@/components/calendar/WeekNavigation';
import WeeklyGrid from '@/components/calendar/WeeklyGrid';
import EventSideList from '@/components/calendar/EventSideList';
import EventPreviewPanel from '@/components/calendar/EventPreviewPanel';
import CalendarFilters, { EventFrequency, SimpleCategory } from '@/components/calendar/CalendarFilters';
import { CalendarEvent } from '@/components/calendar/types';
import { usePersonalCalendar, activityToCalendarEvent } from '@/hooks/usePersonalCalendar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useConfirm } from '@/components/ui/confirm-dialog';

const Calendar = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { registrations, allActivities, loading, register, unregister, isRegistered } = usePersonalCalendar();

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  });

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [frequencyFilter, setFrequencyFilter] = useState<EventFrequency>('all');
  const [categoryFilter, setCategoryFilter] = useState<SimpleCategory>('all');
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(false);
  const [isOverlayEventSelected, setIsOverlayEventSelected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth');
  }, [isAuthenticated, navigate]);

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      return d;
    }),
    [currentWeekStart],
  );

  // User's registered activities → CalendarEvent for the visible week
  const weekEvents = useMemo<CalendarEvent[]>(() => {
    const myActivityIds = new Set(registrations.map((r) => r.activity_id));
    const myActs = allActivities.filter((a) => myActivityIds.has(a.id));
    return myActs
      .map((a) => activityToCalendarEvent(a, currentWeekStart))
      .filter((e): e is CalendarEvent => {
        if (!e) return false;
        if (frequencyFilter === 'recurring' && !e.isRecurring) return false;
        if (frequencyFilter === 'one-time' && e.isRecurring) return false;
        if (categoryFilter !== 'all' && e.simpleCategory !== categoryFilter) return false;
        return true;
      });
  }, [registrations, allActivities, currentWeekStart, frequencyFilter, categoryFilter]);

  // Discovery: activities the user has NOT registered for
  const weekAvailableEvents = useMemo<CalendarEvent[]>(() => {
    if (!isDiscoveryMode) return [];
    const myIds = new Set(registrations.map((r) => r.activity_id));
    return allActivities
      .filter((a) => !myIds.has(a.id))
      .map((a) => activityToCalendarEvent(a, currentWeekStart))
      .filter((e): e is CalendarEvent => {
        if (!e) return false;
        if (frequencyFilter === 'recurring' && !e.isRecurring) return false;
        if (frequencyFilter === 'one-time' && e.isRecurring) return false;
        if (categoryFilter !== 'all' && e.simpleCategory !== categoryFilter) return false;
        return true;
      });
  }, [isDiscoveryMode, registrations, allActivities, currentWeekStart, frequencyFilter, categoryFilter]);

  const handlePreviousWeek = () => {
    setCurrentWeekStart((p) => { const d = new Date(p); d.setDate(p.getDate() - 7); return d; });
  };
  const handleNextWeek = () => {
    setCurrentWeekStart((p) => { const d = new Date(p); d.setDate(p.getDate() + 7); return d; });
  };
  const handleToday = () => {
    const today = new Date();
    const s = new Date(today);
    s.setDate(today.getDate() - today.getDay());
    s.setHours(0, 0, 0, 0);
    setCurrentWeekStart(s);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsOverlayEventSelected(false);
  };
  const handleOverlayEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsOverlayEventSelected(true);
  };
  const handleClosePreview = () => {
    setSelectedEvent(null);
    setIsOverlayEventSelected(false);
  };

  const handleRegister = async () => {
    if (!selectedEvent) return;
    await register(selectedEvent.id);
    toast.success(t.registeredSuccess ?? 'נרשמת בהצלחה');
    handleClosePreview();
  };

  const handleUnregister = async () => {
    if (!selectedEvent) return;
    const ok = await confirm({
      title: 'ביטול הרשמה',
      description: `האם את/ה בטוח/ה שברצונך לבטל את ההרשמה ל"${selectedEvent.title}"?`,
      confirmText: 'בטל הרשמה',
    });
    if (!ok) return;
    await unregister(selectedEvent.id);
    toast.success(t.unregisteredSuccess ?? 'בוטל בהצלחה');
    handleClosePreview();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 px-6 md:px-10">
        <div className="container mx-auto max-w-[1700px]">
          <div className="text-center mb-10">
            <h1 className="text-foreground mb-4">{t.calendarTitle}</h1>
            <p className="text-2xl text-muted-foreground">
              {t.welcome.replace(',', '')} {profile?.full_name || user?.email?.split('@')[0]}, {t.calendarSubtitle}
            </p>
            <button
              type="button"
              onClick={() => navigate('/whats-new?category=calendar')}
              className="mt-6 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-xl font-bold bg-[hsl(var(--cta-pink))] text-[hsl(var(--cta-pink-foreground))] border-4 border-[hsl(var(--foreground))] hover:brightness-110 transition-all shadow-md"
            >
              <span aria-hidden="true" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--cta-pink-foreground))] text-[hsl(var(--cta-pink))] font-extrabold text-lg">?</span>
              {t.aboutThisPage}
            </button>
          </div>

          <WeekNavigation
            currentWeekStart={currentWeekStart}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onToday={handleToday}
          />

          <CalendarFilters
            frequencyFilter={frequencyFilter}
            categoryFilter={categoryFilter}
            onFrequencyChange={setFrequencyFilter}
            onCategoryChange={setCategoryFilter}
          />

          {loading ? (
            <Skeleton className="h-[600px] w-full" />
          ) : (
            <div className="flex flex-col-reverse lg:flex-row gap-8">
              <div className="flex-1 overflow-x-auto">
                <WeeklyGrid
                  weekDates={weekDates}
                  events={weekEvents}
                  selectedEventId={selectedEvent?.id || null}
                  onEventClick={handleEventClick}
                  overlayEvents={weekAvailableEvents}
                  onOverlayEventClick={handleOverlayEventClick}
                />
              </div>

              <div className="w-full lg:w-80 flex-shrink-0">
                <EventSideList
                  events={weekEvents}
                  onEventClick={handleEventClick}
                  onDiscoverMore={() => setIsDiscoveryMode((v) => !v)}
                  isDiscoveryMode={isDiscoveryMode}
                />
              </div>
            </div>
          )}

          <div className="mt-10 p-8 bg-secondary rounded-2xl text-center shadow-sm">
            <p className="text-2xl font-medium text-foreground">
              {t.totalActivities} {weekEvents.length} {t.thisWeek}
            </p>
          </div>
        </div>
      </main>

      {selectedEvent && (
        <EventPreviewPanel
          event={selectedEvent}
          onClose={handleClosePreview}
          isOverlayEvent={isOverlayEventSelected}
          onPurchaseClick={isOverlayEventSelected ? handleRegister : undefined}
          isRegistered={isRegistered(selectedEvent.id)}
          onUnregister={!isOverlayEventSelected ? handleUnregister : undefined}
        />
      )}

      <Footer />
    </div>
  );
};

export default Calendar;
