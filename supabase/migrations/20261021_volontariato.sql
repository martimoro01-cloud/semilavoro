-- Keep existing job ads as paid/operator opportunities.
ALTER TABLE public.annunci
  ADD COLUMN IF NOT EXISTS tipo_opportunita text NOT NULL DEFAULT 'operatore';
ALTER TABLE public.annunci DROP CONSTRAINT IF EXISTS annunci_tipo_opportunita_check;
ALTER TABLE public.annunci ADD CONSTRAINT annunci_tipo_opportunita_check
  CHECK (tipo_opportunita IN ('operatore', 'volontario'));
-- The existing candidature.cv_path field holds the required attachment:
-- CV for operator jobs, presentation letter for volunteer opportunities.
-- Reuse the existing private CV storage bucket and its RLS policies.
