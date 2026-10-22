ALTER TABLE public.annunci
  ADD COLUMN IF NOT EXISTS tipologia_contratto text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS durata_contratto text,
  ADD COLUMN IF NOT EXISTS contratto_dal date,
  ADD COLUMN IF NOT EXISTS contratto_al date;
ALTER TABLE public.annunci DROP CONSTRAINT IF EXISTS annunci_durata_contratto_check;
ALTER TABLE public.annunci ADD CONSTRAINT annunci_durata_contratto_check
  CHECK (durata_contratto IS NULL OR durata_contratto IN ('determinato', 'indeterminato'));
ALTER TABLE public.annunci DROP CONSTRAINT IF EXISTS annunci_date_contratto_check;
ALTER TABLE public.annunci ADD CONSTRAINT annunci_date_contratto_check
  CHECK (contratto_dal IS NULL OR contratto_al IS NULL OR contratto_al >= contratto_dal);
