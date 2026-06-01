import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useIsAdmin = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      // Does ANY admin exist? (used to show "claim first admin" CTA)
      const { count } = await supabase
        .from('user_roles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'admin');
      if (!cancelled) setAdminExists((count ?? 0) > 0);

      if (!user) {
        if (!cancelled) { setIsAdmin(false); setLoading(false); }
        return;
      }
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      if (!cancelled) {
        setIsAdmin(!!data);
        setLoading(false);
      }
    };
    if (!authLoading) run();
    return () => { cancelled = true; };
  }, [user, authLoading]);

  const claimFirstAdmin = async () => {
    const { data, error } = await supabase.rpc('claim_first_admin');
    if (!error && data === true) setIsAdmin(true);
    return { success: data === true, error };
  };

  return { isAdmin, loading, adminExists, claimFirstAdmin };
};
