import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { annunciInPrimoPiano } from "@/lib/annunci";
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
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="texture-dots">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Il lavoro educativo
            <br />
            cresce qui
          </h1>
          <p className="mx-auto mt-6 text-lg text-muted-foreground md:whitespace-nowrap">
            Il punto d'incontro tra chi lavora nel sociale e chi sta cercando
            proprio te.
          </p>
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            <Link
              to="/pubblica-annuncio"
              className="group flex items-center justify-between gap-3 rounded-2xl bg-primary px-6 py-5 text-left font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
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
              className="group flex items-center justify-between gap-3 rounded-2xl bg-primary px-6 py-5 text-left font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
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
        </div>
      </section>

      {/* Annunci in primo piano */}
      <section id="annunci" className="scroll-mt-24 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-bold md:text-4xl">
              Annunci in primo piano
            </h2>
            <Link
              to="/trova-lavoro"
              className="hidden items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Vedi tutti gli annunci
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {annunciInPrimoPiano.map((annuncio) => (
              <article
                key={annuncio.titolo}
                className="group flex flex-col rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
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
      <section id="dicono-di-noi" className="scroll-mt-24 bg-card py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold md:text-4xl">Dicono di noi</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <blockquote className="rounded-3xl border border-border bg-background p-7">
              <p className="leading-relaxed text-muted-foreground">
                "Grazie a semi ho trovato una cooperativa seria in pochi giorni.
                Finalmente un portale pensato per chi lavora davvero nel
                sociale."
              </p>
              <footer className="mt-4 text-sm font-semibold">
                — Giulia, educatrice di comunità
              </footer>
            </blockquote>
            <blockquote className="rounded-3xl border border-border bg-background p-7">
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
      <section id="contatti" className="scroll-mt-24 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold md:text-4xl">Contatti</h2>
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
