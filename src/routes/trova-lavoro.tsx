import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { areeDiIntervento } from "@/lib/annunci";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/trova-lavoro")({
  head: () => ({
    meta: [
      { title: "Trova lavoro — semi" },
      {
        name: "description",
        content:
          "Scegli l'area di intervento che fa per te: prima infanzia, minori, mamma-bambino, dipendenze, anziani, disabilità.",
      },
      { property: "og:title", content: "Trova lavoro — semi" },
      {
        property: "og:description",
        content: "Scegli l'area di intervento che fa per te e trova lavoro in ambito educativo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrovaLavoro,
});

function TrovaLavoro() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna alla home
        </Link>
        <h1 className="mt-6 text-4xl font-bold md:text-5xl">Trova lavoro</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Scegli l'area di intervento che fa per te.
        </p>

        <h2 className="mt-12 text-2xl font-bold">Scegli l'area di intervento</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {areeDiIntervento.map((area) => (
            <button
              key={area.nome}
              type="button"
              className="group flex items-center justify-between gap-3 rounded-2xl bg-primary px-6 py-5 text-left font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
            >
              <span>
                <span className="block text-lg">{area.nome}</span>
                <span className="mt-1 block text-sm font-normal opacity-80">
                  {area.descrizione}
                </span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
