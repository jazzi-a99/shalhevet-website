import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import logo from '@/assets/logo.png';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [showCreateAccountCta, setShowCreateAccountCta] = useState(false);
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowCreateAccountCta(false);
    setSuccess('');
    setIsLoading(true);

    if (!email.trim()) {
      setError(t.enterEmail || 'Please enter your email');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t.passwordMinSix || 'Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (isSignUp) {
      const result = await signup(email, password, fullName || undefined);
      if (result.success) {
        setSuccess(t.signupSuccess || 'Account created! Please check your email to verify.');
        setEmail('');
        setPassword('');
        setFullName('');
      } else {
        setError(result.error || t.loginError);
      }
    } else {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        const errMsg = (result.error || '').toLowerCase();
        if (errMsg.includes('invalid login credentials') || errMsg.includes('invalid_credentials')) {
          setError(t.noUserFound);
          setShowCreateAccountCta(true);
        } else {
          setError(result.error || t.loginError);
        }
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <img src={logo} alt={t.brandName} className="h-24 w-24 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground">
              {isSignUp ? (t.signupTitle || 'Create Account') : t.loginTitle}
            </h1>
            <p className="text-xl text-muted-foreground mt-2">{t.welcomeToSite}</p>
            <Link
              to="/whats-new?category=login"
              className="mt-6 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-xl font-bold bg-[hsl(var(--cta-pink))] text-[hsl(var(--cta-pink-foreground))] border-4 border-[hsl(var(--foreground))] hover:brightness-110 transition-all shadow-md"
            >
              <span aria-hidden="true" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--cta-pink-foreground))] text-[hsl(var(--cta-pink))] font-extrabold text-lg">?</span>
              {t.aboutThisPage}
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-xl font-medium text-foreground mb-3">
                  {t.fullName || 'Full Name'}
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-accessible"
                  placeholder={t.enterFullName || 'Enter your full name'}
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xl font-medium text-foreground mb-3">
                {t.email || 'Email'}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-accessible"
                placeholder={t.enterEmail || 'Enter your email'}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xl font-medium text-foreground mb-3">
                {t.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-accessible"
                placeholder={t.enterPassword}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-4 space-y-3">
                <p className="text-destructive text-lg font-medium text-center">{error}</p>
                {showCreateAccountCta && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setError('');
                      setShowCreateAccountCta(false);
                      setPassword('');
                    }}
                    className="w-full btn-cta btn-blue"
                  >
                    {t.createAccountNow}
                  </button>
                )}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-4">
                <p className="text-green-600 text-lg font-medium text-center">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-cta btn-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? t.loggingIn 
                : (isSignUp ? (t.signupButton || 'Sign Up') : t.loginButton)}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="text-primary text-lg hover:underline"
            >
              {isSignUp 
                ? (t.alreadyHaveAccount || 'Already have an account? Login') 
                : (t.noAccount || "Don't have an account? Sign Up")}
            </button>
          </div>

          {!isSignUp && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={async () => {
                  setError('');
                  setSuccess('');
                  if (!email.trim()) {
                    setError('יש להזין כתובת מייל ולאחר מכן ללחוץ על "שכחתי סיסמה"');
                    return;
                  }
                  setIsLoading(true);
                  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                    redirectTo: `${window.location.origin}/reset-password`,
                  });
                  setIsLoading(false);
                  if (resetError) {
                    setError(resetError.message);
                  } else {
                    setSuccess('שלחנו קישור לאיפוס הסיסמה לכתובת המייל שלך. בדקי גם בתיקיית הספאם.');
                  }
                }}
                className="text-primary text-lg hover:underline font-medium"
              >
                שכחתי סיסמה
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
