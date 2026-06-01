import { useEffect, useState } from 'react';
import { adminApi, type ActivityInsert } from '@/lib/adminApi';
import type { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useConfirm } from '@/components/ui/confirm-dialog';

type Cat = Tables<'activity_categories'>;
type Act = Tables<'activities'>;

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

// Convert ISO yyyy-mm-dd → dd/mm/yy
const isoToDisplay = (iso?: string | null): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return '';
  return `${d}/${m}/${y.slice(-2)}`;
};

// Convert dd/mm/yy or dd/mm/yyyy → ISO yyyy-mm-dd
const displayToIso = (raw: string): string | null => {
  const cleaned = raw.replace(/[^\d/]/g, '');
  const parts = cleaned.split('/');
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (!d || !m || !y) return null;
  if (y.length === 2) y = '20' + y;
  if (y.length !== 4 || d.length > 2 || m.length > 2) return null;
  d = d.padStart(2, '0');
  m = m.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Text input that accepts dd/mm/yy and stores ISO
const DateDmyInput = ({ value, onChange }: { value: string | null | undefined; onChange: (iso: string | null) => void }) => {
  const [local, setLocal] = useState(isoToDisplay(value));
  useEffect(() => { setLocal(isoToDisplay(value)); }, [value]);
  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder="dd/mm/yy"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        const iso = displayToIso(local);
        if (iso) { onChange(iso); setLocal(isoToDisplay(iso)); }
        else if (local === '') { onChange(null); }
        else { setLocal(isoToDisplay(value)); }
      }}
    />
  );
};

// 24-hour time input that accepts "1730" or "17:30" and outputs "HH:MM"
const Time24Input = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const display = (value ?? '').slice(0, 5);
  const [local, setLocal] = useState(display);
  useEffect(() => { setLocal(display); }, [display]);

  const normalize = (raw: string): string | null => {
    const cleaned = raw.replace(/[^\d:]/g, '');
    let h = '', m = '';
    if (cleaned.includes(':')) {
      const [hh, mm = ''] = cleaned.split(':');
      h = hh; m = mm;
    } else if (cleaned.length === 4) {
      h = cleaned.slice(0, 2); m = cleaned.slice(2);
    } else if (cleaned.length === 3) {
      h = cleaned.slice(0, 1); m = cleaned.slice(1);
    } else if (cleaned.length <= 2) {
      h = cleaned; m = '00';
    } else return null;
    const hi = Number(h), mi = Number(m);
    if (isNaN(hi) || isNaN(mi) || hi < 0 || hi > 23 || mi < 0 || mi > 59) return null;
    return `${String(hi).padStart(2, '0')}:${String(mi).padStart(2, '0')}`;
  };

  return (
    <Input
      dir="ltr"
      type="text"
      inputMode="numeric"
      placeholder="HH:MM"
      maxLength={5}
      value={local}
      onChange={e => setLocal(e.target.value)}
      onBlur={() => {
        const n = normalize(local);
        if (n) { setLocal(n); onChange(n); }
        else { setLocal(display); }
      }}
    />
  );
};

const empty: Partial<ActivityInsert> = {
  kind: 'recurring',
  title_he: '',
  title_en: '',
  description_he: '',
  description_en: '',
  teacher_he: '',
  teacher_en: '',
  location_he: '',
  location_en: '',
  day_of_week: 0,
  start_time: '10:00',
  end_time: '11:00',
  capacity: null,
  price_cents: 0,
  currency: 'ILS',
  is_active: true,
  is_cancelled: false,
  visual_category: 'default',
  simple_category: 'social',
};

export const AdminActivities = () => {
  const [activities, setActivities] = useState<Act[] | null>(null);
  const [categories, setCategories] = useState<Cat[]>([]);
  const [editing, setEditing] = useState<Partial<ActivityInsert> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const confirm = useConfirm();

  const refresh = async () => {
    const [a, c] = await Promise.all([adminApi.listActivities(), adminApi.listCategories()]);
    setActivities(a.data as Act[]);
    setCategories(c.data);
  };

  useEffect(() => { refresh(); }, []);

  const openNew = () => {
    setEditingId(null);
    setEditing({ ...empty, category_id: categories[0]?.id });
  };

  const openEdit = (a: Act & { category?: unknown }) => {
    const { category: _category, ...activity } = a;
    setEditingId(a.id);
    setEditing({ ...activity });
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title_he?.trim()) {
      toast.error('שם הפעילות בעברית הוא שדה חובה');
      return;
    }
    if (!editing.category_id) {
      toast.error('יש לבחור קטגוריה');
      return;
    }
    const kind = editing.kind ?? 'recurring';
    if (kind === 'one_time') {
      if (!editing.event_date) {
        toast.error('לפעילות חד-פעמית יש להזין תאריך');
        return;
      }
      if (!editing.event_start_time) {
        toast.error('לפעילות חד-פעמית יש להזין שעת התחלה');
        return;
      }
      if (editing.event_end_time && editing.event_start_time >= editing.event_end_time) {
        toast.error('שעת ההתחלה חייבת להיות מוקדמת משעת הסיום');
        return;
      }
    } else {
      if (editing.day_of_week === null || editing.day_of_week === undefined) {
        toast.error('לפעילות שבועית יש לבחור יום בשבוע');
        return;
      }
      if (!editing.start_time || !editing.end_time) {
        toast.error('לפעילות שבועית יש להזין שעת התחלה וסיום');
        return;
      }
      if (editing.start_time >= editing.end_time) {
        toast.error('שעת ההתחלה חייבת להיות מוקדמת משעת הסיום');
        return;
      }
    }
    const { category: _category, ...editableFields } = editing as Partial<ActivityInsert> & { category?: unknown };
    const payload: ActivityInsert = {
      ...empty,
      ...editableFields,
      title_he: editing.title_he!,
      category_id: editing.category_id!,
      kind: editing.kind ?? 'recurring',
    } as ActivityInsert;

    // Clean fields based on kind
    if (payload.kind === 'recurring') {
      payload.event_date = null;
      payload.event_start_time = null;
      payload.event_end_time = null;
    } else {
      payload.day_of_week = null;
      payload.start_time = null;
      payload.end_time = null;
    }

    const res = editingId
      ? await adminApi.updateActivity(editingId, payload)
      : await adminApi.createActivity(payload);
    if (res.error) {
      toast.error('שמירה נכשלה: ' + res.error.message);
    } else {
      toast.success('נשמר בהצלחה');
      setEditing(null);
      refresh();
    }
  };

  const remove = async (id: string) => {
    const ok = await confirm({
      title: 'מחיקת פעילות',
      description: 'האם את/ה בטוח/ה שברצונך למחוק את הפעילות לצמיתות? פעולה זו אינה הפיכה.',
      confirmText: 'מחק',
    });
    if (!ok) return;
    const { error } = await adminApi.deleteActivity(id);
    if (error) toast.error(error.message);
    else { toast.success('נמחק'); refresh(); }
  };

  const toggleActive = async (a: Act) => {
    const newActive = !a.is_active;
    // כשהפעילות מושבתת -> מבוטלת, וכשמופעלת -> לא מבוטלת
    await adminApi.setActivityActive(a.id, newActive);
    await adminApi.setActivityCancelled(a.id, !newActive);
    refresh();
  };

  if (activities === null) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">פעילויות ({activities.length})</h2>
        <Button onClick={openNew}>+ פעילות חדשה</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-right text-base">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3">שם</th>
              <th className="p-3">סוג</th>
              <th className="p-3">קטגוריה</th>
              <th className="p-3">מתי</th>
              <th className="p-3">סטטוס</th>
              <th className="p-3">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a: any) => (
              <tr key={a.id} className="border-t">
                <td className="p-3 font-semibold">{a.title_he}</td>
                <td className="p-3">{a.kind === 'recurring' ? 'שבועית' : 'חד-פעמית'}</td>
                <td className="p-3">{a.category?.name_he ?? '—'}</td>
                <td className="p-3">
                  {a.kind === 'recurring'
                    ? `יום ${DAYS_HE[a.day_of_week ?? 0]} ${a.start_time?.slice(0, 5) ?? ''}–${a.end_time?.slice(0, 5) ?? ''}`
                    : `${isoToDisplay(a.event_date)} ${a.event_start_time?.slice(0, 5) ?? ''}${a.event_end_time ? '–' + a.event_end_time.slice(0, 5) : ''}`}
                </td>
                <td className="p-3">
                  {!a.is_active && <span className="text-muted-foreground">לא פעילה</span>}
                  {a.is_cancelled && <span className="text-destructive ml-2">מבוטלת</span>}
                  {a.is_active && !a.is_cancelled && <span className="text-green-700">פעילה</span>}
                </td>
                <td className="p-3 space-x-2 space-x-reverse">
                  <Button size="sm" variant="outline" onClick={() => openEdit(a)}>ערוך</Button>
                  <Button size="sm" variant="outline" onClick={() => toggleActive(a)}>
                    {a.is_active ? 'השבת' : 'הפעל'}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(a.id)}>מחק</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'עריכת פעילות' : 'פעילות חדשה'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>סוג</Label>
                  <Select
                    value={editing.kind ?? 'recurring'}
                    onValueChange={(v) => setEditing({ ...editing, kind: v as never })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recurring">פעילות שבועית</SelectItem>
                      <SelectItem value="one_time">אירוע חד-פעמי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>קטגוריה</Label>
                  <Select
                    value={editing.category_id ?? ''}
                    onValueChange={(v) => setEditing({ ...editing, category_id: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="בחר קטגוריה" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name_he}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><Label>שם בעברית *</Label><Input value={editing.title_he ?? ''} onChange={e => setEditing({ ...editing, title_he: e.target.value })} /></div>
                <div><Label>שם באנגלית</Label><Input dir="ltr" value={editing.title_en ?? ''} onChange={e => setEditing({ ...editing, title_en: e.target.value })} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><Label>תיאור בעברית</Label><Textarea value={editing.description_he ?? ''} onChange={e => setEditing({ ...editing, description_he: e.target.value })} /></div>
                <div><Label>תיאור באנגלית</Label><Textarea dir="ltr" value={editing.description_en ?? ''} onChange={e => setEditing({ ...editing, description_en: e.target.value })} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><Label>מדריך/מרצה (עברית)</Label><Input value={editing.teacher_he ?? ''} onChange={e => setEditing({ ...editing, teacher_he: e.target.value })} /></div>
                <div><Label>מדריך/מרצה (אנגלית)</Label><Input dir="ltr" value={editing.teacher_en ?? ''} onChange={e => setEditing({ ...editing, teacher_en: e.target.value })} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><Label>מיקום (עברית)</Label><Input value={editing.location_he ?? ''} onChange={e => setEditing({ ...editing, location_he: e.target.value })} /></div>
                <div><Label>מיקום (אנגלית)</Label><Input dir="ltr" value={editing.location_en ?? ''} onChange={e => setEditing({ ...editing, location_en: e.target.value })} /></div>
              </div>

              {editing.kind === 'recurring' ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>יום בשבוע</Label>
                    <Select value={String(editing.day_of_week ?? 0)} onValueChange={v => setEditing({ ...editing, day_of_week: Number(v) })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DAYS_HE.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>שעת התחלה</Label><Time24Input value={editing.start_time ?? ''} onChange={v => setEditing({ ...editing, start_time: v })} /></div>
                  <div><Label>שעת סיום</Label><Time24Input value={editing.end_time ?? ''} onChange={v => setEditing({ ...editing, end_time: v })} /></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>תאריך</Label><DateDmyInput value={editing.event_date} onChange={(iso) => setEditing({ ...editing, event_date: iso ?? '' })} /></div>
                  <div><Label>שעת התחלה</Label><Time24Input value={editing.event_start_time ?? ''} onChange={v => setEditing({ ...editing, event_start_time: v })} /></div>
                  <div><Label>שעת סיום</Label><Time24Input value={editing.event_end_time ?? ''} onChange={v => setEditing({ ...editing, event_end_time: v })} /></div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div><Label>קיבולת (ריק = ללא הגבלה)</Label><Input type="number" value={editing.capacity ?? ''} onChange={e => setEditing({ ...editing, capacity: e.target.value === '' ? null : Number(e.target.value) })} /></div>
                <div><Label>מחיר (ש״ח)</Label><Input type="number" min="0" step="1" value={editing.price_cents != null ? Math.round((editing.price_cents ?? 0) / 100) : 0} onChange={e => setEditing({ ...editing, price_cents: Math.round(Number(e.target.value || 0) * 100) })} /></div>
                <div><Label>קישור לתמונה</Label><Input dir="ltr" value={editing.image_url ?? ''} onChange={e => setEditing({ ...editing, image_url: e.target.value })} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>קטגוריה ויזואלית</Label>
                  <Select value={editing.visual_category ?? 'default'} onValueChange={v => setEditing({ ...editing, visual_category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['art','lecture','trip','reading','fitness','music','default'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>קטגוריה כללית</Label>
                  <Select value={editing.simple_category ?? 'social'} onValueChange={v => setEditing({ ...editing, simple_category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sport">ספורט</SelectItem>
                      <SelectItem value="culture">תרבות</SelectItem>
                      <SelectItem value="social">חברה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>ביטול</Button>
            <Button onClick={save}>שמור</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
