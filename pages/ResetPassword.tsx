import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import logo from '@/assets/logo.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  useEffect(() => {
    // Parse error from URL hash (e.g. #error=access_denied&error_code=otp_expired&error_description=...)
    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
    const params = new URLSearchParams(hash);
    const errCode = params.get('error_code') || params.get('error');
    const errDesc = params.get('error_description');
    if (errCode) {
      if (errCode === 'otp_expired' || errDesc?.toLowerCase().includes('expired')) {
        setLinkError('פג תוקף הקישור או שכבר נעשה בו שימוש. כל קישור איפוס תקף לשעה אחת בלבד וניתן ללחוץ עליו פעם אחת. בקשי קישור חדש למטה.');
      } else {
        setLinkError(errDesc ? decodeURIComponent(errDesc.replace(/\+/g, ' ')) : 'הקישור אינו תקף.');
      }
      return;
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setHasRecoverySession(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setHasRecoverySession(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleResend = async () => {
    setResendMsg('');
    if (!resendEmail.trim()) {
      setResendMsg('יש להזין כתובת מייל');
      return;
    }
    setResending(true);
    const { error: resErr } = await supabase.auth.resetPasswordForEmail(resendEmail.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResending(false);
    if (resErr) setResendMsg(resErr.message);
    else setResendMsg('שלחנו קישור חדש לאיפוס סיסמה. בדקי את תיבת המייל (וגם בספאם).');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password.length < 6) {
      setError('הסיסמה חייבת להיות באורך 6 תווים לפחות');
      return;
    }
    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }
    setIsLoading(true);
    const { error: updErr } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (updErr) {
      setError(updErr.message);
    } else {
      setSuccess('הסיסמה עודכנה בהצלחה. מעבירים אותך לעמוד הבית...');
      setTimeout(() => navigate('/'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <img src={logo} alt="לוגו" className="h-24 w-24 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground">איפוס סיסמה</h1>
            <p className="text-xl text-muted-foreground mt-2">בחרי סיסמה חדשה לחשבון שלך</p>
          </div>

          {!hasRecoverySession ? (
            <div className="space-y-4">
              <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-6 text-center">
                <p className="text-lg font-medium">
                  {linkError ?? 'הקישור לאיפוס סיסמה אינו תקף או שפג תוקפו.'}
                </p>
              </div>

              <div className="bg-card border-2 border-border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-bold text-center">בקשת קישור חדש</h2>
                <p className="text-base text-muted-foreground text-center">
                  הזיני את כתובת המייל שלך ונשלח קישור איפוס חדש. שימי לב — לקישור יש תוקף של שעה אחת בלבד וניתן ללחוץ עליו פעם אחת.
                </p>
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="input-accessible"
                  placeholder="הזיני כתובת מייל"
                  autoComplete="email"
                />
                {resendMsg && (
                  <p className="text-base font-medium text-center text-foreground">{resendMsg}</p>
                )}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full btn-cta btn-blue disabled:opacity-50"
                >
                  {resending ? 'שולח...' : 'שלח קישור חדש'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/auth')}
                  className="w-full text-primary text-lg hover:underline"
                >
                  חזרה להתחברות
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-xl font-medium text-foreground mb-3">
                  סיסמה חדשה
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-accessible"
                  placeholder="הזיני סיסמה חדשה"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-xl font-medium text-foreground mb-3">
                  אישור סיסמה
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-accessible"
                  placeholder="הזיני שוב את הסיסמה"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-4">
                  <p className="text-destructive text-lg font-medium text-center">{error}</p>
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
                {isLoading ? 'מעדכן...' : 'עדכן סיסמה'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
