export type EventCategory = 'art' | 'lecture' | 'trip' | 'reading' | 'fitness' | 'music' | 'default';

export type SimpleCategory = 'sport' | 'culture' | 'social';

export interface EventNotification {
  id: string;
  message: string;
  messageEn?: string;
  date: Date;
  type: 'info' | 'warning' | 'change';
}

export interface CalendarEvent {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  date: Date;
  startHour: number;
  endHour: number;
  category: EventCategory;
  simpleCategory: SimpleCategory;
  isRecurring: boolean;
  teacher?: string;
  teacherEn?: string;
  participants: number;
  imageUrl?: string;
  instructions?: string;
  instructionsEn?: string;
  notifications?: EventNotification[];
}

export interface AttendanceStatus {
  eventId: string;
  isAttending: boolean;
}

export const categoryColors: Record<EventCategory, string> = {
  art: 'bg-event-art',
  lecture: 'bg-event-lecture',
  trip: 'bg-event-trip',
  reading: 'bg-event-reading',
  fitness: 'bg-event-fitness',
  music: 'bg-event-music',
  default: 'bg-event-default',
};

export const categoryLabels: Record<EventCategory, string> = {
  art: 'אומנות',
  lecture: 'הרצאה',
  trip: 'טיול',
  reading: 'קריאה',
  fitness: 'כושר',
  music: 'מוסיקה',
  default: 'כללי',
};

export const categoryLabelsEn: Record<EventCategory, string> = {
  art: 'Art',
  lecture: 'Lecture',
  trip: 'Trip',
  reading: 'Reading',
  fitness: 'Fitness',
  music: 'Music',
  default: 'General',
};

export const getCategoryLabel = (category: EventCategory, language: string): string => {
  if (language === 'en') return categoryLabelsEn[category];
  return categoryLabels[category];
};
