CREATE OR REPLACE FUNCTION public.get_activity_registration_count(_activity_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int
  FROM public.activity_registrations
  WHERE activity_id = _activity_id
    AND attendance_status <> 'cancelled';
$$;

CREATE OR REPLACE FUNCTION public.get_announcements_for_activity(_activity_id uuid)
RETURNS TABLE (
  id uuid,
  title_he text,
  title_en text,
  message_he text,
  message_en text,
  created_at timestamptz,
  activity_id uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, title_he, title_en, message_he, message_en, created_at, activity_id
  FROM public.announcements
  WHERE activity_id = _activity_id OR activity_id IS NULL
  ORDER BY created_at DESC
  LIMIT 20;
$$;