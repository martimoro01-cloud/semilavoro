import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { areeDiIntervento } from "@/lib/annunci";
import { ArrowLeft, Megaphone } from "lucide-react";

export const Route = createFileRoute("/pubblica-annuncio")({
  head: () => ({
    meta: [
      { title: "Pubblica un annuncio — semi" },
      {
        name: "description",
        content:
          "Pubblica il tuo annuncio di lavoro in ambito educativo e raggiungi educatori e operatori del sociale.",
      },
      { property: "og:title", content: "Pubblica un annuncio — semi" },
      {
        property: "og:description",
        content: "Pubblica il tuo annuncio di lavoro in ambito educativo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PubblicaAnnuncio,
});

const inputClass =
  "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary";
const labelClass = "text-sm font-semibold";

function PubblicaAnnuncio() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-6 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna alla home
        </Link>
        <div className="mt-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Megaphone className="h-5 w-5" />
          </span>
          <h1 className="text-4xl font-bold">Pubblica un annuncio</h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">
          Compila il modulo: il tuo annuncio sarà visibile a educatori e
          operatori del sociale in tutta Italia.
        </p>

        <form
          className="mt-10 space-y-5 rounded-3xl border border-border bg-card p-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label htmlFor="titolo" className={labelClass}>
              Titolo dell'annuncio
            </label>
            <input
              id="titolo"
              type="text"
              placeholder="Es. Educatore/trice per centro diurno"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="area" className={labelClass}>
              Area di intervento
            </label>
            <select id="area" className={inputClass}>
              <option value="">Seleziona un'area</option>
              {areeDiIntervento.map((area) => (
                <option key={area.nome} value={area.nome}>
                  {area.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="sede" className={labelClass}>
                Sede di lavoro
              </label>
              <input
                id="sede"
                type="text"
                placeholder="Es. Bologna"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="orario" className={labelClass}>
                Tipo di orario
              </label>
              <select id="orario" className={inputClass}>
                <option value="">Seleziona</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>A chiamata</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="descrizione" className={labelClass}>
              Descrizione
            </label>
            <textarea
              id="descrizione"
              rows={5}
              placeholder="Descrivi il ruolo, i requisiti e cosa offrite..."
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email per le candidature
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.it"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Pubblica l'annuncio
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}
