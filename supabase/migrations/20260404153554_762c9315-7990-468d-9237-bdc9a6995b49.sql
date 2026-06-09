
-- Drop overly permissive SELECT and UPDATE policies
DROP POLICY "Allow anonymous select" ON public.quiz_submissions;
DROP POLICY "Allow anonymous update" ON public.quiz_submissions;

-- Only authenticated users can read submissions (admin page)
CREATE POLICY "Authenticated select" ON public.quiz_submissions
  FOR SELECT TO authenticated
  USING (true);

-- Only authenticated users can update submissions (mark pdf_generated)
CREATE POLICY "Authenticated update" ON public.quiz_submissions
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add storage policies for drive bucket
CREATE POLICY "Authenticated read drive" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'drive');

CREATE POLICY "Authenticated insert drive" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'drive');

CREATE POLICY "Authenticated delete drive" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'drive');
