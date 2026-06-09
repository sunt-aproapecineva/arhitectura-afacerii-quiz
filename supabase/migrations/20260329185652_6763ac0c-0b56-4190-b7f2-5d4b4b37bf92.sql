
CREATE TABLE public.quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  contact_name TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  contact_phone TEXT NOT NULL DEFAULT '',
  contact_instagram TEXT NOT NULL DEFAULT '',
  profile_primary TEXT NOT NULL DEFAULT '',
  profile_secondary TEXT NOT NULL DEFAULT '',
  profile_temperature TEXT NOT NULL DEFAULT '',
  raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  pdf_generated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.quiz_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON public.quiz_submissions
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update" ON public.quiz_submissions
  FOR UPDATE USING (true) WITH CHECK (true);
