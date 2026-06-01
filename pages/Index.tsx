import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SecondarySection from '@/components/SecondarySection';
import UpcomingEventsHomeSection from '@/components/home/UpcomingEventsHomeSection';
import NewsSection from '@/components/home/NewsSection';
import DonationsSection from '@/components/home/DonationsSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <SecondarySection />
        <UpcomingEventsHomeSection />
        <NewsSection />
        <DonationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
