import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { trovaArea, type Annuncio } from "@/lib/annunci";
import { useQuery } from "@tanstack/react-query";
import { fetchAnnunci } from "@/lib/annunci-db";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
import {
  ArrowLeft,
  MapPin,
  Clock,
  SearchX,
  Send,
  ChevronDown,
} from "lucide-react";

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

const inputClass =
  "mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const labelClass = "text-sm font-medium";

function CandidaturaForm({ annuncio }: { annuncio: Annuncio }) {
  const { user, tipo, loading } = useAccount();
  const volontariato = annuncio.tipo_opportunita === "volontario";
  const [stato, setStato] = useState<"idle" | "invio" | "ok" | "errore" | "doppia">("idle");

  if (loading) return null;
  if (!user || tipo !== "educatore") {
    return (
      <div className="mt-6 border-t border-border pt-6 text-sm">
        <p className="text-muted-foreground">
          {user ? "Le candidature sono riservate agli account educatore." : "Per candidarti accedi o registrati come educatore."}
        </p>
        {!user && (
          <Link to="/auth" className="mt-3 inline-flex rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground">Accedi o registrati</Link>
        )}
      </div>
    );
  }
  if (stato === "ok") {
    return (
      <div className="mt-6 border-t border-border pt-6 text-sm">
        <p role="status" className="font-semibold">Candidatura inviata! La trovi nella tua area personale.</p>
        <Link to="/area-personale" className="mt-2 inline-block font-semibold text-primary underline">Vai all’area personale</Link>
      </div>
    );
  }

  async function invia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    if (f.get("privacy_candidatura") !== "on") return setStato("errore");
    const file = f.get(volontariato ? "lettera_motivazionale" : "cv") as File;
    if (!file || file.size === 0) return setStato("errore");
    setStato("invio");
    const path = `${user!.id}/${annuncio.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const up = await supabase.storage.from("cv").upload(path, file);
    if (up.error) return setStato("errore");
    const { data: prof } = await supabase.from("profiles").select("nome").eq("id", user!.id).maybeSingle();
    const { error } = await supabase.from("candidature").insert({
      annuncio_id: annuncio.id,
      candidato_id: user!.id,
      nome: prof?.nome ?? "",
      email: String(f.get("email")),
      cellulare: String(f.get("telefono")),
      lettera: String(f.get("lettera")),
      cv_path: path,
    });
    if (error) return setStato(error.code === "23505" ? "doppia" : "errore");
    setStato("ok");
  }

  return (
    <form className="mt-6 space-y-4 border-t border-border pt-6" onSubmit={invia}>
      <p className="text-sm text-muted-foreground">
        Ti stai candidando per <strong>{annuncio.titolo}</strong>. I campi contrassegnati con * sono obbligatori.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`email-${annuncio.id}`} className={labelClass}>
            Email *
          </label>
          <input
            id={`email-${annuncio.id}`}
            name="email"
            type="email"
            required
            defaultValue={user.email ?? ""}
            placeholder="tu@email.it"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`tel-${annuncio.id}`} className={labelClass}>
            Numero di cellulare *
          </label>
          <input
            id={`tel-${annuncio.id}`}
            name="telefono"
            type="tel"
            required
            placeholder="Es. 333 1234567"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor={`cv-${annuncio.id}`} className={labelClass}>
          {volontariato ? "Lettera motivazionale *" : "Curriculum vitae *"}
        </label>
        <input
          id={`cv-${annuncio.id}`}
          name={volontariato ? "lettera_motivazionale" : "cv"}
          type="file"
          required
          accept=".pdf,.doc,.docx"
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Formati accettati: PDF, DOC, DOCX.
        </p>
      </div>
      <div>
        <label htmlFor={`lettera-${annuncio.id}`} className={labelClass}>
          Messaggio (facoltativo)
        </label>
        <textarea
          id={`lettera-${annuncio.id}`}
          name="lettera"
          rows={5}
          placeholder="Scrivi un messaggio per l’ente, se desideri..."
          className={inputClass}
        />
      </div>
      <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
        <input type="checkbox" name="privacy_candidatura" required className="mt-1 h-4 w-4 shrink-0 accent-primary" />
        <span>Ho letto e compreso l’<Link to="/privacy" target="_blank" className="font-semibold text-primary underline underline-offset-2">Informativa sulla Privacy</Link> e acconsento al trattamento dei miei dati personali, inclusi quelli contenuti {volontariato ? "nella lettera motivazionale" : "nel CV"}, per le finalità di gestione della candidatura e di contatto da parte dei datori di lavoro.</span>
      </label>
      {stato === "errore" && <p role="alert" className="text-sm text-destructive">Invio non riuscito, riprova.</p>}
      {stato === "doppia" && <p role="alert" className="text-sm text-destructive">Ti sei già candidato a questo annuncio.</p>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={stato === "invio"}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Send className="h-4 w-4" />
          Invia candidatura
        </button>
      </div>
    </form>
  );
}

export function AnnuncioCard({ annuncio }: { annuncio: Annuncio }) {
  const [open, setOpen] = useState(false);
  const [dettagliAperti, setDettagliAperti] = useState(false);
  const volontario = annuncio.tipo_opportunita === "volontario";

  return (
    <article className="flex flex-col rounded-3xl border border-border bg-card p-7 transition-all hover:shadow-xl hover:shadow-primary/10">
      <span className="inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
        {annuncio.area}
      </span>
      <h2 className="mt-4 text-2xl font-bold leading-snug break-words">{annuncio.servizio}</h2>
      <p className="mt-2 text-lg font-semibold leading-snug text-foreground/85">{annuncio.titolo}</p>
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
      <button type="button" onClick={() => setDettagliAperti(v => !v)} aria-expanded={dettagliAperti} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4">
        {dettagliAperti ? "Nascondi dettagli" : "Visualizza dettagli dell’annuncio"}
        <ChevronDown className={`h-4 w-4 transition-transform ${dettagliAperti ? "rotate-180" : ""}`} />
      </button>
      {dettagliAperti && <div className="mt-4 space-y-3 rounded-2xl border border-border bg-background/60 p-5 text-sm">
        <p><strong>Servizio:</strong> {annuncio.servizio}</p>
        {annuncio.emailServizio && <p><strong>Email del servizio:</strong> <a className="break-all text-primary underline underline-offset-2" href={`mailto:${annuncio.emailServizio}`}>{annuncio.emailServizio}</a></p>
        <p><strong>Sede:</strong> {annuncio.sede}{annuncio.regione ? `, ${annuncio.regione}` : ""}</p>
        {!volontario && <>
          <p><strong>Impegno:</strong> {annuncio.orario}</p>
          <p><strong>Retribuzione annua lorda:</strong> {annuncio.ralMin?.toLocaleString("it-IT")} € – {annuncio.ralMax?.toLocaleString("it-IT")} €</p>
          <p><strong>Tipologia di contratto:</strong> {annuncio.contratto || "Non indicata"}</p>
          <p><strong>Durata:</strong> {annuncio.durataContratto === "determinato" ? "Tempo determinato" : "Tempo indeterminato"}</p>
          {annuncio.durataContratto === "determinato" && annuncio.contrattoDal && annuncio.contrattoAl && <p><strong>Periodo:</strong> {new Date(annuncio.contrattoDal + "T12:00:00").toLocaleDateString("it-IT")} – {new Date(annuncio.contrattoAl + "T12:00:00").toLocaleDateString("it-IT")}</p>}
        </>}
        {annuncio.informazioni?.trim() && <div><p className="font-semibold">{volontario ? "Descrizione dell’attività e impegno richiesto" : "Altre informazioni"}</p><p className="mt-1 whitespace-pre-line text-muted-foreground">{annuncio.informazioni}</p></div>}
      </div>}
      {annuncio.chiuso ? (
        <p className="mt-6 text-sm font-semibold text-muted-foreground">Candidature chiuse</p>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Candidati
            <ChevronDown
              className={`h-4 w-4 text-primary transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && <CandidaturaForm annuncio={annuncio} />}
        </>
      )}
    </article>
  );
}

function AreaPage() {
  const { area } = Route.useLoaderData();
  const { data: annunci = [], isLoading } = useQuery({ queryKey: ["annunci", area.nome], queryFn: () => fetchAnnunci({ area: area.nome }) });

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

        {isLoading ? null : annunci.length === 0 ? (
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
              <AnnuncioCard key={annuncio.id} annuncio={annuncio} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
