import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, Mic, Music, Film, ShoppingCart, Info, CheckCircle, XCircle, Users, Megaphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useActivityDetails } from '@/hooks/useActivityDetails';

interface UpcomingEvent {
  id?: string;
  title: string;
  date: Date;
  dateDisplay: string;
  description: string;
  type: 'lecture' | 'concert' | 'movie';
  imageUrl: string;
  time?: string;
  isAvailable?: boolean;
}

interface EventDetailDialogProps {
  event: UpcomingEvent | null;
  isOpen: boolean;
  onClose: () => void;
  showPurchase?: boolean;
}

const getEventIcon = (type: UpcomingEvent['type']) => {
  switch (type) {
    case 'lecture':
      return <Mic className="w-8 h-8" />;
    case 'concert':
      return <Music className="w-8 h-8" />;
    case 'movie':
      return <Film className="w-8 h-8" />;
  }
};

const getEventColor = (type: UpcomingEvent['type']) => {
  switch (type) {
    case 'lecture':
      return 'bg-amber-500';
    case 'concert':
      return 'bg-rose-500';
    case 'movie':
      return 'bg-indigo-500';
  }
};

const EventDetailDialog = ({ event, isOpen, onClose, showPurchase = true }: EventDetailDialogProps) => {
  const { language, t } = useLanguage();
  const { count, announcements } = useActivityDetails(event?.id);

  if (!event) return null;

  const getTypeLabel = () =>
    event.type === 'lecture' ? t.lectureLabel : event.type === 'concert' ? t.concertLabel : t.movieLabel;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-w-[95vw] p-0 overflow-hidden">
        {/* Event Image */}
        <div className="relative h-52 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full text-white ${getEventColor(event.type)}`}>
            {getEventIcon(event.type)}
            <span className="text-lg font-bold">{getTypeLabel()}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight text-foreground">
              {event.title}
            </DialogTitle>
          </DialogHeader>

          {/* Date & Time */}
          <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-xl">
            <div className="bg-primary p-3 rounded-full">
              <Calendar className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                {t.dateLabel}
              </p>
              <p className="text-xl font-bold text-primary">
                {event.dateDisplay}
              </p>
            </div>
          </div>

          {event.time && (
            <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-xl">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {t.timeLabel}
                </p>
                <p className="text-xl font-bold text-foreground">
                  {event.time}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-secondary/30 p-4 rounded-xl">
            <p className="text-lg text-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Registered participants count */}
          {event.id && count !== null && (
            <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <Users className="w-7 h-7 text-blue-700 flex-shrink-0" />
              <span className="text-lg font-bold text-blue-900">
                {language === 'en'
                  ? `${count} ${count === 1 ? 'person registered' : 'people registered'}`
                  : `${count} ${count === 1 ? 'נרשם/ת' : 'נרשמו עד כה'}`}
              </span>
            </div>
          )}

          {/* Availability Status */}
          {event.isAvailable !== undefined && (
            <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
              event.isAvailable 
                ? 'bg-green-50 border-green-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              {event.isAvailable ? (
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              )}
              <span className={`text-xl font-bold ${
                event.isAvailable ? 'text-green-700' : 'text-red-700'
              }`}>
                {event.isAvailable ? t.seatsAvailable : t.eventFullLong}
              </span>
            </div>
          )}

          {/* Announcements */}
          {event.id && announcements.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-3 text-lg font-bold text-amber-900 mb-3">
                <Megaphone className="w-6 h-6 text-amber-700" />
                <span>{language === 'en' ? 'Announcements' : 'הודעות והכרזות'}</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {announcements.map((a) => {
                  const title = (language === 'en' && a.title_en) ? a.title_en : a.title_he;
                  const message = (language === 'en' && a.message_en) ? a.message_en : a.message_he;
                  return (
                    <div key={a.id} className="bg-white border border-amber-200 rounded-lg p-3">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h4 className="text-base font-bold text-foreground">{title}</h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(a.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'he-IL')}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                        {message}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Purchase Button - Only show if available */}
          {showPurchase && event.isAvailable !== false && (
            <Button 
              size="lg" 
              className="w-full text-xl py-6 gap-3"
              onClick={() => {
                alert(t.purchaseSoon);
              }}
            >
              <ShoppingCart className="w-6 h-6" />
              {t.purchaseTickets}
            </Button>
          )}

          {/* Info Note */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-base text-blue-800">
              {t.contactCenterNote}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;
