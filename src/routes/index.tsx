import { createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap,
  MapPin,
  Clock,
  Euro,
  Mail,
  Phone,
  Play,
  BookOpen,
  Users,
  Heart,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduLavoro — Opportunità di lavoro in ambito educativo" },
      {
        name: "description",
        content:
          "Scopri le posizioni aperte nel mondo dell'educazione: insegnanti, educatori e formatori. Guarda il video di presentazione e candidati oggi.",
      },
      { property: "og:title", content: "EduLavoro — Opportunità di lavoro in ambito educativo" },
      {
        property: "og:description",
        content:
          "Posizioni aperte per insegnanti, educatori e formatori. Guarda il video e candidati.",
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

const jobs = [
  {
    title: "Educatore/Educatrice di asilo nido",
    location: "Roma",
    type: "Tempo pieno",
    salary: "€1.400 – €1.700 / mese",
    description:
      "Cerchiamo una figura empatica e qualificata per la cura e l'educazione di bambini da 0 a 3 anni, in un ambiente stimolante e accogliente.",
    tags: ["Infanzia", "0-3 anni", "Qualifica richiesta"],
  },
  {
    title: "Insegnante di sostegno",
    location: "Milano",
    type: "Tempo pieno",
    salary: "€1.500 – €1.900 / mese",
    description:
      "Supporto didattico personalizzato per alunni con bisogni educativi speciali nella scuola primaria e secondaria di primo grado.",
    tags: ["Sostegno", "Scuola primaria", "BES"],
  },
  {
    title: "Formatore/Formatrice per adulti",
    location: "Da remoto",
    type: "Part-time",
    salary: "€35 – €50 / ora",
    description:
      "Progettazione ed erogazione di corsi di formazione professionale per adulti, sia online che in presenza, su tematiche educative e sociali.",
    tags: ["Formazione", "Online", "FAD"],
  },
];

const values = [
  {
    icon: BookOpen,
    title: "Crescita continua",
    text: "Crediamo nella formazione permanente: ogni collaboratore ha accesso a percorsi di aggiornamento professionale.",
  },
  {
    icon: Users,
    title: "Comunità educativa",
    text: "Lavoriamo in team, condividendo buone pratiche e costruendo insieme ambienti di apprendimento inclusivi.",
  },
  {
    icon: Heart,
    title: "Passione per l'educazione",
    text: "Mettiamo la persona al centro: bambini, ragazzi e adulti con i loro bisogni, talenti e sogni.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold">EduLavoro</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex">
            <a href="#video" className="transition-colors hover:text-foreground">
              Video
            </a>
            <a href="#annunci" className="transition-colors hover:text-foreground">
              Annunci
            </a>
            <a href="#chi-sono" className="transition-colors hover:text-foreground">
              Chi sono
            </a>
            <a
              href="#contatti"
              className="rounded-full bg-primary px-5 py-2.5 text-primary-foreground transition-opacity hover:opacity-90"
            >
              Contattami
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="texture-dots">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground">
              <span className="h-2 w-2 rounded-full bg-accent" />
              3 posizioni aperte
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Lavora nel mondo dell'
              <span className="text-primary">educazione</span>, fai la
              differenza ogni giorno
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Seleziono insegnanti, educatori e formatori motivati per progetti
              educativi in tutta Italia. Scopri le posizioni aperte e unisciti
              a una comunità che crede nel valore dell'istruzione.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#annunci"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
              >
                Vedi gli annunci
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#video"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-7 py-3.5 font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Play className="h-4 w-4" />
                Guarda il video
              </a>
            </div>
          </div>

          {/* Video section */}
          <div id="video" className="scroll-mt-24">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10">
              {/* Sostituisci l'attributo src con il percorso del tuo video,
                  ad esempio /video/presentazione.mp4 dopo averlo caricato in public/video/ */}
              <video
                className="aspect-video w-full bg-secondary object-cover"
                controls
                playsInline
                preload="metadata"
                poster=""
              >
                <track kind="captions" label="Italiano" />
                Il tuo browser non supporta la riproduzione video.
              </video>
              <div className="flex items-center gap-3 px-5 py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Play className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold">Video di presentazione</p>
                  <p className="text-sm text-muted-foreground">
                    Scopri chi sono e cosa offro in pochi minuti
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job listings */}
      <section id="annunci" className="scroll-mt-24 bg-card py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold md:text-4xl">Annunci di lavoro</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Le posizioni attualmente aperte. Ogni candidatura viene letta con
              attenzione: raccontami chi sei e perché ami educare.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {jobs.map((job) => (
              <article
                key={job.title}
                className="group flex flex-col rounded-3xl border border-border bg-background p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-4 text-xl font-bold leading-snug">{job.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {job.description}
                </p>
                <dl className="mt-5 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <dd>{job.location}</dd>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <dd>{job.type}</dd>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="h-4 w-4 text-primary" />
                    <dd>{job.salary}</dd>
                  </div>
                </dl>
                <a
                  href="#contatti"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Candidati ora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About / values */}
      <section id="chi-sono" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Chi sono</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Da oltre dieci anni lavoro nel settore educativo, tra scuole,
                centri di formazione e servizi per l'infanzia. Oggi aiuto
                realtà educative a trovare le persone giuste: professionisti
                che mettono cuore e competenza nel proprio lavoro.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Il mio obiettivo è semplice: creare incontri di valore tra chi
                educa e chi cerca educatori, per costruire ambienti di
                apprendimento migliori per tutti.
              </p>
            </div>
            <div className="space-y-5">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <v.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-bold">{v.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {v.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contatti" className="scroll-mt-24 bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Pronto a fare il prossimo passo?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg opacity-90">
            Inviami il tuo curriculum e una breve presentazione: ti ricontatterò
            entro pochi giorni per conoscerci meglio.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:candidature@edulavoro.it"
              className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 font-semibold text-foreground transition-transform hover:-translate-y-0.5"
            >
              <Mail className="h-5 w-5" />
              candidature@edulavoro.it
            </a>
            <a
              href="tel:+390000000000"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary-foreground/60 px-7 py-3.5 font-semibold transition-colors hover:bg-primary-foreground/10"
            >
              <Phone className="h-5 w-5" />
              +39 000 000 0000
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-display font-semibold text-foreground">EduLavoro</span>
          </div>
          <p>© 2026 EduLavoro — Opportunità nel mondo dell'educazione</p>
        </div>
      </footer>
    </div>
  );
}
