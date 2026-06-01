import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfirm } from '@/components/ui/confirm-dialog';

type ContactMessage = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  wants_email_updates: boolean;
  wants_to_volunteer: boolean;
  is_read: boolean;
  created_at: string;
};

export const AdminContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const confirm = useConfirm();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      toast.error('שגיאה בטעינת ההודעות');
      return;
    }
    setMessages((data || []) as ContactMessage[]);
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (msg: ContactMessage) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: !msg.is_read })
      .eq('id', msg.id);
    if (error) { toast.error('שגיאה בעדכון'); return; }
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m)));
  };

  const remove = async (id: string) => {
    const ok = await confirm({
      title: 'מחיקת הודעה',
      description: 'האם את/ה בטוח/ה שברצונך למחוק את הודעת הפנייה?',
      confirmText: 'מחק',
    });
    if (!ok) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) { toast.error('שגיאה במחיקה'); return; }
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success('ההודעה נמחקה');
  };

  if (loading) return <Skeleton className="h-96 w-full" />;

  const visible = filter === 'unread' ? messages.filter((m) => !m.is_read) : messages;
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold">
          הודעות מהטופס ({messages.length}) — {unreadCount} לא נקראו
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md border-2 font-bold ${filter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
          >הכל</button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-md border-2 font-bold ${filter === 'unread' ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
          >לא נקראו</button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-10 text-center text-lg text-muted-foreground">
          אין הודעות להצגה
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((m) => (
            <div
              key={m.id}
              className={`border-2 rounded-lg p-5 ${m.is_read ? 'border-border bg-card' : 'border-primary bg-primary/5'}`}
            >
              <div className="flex justify-between items-start gap-4 flex-wrap mb-3">
                <div>
                  <div className="text-xl font-bold">{m.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(m.created_at).toLocaleString('he-IL')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleRead(m)} className="px-3 py-2 border-2 border-border rounded-md font-bold hover:bg-muted">
                    {m.is_read ? 'סמן כלא נקרא' : 'סמן כנקרא'}
                  </button>
                  <button onClick={() => remove(m.id)} className="px-3 py-2 border-2 border-destructive text-destructive rounded-md font-bold hover:bg-destructive/10">
                    מחק
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2 mb-3 text-base">
                {m.email && <div><span className="font-bold">דוא"ל: </span><a href={`mailto:${m.email}`} className="text-primary hover:underline" dir="ltr">{m.email}</a></div>}
                {m.phone && <div><span className="font-bold">טלפון: </span><a href={`tel:${m.phone}`} className="text-primary hover:underline" dir="ltr">{m.phone}</a></div>}
              </div>
              <p className="text-lg whitespace-pre-wrap mb-3">{m.message}</p>
              <div className="flex gap-2 flex-wrap text-sm">
                {m.wants_email_updates && <span className="bg-muted px-3 py-1 rounded-full">מאשר/ת מייל</span>}
                {m.wants_to_volunteer && <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">מעוניין/ת להתנדב</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
