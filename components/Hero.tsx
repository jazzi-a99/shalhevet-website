import { Link } from 'react-router-dom';
import heroImage from '@/assets/home-hero-flower.jpg';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt={t.brandName}
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover object-left"
      />
      {/* soft cream overlay on right side (where text sits in RTL) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(270deg, hsl(45 80% 92% / 0.95) 0%, hsl(45 80% 92% / 0.75) 35%, hsl(45 80% 92% / 0.15) 70%, transparent 100%)',
        }}
      />
      <div className="relative z-10 w-full container mx-auto px-6">
        <div className="max-w-2xl text-right ms-auto">
          <h1 className="text-foreground mb-6 leading-tight">{t.heroTitle}</h1>
          <p className="text-foreground/85 mb-10">{t.heroSubtitle}</p>
          <Link
            to="/activity-center"
            className="inline-block btn-cta btn-blue text-xl"
          >
            {t.homeHeroPrimaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
