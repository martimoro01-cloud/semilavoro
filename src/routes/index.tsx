import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchAnnunci } from "@/lib/annunci-db";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
import { Button } from "@/components/ui/button";
import { Megaphone, Search, MapPin, Clock, ArrowRight, Mail, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "semi — Il lavoro educativo cresce qui" },
      {
        name: "description",
        content:
          "semi è il punto d'incontro tra chi lavora nel sociale e chi sta cercando proprio te. Pubblica un annuncio o trova lavoro in ambito educativo.",
      },
      { property: "og:title", content: "semi — Il lavoro educativo cresce qui" },
      {
        property: "og:description",
        content:
          "Il punto d'incontro tra chi lavora nel sociale e chi sta cercando proprio te.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Nunito+Sans:wght@400;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: annunciInPrimoPiano = [] } = useQuery({ queryKey: ["annunci", "primo-piano"], queryFn: () => fetchAnnunci({ primoPiano: true }) });
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        {/* Motivi editoriali ispirati a semi, connessioni e crescita: forme geometriche e tratti organici. */}
        <svg aria-hidden="true" viewBox="0 0 340 510" fill="none" className="pointer-events-none absolute -left-28 top-12 hidden h-[510px] w-[340px] text-brand-green opacity-35 lg:block" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M70 480 Q205 365 121 256 T190 24" strokeWidth="2.5" />
          <path d="M121 256 Q30 211 48 139 Q119 146 121 256Z M140 205 Q240 190 265 107 Q174 108 140 205Z M99 348 Q20 332 21 271 Q90 275 99 348Z M130 395 Q235 382 268 310 Q177 309 130 395Z" strokeWidth="1.8" />
          <path d="M121 256 L48 139 M140 205 L265 107 M99 348 L21 271 M130 395 L268 310" strokeWidth="1" opacity=".7" />
          <circle cx="180" cy="96" r="68" strokeWidth="1" strokeDasharray="4 10" />
          <circle cx="80" cy="435" r="19" strokeWidth="1.5" />
          <path d="M198 65 L230 32 M206 105 L251 108 M173 42 L170 9" strokeWidth="1.5" />
          <path d="M221 255 Q285 233 303 187 M224 264 Q290 260 315 231" strokeWidth="1.2" />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 350 520" fill="none" className="pointer-events-none absolute -right-28 bottom-0 hidden h-[520px] w-[350px] text-brand-green opacity-30 lg:block" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M180 505 C95 410 236 344 161 259 S151 109 197 20" strokeWidth="2.5" />
          <path d="M168 420 C82 412 45 360 52 300 C126 310 170 345 168 420Z M183 355 C267 330 299 281 302 230 C223 247 184 291 183 355Z M168 267 C88 253 68 197 82 146 C143 161 177 204 168 267Z M170 166 C258 138 282 92 275 46 C207 64 177 103 170 166Z" strokeWidth="1.8" />
          <path d="M168 420 L52 300 M183 355 L302 230 M168 267 L82 146 M170 166 L275 46" strokeWidth="1" opacity=".7" />
          <circle cx="233" cy="448" r="61" strokeDasharray="3 10" />
          <circle cx="234" cy="448" r="24" strokeWidth="1.4" />
          <path d="M27 90 L65 90 M46 71 L46 109 M275 186 L312 186 M294 167 L294 205" strokeWidth="1.5" />
        </svg>
        <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col items-center justify-center px-6 pb-24 pt-16 text-center md:min-h-[610px] md:pb-32 md:pt-24">
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Il lavoro educativo
            <br />
            cresce qui
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            Il punto d'incontro tra chi lavora nel sociale e chi sta cercando
            proprio te.
          </p>
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Scegli da dove iniziare</p>
          <div className="mx-auto mt-5 grid w-full max-w-3xl gap-4 sm:grid-cols-2 md:gap-6">
            <Link
              to="/pubblica-annuncio"
              className="group flex min-h-24 items-center justify-between gap-4 rounded-2xl bg-primary px-6 py-6 text-left text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 sm:px-7"
            >
              <span className="flex items-center gap-3">
                <Megaphone className="h-5 w-5" />
                Pubblica un annuncio
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20 transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/trova-lavoro"
              className="group flex min-h-24 items-center justify-between gap-4 rounded-2xl bg-primary px-6 py-6 text-left text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 sm:px-7"
            >
              <span className="flex items-center gap-3">
                <Search className="h-5 w-5" />
                Trova lavoro
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20 transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
          <div className="mt-16 h-px w-16 bg-brand-green/50" aria-hidden="true" />
        </div>
      </section>

      {/* Annunci in primo piano */}
      <section id="annunci" className="scroll-mt-24 border-t border-border bg-muted/30 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-bold md:text-4xl">
              <span className="mb-3 block font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green">Opportunità selezionate</span>
              Annunci in primo piano
            </h2>
            <Link
              to="/trova-lavoro"
              className="hidden items-center gap-1 text-sm font-semibold text-muted-foreground decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-foreground sm:inline-flex"
            >
              <span className="underline decoration-primary decoration-2 underline-offset-4">Vedi tutti gli annunci</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {annunciInPrimoPiano.map((annuncio) => (
              <article
                key={annuncio.id}
                className="group flex flex-col rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <span className="inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                  {annuncio.area}
                </span>
                <h3 className="mt-4 flex-1 text-xl font-bold leading-snug">
                  {annuncio.titolo}
                </h3>
                <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    {annuncio.sede}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    {annuncio.orario}
                  </span>
                </div>
                <span className="mt-6 flex h-9 w-9 items-center justify-center self-end rounded-full bg-primary/15 text-primary transition-transform group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recensioni autentiche, pubblicate dopo moderazione */}
      <Recensioni />
      
      {/* Contatti */}
      <section id="contatti" className="scroll-mt-24 border-t border-border bg-muted/30 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold md:text-4xl"><span className="mb-3 block font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green">Restiamo in contatto</span>Contatti</h2>
          <div className="mt-8 max-w-xl rounded-3xl border border-border bg-card p-7">
            <h3 className="text-xl font-bold">Hai domande?</h3>
            <p className="mt-2 text-muted-foreground">
              Scrivici per informazioni, supporto o segnalazioni.
            </p>
            <a
              href="mailto:info@semilavoro.it"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-primary underline"
            >
              <Mail className="h-4 w-4" />
              info@semilavoro.it
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Recensioni() {
  const { user, tipo } = useAccount();
  const [aperto, setAperto] = useState(false);
  const [valutazione, setValutazione] = useState(5);
  const [sending, setSending] = useState(false);
  const [messaggio, setMessaggio] = useState("");
  const { data: recensioni = [], refetch, isError } = useQuery({
    queryKey: ["recensioni", "pubbliche"],
    queryFn: async () => {
      const { data, error } = await supabase.from("recensioni").select("id, nome, ruolo, testo, valutazione, created_at").eq("approvata", true).order("created_at", { ascending: false }).limit(6);
      if (error) throw error;
      return data;
    },
    retry: false,
  });
  async function invia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || (tipo !== "educatore" && tipo !== "servizio")) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const nome = String(fields.get("nome") || "").trim();
    const testo = String(fields.get("testo") || "").trim();
    if (nome.length < 2 || nome.length > 100 || testo.length < 20 || testo.length > 1200) {
      setMessaggio("Inserisci un nome valido e una recensione tra 20 e 1200 caratteri.");
      return;
    }
    setSending(true);
    setMessaggio("");
    const { error } = await supabase.from("recensioni").insert({ autore_id: user.id, nome, ruolo: tipo, testo, valutazione });
    setSending(false);
    if (error) return setMessaggio("Invio non riuscito. Il servizio recensioni potrebbe non essere ancora attivo.");
    form.reset();
    setValutazione(5);
    setAperto(false);
    setMessaggio("Grazie! La tua recensione è stata inviata e sarà visibile dopo la verifica.");
    void refetch();
  }
  return (
    <section id="dicono-di-noi" className="scroll-mt-24 border-t border-border bg-background py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-brand-green">Le esperienze della comunità</span>
            <h2 className="text-3xl font-bold md:text-4xl">Le vostre recensioni</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">Racconta la tua esperienza con SEMI. Le recensioni vengono verificate prima della pubblicazione.</p>
          </div>
          <Button className="rounded-full" onClick={() => setAperto(v => !v)}>{aperto ? "Chiudi" : "Scrivi una recensione"}</Button>
        </div>
        {messaggio && <p role="status" className="mt-5 rounded-xl border border-border p-4 text-sm">{messaggio}</p>}
        {aperto && (
          <div className="mt-8 max-w-2xl rounded-3xl border border-border bg-muted/30 p-6 sm:p-8">
            {!user ? <p>Per lasciare una recensione, <Link to="/auth" className="font-semibold text-primary underline">accedi o registrati</Link> al tuo account.</p> :
            tipo !== "educatore" && tipo !== "servizio" ? <p>Completa il tuo profilo per inviare una recensione.</p> :
            <form onSubmit={invia} className="grid gap-5">
              <div><label htmlFor="review-name" className="text-sm font-semibold">Nome da mostrare *</label><input id="review-name" name="nome" required minLength={2} maxLength={100} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3" placeholder="Il tuo nome o nome del servizio" /></div>
              <fieldset><legend className="text-sm font-semibold">Valutazione *</legend><div className="mt-2 flex gap-2">{[1,2,3,4,5].map(n => <button key={n} type="button" onClick={() => setValutazione(n)} aria-label={`${n} stelle`} aria-pressed={valutazione === n} className="rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-primary"><Star className={`h-7 w-7 ${n <= valutazione ? "fill-primary text-primary" : "text-muted-foreground"}`} /></button>)}</div></fieldset>
              <div><label htmlFor="review-text" className="text-sm font-semibold">La tua esperienza *</label><textarea id="review-text" name="testo" required minLength={20} maxLength={1200} rows={5} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3" placeholder="Che cosa hai apprezzato? Cosa potremmo migliorare?" /></div>
              <p className="text-xs text-muted-foreground">La recensione sarà pubblica dopo la verifica. Non inserire dati personali di altre persone.</p>
              <Button type="submit" disabled={sending} className="w-fit rounded-full">{sending ? "Invio in corso..." : "Invia recensione"}</Button>
            </form>}
          </div>
        )}
        {isError && <p className="mt-8 text-sm text-muted-foreground">Le recensioni non sono ancora disponibili.</p>}
        {!isError && recensioni.length === 0 && <div className="mt-9 rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">Non ci sono ancora recensioni pubblicate. La tua potrebbe essere la prima!</div>}
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {recensioni.map(r => <article key={r.id} className="flex flex-col rounded-3xl border border-border bg-card p-7 shadow-sm">
            <div className="flex gap-1" aria-label={`${r.valutazione} stelle su 5`}>{[1,2,3,4,5].map(n => <Star key={n} className={`h-4 w-4 ${n <= r.valutazione ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />)}</div>
            <p className="mt-5 flex-1 whitespace-pre-line leading-relaxed text-foreground">{r.testo}</p>
            <div className="mt-6 border-t border-border pt-4"><p className="font-semibold">{r.nome}</p><p className="text-xs text-muted-foreground">{r.ruolo === "servizio" ? "Servizio educativo" : "Educatore / operatore"}</p></div>
          </article>)}
        </div>
      </div>
    </section>
  );
}
