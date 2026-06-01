import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

type Row = {
  name: string;
  address: string;
  phone: string;
  discount: string;
  notes?: string;
};

type Category = {
  title: string;
  rows: Row[];
};

const categories: Category[] = [
  {
    title: 'אופטיקה',
    rows: [
      { name: 'קנטור אופטיקה', address: 'ככר בן-גוריון, טבעון', phone: '04-9833306', discount: '15%', notes: 'ליד דוכן מפעל הפיס' },
      { name: 'אופטיקפלן - קפלן יניב', address: 'רימונים 1, טבעון', phone: '04-9531717', discount: '10%', notes: 'אין כפל הנחות' },
    ],
  },
  {
    title: 'אחזקת בית',
    rows: [
      { name: 'חלק - חומרי בניין', address: 'אלכסנדר זייד 1, טבעון', phone: '04-9832706', discount: '10%', notes: 'על מזומן' },
      { name: 'לאדר - כלי כתיבה ובניין', address: 'ככר בן-גוריון, טבעון', phone: '04-9831437', discount: '10%' },
    ],
  },
  {
    title: 'ביגוד',
    rows: [
      { name: 'הולכים אחרת - נעליים', address: 'ככר בן-גוריון, טבעון', phone: '04-9831322', discount: '5%', notes: 'ללא כפל מבצעים' },
    ],
  },
  {
    title: 'בעלי חיים',
    rows: [
      { name: 'פט סייף - הכל לחתול ולכלב', address: 'אלכסנדר זייד 7, טבעון', phone: '054-4855622', discount: '5%' },
    ],
  },
  {
    title: 'בתי מרקחת',
    rows: [
      { name: 'בית מרקחת אורנים', address: 'מרכז מסחרי זייד, טבעון', phone: '04-9832366', discount: '10%', notes: 'לא כולל תרופות מרשם' },
      { name: 'גוטליב "דליה בית מרקחת"', address: 'ככר בן-גוריון, טבעון', phone: '04-9831540', discount: '10%', notes: 'לא כולל תרופות מרשם' },
    ],
  },
  {
    title: 'מסעדות וחנויות מזון',
    rows: [
      { name: 'ניצת הדובדבן', address: 'כיכר בן גוריון', phone: '04-9530933', discount: '5%', notes: 'מס\' לקוח חברי עמותת שלהב"ת: 600904' },
      { name: 'פלאפל לולי', address: 'מרכז מסחרי זייד, טבעון', phone: '052-2793238', discount: '20%', notes: 'מנה פלאפל ב-15 ש"ח בימי שלישי בלבד' },
      { name: 'עראבס - אוכל ביתי', address: 'כיכר בן גוריון', phone: '054-5634338', discount: '10%' },
      { name: 'מסעדת אחמד עדויי', address: 'רמת טבעון (מול האני)', phone: '054-7265555', discount: '10%', notes: 'הנחה על ארוחות ומשלוחים' },
      { name: 'קונדיטוריה שני', address: 'כיכר בן גוריון, טבעון', phone: '04-9831183', discount: '5%', notes: 'על העוגות בלבד' },
      { name: 'לחם ארז', address: 'כיכר בן גוריון, טבעון', phone: '052-5553931', discount: '5%' },
      { name: 'מזון על: ספירולינה / אצות', address: 'רמת ישי ומגדל העמק', phone: '054-2505661', discount: '10%' },
      { name: 'קפה ביגה', address: 'אלונים 85, טבעון', phone: '04-9536306', discount: '5%' },
    ],
  },
  {
    title: 'מתנות',
    rows: [
      { name: 'עומר צעצועים אנתרופוסופיה', address: 'כיכר בן גוריון', phone: '054-6988906', discount: '10%' },
      { name: 'פרח לדנה - מתנות וצעצועים', address: 'קניון מול היער, טבעון', phone: '052-8648832', discount: '10%' },
    ],
  },
  {
    title: 'עו"ד',
    rows: [
      { name: 'רויטל לוין', address: 'פלי"ם 7, חיפה', phone: '052-4204245', discount: '20%', notes: 'דיני משפחה, גירושין, ירושה, נדל"ן - פגישה ראשונה ללא תשלום' },
    ],
  },
  {
    title: 'פרחים',
    rows: [
      { name: 'פרחים לבנים', address: 'ככר בן-גוריון, טבעון', phone: '04-9837755', discount: '5%' },
    ],
  },
  {
    title: 'צילום',
    rows: [
      { name: 'בית הצילום', address: 'מרכז מסחרי זייד, טבעון', phone: '04-9533860', discount: '3%', notes: 'במזומן' },
    ],
  },
  {
    title: 'שונות',
    rows: [
      { name: 'אורון - מדרסים בהתאמה אישית', address: 'השקדים 1, טבעון', phone: '073-7686992', discount: '10%', notes: 'הנחה במזומן בלבד' },
      { name: 'המרכז הישראלי לאיכות חיים - ציוד שיקומי וסיעודי', address: 'תחנת סונול, כפר חסידים', phone: '053-7265563', discount: '5%', notes: 'אין כפל מבצעים' },
      { name: 'מכון קוסמטיקה פרפקט לוק', address: 'אלכסנדר זייד 7, טבעון', phone: '054-4855622', discount: '5%', notes: 'קוסמטיקאית עם 30 שנות ניסיון' },
      { name: 'מוניות - נירו טקסי', address: 'שקדים 35, טבעון', phone: '052-3011600', discount: '30%', notes: 'מהמחירון' },
      { name: 'בית התוכנה והמחשב', address: 'הבונים 2, טבעון', phone: '04-9931670', discount: '5%', notes: '5%-10% הנחה למוצרים נלווים' },
    ],
  },
];

const Discounts = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10" dir="rtl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 text-center">
          {isHe ? 'הנחות לבתי עסק' : 'Business Discounts'}
        </h1>
        <p className="text-xl text-foreground text-center mb-2">
          {isHe ? 'רשימת החנויות שנותנות הנחה לחברי העמותה' : 'List of businesses offering discounts to association members'}
        </p>
        <p className="text-lg text-muted-foreground text-center mb-10">
          {isHe ? '(מעודכן לשנת הפעילות תשפ"ד 2023-2024)' : '(Updated for 2023-2024)'}
        </p>

        <div className="space-y-10 max-w-5xl mx-auto">
          {categories.map((cat) => (
            <section key={cat.title} className="border-2 border-border rounded-lg overflow-hidden">
              <h2 className="text-2xl font-bold bg-primary text-primary-foreground px-6 py-3">
                {cat.title}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-lg">
                  <thead className="bg-muted">
                    <tr className="text-right">
                      <th className="px-4 py-3 font-bold">שם בית העסק</th>
                      <th className="px-4 py-3 font-bold">כתובת</th>
                      <th className="px-4 py-3 font-bold">טלפון</th>
                      <th className="px-4 py-3 font-bold">הנחה</th>
                      <th className="px-4 py-3 font-bold">הערות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border hover:bg-muted/40">
                        <td className="px-4 py-3 font-semibold">{row.name}</td>
                        <td className="px-4 py-3">{row.address}</td>
                        <td className="px-4 py-3">
                          <a
                            href={`tel:${row.phone.replace(/[^\d+]/g, '')}`}
                            className="text-primary hover:underline"
                            dir="ltr"
                          >
                            {row.phone}
                          </a>
                        </td>
                        <td className="px-4 py-3 font-bold text-primary">{row.discount}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.notes || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Discounts;
