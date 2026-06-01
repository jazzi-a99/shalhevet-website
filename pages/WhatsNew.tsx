import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import activitiesStep1Image from '@/assets/whats-new-activities-step1.png';
import activitiesStep2TabImage from '@/assets/whats-new-activities-step2-tab.png';
import activitiesStep2Image from '@/assets/whats-new-activities-step2.png';
import activitiesStep4Image from '@/assets/whats-new-activities-step4.png';
import activitiesStep5Image from '@/assets/whats-new-activities-step5.png';
import activitiesStep6Image from '@/assets/whats-new-activities-step6.png';
import activitiesStep7Image from '@/assets/whats-new-activities-step7.png';
import activitiesStep8Image from '@/assets/whats-new-activities-step8.png';
import activitiesStep9Image from '@/assets/whats-new-activities-step9.png';
import activitiesStep10Image from '@/assets/whats-new-activities-step10.png';
import activitiesStep11Image from '@/assets/whats-new-activities-step11.png';
import activitiesStep12Image from '@/assets/whats-new-activities-step12.png';
import activitiesStep13Image from '@/assets/whats-new-activities-step13.png';
import loginStep1Image from '@/assets/whats-new-login-step1.png';
import loginStep2Image from '@/assets/whats-new-login-step2.png';
import loginStep3Image from '@/assets/whats-new-login-step3.png';
import loginStep4Image from '@/assets/whats-new-login-step4.png';
import calendarStep1Image from '@/assets/whats-new-calendar-step1.png';
import calendarStep2Image from '@/assets/whats-new-calendar-step2.png';
import calendarStep3Image from '@/assets/whats-new-calendar-step3.png';
import calendarStep4Image from '@/assets/whats-new-calendar-step4.png';
import calendarStep5Image from '@/assets/whats-new-calendar-step5.png';
import calendarStep6Image from '@/assets/whats-new-calendar-step6.png';
import calendarStep7Image from '@/assets/whats-new-calendar-step7.png';

interface Step {
  title: string;
  description: string;
  imageUrl?: string;
}

type CategoryId = 'activities' | 'login' | 'calendar';

const categoryImages: Record<CategoryId, (string | undefined)[]> = {
  activities: [
    activitiesStep1Image,
    activitiesStep2TabImage,
    activitiesStep2Image,
    activitiesStep4Image,
    activitiesStep5Image,
    activitiesStep6Image,
    activitiesStep7Image,
    activitiesStep8Image,
    activitiesStep9Image,
    activitiesStep10Image,
    activitiesStep11Image,
    activitiesStep12Image,
    activitiesStep13Image,
  ],
  login: [loginStep1Image, loginStep2Image, loginStep3Image, loginStep4Image],
  calendar: [
    calendarStep1Image,
    calendarStep2Image,
    calendarStep3Image,
    calendarStep4Image,
    calendarStep5Image,
    calendarStep6Image,
    calendarStep7Image,
  ],
};

const StepCarousel = ({ steps }: { steps: Step[] }) => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const total = steps.length;

  const goNext = () => setCurrent((c) => Math.min(c + 1, total - 1));
  const goPrev = () => setCurrent((c) => Math.max(c - 1, 0));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <span className="inline-block bg-secondary text-secondary-foreground text-xl md:text-2xl font-bold px-6 py-3 rounded-lg border-2 border-border">
          {t.stepLabel} {current + 1} {t.stepOf} {total}
        </span>
      </div>

      <article className="bg-card border-2 border-border rounded-2xl p-8 md:p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
          {step.title}
        </h2>

        <div className="w-full aspect-video bg-muted border-2 border-dashed border-border rounded-xl flex items-center justify-center mb-8 overflow-hidden">
          {step.imageUrl ? (
            <img src={step.imageUrl} alt={step.title} className="w-full h-full object-contain" />
          ) : (
            <span className="text-2xl text-muted-foreground">{t.imagePlaceholder}</span>
          )}
        </div>

        <p className="text-lg md:text-xl text-foreground leading-relaxed mb-10 whitespace-pre-line">
          {step.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={goNext}
            disabled={current === total - 1}
            className="btn-cta btn-blue w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ChevronRight className="h-6 w-6" />
            {t.nextStep}
          </button>

          <button
            type="button"
            onClick={goPrev}
            disabled={current === 0}
            className="btn-cta btn-green w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {t.previousStep}
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
      </article>
    </div>
  );
};

const WhatsNew = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const categories: { id: CategoryId; label: string }[] = [
    { id: 'activities', label: t.catActivities },
    { id: 'login', label: t.catLogin },
    { id: 'calendar', label: t.catCalendar },
  ];

  const validIds = categories.map((c) => c.id) as string[];
  const initialTab = searchParams.get('category');
  const [activeTab, setActiveTab] = useState<string>(
    initialTab && validIds.includes(initialTab) ? initialTab : categories[0].id,
  );

  useEffect(() => {
    const tab = searchParams.get('category');
    if (tab && validIds.includes(tab) && tab !== activeTab) {
      setActiveTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ category: value }, { replace: true });
  };

  const buildSteps = (id: CategoryId): Step[] => {
    const localized = t.whatsNewSteps[id] || [];
    const images = categoryImages[id] || [];
    // Existing screenshots are captured in Hebrew UI. Hide them in English so
    // users don't see Hebrew interface in the guides.
    return localized.map((s, i) => ({
      title: s.title,
      description: s.description,
      imageUrl: language === 'en' ? undefined : images[i],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="bg-secondary py-8 border-b border-border">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center">
              {t.whatsNew}
            </h1>
            <p className="text-center text-xl text-muted-foreground mt-3">
              {t.whatsNewSubtitle}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-3 h-auto bg-transparent mb-10 p-0">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="px-6 py-4 text-lg md:text-xl font-bold rounded-xl border-2 border-border bg-background text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary hover:border-primary transition-all min-h-[60px]"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id} className="mt-0">
                <StepCarousel steps={buildSteps(cat.id)} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WhatsNew;
