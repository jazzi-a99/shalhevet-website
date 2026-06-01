import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface SparksIssue {
  id: string;
  title_he: string;
  title_en: string | null;
  issue_month: number;
  issue_year: number;
  pdf_url: string;
  cover_image_url: string | null;
  description_he: string | null;
  description_en: string | null;
}

const monthNamesHe = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];
const monthNamesEn = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const Sparks = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [issues, setIssues] = useState<SparksIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('sparks_issues')
        .select('*')
        .eq('is_published', true)
        .order('issue_year', { ascending: false })
        .order('issue_month', { ascending: false });
      if (!error && data) setIssues(data as SparksIssue[]);
      setLoading(false);
    };
    load();
  }, []);

  const t = isEn
    ? {
        title: 'Sparks — Shalhevet Community Monthly',
        subtitle:
          'The monthly newsletter is intended to raise awareness and develop formal and informal communication networks among the senior community. It reflects the pulse of our association — through it, members receive ongoing information about Shalhevet\'s activities, clubs, classes, and services for the entire older adult population.',
        distribution: '"Sparks" is published monthly and distributed by direct mail.',
        editorLabel: 'Editor',
        editorName: 'Gila Omri',
        phoneLabel: 'Phone',
        emailLabel: 'Email',
        empty: 'No issues have been published yet. Please check back soon.',
        download: 'Download PDF',
        view: 'View',
        loading: 'Loading…',
        issuesHeading: 'Issues',
      }
    : {
        title: 'ניצוצות — ירחון קהילת שלהב"ת',
        subtitle:
          'הירחון נועד להגביר ערנות ולפתח רשתות תקשורת פורמליות ובלתי פורמליות בקרב ציבור הגמלאים. הירחון משקף את דופק חייה של העמותה ובאמצעותו מקבלים החברים מידע שוטף על פעילויותיה של שלהב"ת, במועדוניה, בחוגיה ובשירותיה לכלל האוכלוסייה המבוגרת.',
        distribution: '"ניצוצות" יוצא לאור מדי חודש, ומופץ בדיוור ישיר.',
        editorLabel: 'עורכת',
        editorName: 'גילה עמרי',
        phoneLabel: 'טלפון',
        emailLabel: 'דוא"ל',
        empty: 'עדיין לא פורסמו גיליונות. נשמח לראותכם שוב בקרוב.',
        download: 'הורדת PDF',
        view: 'צפייה',
        loading: 'טוען…',
        issuesHeading: 'גיליונות',
      };

  const issueLabel = (issue: SparksIssue) => {
    const months = isEn ? monthNamesEn : monthNamesHe;
    const monthName = months[issue.issue_month - 1] ?? '';
    const customTitle = (isEn ? issue.title_en || issue.title_he : issue.title_he) ?? '';
    const monthYear = `${monthName} ${issue.issue_year}`.trim();
    // Avoid duplicating month/year if it's already in the title
    if (customTitle && customTitle.includes(String(issue.issue_year))) {
      return customTitle;
    }
    return customTitle ? `${customTitle} — ${monthYear}` : monthYear;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isEn ? 'ltr' : 'rtl'}>
      <Header />
      <main className="flex-1 container mx-auto px-6 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t.title}</h1>
        </header>

        <section className="max-w-3xl mx-auto bg-card border-2 border-border rounded-2xl p-6 md:p-8 mb-10">
          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-4">{t.subtitle}</p>
          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6">{t.distribution}</p>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg border-t-2 border-border pt-5">
            <div>
              <dt className="font-bold text-foreground">{t.editorLabel}</dt>
              <dd className="text-muted-foreground">{t.editorName}</dd>
            </div>
            <div>
              <dt className="font-bold text-foreground">{t.phoneLabel}</dt>
              <dd className="text-muted-foreground">
                <a href="tel:+972523482014" className="hover:underline">052-3482014</a>
              </dd>
            </div>
            <div>
              <dt className="font-bold text-foreground">{t.emailLabel}</dt>
              <dd className="text-muted-foreground break-all">
                <a href="mailto:go101046@outlook.com" className="hover:underline">go101046@outlook.com</a>
              </dd>
            </div>
          </dl>
        </section>

        <h2 className="text-3xl font-bold text-foreground text-center mb-6">{t.issuesHeading}</h2>

        {loading ? (
          <p className="text-center text-xl text-muted-foreground py-16">{t.loading}</p>
        ) : issues.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-card border-2 border-border rounded-2xl p-10 text-center">
            <p className="text-xl text-muted-foreground">{t.empty}</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <li
                key={issue.id}
                className="bg-card border-2 border-border rounded-2xl overflow-hidden flex flex-col"
              >
                {issue.cover_image_url && (
                  <img
                    src={issue.cover_image_url}
                    alt={issueLabel(issue)}
                    className="w-full h-56 object-cover border-b-2 border-border"
                  />
                )}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h2 className="text-2xl font-bold text-foreground">{issueLabel(issue)}</h2>
                  {(isEn ? issue.description_en : issue.description_he) && (
                    <p className="text-base text-muted-foreground">
                      {isEn ? issue.description_en : issue.description_he}
                    </p>
                  )}
                  <div className="mt-auto flex gap-2 pt-3">
                    <a
                      href={issue.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center text-lg font-bold py-3 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary transition-colors"
                    >
                      {t.view}
                    </a>
                    <a
                      href={issue.pdf_url}
                      download
                      className="flex-1 inline-flex items-center justify-center text-lg font-bold py-3 px-4 rounded-md bg-background text-foreground hover:bg-muted border-2 border-border transition-colors"
                    >
                      {t.download}
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Sparks;
