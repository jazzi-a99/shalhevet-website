import { useLanguage } from '@/contexts/LanguageContext';

const DonationsSection = () => {
  const { t } = useLanguage();
  return (
    <section className="bg-accent section-padding">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-foreground mb-6">{t.homeDonationsTitle}</h2>
        <p className="text-foreground/85 mb-10 leading-loose">{t.homeDonationsBody}</p>
        <a
          href="mailto:shalhevet01@gmail.com"
          className="btn-cta btn-pink inline-block"
        >
          {t.homeDonationsCta}
        </a>
      </div>
    </section>
  );
};

export default DonationsSection;
