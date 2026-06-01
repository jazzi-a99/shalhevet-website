import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, MapPin, User, Info, Users, Megaphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Activity } from './WeeklyCalendarGrid';
import { useActivityDetails } from '@/hooks/useActivityDetails';

interface ActivityDetailDialogProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const ActivityDetailDialog = ({ activity, isOpen, onClose }: ActivityDetailDialogProps) => {
  const { language, t } = useLanguage();
  const { count, announcements } = useActivityDetails(activity?.id);

  if (!activity) return null;

  const name = language === 'en' ? (activity.nameEn || activity.name) : activity.name;
  const instructor = language === 'en' ? (activity.instructorEn || activity.instructor) : activity.instructor;
  const location = language === 'en' ? (activity.locationEn || activity.location) : activity.location;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] p-0 overflow-hidden">
        {/* Header with color */}
        <div className="bg-primary p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight">
              {name}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Time */}
          <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-xl">
            <div className="bg-primary/10 p-3 rounded-full">
              <Clock className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                {t.timeLabel}
              </p>
              <p className="text-xl font-bold text-foreground">
                {activity.startTime} - {activity.endTime}
              </p>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-xl">
            <div className="bg-primary/10 p-3 rounded-full">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                {t.instructorLabel}
              </p>
              <p className="text-xl font-bold text-foreground">
                {instructor}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-xl">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                {t.locationLabel}
              </p>
              <p className="text-xl font-bold text-foreground">
                {location}
              </p>
            </div>
          </div>

          {/* Registered participants count */}
          {activity.id && count !== null && (
            <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <Users className="w-7 h-7 text-blue-700 flex-shrink-0" />
              <span className="text-lg font-bold text-blue-900">
                {language === 'en'
                  ? `${count} ${count === 1 ? 'person registered' : 'people registered'}`
                  : `${count} ${count === 1 ? 'נרשם/ת' : 'נרשמו עד כה'}`}
              </span>
            </div>
          )}

          {/* Announcements */}
          {activity.id && announcements.length > 0 && (
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

          {/* Info Note */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-lg text-amber-800">
              {t.weeklyRecurringNote}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetailDialog;
