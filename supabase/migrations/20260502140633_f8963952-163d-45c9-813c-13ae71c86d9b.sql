-- Auto-decrement activity capacity when a user registers, and restore on delete.
CREATE OR REPLACE FUNCTION public.decrement_capacity_on_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.activities
  SET capacity = GREATEST(capacity - 1, 0)
  WHERE id = NEW.activity_id AND capacity IS NOT NULL;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_capacity_on_unregistration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.activities
  SET capacity = capacity + 1
  WHERE id = OLD.activity_id AND capacity IS NOT NULL;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_decrement_capacity ON public.activity_registrations;
CREATE TRIGGER trg_decrement_capacity
AFTER INSERT ON public.activity_registrations
FOR EACH ROW
EXECUTE FUNCTION public.decrement_capacity_on_registration();

DROP TRIGGER IF EXISTS trg_increment_capacity ON public.activity_registrations;
CREATE TRIGGER trg_increment_capacity
AFTER DELETE ON public.activity_registrations
FOR EACH ROW
EXECUTE FUNCTION public.increment_capacity_on_unregistration();