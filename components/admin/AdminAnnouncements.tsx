import { useEffect, useState } from 'react';
import { adminApi, type AnnouncementInsert } from '@/lib/adminApi';
import type { Tables } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useConfirm } from '@/components/ui/confirm-dialog';

type Act = Tables<'activities'>;
type AnnouncementRow = Tables<'announcements'> & { activity?: { title_he: string; title_en: string | null } | null };

const emptyDraft = (): Partial<AnnouncementInsert> => ({
  title_he: '', message_he: '', title_en: '', message_en: '', activity_id: null,
});

export const AdminAnnouncements = () => {
  const [rows, setRows] = useState<AnnouncementRow[] | null>(null);
  const [activities, setActivities] = useState<Act[]>([]);
  const [draft, setDraft] = useState<Partial<AnnouncementInsert>>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<AnnouncementInsert>>(emptyDraft());
  const confirm = useConfirm();

  const refresh = async () => {
    const [a, acts] = await Promise.all([adminApi.listAnnouncements(), adminApi.listActivities()]);
    setRows(a.data as AnnouncementRow[]);
    setActivities((acts.data as Act[]) ?? []);
  };
  useEffect(() => { refresh(); }, []);

  const create = async () => {
    if (!draft.title_he?.trim() || !draft.message_he?.trim()) {
      toast.error('כותרת והודעה בעברית הן חובה');
      return;
    }
    const { error } = await adminApi.createAnnouncement(draft as AnnouncementInsert);
    if (error) toast.error(error.message);
    else {
      toast.success('פורסם');
      setDraft(emptyDraft());
      refresh();
    }
  };

  const startEdit = (row: AnnouncementRow) => {
    setEditingId(row.id);
    setEditDraft({
      title_he: row.title_he,
      message_he: row.message_he,
      title_en: row.title_en ?? '',
      message_en: row.message_en ?? '',
      activity_id: row.activity_id,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(emptyDraft());
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editDraft.title_he?.trim() || !editDraft.message_he?.trim()) {
      toast.error('כותרת והודעה בעברית הן חובה');
      return;
    }
    const { error } = await adminApi.updateAnnouncement(editingId, {
      title_he: editDraft.title_he,
      message_he: editDraft.message_he,
      title_en: editDraft.title_en ?? null,
      message_en: editDraft.message_en ?? null,
      activity_id: editDraft.activity_id ?? null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success('עודכן');
      cancelEdit();
      refresh();
    }
  };

  const remove = async (id: string) => {
    const ok = await confirm({
      title: 'מחיקת הודעה',
      description: 'האם את/ה בטוח/ה שברצונך למחוק את ההודעה? לא ניתן לשחזר.',
      confirmText: 'מחק',
    });
    if (!ok) return;
    const { error } = await adminApi.deleteAnnouncement(id);
    if (error) toast.error(error.message);
    else { toast.success('נמחקה'); refresh(); }
  };

  if (rows === null) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">הודעות והכרזות</h2>

      {/* Create new */}
      <div className="rounded-lg border p-4 space-y-3 bg-card">
        <h3 className="text-xl font-semibold">הודעה חדשה</h3>
        <div>
          <Label>שייך לפעילות (אופציונלי — ריק = הודעה לכולם)</Label>
          <Select
            value={draft.activity_id ?? '__all__'}
            onValueChange={(v) => setDraft({ ...draft, activity_id: v === '__all__' ? null : v })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">כל המשתמשים</SelectItem>
              {activities.map(a => <SelectItem key={a.id} value={a.id}>{a.title_he}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>כותרת (עברית) *</Label><Input value={draft.title_he ?? ''} onChange={e => setDraft({ ...draft, title_he: e.target.value })} /></div>
          <div><Label>Title (English)</Label><Input dir="ltr" value={draft.title_en ?? ''} onChange={e => setDraft({ ...draft, title_en: e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>הודעה (עברית) *</Label><Textarea value={draft.message_he ?? ''} onChange={e => setDraft({ ...draft, message_he: e.target.value })} /></div>
          <div><Label>Message (English)</Label><Textarea dir="ltr" value={draft.message_en ?? ''} onChange={e => setDraft({ ...draft, message_en: e.target.value })} /></div>
        </div>
        <Button onClick={create}>פרסם הודעה</Button>
      </div>

      {/* Existing */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">הודעות קיימות ({rows.length})</h3>
        {rows.length === 0 && <p className="text-muted-foreground">אין הודעות.</p>}
        {rows.map((r) => {
          const isEditing = editingId === r.id;
          return (
            <div key={r.id} className="rounded-lg border p-4 bg-card space-y-3">
              {isEditing ? (
                <>
                  <div>
                    <Label>שייך לפעילות (ריק = לכולם)</Label>
                    <Select
                      value={editDraft.activity_id ?? '__all__'}
                      onValueChange={(v) => setEditDraft({ ...editDraft, activity_id: v === '__all__' ? null : v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">כל המשתמשים</SelectItem>
                        {activities.map(a => <SelectItem key={a.id} value={a.id}>{a.title_he}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>כותרת (עברית) *</Label><Input value={editDraft.title_he ?? ''} onChange={e => setEditDraft({ ...editDraft, title_he: e.target.value })} /></div>
                    <div><Label>Title (English)</Label><Input dir="ltr" value={editDraft.title_en ?? ''} onChange={e => setEditDraft({ ...editDraft, title_en: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>הודעה (עברית) *</Label><Textarea value={editDraft.message_he ?? ''} onChange={e => setEditDraft({ ...editDraft, message_he: e.target.value })} /></div>
                    <div><Label>Message (English)</Label><Textarea dir="ltr" value={editDraft.message_en ?? ''} onChange={e => setEditDraft({ ...editDraft, message_en: e.target.value })} /></div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEdit}>שמור שינויים</Button>
                    <Button variant="outline" onClick={cancelEdit}>ביטול</Button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-lg">{r.title_he}</div>
                    {r.title_en && <div className="text-base text-muted-foreground" dir="ltr">{r.title_en}</div>}
                    <div className="text-foreground mt-2 whitespace-pre-line">{r.message_he}</div>
                    {r.message_en && <div className="text-muted-foreground mt-1 whitespace-pre-line" dir="ltr">{r.message_en}</div>}
                    <div className="text-sm text-muted-foreground mt-3">
                      {r.activity_id ? `📌 ${r.activity?.title_he ?? ''}` : '🌐 כל המשתמשים'} ·{' '}
                      {new Date(r.created_at).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(r)}>ערוך</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(r.id)}>מחק</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
