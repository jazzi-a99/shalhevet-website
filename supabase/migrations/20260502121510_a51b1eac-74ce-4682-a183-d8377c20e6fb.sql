
-- =========================================================
-- ROLES
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'verified_member', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- TIMESTAMP TRIGGER (reuses existing public.update_updated_at_column)
-- =========================================================

-- =========================================================
-- ACTIVITY CATEGORIES (the 3 sections)
-- =========================================================
CREATE TABLE public.activity_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,                     -- 'lectures-and-classes' | 'health-club' | 'upcoming-events'
  name_he TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  description_he TEXT,
  description_en TEXT,
  description_ru TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON public.activity_categories FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage categories"
  ON public.activity_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_activity_categories_updated
  BEFORE UPDATE ON public.activity_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- ACTIVITIES
-- =========================================================
CREATE TYPE public.activity_kind AS ENUM ('recurring', 'one_time');

CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.activity_categories(id) ON DELETE RESTRICT,
  kind public.activity_kind NOT NULL,

  -- Localized text
  title_he TEXT NOT NULL,
  title_en TEXT,
  title_ru TEXT,
  description_he TEXT,
  description_en TEXT,
  description_ru TEXT,
  teacher_he TEXT,
  teacher_en TEXT,
  teacher_ru TEXT,
  location_he TEXT,
  location_en TEXT,
  location_ru TEXT,
  instructions_he TEXT,
  instructions_en TEXT,
  instructions_ru TEXT,

  -- Visual / classification
  image_url TEXT,
  visual_category TEXT,       -- art|lecture|trip|reading|fitness|music|default|concert|movie
  simple_category TEXT,       -- sport|culture|social
  sub_category TEXT,          -- yoga|pilates|... (used by HealthClub & LecturesAndClasses)

  -- Recurring fields (kind='recurring')
  day_of_week SMALLINT,       -- 0=Sun .. 6=Sat
  start_time TIME,
  end_time TIME,

  -- One-time fields (kind='one_time')
  event_date DATE,
  event_start_time TIME,
  event_end_time TIME,

  -- Capacity / payments
  capacity INT,
  price_cents INT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'ILS',

  -- Lifecycle
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_cancelled BOOLEAN NOT NULL DEFAULT false,

  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT activities_recurring_fields CHECK (
    (kind = 'recurring' AND day_of_week IS NOT NULL AND start_time IS NOT NULL AND end_time IS NOT NULL)
    OR kind = 'one_time'
  ),
  CONSTRAINT activities_one_time_fields CHECK (
    (kind = 'one_time' AND event_date IS NOT NULL AND event_start_time IS NOT NULL)
    OR kind = 'recurring'
  )
);

CREATE INDEX idx_activities_category ON public.activities(category_id);
CREATE INDEX idx_activities_kind ON public.activities(kind);
CREATE INDEX idx_activities_event_date ON public.activities(event_date) WHERE kind = 'one_time';
CREATE INDEX idx_activities_dow ON public.activities(day_of_week) WHERE kind = 'recurring';

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active activities"
  ON public.activities FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all activities"
  ON public.activities FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage activities"
  ON public.activities FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_activities_updated
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- ACTIVITY REGISTRATIONS (personal calendar)
-- =========================================================
CREATE TYPE public.attendance_status AS ENUM ('registered', 'attended', 'no_show', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('none', 'pending', 'paid', 'refunded');

CREATE TABLE public.activity_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  -- For one-time events: matches activity.event_date.
  -- For recurring: NULL = registered for the ongoing class (every week).
  occurrence_date DATE,
  attendance_status public.attendance_status NOT NULL DEFAULT 'registered',
  payment_status public.payment_status NOT NULL DEFAULT 'none',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, activity_id, occurrence_date)
);

CREATE INDEX idx_registrations_user ON public.activity_registrations(user_id);
CREATE INDEX idx_registrations_activity ON public.activity_registrations(activity_id);

ALTER TABLE public.activity_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own registrations"
  ON public.activity_registrations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all registrations"
  ON public.activity_registrations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users register themselves"
  ON public.activity_registrations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own registrations"
  ON public.activity_registrations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all registrations"
  ON public.activity_registrations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users delete own registrations"
  ON public.activity_registrations FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_registrations_updated
  BEFORE UPDATE ON public.activity_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- VERIFIED MEMBER REQUESTS
-- =========================================================
CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.member_verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  status public.verification_status NOT NULL DEFAULT 'pending',
  reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.member_verification_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own request"
  ON public.member_verification_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own request"
  ON public.member_verification_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all verification requests"
  ON public.member_verification_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage verification requests"
  ON public.member_verification_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_verification_updated
  BEFORE UPDATE ON public.member_verification_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- ANNOUNCEMENTS
-- =========================================================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE, -- NULL = site-wide
  title_he TEXT NOT NULL,
  title_en TEXT,
  title_ru TEXT,
  message_he TEXT NOT NULL,
  message_en TEXT,
  message_ru TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_announcements_activity ON public.announcements(activity_id);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read announcements"
  ON public.announcements FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage announcements"
  ON public.announcements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_announcements_updated
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- SEED CATEGORIES
-- =========================================================
INSERT INTO public.activity_categories (slug, name_he, name_en, name_ru, display_order) VALUES
  ('lectures-and-classes', 'הרצאות וחוגים', 'Lectures & Classes', 'Лекции и кружки', 1),
  ('health-club',          'מועדון בריאות וכושר', 'Health & Fitness Club', 'Клуб здоровья и фитнеса', 2),
  ('upcoming-events',      'הרצאות, קונצרטים וסרטים קרובים', 'Upcoming Lectures, Concerts & Movies', 'Предстоящие лекции, концерты и фильмы', 3);
