CREATE OR REPLACE FUNCTION public.admin_list_registrations()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  activity_id uuid,
  attendance_status attendance_status,
  payment_status payment_status,
  notes text,
  occurrence_date date,
  created_at timestamptz,
  full_name text,
  email text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can list all registrations';
  END IF;

  RETURN QUERY
  SELECT
    r.id,
    r.user_id,
    r.activity_id,
    r.attendance_status,
    r.payment_status,
    r.notes,
    r.occurrence_date,
    r.created_at,
    COALESCE(NULLIF(p.full_name, ''), NULLIF(u.raw_user_meta_data->>'full_name', ''), NULLIF(u.raw_user_meta_data->>'name', '')) AS full_name,
    COALESCE(NULLIF(p.email, ''), u.email) AS email
  FROM public.activity_registrations r
  LEFT JOIN public.profiles p ON p.id = r.user_id
  LEFT JOIN auth.users u ON u.id = r.user_id
  ORDER BY r.created_at DESC
  LIMIT 2000;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_registrations() FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_list_registrations() TO authenticated;

-- Backfill existing profiles from auth.users so future joins work too
INSERT INTO public.profiles (id, email, full_name)
SELECT u.id, u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')
FROM auth.users u
ON CONFLICT (id) DO UPDATE
  SET email = COALESCE(NULLIF(public.profiles.email, ''), EXCLUDED.email),
      full_name = COALESCE(NULLIF(public.profiles.full_name, ''), EXCLUDED.full_name);