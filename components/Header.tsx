import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import LanguageToggle from '@/components/LanguageToggle';
import logo from '@/assets/logo.png';

const Header = () => {
  const { user, profile, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const navItems = [
    { label: t.home, path: '/' },
    { label: t.about, path: '/about' },
    { label: t.multiCenter, path: '/services' },
    { label: t.activities, path: '/activity-center' },
    { label: t.sparks, path: '/sparks' },
    { label: t.discounts, path: '/discounts' },
    { label: t.donations, path: '/donations' },
    { label: t.contact, path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-6 py-3">
        {/* Top row: auth area on the left, logo on the right (RTL) */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 order-first">
            {isAuthenticated ? (
              <>
                <span className="text-lg font-medium text-foreground hidden sm:inline">
                  {t.welcome} {profile?.full_name || user?.email?.split('@')[0]}
                </span>
                <Link
                  to="/calendar"
                  className="text-primary font-semibold text-lg hover:underline"
                >
                  {t.myCalendar}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-lg font-bold px-3 py-1 rounded-md bg-amber-100 border-2 border-amber-400 text-amber-900 hover:bg-amber-200"
                  >
                    ניהול
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="nav-link text-muted-foreground hover:text-foreground"
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-lg font-bold bg-primary text-primary-foreground border-2 border-primary hover:bg-primary/90 transition-colors shadow-sm"
              >
                {t.login}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Link to="/" className="flex items-center gap-3">
              <span className="text-2xl font-bold text-foreground hidden md:inline">{t.brandName}</span>
              <img src={logo} alt={t.brandName} className="h-16 w-16" />
            </Link>
          </div>
        </div>

        {/* Bottom row: single-line navigation */}
        <nav className="mt-3 border-t border-border pt-3">
          <div className="flex items-center justify-center gap-1 flex-nowrap overflow-x-auto whitespace-nowrap">
            {navItems.map((item, idx) => (
              <Link key={`${item.label}-${idx}`} to={item.path} className="nav-link">
                {item.label}
              </Link>
            ))}
            <Link
              to="/whats-new"
              className="ml-2 inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold bg-amber-100 border-2 border-amber-500 text-amber-900 hover:bg-amber-200 shadow-sm"
            >
              {t.whatsNew}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
