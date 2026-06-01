import { useLanguage } from '@/contexts/LanguageContext';

export type EventFrequency = 'all' | 'recurring' | 'one-time';
export type SimpleCategory = 'all' | 'sport' | 'culture' | 'social';

interface CalendarFiltersProps {
  frequencyFilter: EventFrequency;
  categoryFilter: SimpleCategory;
  onFrequencyChange: (filter: EventFrequency) => void;
  onCategoryChange: (filter: SimpleCategory) => void;
}

const CalendarFilters = ({
  frequencyFilter,
  categoryFilter,
  onFrequencyChange,
  onCategoryChange,
}: CalendarFiltersProps) => {
  const { t } = useLanguage();

  const frequencyOptions: { value: EventFrequency; label: string }[] = [
    { value: 'all', label: t.allEvents },
    { value: 'recurring', label: t.recurring },
    { value: 'one-time', label: t.oneTime },
  ];

  const categoryOptions: { value: SimpleCategory; label: string }[] = [
    { value: 'all', label: t.allEvents },
    { value: 'sport', label: t.sport },
    { value: 'culture', label: t.culture },
    { value: 'social', label: t.social },
  ];

  return (
    <div className="bg-card rounded-2xl border-2 border-border p-6 mb-8 shadow-sm">
      {/* Filter instruction text */}
      <p className="text-xl text-primary font-semibold text-center mb-6 bg-primary/10 rounded-xl p-4">
        ℹ️ {t.filterInstruction}
      </p>
      
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {/* Frequency filter */}
        <div className="flex gap-3">
          {frequencyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFrequencyChange(option.value)}
              className={`
                px-6 py-4 rounded-xl text-xl font-semibold transition-all shadow-sm
                ${frequencyFilter === option.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-foreground hover:bg-accent'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        <div className="w-px h-12 bg-border hidden md:block" />
        
        {/* Category filter */}
        <div className="flex gap-3">
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onCategoryChange(option.value)}
              className={`
                px-6 py-4 rounded-xl text-xl font-semibold transition-all shadow-sm
                ${categoryFilter === option.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-foreground hover:bg-accent'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarFilters;
