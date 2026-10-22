ALTER TABLE public.annunci
  ADD COLUMN IF NOT EXISTS tipo_opportunita text DEFAULT 'operatore',
  ADD COLUMN IF NOT EXISTS stato_pubblicazione text NOT NULL DEFAULT 'attivo',
  ADD COLUMN IF NOT EXISTS tipologia_contratto text,
  ADD COLUMN IF NOT EXISTS durata_contratto text,
  ADD COLUMN IF NOT EXISTS contratto_dal date,
  ADD COLUMN IF NOT EXISTS contratto_al date;
ALTER TABLE public.annunci ADD CONSTRAINT annunci_stato_pubblicazione_check CHECK (stato_pubblicazione IN ('attivo','sospeso','chiuso'));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telefono text,
  ADD COLUMN IF NOT EXISTS citta text,
  ADD COLUMN IF NOT EXISTS descrizione text,
  ADD COLUMN IF NOT EXISTS sito_web text,
  ADD COLUMN IF NOT EXISTS qualifica text,
  ADD COLUMN IF NOT EXISTS esperienza text,
  ADD COLUMN IF NOT EXISTS cv_path text;

DROP POLICY IF EXISTS "Annunci pubblici" ON public.annunci;
CREATE POLICY "Annunci pubblici" ON public.annunci FOR SELECT TO anon, authenticated
  USING (stato_pubblicazione <> 'sospeso' OR owner_id = auth.uid());

CREATE OR REPLACE FUNCTION public.annuncio_aperto(_annuncio_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.annunci WHERE id = _annuncio_id AND stato_pubblicazione = 'attivo')
$$;

DROP POLICY IF EXISTS "Educatore si candida" ON public.candidature;
CREATE POLICY "Educatore si candida" ON public.candidature FOR INSERT TO authenticated
  WITH CHECK (candidato_id = auth.uid() AND stato = 'in_attesa' AND risposta IS NULL AND colloquio_at IS NULL
    AND public.has_role(auth.uid(), 'educatore') AND public.annuncio_aperto(annuncio_id));

ALTER TABLE public.candidature DROP CONSTRAINT candidature_annuncio_id_fkey;
ALTER TABLE public.candidature ADD CONSTRAINT candidature_annuncio_id_fkey
  FOREIGN KEY (annuncio_id) REFERENCES public.annunci(id) ON DELETE CASCADE;

CREATE POLICY "CV aggiorna proprio" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'cv' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "CV elimina proprio" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'cv' AND (storage.foldername(name))[1] = auth.uid()::text);