import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

type Reg = any;

const formatActivityWhen = (a: any): string => {
  if (!a) return '';
  if (a.kind === 'one_time' && a.event_date) {
    const d = new Date(a.event_date).toLocaleDateString('he-IL');
    return a.event_start_time ? `${d} • ${a.event_start_time.slice(0, 5)}` : d;
  }
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const day = typeof a.day_of_week === 'number' ? days[a.day_of_week] : '';
  const t = a.start_time ? a.start_time.slice(0, 5) : '';
  return [day && `יום ${day}`, t].filter(Boolean).join(' • ');
};

const attendanceLabel: Record<string, string> = {
  registered: 'נרשם',
  attended: 'נכח',
  no_show: 'נעדר',
  cancelled: 'בוטל',
};
const paymentLabel: Record<string, string> = {
  none: 'ללא',
  pending: 'ממתין',
  paid: 'שולם',
  refunded: 'הוחזר',
};

export const AdminRegistrations = () => {
  const [rows, setRows] = useState<Reg[] | null>(null);
  const [search, setSearch] = useState('');

  const refresh = async () => {
    const { data } = await adminApi.listAllRegistrations();
    setRows(data);
  };

  useEffect(() => { refresh(); }, []);

  const update = async (id: string, field: 'attendance_status' | 'payment_status', value: string) => {
    const { error } = await adminApi.updateRegistration(id, { [field]: value });
    if (error) toast.error(error.message);
    else { toast.success('עודכן'); refresh(); }
  };

  const grouped = useMemo(() => {
    if (!rows) return [];
    const map = new Map<string, { activity: any; regs: Reg[] }>();
    for (const r of rows) {
      const key = r.activity_id;
      if (!map.has(key)) map.set(key, { activity: r.activity, regs: [] });
      map.get(key)!.regs.push(r);
    }
    let arr = Array.from(map.values());
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      arr = arr
        .map((g) => ({
          ...g,
          regs: g.regs.filter((r) => {
            const name = (r.profile?.full_name ?? '').toLowerCase();
            const email = (r.profile?.email ?? '').toLowerCase();
            const title = (g.activity?.title_he ?? '').toLowerCase();
            return name.includes(q) || email.includes(q) || title.includes(q);
          }),
        }))
        .filter((g) => g.regs.length > 0);
    }
    arr.sort((a, b) => b.regs.length - a.regs.length);
    return arr;
  }, [rows, search]);

  if (rows === null) return <Skeleton className="h-96 w-full" />;

  const totalRegs = rows.length;
  const totalActivities = new Set(rows.map((r) => r.activity_id)).size;
  const totalUsers = new Set(rows.map((r) => r.user_id)).size;

  if (totalRegs === 0) {
    return <p className="text-muted-foreground text-lg">אין הרשמות עדיין.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">הרשמות</h2>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg border bg-card px-4 py-2 text-center min-w-32">
            <div className="text-2xl font-bold">{totalRegs}</div>
            <div className="text-sm text-muted-foreground">סה״כ הרשמות</div>
          </div>
          <div className="rounded-lg border bg-card px-4 py-2 text-center min-w-32">
            <div className="text-2xl font-bold">{totalActivities}</div>
            <div className="text-sm text-muted-foreground">פעילויות פעילות</div>
          </div>
          <div className="rounded-lg border bg-card px-4 py-2 text-center min-w-32">
            <div className="text-2xl font-bold">{totalUsers}</div>
            <div className="text-sm text-muted-foreground">משתמשים שונים</div>
          </div>
        </div>
      </div>

      <Input
        placeholder="חיפוש לפי שם משתמש, אימייל או שם פעילות…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="text-base h-12"
      />

      {grouped.length === 0 ? (
        <p className="text-muted-foreground">לא נמצאו תוצאות.</p>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {grouped.map((g) => (
            <AccordionItem
              key={g.activity?.id ?? Math.random()}
              value={g.activity?.id ?? String(Math.random())}
              className="border rounded-lg bg-card overflow-hidden"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/50">
                <div className="flex flex-1 items-center justify-between gap-4 text-right">
                  <div className="flex-1">
                    <div className="text-lg font-bold">{g.activity?.title_he ?? 'פעילות לא ידועה'}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatActivityWhen(g.activity)}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {g.regs.length} נרשמים
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-base">
                    <thead className="bg-secondary/40">
                      <tr>
                        <th className="p-3">שם</th>
                        <th className="p-3">אימייל</th>
                        <th className="p-3">תאריך הרשמה</th>
                        <th className="p-3">נוכחות</th>
                        <th className="p-3">תשלום</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.regs.map((r) => (
                        <tr key={r.id} className="border-t">
                          <td className="p-3 font-medium">
                            {r.profile?.full_name ?? '—'}
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {r.profile?.email ?? '—'}
                          </td>
                          <td className="p-3">
                            {new Date(r.created_at).toLocaleDateString('he-IL')}
                          </td>
                          <td className="p-3">
                            <Select
                              value={r.attendance_status}
                              onValueChange={(v) => update(r.id, 'attendance_status', v)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(attendanceLabel).map(([v, l]) => (
                                  <SelectItem key={v} value={v}>{l}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Select
                              value={r.payment_status}
                              onValueChange={(v) => update(r.id, 'payment_status', v)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(paymentLabel).map(([v, l]) => (
                                  <SelectItem key={v} value={v}>{l}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
