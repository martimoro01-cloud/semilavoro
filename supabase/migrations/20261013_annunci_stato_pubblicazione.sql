-- Eseguire nel database Supabase collegato al sito prima di pubblicare la nuova versione.
ALTER TABLE public.annunci
  ADD COLUMN IF NOT EXISTS stato_pubblicazione text NOT NULL DEFAULT 'attivo';
ALTER TABLE public.annunci
  DROP CONSTRAINT IF EXISTS annunci_stato_pubblicazione_check;
ALTER TABLE public.annunci
  ADD CONSTRAINT annunci_stato_pubblicazione_check
  CHECK (stato_pubblicazione IN ('attivo', 'sospeso', 'archiviato'));

-- Le policy RLS esistenti devono consentire UPDATE e DELETE solo al proprietario.
-- Non modificare le policy senza aver verificato quelle già presenti.
-- Per eliminare un annuncio con candidature esistenti, il frontend blocca
-- l'operazione per preservare le candidature e i CV associati.
