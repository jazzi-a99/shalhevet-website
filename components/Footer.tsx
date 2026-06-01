import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-muted border-t border-border py-12">
      <div className="container mx-auto px-6 text-center">
        <p className="text-lg text-muted-foreground mb-4">
          {t.footerText}
        </p>
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} {t.allRightsReserved}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
