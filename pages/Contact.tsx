import { useState } from 'react';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'נא להזין שם').max(100),
  email: z.string().trim().email('כתובת מייל לא תקינה').max(255).optional().or(z.literal('')),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'נא להזין הודעה').max(2000),
});

const staff = [
  ["רכז חוג ברידג'", 'יעקב בן מרדכי', '052-3361579'],
  ['רכזת מתנדבים', 'חנה חונוביץ', '054-3330575'],
  ['ייעוץ תכנון רפואי', 'איתנה דוד', '054-9911120'],
  ['צוות ירחון "ניצוצות"', 'נאוה בולקא', '052-3342458'],
  ['עורכת ירחון "ניצוצות"', 'גילה עומרי', '053-9187481'],
  ['רכז "איסוף תרופות"', 'דוד כץ', '050-6263109'],
  ['רכז ספרייה קהילתית', 'רון כספי', '052-3793203'],
  ['רכז קבוצת רוכבי אופניים', 'אביהו שי', '050-3080806'],
  ['רכז קונצרטים מוקרנים', 'זאב מזור', '054-4776131'],
  ['רכזת קבוצת מטיילים גלים', 'אמי אברבך', '052-2827106'],
  ['רכזת קבוצת מטיילים גאל', 'שולה נחמיאס', '052-3209184'],
  ['רכזת "קהילות נכחדות"', 'זהבה לרון', '054-5544008'],
  ['רכזת "קהילות נכחדות"', 'רחל גדות', '052-3744697'],
  ['רכז מקהלת הבית', 'יורם גרזון', '050-7954934'],
  ['רכז "הפרלמנט בראשון"', 'יעקב שורר', '054-5749279'],
  ['רכז קורס ערבית וערבי זמר', 'גדי בתר', '054-6416840'],
  ['רכז מועדון מחשבים', 'חנן שטיין', '054-4260688'],
  ['רכזת חוג מוסיקה', 'מרים ראוך', '054-8035844'],
  ['רכז קהילה תומכת', 'משה אמסלם', '052-2974185'],
  ['אם קהילה תומכת', 'סילבי סבו', '052-3707767'],
  ['רכזת מועדון המפגש', 'שירלי מימון', '051-5404452'],
  ['פדיקוריסטית', 'רחל טל', '054-4417700'],
  ['ספרית', 'שושנה אברג\'יל', '052-8615970'],
  ['אחות מרכז יום', 'רחלי שפיקר', '04-9833255'],
  ['מזכירות מרכז יום', 'נורית תמיר', '04-9833255'],
  ['עו"ס מרכז יום', 'עליזה ארצי', '04-9833255'],
  ['מנהלת מרכז יום', 'נטשה שטיין', '050-2148853'],
  ['גבייה', 'ענת אלוש', '04-9535750'],
  ['אב בית', 'ששי שוספי', '052-8389106'],
  ['הנהלת חשבונות', 'חנה ברנשטיין', '04-9535750'],
  ['יו"ר העמותה', 'יקי שלו', '054-4409180'],
  ['מזכירות העמותה', 'רעות תורג\'מן', '04-9535750'],
  ['מנכ"ל העמותה', 'אלי פוליאקוב', '052-4402187'],
];

const Contact = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';

  const [form, setForm] = useState({
    name: '', email: '', phone: '', message: '',
    wants_email_updates: false, wants_to_volunteer: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      toast.error(first || 'שגיאה בטופס');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('contact_messages').insert({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
      wants_email_updates: form.wants_email_updates,
      wants_to_volunteer: form.wants_to_volunteer,
    });
    setSubmitting(false);
    if (error) {
      toast.error(isHe ? 'שליחת ההודעה נכשלה' : 'Failed to send');
      return;
    }
    toast.success(isHe ? 'תודה! ההודעה נשלחה' : 'Thank you! Your message was sent');
    setForm({ name: '', email: '', phone: '', message: '', wants_email_updates: false, wants_to_volunteer: false });
  };

  const inputClass = 'w-full text-lg p-3 border-2 border-border rounded-md bg-background focus:border-primary outline-none';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10" dir={isHe ? 'rtl' : 'ltr'}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
            {isHe ? 'צור קשר' : 'Contact Us'}
          </h1>

          {/* Contact info */}
          <section className="bg-card border-2 border-border rounded-lg p-8 mb-8 grid md:grid-cols-2 gap-6 text-lg">
            <div>
              <p className="mb-3"><span className="font-bold">{isHe ? 'טלפון:' : 'Phone:'}</span>{' '}
                <a href="tel:04-9535750" className="text-primary hover:underline" dir="ltr">04-9535750</a>
              </p>
              <p className="mb-3"><span className="font-bold">{isHe ? 'דוא"ל:' : 'Email:'}</span>{' '}
                <a href="mailto:shalhevet01@gmail.com" className="text-primary hover:underline" dir="ltr">shalhevet01@gmail.com</a>
              </p>
              <p><span className="font-bold">{isHe ? 'כתובת:' : 'Address:'}</span> {isHe ? 'סימטת הלבנה 2, מיקוד 3601602, קריית טבעון' : 'Simtat HaLivne 2, Kiryat Tivon 3601602'}</p>
            </div>
            <div className="flex items-center justify-center">
              <a
                href="https://www.waze.com/he/livemap?zoom=17&lat=32.71753&lon=35.12608"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground text-xl font-bold py-4 px-8 rounded-md border-2 border-primary hover:bg-primary/90"
              >
                {isHe ? 'נווט באמצעות Waze' : 'Navigate with Waze'}
              </a>
            </div>
          </section>

          {/* Form */}
          <section className="border-2 border-primary rounded-lg p-8 mb-10">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">
              {isHe ? 'אנחנו כאן בשבילכם' : 'We are here for you'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-lg font-bold mb-2">{isHe ? 'שם *' : 'Name *'}</label>
                <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} required />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-lg font-bold mb-2">{isHe ? 'דואר אלקטרוני' : 'Email'}</label>
                  <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} dir="ltr" />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2">{isHe ? 'טלפון' : 'Phone'}</label>
                  <input type="tel" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={30} dir="ltr" />
                </div>
              </div>
              <div>
                <label className="block text-lg font-bold mb-2">{isHe ? 'הודעה *' : 'Message *'}</label>
                <textarea className={inputClass} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={2000} required />
              </div>
              <label className="flex items-center gap-3 text-lg cursor-pointer">
                <input type="checkbox" className="w-5 h-5" checked={form.wants_email_updates} onChange={(e) => setForm({ ...form, wants_email_updates: e.target.checked })} />
                {isHe ? 'מאשר/ת קבלת הודעות למייל' : 'I agree to receive email updates'}
              </label>
              <label className="flex items-center gap-3 text-lg cursor-pointer">
                <input type="checkbox" className="w-5 h-5" checked={form.wants_to_volunteer} onChange={(e) => setForm({ ...form, wants_to_volunteer: e.target.checked })} />
                {isHe ? 'מעוניין/ת להתנדב בשלהב"ת' : 'I am interested in volunteering at Shalhevet'}
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground text-xl font-bold py-4 px-8 rounded-md border-2 border-primary hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? (isHe ? 'שולח...' : 'Sending...') : (isHe ? 'שליחה' : 'Send')}
              </button>
            </form>
          </section>

          {/* Staff list */}
          <section className="border-2 border-border rounded-lg overflow-hidden">
            <h2 className="text-2xl font-bold bg-primary text-primary-foreground px-6 py-3">
              {isHe ? 'בעלי תפקידים בעמותה' : 'Association Staff'}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-lg">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold">{isHe ? 'תפקיד' : 'Role'}</th>
                    <th className="px-4 py-3 text-right font-bold">{isHe ? 'שם' : 'Name'}</th>
                    <th className="px-4 py-3 text-right font-bold">{isHe ? 'טלפון' : 'Phone'}</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map(([role, name, phone], i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/40">
                      <td className="px-4 py-3 font-semibold">{role}</td>
                      <td className="px-4 py-3">{name}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="text-primary hover:underline" dir="ltr">{phone}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
