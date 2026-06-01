import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const NewsSection = () => {
  const { t } = useLanguage();
  const cards = [
    { num: '01', title: t.homeNewsCardTitle, cta: t.homeNewsCardCta, to: '/activity-center' },
    { num: '02', title: t.homeNewsCard2Title, cta: t.homeNewsCard2Cta, to: '/activity-center' },
  ];
  return (
    <section className="bg-secondary/60 section-padding">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-primary text-center mb-10 border-b-4 border-primary/30 pb-3">
          {t.homeNewsTitle}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((c) => (
            <article
              key={c.num}
              className="bg-card border-2 border-border rounded-lg p-8 flex gap-6 items-start hover:border-primary transition-colors"
            >
              <div className="text-6xl font-bold text-primary/40 tabular-nums leading-none">
                {c.num}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-foreground mb-4">{c.title}</h3>
                <Link to={c.to} className="text-xl font-semibold text-primary hover:underline">
                  {c.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
