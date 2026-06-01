import { X, Users, Clock, User, Info, Megaphone } from 'lucide-react';
import { CalendarEvent, getCategoryLabel } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useActivityDetails } from '@/hooks/useActivityDetails';

interface EventPreviewPanelProps {
  event: CalendarEvent | null;
  onClose: () => void;
  isOverlayEvent?: boolean;
  onPurchaseClick?: () => void;
  isRegistered?: boolean;
  onUnregister?: () => void;
}

const EventPreviewPanel = ({ 
  event, 
  onClose,
  isOverlayEvent = false,
  onPurchaseClick,
  isRegistered = false,
  onUnregister,
}: EventPreviewPanelProps) => {
  const { language, t } = useLanguage();
  const { count, announcements } = useActivityDetails(event?.id);

  if (!event) return null;

  const formatDate = (date: Date) => {
    const locale = language === 'he' ? 'he-IL' : 'en-US';
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };
  
  const pickLang = <T,>(he: T | undefined, en: T | undefined): T | undefined => {
    if (language === 'en') return en ?? he;
    return he;
  };
  const eventTitle = pickLang(event.title, event.titleEn) || event.title;
  const eventDescription = pickLang(event.description, event.descriptionEn) || event.description;
  const eventTeacher = pickLang(event.teacher, event.teacherEn);
  const eventInstructions = pickLang(event.instructions, event.instructionsEn);
  const categoryLabel = getCategoryLabel(event.category, language);

  return (
    <div 
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - positioned inside popup container */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header image */}
        {event.imageUrl && (
          <div className="relative h-48 md:h-56 overflow-hidden rounded-t-2xl">
            <img
              src={event.imageUrl}
              alt={eventTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Action button at top */}
          {isOverlayEvent && onPurchaseClick && (
            <button
              onClick={onPurchaseClick}
              className="w-full py-4 mb-6 bg-primary text-primary-foreground text-xl font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              {t.registerForActivity ?? t.clickToPurchase}
            </button>
          )}
          {!isOverlayEvent && isRegistered && onUnregister && (
            <button
              onClick={onUnregister}
              className="w-full py-4 mb-6 bg-destructive text-destructive-foreground text-xl font-bold rounded-xl hover:bg-destructive/90 transition-colors"
            >
              {t.unregisterFromActivity ?? 'בטל הרשמה'}
            </button>
          )}
          
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-4 py-2 bg-secondary text-foreground rounded-full text-lg font-medium">
              {categoryLabel}
            </span>
            {event.isRecurring && (
              <span className="inline-block px-3 py-2 bg-accent text-foreground rounded-full text-base">
                🔄 {t.recurringEvent}
              </span>
            )}
          </div>
          
          {/* Title */}
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {eventTitle}
          </h2>
          
          {/* Date and time */}
          <div className="flex items-center gap-3 text-xl text-foreground mb-3">
            <Clock className="w-6 h-6 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-xl text-foreground mb-4 mr-9">
            <span>{event.startHour}:00 - {event.endHour}:00</span>
          </div>
          
          {/* Teacher */}
          {eventTeacher && (
            <div className="flex items-center gap-3 text-xl text-foreground mb-4">
              <User className="w-6 h-6 text-primary" />
              <span>{eventTeacher}</span>
            </div>
          )}
          
          {/* Participants */}
          <div className="flex items-center gap-3 text-xl text-foreground mb-6">
            <Users className="w-6 h-6 text-primary" />
            <span>
              {count ?? event.participants} {t.participants}
            </span>
          </div>
          
          {/* Description */}
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            {eventDescription}
          </p>
          
          {/* Event Instructions - only shown if they exist */}
          {eventInstructions && (
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 text-xl font-semibold text-foreground mb-2">
                <Info className="w-6 h-6 text-primary" />
                <span>{t.eventInstructions}</span>
              </div>
              <p className="text-lg text-foreground leading-relaxed mr-9">
                {eventInstructions}
              </p>
            </div>
          )}
          
          {/* Announcements section */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 text-xl font-semibold text-amber-900 mb-3">
              <Megaphone className="w-6 h-6 text-amber-700" />
              <span>{language === 'en' ? 'Announcements' : 'הודעות והכרזות'}</span>
            </div>
            
            {announcements.length > 0 ? (
              <div className="max-h-48 overflow-y-auto space-y-3">
                {announcements.map((a) => {
                  const title = (language === 'en' && a.title_en) ? a.title_en : a.title_he;
                  const message = (language === 'en' && a.message_en) ? a.message_en : a.message_he;
                  const isGeneral = a.activity_id === null;
                  return (
                    <div
                      key={a.id}
                      className="bg-white border border-amber-200 rounded-lg p-3"
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h4 className="text-lg font-bold text-foreground">{title}</h4>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(a.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'he-IL')}
                        </span>
                      </div>
                      {isGeneral && (
                        <div className="text-sm font-semibold text-amber-800 mb-1">
                          {language === 'en' ? 'General announcement' : 'הודעה כללית'}
                        </div>
                      )}
                      <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                        {message}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-lg text-muted-foreground mr-9">
                {language === 'en' ? 'No announcements' : 'אין הודעות'}
              </p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EventPreviewPanel;
