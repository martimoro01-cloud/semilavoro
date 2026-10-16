-- SEMI: concorsi e bandi, inserimento manuale e importazione da fonti ufficiali.
CREATE TABLE IF NOT EXISTS public.bandi (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 titolo text NOT NULL CHECK (char_length(trim(titolo)) BETWEEN 8 AND 240),
 ente text NOT NULL CHECK (char_length(trim(ente)) BETWEEN 2 AND 180),
 tipo text NOT NULL CHECK (tipo IN ('concorso','avviso','bando_enti')),
 regione text NOT NULL DEFAULT 'Nazionale',
 professione text NOT NULL DEFAULT '',
 descrizione text NOT NULL DEFAULT '',
 scadenza timestamptz NOT NULL,
 url_ufficiale text NOT NULL CHECK (url_ufficiale ~* '^https://[^[:space:]]+$'),
 fonte text NOT NULL DEFAULT 'manuale' CHECK (fonte IN ('manuale','automatica')),
 identificativo_fonte text UNIQUE,
 verificato boolean NOT NULL DEFAULT false,
 pubblicato boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bandi_pubblicati_scadenza_idx ON public.bandi(scadenza) WHERE pubblicato = true;
CREATE TABLE IF NOT EXISTS public.bandi_amministratori (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.bandi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bandi_amministratori ENABLE ROW LEVEL SECURITY;
-- Non esporre l'elenco degli amministratori; verifica in policy tramite funzione SECURITY DEFINER.
CREATE OR REPLACE FUNCTION public.is_bandi_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT EXISTS(SELECT 1 FROM public.bandi_amministratori WHERE user_id = (select auth.uid())); $$;
REVOKE ALL ON FUNCTION public.is_bandi_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_bandi_admin() TO authenticated;
DROP POLICY IF EXISTS "Bandi pubblici visibili" ON public.bandi;
CREATE POLICY "Bandi pubblici visibili" ON public.bandi FOR SELECT TO anon, authenticated
 USING (pubblicato = true OR (select public.is_bandi_admin()));
DROP POLICY IF EXISTS "Amministratori inseriscono bandi" ON public.bandi;
CREATE POLICY "Amministratori inseriscono bandi" ON public.bandi FOR INSERT TO authenticated
 WITH CHECK ((select public.is_bandi_admin()));
DROP POLICY IF EXISTS "Amministratori aggiornano bandi" ON public.bandi;
CREATE POLICY "Amministratori aggiornano bandi" ON public.bandi FOR UPDATE TO authenticated
 USING ((select public.is_bandi_admin())) WITH CHECK ((select public.is_bandi_admin()));
DROP POLICY IF EXISTS "Amministratori eliminano bandi" ON public.bandi;
CREATE POLICY "Amministratori eliminano bandi" ON public.bandi FOR DELETE TO authenticated
 USING ((select public.is_bandi_admin()));
-- Assegnare un amministratore con SQL privilegiato:
-- INSERT INTO public.bandi_amministratori(user_id) VALUES ('UUID_UTENTE_AUTORIZZATO');
-- Le importazioni automatiche usano credenziali server-side, MAI nel browser.
