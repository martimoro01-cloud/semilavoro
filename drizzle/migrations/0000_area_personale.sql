CREATE TYPE public.app_role AS ENUM ('educatore', 'servizio');
CREATE TYPE public.stato_candidatura AS ENUM ('in_attesa', 'accettata', 'rifiutata', 'colloquio');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nome) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (
    NEW.id,
    CASE WHEN NEW.raw_user_meta_data->>'tipo' = 'servizio' THEN 'servizio'::public.app_role ELSE 'educatore'::public.app_role END
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.annunci (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  servizio text NOT NULL,
  area text NOT NULL,
  regione text NOT NULL,
  provincia text NOT NULL,
  mansione text NOT NULL,
  impegno text NOT NULL,
  guadagno_min integer NOT NULL,
  guadagno_max integer NOT NULL,
  note_retribuzione text NOT NULL,
  email text NOT NULL,
  informazioni text NOT NULL,
  in_primo_piano boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.annunci TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.annunci TO authenticated;
GRANT ALL ON public.annunci TO service_role;
ALTER TABLE public.annunci ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Annunci pubblici" ON public.annunci FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Servizi pubblicano" ON public.annunci FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(), 'servizio'));
CREATE POLICY "Servizi modificano i propri" ON public.annunci FOR UPDATE TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "Servizi eliminano i propri" ON public.annunci FOR DELETE TO authenticated USING (owner_id = auth.uid());

CREATE TABLE public.candidature (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  annuncio_id uuid NOT NULL REFERENCES public.annunci(id) ON DELETE CASCADE,
  candidato_id uuid NOT NULL,
  nome text NOT NULL DEFAULT '',
  email text NOT NULL,
  cellulare text NOT NULL,
  cv_path text NOT NULL,
  lettera text NOT NULL,
  stato public.stato_candidatura NOT NULL DEFAULT 'in_attesa',
  risposta text,
  colloquio_at timestamptz,
  colloquio_luogo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (annuncio_id, candidato_id)
);
GRANT SELECT, INSERT, UPDATE ON public.candidature TO authenticated;
GRANT ALL ON public.candidature TO service_role;
ALTER TABLE public.candidature ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.owns_annuncio(_annuncio_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.annunci WHERE id = _annuncio_id AND owner_id = auth.uid())
$$;

CREATE POLICY "Candidato vede le proprie" ON public.candidature FOR SELECT TO authenticated USING (candidato_id = auth.uid());
CREATE POLICY "Servizio vede i candidati" ON public.candidature FOR SELECT TO authenticated USING (public.owns_annuncio(annuncio_id));
CREATE POLICY "Educatore si candida" ON public.candidature FOR INSERT TO authenticated
  WITH CHECK (candidato_id = auth.uid() AND stato = 'in_attesa' AND risposta IS NULL AND colloquio_at IS NULL AND public.has_role(auth.uid(), 'educatore'));
CREATE POLICY "Servizio risponde" ON public.candidature FOR UPDATE TO authenticated USING (public.owns_annuncio(annuncio_id)) WITH CHECK (public.owns_annuncio(annuncio_id));

CREATE POLICY "CV upload proprio" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cv' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "CV lettura" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'cv' AND ((storage.foldername(name))[1] = auth.uid()::text OR EXISTS (
    SELECT 1 FROM public.candidature c WHERE c.cv_path = storage.objects.name AND public.owns_annuncio(c.annuncio_id)
  )));

INSERT INTO public.annunci (servizio, area, regione, provincia, mansione, impegno, guadagno_min, guadagno_max, note_retribuzione, email, informazioni, in_primo_piano) VALUES
('Servizio di esempio', 'Anziani', 'Toscana', 'Firenze', 'Operatore/trice sociale residenziale', 'Full-time', 22000, 26000, 'CCNL Coop. Sociali', 'info@semilavoro.it', 'Annuncio di esempio.', true),
('Servizio di esempio', 'Disabilità', 'Emilia-Romagna', 'Bologna', 'Coordinatore/trice di progetto', 'Full-time', 26000, 30000, 'CCNL Coop. Sociali', 'info@semilavoro.it', 'Annuncio di esempio.', true),
('Servizio di esempio', 'Minori', 'Lombardia', 'Milano', 'Educatore/trice per centro diurno', 'Full-time', 22000, 27000, 'CCNL Coop. Sociali', 'info@semilavoro.it', 'Annuncio di esempio.', true),
('Servizio di esempio', 'Mamma-bambino', 'Lazio', 'Roma', 'Educatore/trice in comunità mamma-bambino', 'Part-time', 12000, 15000, 'CCNL Coop. Sociali', 'info@semilavoro.it', 'Annuncio di esempio.', false),
('Servizio di esempio', 'Dipendenze', 'Campania', 'Napoli', 'Animatore/trice educativo in comunità terapeutica', 'Full-time', 21000, 25000, 'CCNL Coop. Sociali', 'info@semilavoro.it', 'Annuncio di esempio.', false),
('Servizio di esempio', 'Migranti', 'Piemonte', 'Torino', 'Mediatore/trice culturale nel servizio di accoglienza', 'Part-time', 12000, 14000, 'CCNL Coop. Sociali', 'info@semilavoro.it', 'Annuncio di esempio.', false);