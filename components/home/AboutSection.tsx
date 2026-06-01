import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const AboutSection = () => {
  const { t, language } = useLanguage();
  const isHe = language === 'he';

  const intro = isHe
    ? 'עמותת שלהב״ת הוקמה ב-1984.'
    : 'Shalhevet Association was founded in 1984.';

  const sections = isHe
    ? [
        {
          value: 'purpose',
          title: 'ייעוד',
          paragraphs: [
            'שלהב״ת היא בית שמקדם איכות חיים מיטבית ומשמעותית ומהווה מרכז המתכנן, מפתח ומספק מענה, מידע, תוכן ושירותים מגוונים לצרכי האוכלוסייה המבוגרת בקרית טבעון והסביבה.',
          ],
        },
        {
          value: 'vision',
          title: 'חזון',
          paragraphs: [
            'שלהב״ת תהיה בית שוקק חיים, מזמין, נגיש, נעים ומכבד לכל מבוגר. כל אדם יוכל למצוא בבית זה אוזן קשבת, פעילות מתאימה והזדמנות להפגת בדידות ויצירת איכות חיים מיטבית ומשמעותית.',
            'שלהב״ת תהיה מרכז ידע מקצועי המתמחה בתחומי החיים הרלוונטיים לאוכלוסייה המבוגרת, תהווה מוקד לכל פנייה הקשורה לצרכי חייהם ותכווין לפתרונות קיימים. שלהב״ת תיזום מהלכים שיקדמו את איכות החיים המיטבית של האוכלוסייה המבוגרת ותעודד יזמויות נוספות בתחום.',
            'שלהב״ת הינה שותף אסטרטגי של המועצה המקומית קריית טבעון לקביעת מדיניות קידום האוכלוסייה המבוגרת, וזרוע ביצועית ליישום והפעלת התוכניות וסל השירותים המוצע עבורה.',
          ],
        },
        {
          value: 'values',
          title: 'ערכים',
          items: [
            { h: 'כבוד לאדם', t: 'הכבוד לאדם יתבטא באמפטיה, חמלה, רגישות, סבלנות והכרה בערך הניסיון וחוכמת החיים שצבר אדם בחייו.' },
            { h: 'הזכות להגשמה עצמית והתפתחות אישית', t: 'אנו מאמינים בחופש הבחירה של האדם בפעילות שתצור ערך ומשמעות עבורו בכל גיל ושלב, ברמה הפיזית, האינטלקטואלית והרוחנית.' },
            { h: 'מעורבות, אכפתיות ותרומה לקהילה', t: 'חברי קהילת שלהב״ת מעורבים ביומיום של העמותה ופועלים בהתנדבות ועזרה הדדית מתוך אכפתיות למקום.' },
            { h: 'נגישות', t: 'שלהב״ת תשאף לאפשר לכל אדם, ככל האפשר, לקחת חלק ולהשתתף בפעילויות השונות.' },
            { h: 'שירותיות', t: 'העובדים והמתנדבים יפעלו לאור גישה הכוללת נכונות ומאמץ לתת שירות מקצועי ואדיב.' },
            { h: 'יוזמה וחדשנות', t: 'שלהב״ת תקדם מהלכים, תיזום פרויקטים ותוכניות ותעודד יוזמות לטובת האוכלוסייה המבוגרת. שלהב״ת תהיה מעודכנת, מקצועית ומעורה בחדשנות הקיימת בתחום ותפעל להנגשת ידע זה לאוכלוסייה המבוגרת.' },
          ],
        },
        { value: 'staff', title: 'צוות העמותה', paragraphs: ['צוות מסור של אנשי מקצוע, רכזות, מדריכים ומתנדבים פועלים יחד מדי יום למען חברי הקהילה. צילום חברי העמותה: יסמין יהב.'] },
        { value: 'board', title: 'חברי הועד המנהל', paragraphs: ['הועד המנהל מורכב מתושבי קריית טבעון המתנדבים מזמנם ומומחיותם לטובת קידום פעילות העמותה.'] },
        { value: 'services', title: 'מערך השירותים', paragraphs: ['מערך השירותים של שלהב״ת כולל מרכז יום רב-תחומי, מועדון בריאות וכושר, חוגים והרצאות, קהילה תומכת, מועדון מפגש ותוכניות מיוחדות לאוכלוסייה המבוגרת.'] },
      ]
    : [
        { value: 'purpose', title: 'Purpose', paragraphs: ['Shalhevet is a home that promotes a meaningful quality of life and serves as a center that plans, develops, and provides services for the older population in Kiryat Tivon and the surrounding area.'] },
        { value: 'vision', title: 'Vision', paragraphs: ['A vibrant, welcoming, accessible, and respectful home for every older adult — a place to find a listening ear, suitable activities, and meaningful connections.'] },
        { value: 'values', title: 'Values', items: [
          { h: 'Respect', t: 'Empathy, compassion, sensitivity and recognition of life experience.' },
          { h: 'Self-fulfillment', t: 'Freedom of choice in activities that create meaning at every age and stage.' },
          { h: 'Community involvement', t: 'Members are involved daily through volunteering and mutual support.' },
          { h: 'Accessibility', t: 'Enabling every person to take part in our activities.' },
          { h: 'Service', t: 'Professional and courteous service from staff and volunteers.' },
          { h: 'Innovation', t: 'Initiating projects and adopting innovation for the benefit of older adults.' },
        ]},
        { value: 'staff', title: 'Our Team', paragraphs: ['A dedicated team of professionals, coordinators, instructors and volunteers. Member photos: Yasmin Yahav.'] },
        { value: 'board', title: 'Board Members', paragraphs: ['The board consists of Kiryat Tivon residents who volunteer their time and expertise.'] },
        { value: 'services', title: 'Services', paragraphs: ['A multi-disciplinary day center, health & fitness club, classes and lectures, supportive community, and meeting club.'] },
      ];

  return (
    <section id="about" className="bg-background section-padding">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-primary mb-4 border-b-4 border-primary/30 pb-3 inline-block">
            {t.homeAboutTitle}
          </h2>
          <p className="text-xl text-foreground/85 mb-10">{intro}</p>
        </div>

        <Accordion type="single" collapsible defaultValue="purpose" className="w-full space-y-3">
          {sections.map((s) => (
            <AccordionItem
              key={s.value}
              value={s.value}
              className="border-2 border-primary/20 rounded-lg bg-secondary/30 px-5 hover:border-primary/40 transition-colors"
            >
              <AccordionTrigger className="text-2xl font-bold text-primary hover:no-underline py-5">
                {s.title}
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-loose text-foreground/85 pb-5">
                {s.paragraphs?.map((p, i) => (
                  <p key={i} className="mb-3 last:mb-0">{p}</p>
                ))}
                {s.items && (
                  <ul className="space-y-3 list-disc pr-5">
                    {s.items.map((it, i) => (
                      <li key={i}>
                        <span className="font-bold text-foreground">{it.h}</span> – {it.t}
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default AboutSection;
