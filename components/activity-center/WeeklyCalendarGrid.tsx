import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ActivityDetailDialog from './ActivityDetailDialog';

export interface Activity {
  id?: string;
  name: string;
  nameEn?: string;
  startTime: string;
  endTime: string;
  instructor: string;
  instructorEn?: string;
  location: string;
  locationEn?: string;
  category?: string;
}

export interface DaySchedule {
  day: string;
  dayEn: string;
  activities: Activity[];
}

interface WeeklyCalendarGridProps {
  schedule: DaySchedule[];
  colorScheme?: 'lectures' | 'health';
}

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const SLOT_HEIGHT = 100; // increased from 80 for better readability

const categoryColors: Record<string, string> = {
  // Lectures colors
  yoga: 'bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200',
  art: 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200',
  language: 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200',
  music: 'bg-rose-100 border-rose-300 text-rose-900 hover:bg-rose-200',
  games: 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200',
  lecture: 'bg-teal-100 border-teal-300 text-teal-900 hover:bg-teal-200',
  computers: 'bg-indigo-100 border-indigo-300 text-indigo-900 hover:bg-indigo-200',
  dance: 'bg-pink-100 border-pink-300 text-pink-900 hover:bg-pink-200',
  books: 'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200',
  swimming: 'bg-cyan-100 border-cyan-300 text-cyan-900 hover:bg-cyan-200',
  craft: 'bg-yellow-100 border-yellow-300 text-yellow-900 hover:bg-yellow-200',
  shabbat: 'bg-violet-100 border-violet-300 text-violet-900 hover:bg-violet-200',
  // Health colors
  fitness: 'bg-emerald-100 border-emerald-300 text-emerald-900 hover:bg-emerald-200',
  pilates: 'bg-teal-100 border-teal-300 text-teal-900 hover:bg-teal-200',
  walking: 'bg-lime-100 border-lime-300 text-lime-900 hover:bg-lime-200',
  aqua: 'bg-sky-100 border-sky-300 text-sky-900 hover:bg-sky-200',
  relaxation: 'bg-violet-100 border-violet-300 text-violet-900 hover:bg-violet-200',
  strength: 'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200',
  balance: 'bg-indigo-100 border-indigo-300 text-indigo-900 hover:bg-indigo-200',
  default: 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200',
};

const dayHeaderColors: Record<string, string> = {
  'ראשון': 'bg-blue-500',
  'שני': 'bg-green-500',
  'שלישי': 'bg-yellow-500',
  'רביעי': 'bg-purple-500',
  'חמישי': 'bg-orange-500',
  'שישי': 'bg-pink-500',
};

const parseTime = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
};

const getEventStyle = (startTime: string, endTime: string) => {
  const startHour = parseTime(startTime);
  const endHour = parseTime(endTime);
  const duration = endHour - startHour;
  
  const top = (startHour - HOURS[0]) * SLOT_HEIGHT;
  const height = duration * SLOT_HEIGHT - 4; // 4px gap
  
  return {
    top: `${top}px`,
    height: `${Math.max(height, 50)}px`,
  };
};

/**
 * Assigns each activity a "lane" (column index) so overlapping activities
 * appear side by side instead of stacking on top of each other.
 * Returns the activities with `lane` and `lanesTotal` for that day.
 */
const assignLanes = (activities: Activity[]): Array<Activity & { lane: number; lanesTotal: number }> => {
  const sorted = [...activities].sort(
    (a, b) => parseTime(a.startTime) - parseTime(b.startTime),
  );
  const laneEnds: number[] = []; // for each lane, the end time of its last placed activity
  const placed: Array<Activity & { lane: number }> = [];

  for (const act of sorted) {
    const start = parseTime(act.startTime);
    const end = parseTime(act.endTime);
    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    placed.push({ ...act, lane });
  }

  // Group activities into overlapping clusters to compute lanesTotal per cluster
  const lanesTotal = laneEnds.length;
  return placed.map((p) => ({ ...p, lanesTotal }));
};

const WeeklyCalendarGrid = ({ schedule, colorScheme = 'lectures' }: WeeklyCalendarGridProps) => {
  const { language, t } = useLanguage();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const getDayLabel = (daySchedule: DaySchedule) => {
    if (language === 'en') return daySchedule.dayEn;
    return daySchedule.day;
  };

  const getActivityName = (a: Activity) => {
    if (language === 'en') return a.nameEn || a.name;
    return a.name;
  };
  const getInstructor = (a: Activity) => {
    if (language === 'en') return a.instructorEn || a.instructor;
    return a.instructor;
  };
  const getLocation = (a: Activity) => {
    if (language === 'en') return a.locationEn || a.location;
    return a.location;
  };

  const getActivityColor = (activity: Activity) => {
    if (activity.category && categoryColors[activity.category]) {
      return categoryColors[activity.category];
    }
    return categoryColors.default;
  };

  const instructionText = t.clickActivityForDetails;

  return (
    <div className="w-full overflow-x-auto">
      {/* Instruction Text */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
        <p className="text-xl font-medium text-blue-800">
          👆 {instructionText}
        </p>
      </div>

      <div className="min-w-[900px]">
        {/* Grid Container */}
        <div className="flex">
          {/* Time Column */}
          <div className="w-24 flex-shrink-0 bg-secondary/50">
            {/* Empty header cell */}
            <div className="h-16 border-b-2 border-border"></div>
            {/* Hour labels */}
            <div className="relative">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="flex items-start justify-center border-b border-border/50"
                  style={{ height: `${SLOT_HEIGHT}px` }}
                >
                  <span className="text-xl font-bold text-muted-foreground mt-2">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Day Columns */}
          {schedule.map((daySchedule) => (
            <div key={daySchedule.day} className="flex-1 min-w-[140px] border-r-2 border-border">
              {/* Day Header */}
              <div className={`h-16 flex items-center justify-center text-white font-bold text-2xl ${dayHeaderColors[daySchedule.day] || 'bg-slate-500'}`}>
                {getDayLabel(daySchedule)}
              </div>
              
              {/* Events Container */}
              <div 
                className="relative bg-card"
                style={{ height: `${HOURS.length * SLOT_HEIGHT}px` }}
              >
                {/* Hour grid lines */}
                {HOURS.map((hour, idx) => (
                  <div
                    key={hour}
                    className="absolute w-full border-b border-border/30"
                    style={{ top: `${idx * SLOT_HEIGHT}px`, height: `${SLOT_HEIGHT}px` }}
                  />
                ))}
                
                {/* Activity blocks */}
                {assignLanes(daySchedule.activities).map((activity, idx) => {
                  const style = getEventStyle(activity.startTime, activity.endTime);
                  const colorClass = getActivityColor(activity);
                  const widthPct = 100 / activity.lanesTotal;
                  const leftPct = widthPct * activity.lane;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedActivity(activity)}
                      className={`absolute rounded-lg border-2 p-3 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer ${colorClass}`}
                      style={{
                        ...style,
                        left: `calc(${leftPct}% + 4px)`,
                        width: `calc(${widthPct}% - 8px)`,
                      }}
                    >
                      <div className="text-base md:text-lg font-bold leading-tight line-clamp-2">
                        {getActivityName(activity)}
                      </div>
                      <div className="text-sm md:text-base font-semibold opacity-80 mt-1">
                        {activity.startTime}-{activity.endTime}
                      </div>
                      {activity.lanesTotal === 1 && (
                        <>
                          <div className="text-sm md:text-base opacity-70 mt-0.5 line-clamp-1">
                            {getInstructor(activity)}
                          </div>
                          <div className="text-sm md:text-base opacity-70 mt-0.5 line-clamp-1">
                            📍 {getLocation(activity)}
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-secondary/30 rounded-xl">
          <p className="text-lg font-bold text-foreground mb-3">
            {t.legend}
          </p>
          <div className="flex flex-wrap gap-3">
            {schedule.flatMap(day => day.activities)
              .filter((activity, index, self) => 
                activity.category && self.findIndex(a => a.category === activity.category) === index
              )
              .map((activity) => (
                <span
                  key={activity.category}
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getActivityColor(activity)}`}
                >
                  {getActivityName(activity).split(' ')[0]}
                </span>
              ))
            }
          </div>
        </div>
      </div>

      {/* Activity Detail Dialog */}
      <ActivityDetailDialog 
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};

export default WeeklyCalendarGrid;
