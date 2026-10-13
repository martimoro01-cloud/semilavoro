-- Recensioni della piattaforma SEMI, con moderazione prima della pubblicazione.
CREATE TABLE IF NOT EXISTS public.recensioni (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  autore_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL CHECK (char_length(trim(nome)) BETWEEN 2 AND 100),
  ruolo text NOT NULL CHECK (ruolo IN ('educatore', 'servizio')),
  testo text NOT NULL CHECK (char_length(trim(testo)) BETWEEN 20 AND 1200),
  valutazione smallint NOT NULL CHECK (valutazione BETWEEN 1 AND 5),
  approvata boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS recensioni_approvate_data_idx ON public.recensioni (created_at DESC) WHERE approvata = true;
ALTER TABLE public.recensioni ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Recensioni approvate leggibili" ON public.recensioni;
CREATE POLICY "Recensioni approvate leggibili" ON public.recensioni FOR SELECT TO anon, authenticated USING (approvata = true OR autore_id = (select auth.uid()));
DROP POLICY IF EXISTS "Utenti autenticati inviano recensioni" ON public.recensioni;
CREATE POLICY "Utenti autenticati inviano recensioni" ON public.recensioni FOR INSERT TO authenticated WITH CHECK (autore_id = (select auth.uid()) AND approvata = false);
-- Le recensioni non sono modificabili o cancellabili dal client.
-- L'approvazione avviene solo da un amministratore autorizzato nel database.
