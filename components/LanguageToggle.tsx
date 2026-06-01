import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const languages: { code: Language; label: string }[] = [
  { code: 'he', label: 'עברית' },
  { code: 'en', label: 'English' },
];

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <Globe className="w-6 h-6 text-primary" />
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-4 py-3 rounded-xl text-lg font-bold transition-colors border-2 min-w-[100px] ${
                language === lang.code
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-foreground border-border hover:bg-accent'
              }`}
              aria-label={lang.label}
              aria-pressed={language === lang.code}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
      <span className="text-base text-muted-foreground">
        {t.changeLanguageHint}
      </span>
    </div>
  );
};

export default LanguageToggle;
