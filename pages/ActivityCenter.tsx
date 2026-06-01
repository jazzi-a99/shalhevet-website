import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import LecturesAndClasses from '@/components/activity-center/LecturesAndClasses';
import HealthClub from '@/components/activity-center/HealthClub';
import UpcomingEvents from '@/components/activity-center/UpcomingEvents';

type TabType = 'lectures' | 'health' | 'upcoming';

const ActivityCenter = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = (searchParams.get('tab') as TabType) || 'lectures';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const { language, t } = useLanguage();

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType | null;
    if (tab && ['lectures', 'health', 'upcoming'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'lectures' as TabType, label: t.tabLectures },
    { id: 'health' as TabType, label: t.tabHealth },
    { id: 'upcoming' as TabType, label: t.tabUpcoming },
  ];

  const pageTitle = t.activityCenterTitle;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Page Title */}
        <div className="bg-secondary py-8 border-b border-border">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center">
              {pageTitle}
            </h1>
            <div className="text-center mt-5">
              <button
                type="button"
                onClick={() => navigate('/whats-new?category=activities')}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-xl font-bold bg-[hsl(var(--cta-pink))] text-[hsl(var(--cta-pink-foreground))] border-4 border-[hsl(var(--foreground))] hover:brightness-110 transition-all shadow-md"
              >
                <span aria-hidden="true" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--cta-pink-foreground))] text-[hsl(var(--cta-pink))] font-extrabold text-lg">?</span>
                {t.aboutThisPage}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-card border-b-2 border-border py-6 shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4">
            {/* Instruction text */}
            <p className="text-center text-lg md:text-xl text-muted-foreground mb-4">
              {t.tabClickInstruction}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-8 py-5 text-xl md:text-2xl font-bold rounded-xl
                    transition-all duration-200 min-w-[200px]
                    border-3 shadow-md
                    ${activeTab === tab.id
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                      : 'bg-background text-foreground border-border hover:border-primary hover:bg-secondary'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="container mx-auto px-4 py-10">
          {activeTab === 'lectures' && <LecturesAndClasses />}
          {activeTab === 'health' && <HealthClub />}
          {activeTab === 'upcoming' && <UpcomingEvents />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ActivityCenter;
