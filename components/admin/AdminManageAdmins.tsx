import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirm } from '@/components/ui/confirm-dialog';

interface AdminRow {
  user_id: string;
  email: string | null;
  full_name: string | null;
  granted_at: string;
  is_super: boolean;
}

export const AdminManageAdmins = () => {
  const { user } = useAuth();
  const confirmDialog = useConfirm();
  const [admins, setAdmins] = useState<AdminRow[] | null>(null);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const { data, error } = await supabase.rpc('list_admins');
    if (error) toast.error(error.message);
    else setAdmins((data ?? []) as AdminRow[]);
  };
  useEffect(() => { refresh(); }, []);

  const grant = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setBusy(true);
    const { data, error } = await supabase.rpc('set_admin_by_email', { _email: value });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    const res = data as { success: boolean; error?: string } | null;
    if (res?.success) {
      toast.success('המשתמש הוגדר כמנהל');
      setEmail('');
      refresh();
    } else if (res?.error === 'user_not_found') {
      toast.error('לא נמצא משתמש עם המייל הזה. ודא שהוא נרשם לאתר.');
    } else {
      toast.error('לא ניתן היה להוסיף את המנהל');
    }
  };

  const revoke = async (targetEmail: string | null, targetUserId: string) => {
    if (targetUserId === user?.id) {
      toast.error('לא ניתן להסיר את עצמך מתפקיד מנהל');
      return;
    }
    if (!targetEmail) { toast.error('אין מייל למשתמש זה'); return; }
    const ok = await confirmDialog({
      title: 'הסרת מנהל',
      description: `האם את/ה בטוח/ה שברצונך להסיר את ${targetEmail} מתפקיד מנהל?`,
      confirmText: 'הסר',
    });
    if (!ok) return;
    const { data, error } = await supabase.rpc('revoke_admin_by_email', { _email: targetEmail });
    if (error) { toast.error(error.message); return; }
    const res = data as { success: boolean; error?: string } | null;
    if (res?.success) {
      toast.success('הוסר תפקיד מנהל');
      refresh();
    } else {
      toast.error(res?.error ?? 'שגיאה בהסרה');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">הוספת מנהל חדש</h2>
        <form onSubmit={grant} className="flex flex-col md:flex-row items-end gap-3 max-w-2xl">
          <div className="flex-1 w-full">
            <Label htmlFor="admin-email" className="text-base">כתובת מייל של המשתמש</Label>
            <Input
              id="admin-email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="text-base h-12"
              required
            />
          </div>
          <Button type="submit" size="lg" disabled={busy}>
            {busy ? 'מוסיף...' : 'הפוך למנהל'}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-2">
          המשתמש חייב להיות רשום באתר. אם אינו נמצא — בקש ממנו להירשם תחילה.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          מנהלים נוכחיים {admins ? `(${admins.length})` : ''}
        </h2>
        {admins === null ? (
          <Skeleton className="h-48 w-full" />
        ) : admins.length === 0 ? (
          <p className="text-muted-foreground">אין מנהלים רשומים.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-right text-base">
              <thead className="bg-secondary">
                <tr>
                  <th className="p-3">שם מלא</th>
                  <th className="p-3">מייל</th>
                  <th className="p-3">תאריך הוספה</th>
                  <th className="p-3">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => {
                  const isMe = a.user_id === user?.id;
                  const meIsSuper = admins.find(x => x.user_id === user?.id)?.is_super;
                  return (
                  <tr key={a.user_id} className="border-t">
                    <td className="p-3">
                      {a.full_name ?? '—'}
                      {a.is_super && <span className="mr-2 text-xs font-bold text-primary">(מנהל ראשי)</span>}
                    </td>
                    <td className="p-3" dir="ltr">{a.email ?? '—'}</td>
                    <td className="p-3">{new Date(a.granted_at).toLocaleDateString('he-IL')}</td>
                    <td className="p-3">
                      {isMe ? (
                        <span className="text-sm text-muted-foreground">{a.is_super ? 'אתה (מנהל ראשי)' : 'אתה'}</span>
                      ) : a.is_super ? (
                        <span className="text-sm text-muted-foreground">לא ניתן להסרה</span>
                      ) : meIsSuper ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => revoke(a.email, a.user_id)}
                        >
                          הסר תפקיד מנהל
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">רק המנהל הראשי יכול להסיר</span>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
