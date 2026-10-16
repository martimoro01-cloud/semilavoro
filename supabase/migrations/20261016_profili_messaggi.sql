-- SEMI: foto profilo e chat riservate alle candidature accettate.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS foto_path text;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES ('foto-profilo','foto-profilo',true,2097152,ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Foto profilo caricate dal proprietario" ON storage.objects;
CREATE POLICY "Foto profilo caricate dal proprietario" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id='foto-profilo' AND (storage.foldername(name))[1]=(select auth.uid())::text);
DROP POLICY IF EXISTS "Foto profilo aggiornate dal proprietario" ON storage.objects;
CREATE POLICY "Foto profilo aggiornate dal proprietario" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id='foto-profilo' AND (storage.foldername(name))[1]=(select auth.uid())::text)
WITH CHECK (bucket_id='foto-profilo' AND (storage.foldername(name))[1]=(select auth.uid())::text);
DROP POLICY IF EXISTS "Foto profilo eliminate dal proprietario" ON storage.objects;
CREATE POLICY "Foto profilo eliminate dal proprietario" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id='foto-profilo' AND (storage.foldername(name))[1]=(select auth.uid())::text);

CREATE TABLE IF NOT EXISTS public.messaggi_candidatura (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 candidatura_id uuid NOT NULL REFERENCES public.candidature(id) ON DELETE CASCADE,
 mittente_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 testo text NOT NULL CHECK (char_length(trim(testo)) BETWEEN 1 AND 2000),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS messaggi_candidatura_ordine_idx ON public.messaggi_candidatura(candidatura_id,created_at);
ALTER TABLE public.messaggi_candidatura ENABLE ROW LEVEL SECURITY;
-- Accesso solo quando la candidatura è accettata o è stato fissato un colloquio.
CREATE OR REPLACE FUNCTION public.puo_messaggiare_candidatura(p_candidatura_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=''
AS $$
 SELECT EXISTS (
 SELECT 1 FROM public.candidature c JOIN public.annunci a ON a.id=c.annuncio_id
 WHERE c.id=p_candidatura_id AND c.stato IN ('accettata','colloquio')
 AND ((select auth.uid())=c.candidato_id OR (select auth.uid())=a.owner_id)
 );
$$;
REVOKE ALL ON FUNCTION public.puo_messaggiare_candidatura(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.puo_messaggiare_candidatura(uuid) TO authenticated;
DROP POLICY IF EXISTS "Partecipanti leggono chat" ON public.messaggi_candidatura;
CREATE POLICY "Partecipanti leggono chat" ON public.messaggi_candidatura
FOR SELECT TO authenticated USING ((select public.puo_messaggiare_candidatura(candidatura_id)));
DROP POLICY IF EXISTS "Partecipanti inviano chat" ON public.messaggi_candidatura;
CREATE POLICY "Partecipanti inviano chat" ON public.messaggi_candidatura
FOR INSERT TO authenticated WITH CHECK (mittente_id=(select auth.uid()) AND (select public.puo_messaggiare_candidatura(candidatura_id)));
