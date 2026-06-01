-- Remove Russian language support from all tables
ALTER TABLE public.activities
  DROP COLUMN IF EXISTS title_ru,
  DROP COLUMN IF EXISTS description_ru,
  DROP COLUMN IF EXISTS teacher_ru,
  DROP COLUMN IF EXISTS location_ru,
  DROP COLUMN IF EXISTS instructions_ru;

ALTER TABLE public.activity_categories
  DROP COLUMN IF EXISTS name_ru,
  DROP COLUMN IF EXISTS description_ru;

ALTER TABLE public.announcements
  DROP COLUMN IF EXISTS title_ru,
  DROP COLUMN IF EXISTS message_ru;