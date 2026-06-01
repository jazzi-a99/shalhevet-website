import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutSection from '@/components/home/AboutSection';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
