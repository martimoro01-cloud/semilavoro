import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { annunciPerArea, trovaArea } from "@/lib/annunci";
import { ArrowLeft, MapPin, Clock, SearchX } from "lucide-react";

export const Route = createFileRoute("/trova-lavoro/$area")({
  loader: ({ params }) => {
    const area = trovaArea(params.area);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Area non trovata — semi" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { area } = loaderData;
    return {
      meta: [
        { title: `${area.nome} — Trova lavoro — semi` },
        {
          name: "description",
          content: `Annunci di lavoro nell'area ${area.nome}: ${area.descrizione}`,
        },
        { property: "og:title", content: `${area.nome} — Trova lavoro — semi` },
        {
          property: "og:description",
          content: `Annunci di lavoro nell'area ${area.nome}: ${area.descrizione}`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: AreaNotFound,
  component: AreaPage,
});

function AreaNotFound() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold md:text-5xl">Area non trovata</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          L'area di intervento che cerchi non esiste.
        </p>
        <Link
          to="/trova-lavoro"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna alle aree di intervento
        </Link>
      </section>
    </SiteLayout>
  );
}

function AreaPage() {
  const { area } = Route.useLoaderData();
  const annunci = annunciPerArea(area.nome);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Link
          to="/trova-lavoro"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Tutte le aree di intervento
        </Link>
        <h1 className="mt-6 text-4xl font-bold md:text-5xl">{area.nome}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{area.descrizione}</p>

        {annunci.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-border bg-card p-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <SearchX className="h-6 w-6" />
            </span>
            <p className="mt-5 text-xl font-bold">Nessun annuncio disponibile</p>
            <p className="mt-2 text-muted-foreground">
              Torna presto: pubblicheremo nuove opportunità per quest'area.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6">
            {annunci.map((annuncio) => (
              <article
                key={annuncio.titolo}
                className="flex flex-col rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <span className="inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                  {annuncio.area}
                </span>
                <h2 className="mt-4 text-xl font-bold leading-snug">
                  {annuncio.titolo}
                </h2>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    {annuncio.sede}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    {annuncio.orario}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
