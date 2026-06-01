import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminActivities } from '@/components/admin/AdminActivities';
import { AdminRegistrations } from '@/components/admin/AdminRegistrations';
import { AdminManageAdmins } from '@/components/admin/AdminManageAdmins';
import { AdminAnnouncements } from '@/components/admin/AdminAnnouncements';
import { AdminContactMessages } from '@/components/admin/AdminContactMessages';
import { toast } from 'sonner';

const Admin = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isAdmin, loading, adminExists, claimFirstAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/auth');
  }, [authLoading, isAuthenticated, navigate]);

  const onClaim = async () => {
    const { success, error } = await claimFirstAdmin();
    if (success) toast.success('הוגדרת כמנהל המערכת');
    else toast.error(error?.message ?? 'מנהל כבר קיים במערכת');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 p-10"><Skeleton className="h-96 w-full" /></main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-10">
          <div className="max-w-xl text-center space-y-6 p-10 rounded-2xl border bg-card">
            <h1 className="text-3xl font-bold">אין לך הרשאת מנהל</h1>
            {adminExists === false ? (
              <>
                <p className="text-lg text-muted-foreground">
                  עדיין אין מנהל במערכת. תוכל להפוך למנהל הראשון בלחיצה על הכפתור.
                </p>
                <Button size="lg" onClick={onClaim}>הפוך אותי למנהל</Button>
              </>
            ) : (
              <p className="text-lg text-muted-foreground">פנה למנהל המערכת לקבלת גישה.</p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-8" dir="rtl">
        <div className="container mx-auto max-w-[1400px]">
          <h1 className="text-4xl font-bold mb-6">דשבורד ניהול</h1>
          <Tabs value={tab} onValueChange={setTab} dir="rtl">
            <TabsList className="grid grid-cols-6 w-full max-w-4xl mb-6">
              <TabsTrigger value="overview">סקירה</TabsTrigger>
              <TabsTrigger value="activities">פעילויות</TabsTrigger>
              <TabsTrigger value="registrations">הרשמות</TabsTrigger>
              <TabsTrigger value="admins">מנהלים</TabsTrigger>
              <TabsTrigger value="announcements">הודעות</TabsTrigger>
              <TabsTrigger value="contact">צור קשר</TabsTrigger>
            </TabsList>
            <TabsContent value="overview"><AdminOverview /></TabsContent>
            <TabsContent value="activities"><AdminActivities /></TabsContent>
            <TabsContent value="registrations"><AdminRegistrations /></TabsContent>
            <TabsContent value="admins"><AdminManageAdmins /></TabsContent>
            <TabsContent value="announcements"><AdminAnnouncements /></TabsContent>
            <TabsContent value="contact"><AdminContactMessages /></TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
