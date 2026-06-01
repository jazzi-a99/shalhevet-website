import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import dayCenter1 from '@/assets/day-center-1.png';
import dayCenter2 from '@/assets/day-center-2.png';
import dayCenter3 from '@/assets/day-center-3.png';
import dayCenter4 from '@/assets/day-center-4.png';
import community1 from '@/assets/community-1.png';
import community2 from '@/assets/community-2.png';
import community3 from '@/assets/community-3.png';
import community4 from '@/assets/community-4.png';
import meetingClub1 from '@/assets/meeting-club-1.png';
import meetingClub2 from '@/assets/meeting-club-2.png';
import meetingClub3 from '@/assets/meeting-club-3.png';
import meetingClub4 from '@/assets/meeting-club-4.png';

interface ServiceImage {
  src: string;
  alt: string;
}

interface ServiceContent {
  id: string;
  title: string;
  summary: string;
  body: string[];
  contact?: string[];
  images?: ServiceImage[];
}

const dayCenterImages = (lang: 'he' | 'en'): ServiceImage[] =>
  lang === 'en'
    ? [
        { src: dayCenter1, alt: 'Crocheted flowers — handicraft class at the day center' },
        { src: dayCenter2, alt: 'Ceramics workshop — shaping a clay bowl' },
        { src: dayCenter3, alt: 'Embroidery — colorful floral artwork in progress' },
        { src: dayCenter4, alt: 'Hand embroidery on a wooden hoop' },
      ]
    : [
        { src: dayCenter1, alt: 'פרחים סרוגים — שיעור מלאכת יד במרכז היום' },
        { src: dayCenter2, alt: 'סדנת קרמיקה — עיצוב קערת חימר' },
        { src: dayCenter3, alt: 'רקמה — יצירת פרחים צבעוניים' },
        { src: dayCenter4, alt: 'רקמת יד על מתקן עץ' },
      ];

const communityImages = (lang: 'he' | 'en'): ServiceImage[] =>
  lang === 'en'
    ? [
        { src: community1, alt: 'A senior couple reading together in the garden' },
        { src: community2, alt: 'A warm hug between a community volunteer and an elderly member' },
        { src: community3, alt: 'Members of the community playing chess together' },
        { src: community4, alt: 'A community group on a guided outdoor tour' },
      ]
    : [
        { src: community1, alt: 'זוג מבוגרים קוראים יחד בגינה' },
        { src: community2, alt: 'חיבוק חם בין מתנדבת לחברת קהילה ותיקה' },
        { src: community3, alt: 'חברי הקהילה משחקים שחמט יחד' },
        { src: community4, alt: 'קבוצת חברי קהילה בסיור מודרך בחוץ' },
      ];

const meetingClubImages = (lang: 'he' | 'en'): ServiceImage[] =>
  lang === 'en'
    ? [
        { src: meetingClub1, alt: 'Members and family at a Meeting Club workshop' },
        { src: meetingClub2, alt: 'Meeting Club members at the entrance to the clubhouse' },
        { src: meetingClub3, alt: 'A group picnic in nature with Meeting Club members' },
        { src: meetingClub4, alt: 'Intergenerational gathering at the Meeting Club' },
      ]
    : [
        { src: meetingClub1, alt: 'חברי המועדון ובני משפחה בסדנה במועדון המפגש' },
        { src: meetingClub2, alt: 'חברות מועדון המפגש בכניסה למועדון' },
        { src: meetingClub3, alt: 'פיקניק קבוצתי בטבע עם חברי מועדון המפגש' },
        { src: meetingClub4, alt: 'מפגש בין-דורי במועדון המפגש' },
      ];


const Services = () => {
  const { language } = useLanguage();

  const heading = language === 'en' ? 'Services' : 'מערך שירותים';
  const intro =
    language === 'en'
      ? 'Shalhevet operates three core services for the older population in Kiryat Tivon and the surrounding area. Click on any service to learn more.'
      : 'עמותת שלהב"ת מפעילה שלושה שירותים מרכזיים לאוכלוסייה המבוגרת בקריית טבעון והסביבה. לחצו על כל שירות כדי לקרוא הסבר מלא.';

  const services: ServiceContent[] = language === 'en'
    ? [
        {
          id: 'day-center',
          title: 'Multi-Disciplinary Day Center',
          summary:
            'A half-day framework operating five days a week, providing transportation, meals, classes and a wide range of activities.',
          body: [
            'The Day Center is a half-day framework for older adults, operating five days a week from morning to noon. It was established as a multi-disciplinary center providing social, nutritional and health services aimed at improving the quality of life of the entire older population in Kiryat Tivon, Ramat Yishai and the surrounding area.',
            'Members enjoy transportation to and from the center, breakfast, lunch and a wide range of classes: painting, handicrafts, ceramics, laughter yoga, physical activity including gymnastics, Tai Chi, yoga and a fully equipped gym. Members also enjoy lectures on a variety of subjects such as history, art, Bible, current affairs, the weekly Torah portion and more.',
            'Joining: Long-term Care Insurance Law beneficiaries can attend a full activity day in exchange for 2–2.75 weekly units. Those not eligible can join with a payment of NIS 145–200 per day (less if arriving independently). Funding assistance may be available through the local social services department.',
            'Hot Meals: Lunch is served at the center at 12:30 by prior arrangement, and hot meals can also be delivered to your home by an association representative.',
            'Protected Unit: A dedicated unit for people with dementia and Alzheimer\'s, with a professional, experienced staff. Built in a modern home-like style, fully equipped, with a pleasant terrace, rest room and adjacent restrooms.',
            'Additional services: Registered nurse and social worker; hairdressing, pedicure and manicure at reduced prices; individual and group physiotherapy at symbolic prices.',
          ],
          contact: [
            'Center Director: Natasha Stein — 050-2148853',
            'Address: HaLevana Alley 2, Kiryat Tivon',
            'Tel: 04-9833255 | Fax: 04-9832743',
          ],
          images: dayCenterImages('en'),
        },
        {
          id: 'supportive-community',
          title: 'Supportive Community',
          summary:
            'Provides personal security, quality of life and 24/7 connection to Shalhevet for residents of Kiryat Tivon and Ramat Yishai.',
          body: [
            'The Supportive Community provides services in Kiryat Tivon and Ramat Yishai, offering personal security, quality of life, a connection to the Shalhevet association and peace of mind 24 hours a day. The service includes: a community "father and mother" with personal contact, home visits, "how are you" calls and a listening ear, minor home repairs, mediation with organizations, help solving everyday problems and 24/7 availability for emergencies.',
            'In addition, members can choose two services from the following list:',
            '1. Emergency button and connection to a medical center — at the press of a button, contact is made with an emergency center that immediately dispatches a medical service (nurse, doctor or ambulance). Device installation, mobile app and wrist sensor are included free of charge. Free medical consultation. Doctor visit only NIS 25. Lift service (after a fall) included. If hospitalization does not follow ambulance evacuation, a personal NIS 25 fee applies.',
            '2. Lunch at the Shalhevet Day Center — 6 meals per year.',
            '3. One weekly class at the Shalhevet Day Center.',
            '4. Lectures at the Shalhevet "Cathedra" (academy) — 6 lectures per year.',
            '5. Concerts in the classical listening club — 6 concerts per year.',
            '6. Bringing medications from the pharmacy — once a month.',
            '7. Medical pedicure — quarterly (NIS 20 co-payment at the center / NIS 50 at home).',
            'Monthly cost: NIS 140. Long-term Care Law beneficiaries: half a weekly care hour. Subsidy for Welfare Ministry beneficiaries and Holocaust survivors: only NIS 25.',
          ],
          contact: [
            'Supportive Community Coordinator: Moshe Amsalem — 052-2974185',
          ],
          images: communityImages('en'),
        },
        {
          id: 'meeting-club',
          title: 'The Meeting Club',
          summary:
            'A social club for independent older adults, operating Sunday, Monday and Wednesday mornings.',
          body: [
            'A social club where activities take place for independent senior citizens. The club operates on Sundays, Mondays and Wednesdays, in the morning hours.',
            'Members enjoy physical activity, yoga, lectures on various subjects, handicrafts and computer studies.',
            'The club operates under the supervision of the Department of Social Services of the Kiryat Tivon local council.',
            'Symbolic monthly participation: NIS 45.',
          ],
          contact: [
            'Contact: Shirley Maimon — 052-6146581',
            'Location: Fish Alley — Golomb Street — Above-ground shelter',
          ],
          images: meetingClubImages('en'),
        },
      ]
    : [
        {
          id: 'day-center',
          title: 'מרכז יום רב תחומי',
          summary:
            'מסגרת חצי יומית הפועלת חמישה ימים בשבוע, הכוללת הסעות, ארוחות, חוגים ומגוון פעילויות.',
          body: [
            'מרכז יום הוא מסגרת חצי יומית למבוגרים הפועלת חמישה ימים בשבוע מהבוקר ועד הצהריים. המרכז הוקם כמרכז רב תחומי הנותן מענה חברתי, תזונתי ובריאותי במטרה לשפר את איכות החיים של כלל האוכלוסייה המבוגרת בקרית טבעון, רמת ישי וסביבתה.',
            'המבקרים נהנים מהסעות אל המרכז וחזרה, ארוחת בוקר, ארוחת צהריים ומגוון רחב של חוגים: ציור, מלאכת יד, קרמיקה, יוגה צחוק, פעילות גופנית הכוללת התעמלות, טאי צ\'י, יוגה וחדר כושר מצויד במכשירים. בנוסף, המבקרים נהנים ממגוון הרצאות בנושאים שונים כמו היסטוריה, אומנות, תנ"ך, אקטואליה, פרשת השבוע ועוד.',
            'איך מצטרפים? זכאי חוק סיעוד: בעבור 2–2.75 יחידות שבועיות ניתן ליהנות מיום פעילות שלם במרכז יום. מי שאינו זכאי לחוק סיעוד יכול להצטרף בתשלום של 145–200 ₪ ליום (ניתן לשלם פחות במידה וההגעה עצמאית). קיימת אפשרות לקבל סיוע במימון מהמחלקה לשירותים חברתיים במועצה המקומית.',
            'ארוחות חמות: מרכז היום מציע לאזרחים הוותיקים בקרית טבעון ארוחות חמות. ניתן לאכול ארוחת צהריים במרכז יום (בשעה 12:30 בתיאום מראש ובתשלום), וכן לרכוש ארוחות חמות לבית — נציג העמותה ידאג להביא את הארוחה לבית הלקוח.',
            'יחידה מוגנת: מיועדת לאנשים עם דמנציה ואלצהיימר, להשגחה וטיפול יום-יומי על ידי צוות מקצועי בעל ניסיון רב. היחידה נבנתה בסגנון ביתי מודרני, מאובזרת ונעימה לשהות בה, וכוללת מרפסת, חדר מנוחה ושירותים צמודים.',
            'שירותים נוספים: ♥ אחות מוסמכת ועובדת סוציאלית. ♥ שירותי מספרה, פדיקור ומניקור במחירים מוזלים. ♥ פיזיותרפיה — פרטני וקבוצתי במחירים סמליים. המכון פתוח לקהל הרחב בימי ראשון ורביעי 9:00–12:00. עלות טיפול: חברי מרכז יום 50 ₪, חבר עמותה 150 ₪.',
          ],
          contact: [
            'מנהלת המרכז: נטשה שטיין — 050-2148853',
            'כתובת: סמטת הלבנה 2, קריית טבעון',
            'טל\': 04-9833255 | פקס: 04-9832743',
          ],
          images: dayCenterImages('he'),
        },
        {
          id: 'supportive-community',
          title: 'קהילה תומכת',
          summary:
            'מעניקה ביטחון אישי, איכות חיים וקשר רציף לעמותה — 24 שעות ביממה בקריית טבעון וברמת ישי.',
          body: [
            'הקהילה התומכת מספקת שירותים בקרית טבעון וברמת ישי ומעניקה ביטחון אישי, איכות חיים, קשר לעמותת שלהב"ת ושקט נפשי 24 שעות ביממה. השירות כולל: אב ואם קהילה עם קשר אישי, ביקורי בית, שיחות "מה נשמע" ואוזן קשבת, תיקונים קלים, תיווך לגופים וארגונים, סיוע בפתרון בעיות יומיומיות וזמינות 24 שעות ביממה במקרי חירום.',
            'בנוסף, חברי הקהילה זכאים לבחור שני שירותים מהרשימה הבאה:',
            '1. לחצן מצוקה וחיבור למוקד רפואי — בלחיצת כפתור נוצר קשר עם מוקד חירום המפעיל מיידית שירות רפואי (אחות, רופא או אמבולנס). התקנת המכשיר, האפליקציה בנייד וחיישן היד — ללא תשלום נוסף. ייעוץ רפואי חינם. ביקור רופא בעלות 25 ₪ בלבד. שירות הרמה (לאחר נפילה) ללא תשלום נוסף. אם אין אשפוז בעקבות פינוי באמבולנס — השתתפות עצמית של 25 ₪ בלבד.',
            '2. ארוחת צהריים במרכז יום שלהב"ת — 6 ארוחות בשנה.',
            '3. חוג אחד בשבוע במרכז יום שלהב"ת.',
            '4. הרצאות בקתדרה (מכללה) של שלהב"ת — 6 הרצאות בשנה.',
            '5. קונצרטים במסגרת החוג להאזנה קלאסית — 6 קונצרטים בשנה.',
            '6. הבאת תרופות מבית מרקחת — אחת לחודש.',
            '7. פדיקור רפואי — אחת לרבעון (השתתפות 20 ₪ במרכז יום / 50 ₪ בבית).',
            'עלות חודשית: 140 ₪. זכאי חוק סיעוד: ההצטרפות תמורת חצי שעת סיעוד שבועית בלבד. סבסוד לזכאי משרד הרווחה ולניצולי השואה: 25 ₪ בלבד.',
          ],
          contact: [
            'רכז הקהילה התומכת: משה אמסלם — 052-2974185',
          ],
          images: communityImages('he'),
        },
        {
          id: 'meeting-club',
          title: 'מועדון המפגש',
          summary:
            'מועדון חברתי לאזרחים ואזרחיות ותיקים עצמאיים — בימי ראשון, שני ורביעי בשעות הבוקר.',
          body: [
            'מועדון חברתי, בו מתקיימת פעילות לאזרחים ואזרחיות ותיקים עצמאיים. המועדון פועל בימי ראשון, שני ורביעי בשעות הבוקר.',
            'המבקרים במועדון נהנים מפעילות גופנית, יוגה, הרצאות בנושאים שונים, מלאכת יד ולימוד מחשבים.',
            'המועדון פועל בפיקוח המחלקה לשירותים חברתיים במועצה המקומית קרית טבעון.',
            'השתתפות סמלית לחודש: 45 ₪.',
          ],
          contact: [
            'ליצירת קשר: שירלי מימון — 052-6146581',
            'מקום: סמטת פיש — רחוב גולומב — מקלט עילי',
          ],
          images: meetingClubImages('he'),
        },
      ];

  const contactLabel = language === 'en' ? 'Contact' : 'יצירת קשר';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary py-10 border-b border-border">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center">
              {heading}
            </h1>
            <p className="text-center text-xl md:text-2xl text-muted-foreground mt-4 max-w-3xl mx-auto leading-relaxed">
              {intro}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            {services.map((s) => (
              <AccordionItem
                key={s.id}
                value={s.id}
                className="bg-card border-2 border-border rounded-2xl px-6 md:px-8"
              >
                <AccordionTrigger className="py-6 text-right hover:no-underline">
                  <div className="flex-1 text-right">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      {s.title}
                    </h2>
                    <p className="text-lg md:text-xl text-foreground/80 font-normal leading-relaxed">
                      {s.summary}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8">
                  <div className="space-y-4 pt-2 border-t-2 border-border">
                    {s.body.map((para, i) => (
                      <p
                        key={i}
                        className="text-lg md:text-xl text-foreground leading-relaxed pt-2 first:pt-4"
                      >
                        {para}
                      </p>
                    ))}

                    {s.images && s.images.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {s.images.map((img, i) => (
                          <img
                            key={i}
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                            className="w-full h-40 md:h-48 object-cover rounded-xl border-2 border-border"
                          />
                        ))}
                      </div>
                    )}

                    {s.contact && s.contact.length > 0 && (
                      <div className="mt-6 bg-secondary/60 rounded-xl p-5 border border-border">
                        <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">
                          {contactLabel}
                        </h3>
                        <ul className="space-y-2">
                          {s.contact.map((line, i) => (
                            <li key={i} className="text-lg md:text-xl text-foreground">
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
