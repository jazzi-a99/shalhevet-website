
-- Create sparks_issues table for "ניצוצות" newsletter PDFs
CREATE TABLE public.sparks_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_he TEXT NOT NULL,
  title_en TEXT,
  issue_month SMALLINT NOT NULL CHECK (issue_month BETWEEN 1 AND 12),
  issue_year SMALLINT NOT NULL CHECK (issue_year BETWEEN 2000 AND 2100),
  pdf_url TEXT NOT NULL,
  cover_image_url TEXT,
  description_he TEXT,
  description_en TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (issue_year, issue_month)
);

ALTER TABLE public.sparks_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published sparks issues"
ON public.sparks_issues
FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "Admins can view all sparks issues"
ON public.sparks_issues
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage sparks issues"
ON public.sparks_issues
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_sparks_issues_updated_at
BEFORE UPDATE ON public.sparks_issues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_sparks_issues_year_month ON public.sparks_issues (issue_year DESC, issue_month DESC);

-- Create public storage bucket for sparks PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('sparks', 'sparks', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin write
CREATE POLICY "Public can read sparks files"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'sparks');

CREATE POLICY "Admins can upload sparks files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sparks' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update sparks files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'sparks' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete sparks files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'sparks' AND has_role(auth.uid(), 'admin'::app_role));
