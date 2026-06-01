
DROP FUNCTION IF EXISTS public.list_admins();

CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE(user_id uuid, email text, full_name text, granted_at timestamp with time zone, is_super boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_super uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can list admins';
  END IF;

  v_super := public.get_super_admin_id();

  RETURN QUERY
  SELECT ur.user_id,
         COALESCE(NULLIF(p.email, ''), u.email) AS email,
         COALESCE(NULLIF(p.full_name, ''), NULLIF(u.raw_user_meta_data->>'full_name', ''), NULLIF(u.raw_user_meta_data->>'name', '')) AS full_name,
         ur.created_at AS granted_at,
         (ur.user_id = v_super) AS is_super
  FROM public.user_roles ur
  LEFT JOIN public.profiles p ON p.id = ur.user_id
  LEFT JOIN auth.users u ON u.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at ASC;
END;
$$;
