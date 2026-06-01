import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Profile = () => {
  const { user, profile, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-2xl text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-6 py-16">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
            {t.myProfile || 'My Profile'}
          </h1>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-lg font-medium text-muted-foreground mb-2">
                {t.email || 'Email'}
              </label>
              <p className="text-xl text-foreground bg-muted/50 rounded-lg p-4">
                {user?.email || '-'}
              </p>
            </div>

            <div>
              <label className="block text-lg font-medium text-muted-foreground mb-2">
                {t.fullName || 'Full Name'}
              </label>
              <p className="text-xl text-foreground bg-muted/50 rounded-lg p-4">
                {profile?.full_name || '-'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
