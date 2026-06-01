import { useLanguage } from '@/contexts/LanguageContext';

const ContactSection = () => {
  const { t } = useLanguage();
  return (
    <section className="bg-background section-padding border-t-2 border-border">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-primary text-center mb-10 border-b-4 border-primary/30 pb-3">
          {t.homeContactTitle}
        </h2>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-5 text-xl">
            <p className="text-foreground/90">📍 {t.homeContactAddress}</p>
            <p>
              <a
                href={`tel:${t.homeContactPhone.replace(/-/g, '')}`}
                className="text-primary font-semibold hover:underline text-2xl"
              >
                ☎ {t.homeContactPhone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${t.homeContactEmail}`}
                className="text-primary font-semibold hover:underline"
              >
                ✉ {t.homeContactEmail}
              </a>
            </p>
            <p>
              <a
                href="https://www.facebook.com/ShalhevetKTV"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                {t.homeContactFacebook}
              </a>
            </p>
          </div>
          <div className="rounded-lg overflow-hidden border-2 border-border h-[300px]">
            <iframe
              title="Shalhevet Tivon Map"
              src="https://www.google.com/maps?q=סימטת+הלבנה+2+קריית+טבעון&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              className="border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
