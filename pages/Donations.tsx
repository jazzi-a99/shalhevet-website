import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const supporters = [
  { name: 'מועצה מקומית קריית טבעון', nameEn: 'Kiryat Tivon Municipality' },
  { name: 'ביטוח לאומי', nameEn: 'National Insurance Institute' },
  { name: 'משרד הרווחה', nameEn: 'Ministry of Welfare' },
  { name: 'אשל - ג\'וינט', nameEn: 'Eshel - Joint' },
  { name: 'קרן אריסון', nameEn: 'Arison Foundation' },
  { name: 'המשרד לאזרחים ותיקים', nameEn: 'Ministry for Senior Citizens' },
  { name: 'ועידת התביעות', nameEn: 'Claims Conference' },
  { name: 'ועדת העזבונות', nameEn: 'Estates Committee' },
];

const Donations = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10" dir={isHe ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
            {isHe ? 'תרומות' : 'Donations'}
          </h1>

          {/* Intro */}
          <section className="bg-card border-2 border-border rounded-lg p-8 mb-8">
            <p className="text-xl leading-relaxed mb-4">
              {isHe
                ? 'עמותת שלהב"ת מספקת מערך שירותים למוסד לביטוח לאומי ולמשרד הרווחה. העמותה נתמכת ע"י המועצה המקומית קריית טבעון ומבססת את פעילותה על הכנסות עצמאיות ותרומות.'
                : 'Shalhevet Association provides services to the National Insurance Institute and the Ministry of Welfare. The association is supported by the Kiryat Tivon Municipality and operates on self-generated income and donations.'}
            </p>
            <p className="text-xl leading-relaxed font-semibold">
              {isHe
                ? 'נשמח לתרומה להמשך פעילות מגוונת למען האוכלוסייה המבוגרת בקריית טבעון והסביבה.'
                : 'We would be grateful for your donation to continue our diverse activities for the elderly population in Kiryat Tivon and the surrounding area.'}
            </p>
          </section>

          {/* Bank Transfer */}
          <section className="border-2 border-primary rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4">
              {isHe ? 'העברה בנקאית' : 'Bank Transfer'}
            </h2>
            <p className="text-lg mb-4">
              {isHe
                ? 'ניתן לבצע העברה בנקאית. לעמותה יש אישור 46א\' לקבלת תרומות.'
                : 'You can make a bank transfer. The association holds a 46A certificate for receiving donations.'}
            </p>
            <div className="bg-muted p-6 rounded-md text-xl space-y-2">
              <div><span className="font-bold">{isHe ? 'בנק:' : 'Bank:'}</span> {isHe ? 'בנק לאומי' : 'Bank Leumi'}</div>
              <div><span className="font-bold">{isHe ? 'סניף:' : 'Branch:'}</span> 896</div>
              <div><span className="font-bold">{isHe ? 'מספר חשבון:' : 'Account Number:'}</span> 6281374</div>
            </div>
          </section>

          {/* Credit Card */}
          <section className="border-2 border-border rounded-lg p-8 mb-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">
              {isHe ? 'תרומה בכרטיס אשראי' : 'Credit Card Donation'}
            </h2>
            <p className="text-lg mb-6">
              {isHe
                ? 'ניתן לתרום בכרטיס אשראי דרך האתר הרשמי של העמותה.'
                : 'You can donate by credit card through the official association website.'}
            </p>
            <a
              href="http://www.shalhevet-tivon.org.il/home/doc.aspx?mCatID=85&mode=s&icID=201"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground text-xl font-bold py-4 px-8 rounded-md border-2 border-primary hover:bg-primary/90 transition-colors"
            >
              {isHe ? 'לתרומה בכרטיס אשראי' : 'Donate by Credit Card'}
            </a>
          </section>

          {/* Supporters */}
          <section className="border-2 border-border rounded-lg p-8">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">
              {isHe ? 'גופים תומכים' : 'Our Supporters'}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supporters.map((s) => (
                <li
                  key={s.name}
                  className="bg-muted px-4 py-3 rounded-md text-lg font-semibold text-center border border-border"
                >
                  {isHe ? s.name : s.nameEn}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Donations;
