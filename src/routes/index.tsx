import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchAnnunci } from "@/lib/annunci-db";
import { Megaphone, Search, MapPin, Clock, ArrowRight, Mail } from "lucide-react";

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
        {/* Illustrazioni botaniche lineari: richiamo alla crescita e al nome SEMI */}
        <svg aria-hidden="true" viewBox="0 0 280 480" fill="none" className="pointer-events-none absolute -left-20 top-10 hidden h-[480px] w-[280px] text-brand-green opacity-30 lg:block" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M85 480 C115 395 75 340 130 258 S172 125 147 20"/>
          <path d="M111 370 C43 340 30 294 35 255 C95 263 125 302 111 370Z M123 320 C172 269 213 260 247 270 C230 321 177 348 123 320Z M137 250 C76 222 63 175 74 135 C129 150 150 189 137 250Z M151 177 C207 152 230 111 225 72 C178 83 151 116 151 177Z M145 92 C102 76 86 46 90 13 C127 24 145 47 145 92Z"/>
          <path d="M111 370 L35 255 M123 320 L247 270 M137 250 L74 135 M151 177 L225 72 M145 92 L90 13" opacity=".6"/>
          <circle cx="83" cy="424" r="48" strokeDasharray="3 9" opacity=".45"/>
        </svg>
        <svg aria-hidden="true" viewBox="0 0 300 460" fill="none" className="pointer-events-none absolute -right-24 bottom-0 hidden h-[460px] w-[300px] text-brand-green opacity-25 lg:block" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M150 460 C128 370 191 308 153 232 C118 161 168 94 180 12"/>
          <path d="M147 400 C77 393 42 354 38 305 C101 308 149 343 147 400Z M157 337 C213 327 247 291 263 243 C200 247 165 276 157 337Z M158 251 C93 234 65 196 61 150 C122 163 158 194 158 251Z M159 164 C225 140 249 99 252 59 C197 69 167 110 159 164Z"/>
          <path d="M147 400 L38 305 M157 337 L263 243 M158 251 L61 150 M159 164 L252 59" opacity=".55"/>
          <circle cx="203" cy="402" r="46" strokeDasharray="2 8" opacity=".5"/>
          <circle cx="222" cy="390" r="12" opacity=".45"/>
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

      {/* Dicono di noi */}
      <section id="dicono-di-noi" className="scroll-mt-24 border-t border-border bg-background py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold md:text-4xl"><span className="mb-3 block font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green">La comunità</span>Dicono di noi</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <blockquote className="rounded-3xl border border-brand-green bg-background p-7">
              <p className="leading-relaxed text-muted-foreground">
                "Grazie a semi ho trovato una cooperativa seria in pochi giorni.
                Finalmente un portale pensato per chi lavora davvero nel
                sociale."
              </p>
              <footer className="mt-4 text-sm font-semibold">
                — Giulia, educatrice di comunità
              </footer>
            </blockquote>
            <blockquote className="rounded-3xl border border-brand-green bg-background p-7">
              <p className="leading-relaxed text-muted-foreground">
                "Pubblicare un annuncio è semplicissimo e le candidature
                arrivano già filtrate per area di intervento. Lo consiglio."
              </p>
              <footer className="mt-4 text-sm font-semibold">
                — Marco, coordinatore di servizi educativi
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

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
