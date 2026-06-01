import { supabase as cloudSupabase } from '@/integrations/supabase/client';

export const supabase = cloudSupabase as any;
