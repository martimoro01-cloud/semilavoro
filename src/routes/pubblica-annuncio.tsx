import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
import { SiteLayout } from "@/components/SiteLayout";
import { areeDiIntervento } from "@/lib/annunci";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { AnnuncioRow } from "@/lib/annunci-db";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import regioniProvince from "@/lib/regioni-province.json";

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
  validateSearch: (search: Record<string, unknown>): { id?: string } => (typeof search["id"] === "string" ? { id: search["id"] } : {}),
  component: PubblicaAnnuncio,
});

const inputClass =
  "mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50";
const labelClass = "text-sm font-medium";
const locations: Record<string, string[]> = regioniProvince;

function PubblicaAnnuncio() {
  const [regione, setRegione] = useState("");
  const [provincia, setProvincia] = useState("");
  const [impegno, setImpegno] = useState("Full-time");
  const [inPrimoPiano, setInPrimoPiano] = useState(false);
  const [errore, setErrore] = useState("");
  const [invio, setInvio] = useState(false);
  const { user, tipo, loading } = useAccount();
  const navigate = useNavigate();
  const { id } = Route.useSearch();
  const [esistente, setEsistente] = useState<AnnuncioRow | null>(null);
  const [caricato, setCaricato] = useState(!id);

  useEffect(() => {
    if (!id || !user) return;
    supabase.from("annunci").select("*").eq("id", id).eq("owner_id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setEsistente(data);
        setRegione(data.regione);
        setProvincia(data.provincia);
        setImpegno(data.impegno);
        setInPrimoPiano(data.in_primo_piano);
      }
      setCaricato(true);
    });
  }, [id, user]);

  async function pubblica(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const min = Number(f.get("guadagno_min"));
    const max = Number(f.get("guadagno_max"));
    if (max < min) return setErrore("Il guadagno massimo deve essere uguale o superiore al minimo.");
    setErrore("");
    setInvio(true);
    const valori = {
      servizio: String(f.get("servizio")),
      area: String(f.get("area")),
      regione,
      provincia,
      mansione: String(f.get("mansione")),
      impegno,
      guadagno_min: min,
      guadagno_max: max,
      note_retribuzione: String(f.get("note_retribuzione")),
      email: String(f.get("email")),
      informazioni: String(f.get("informazioni")),
      in_primo_piano: inPrimoPiano,
      tipologia_contratto: String(f.get("tipologia_contratto")),
      durata_contratto: String(f.get("durata_contratto") || "") || null,
      contratto_dal: String(f.get("contratto_dal") || "") || null,
      contratto_al: String(f.get("contratto_al") || "") || null,
    };
    const { error } = esistente
      ? await supabase.from("annunci").update(valori).eq("id", esistente.id).eq("owner_id", user!.id)
      : await supabase.from("annunci").insert({ ...valori, owner_id: user!.id });
    setInvio(false);
    if (error) return setErrore("Salvataggio non riuscito, riprova.");
    navigate({ to: "/area-personale" });
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Torna alla home
        </Link>
        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{id ? "Modifica annuncio" : "Pubblica un annuncio"}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {"\n"}
        </p>
        {loading ? null : !user || tipo !== "servizio" ? (
          <div className="mt-6 rounded-lg border border-border bg-card p-7 text-sm">
            <p className="text-muted-foreground">{user ? "La pubblicazione è riservata agli account dei servizi educativi." : "Per pubblicare un annuncio accedi o registrati come servizio educativo."}</p>
            {!user && <Button asChild className="mt-4 rounded-full shadow-none"><Link to="/auth">Accedi o registrati</Link></Button>}
          </div>
        ) : !caricato ? null : id && !esistente ? (
          <p className="mt-6 text-sm text-muted-foreground">Annuncio non trovato o non modificabile.</p>
        ) : (
        <form key={esistente?.id ?? "nuovo"} className="mt-6 space-y-5 rounded-lg border border-border bg-card p-5 sm:p-7" onSubmit={pubblica}>
          <div>
            <label htmlFor="servizio" className={labelClass}>Nome del servizio *</label>
            <input id="servizio" name="servizio" defaultValue={esistente?.servizio} required placeholder="Es. Cooperativa sociale La Rondine" className={inputClass} />
          </div>
          <div>
            <label htmlFor="area" className={labelClass}>Area di intervento *</label>
            <select id="area" name="area" required className={inputClass} defaultValue={esistente?.area ?? ""}>
              <option value="">Scegli un’area</option>
              {areeDiIntervento.map((area) => <option key={area.nome}>{area.nome}</option>)}
            </select>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="regione" className={labelClass}>Regione *</label>
              <select id="regione" required className={inputClass} value={regione} onChange={(event) => { setRegione(event.target.value); setProvincia(""); }}>
                <option value="">Scegli la regione</option>
                {Object.keys(locations).map((name) => <option key={name}>{name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="provincia" className={labelClass}>Provincia *</label>
              <select id="provincia" required disabled={!regione} className={inputClass} value={provincia} onChange={(event) => setProvincia(event.target.value)}>
                <option value="">{regione ? "Scegli la provincia" : "Seleziona prima la regione"}</option>
                {(locations[regione] ?? []).map((name) => <option key={name}>{name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="mansione" className={labelClass}>Tipo di mansione *</label>
            <input id="mansione" name="mansione" defaultValue={esistente?.mansione} required placeholder="Es. Educatore/trice per centro diurno" className={inputClass} />
          </div>
          <fieldset>
            <legend className={labelClass}>Impegno *</legend>
            <div className="mt-2 flex gap-2" role="group" aria-label="Impegno">
              {["Full-time", "Part-time"].map((value) => (
                <Button key={value} type="button" size="sm" variant={impegno === value ? "default" : "outline"} aria-pressed={impegno === value} onClick={() => setImpegno(value)} className="rounded-full shadow-none">{value}</Button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="tipologia" className={labelClass}>Tipologia di contratto *</label>
            <select id="tipologia" name="tipologia_contratto" required defaultValue={esistente?.tipologia_contratto ?? ""} className={inputClass}>
              <option value="">Scegli la tipologia</option>
              {["Tempo indeterminato", "Tempo determinato", "Libera professione", "Collaborazione", "Stage / tirocinio", "Sostituzione"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="durata" className={labelClass}>Durata</label>
              <input id="durata" name="durata_contratto" defaultValue={esistente?.durata_contratto ?? ""} placeholder="Es. 12 mesi" className={inputClass} />
            </div>
            <div>
              <label htmlFor="dal" className={labelClass}>Dal</label>
              <input id="dal" name="contratto_dal" type="date" defaultValue={esistente?.contratto_dal ?? ""} className={inputClass} />
            </div>
            <div>
              <label htmlFor="al" className={labelClass}>Al</label>
              <input id="al" name="contratto_al" type="date" defaultValue={esistente?.contratto_al ?? ""} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="guadagno-min" className={labelClass}>Guadagno annuale lordo (€) *</label>
            <div className="grid grid-cols-2 gap-3">
              <input id="guadagno-min" name="guadagno_min" defaultValue={esistente?.guadagno_min} aria-label="Guadagno annuale lordo minimo" type="number" min="0" required placeholder="Min (es. 22000)" className={inputClass} />
              <input id="guadagno-max" name="guadagno_max" defaultValue={esistente?.guadagno_max} aria-label="Guadagno annuale lordo massimo" type="number" min="0" required placeholder="Max (es. 28000)" className={inputClass} />
            </div>
            <input name="note_retribuzione" defaultValue={esistente?.note_retribuzione} aria-label="Note sulla retribuzione" required placeholder="Note (es. CCNL Coop. Sociali, da concordare...)" className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email di contatto *</label>
            <input id="email" name="email" defaultValue={esistente?.email} type="email" required placeholder="candidature@tuoservizio.it" className={inputClass} />
          </div>
          <div>
            <label htmlFor="informazioni" className={labelClass}>Altre informazioni *</label>
            <textarea id="informazioni" name="informazioni" defaultValue={esistente?.informazioni} rows={4} required placeholder="Scrivi liberamente..." className={inputClass} />
            <p className="mt-1.5 text-xs text-muted-foreground">Benefit, requisiti preferenziali, modalità di candidatura, scadenze.</p>
          </div>
          <div className="flex items-start gap-3 rounded-md border border-border p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="flex-1">
              <label htmlFor="primo-piano" className="text-sm font-medium">Metti l’annuncio in primo piano</label>
              <p className="mt-1 text-xs text-muted-foreground">Gli annunci in primo piano appaiono nella sezione in evidenza della home.</p>
            </div>
            <Switch id="primo-piano" checked={inPrimoPiano} onCheckedChange={setInPrimoPiano} />
          </div>
          {errore && <p role="alert" className="text-sm text-destructive">{errore}</p>}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
            <Button asChild variant="ghost" className="rounded-full"><Link to="/">Annulla</Link></Button>
            <Button type="submit" disabled={invio} className="rounded-full px-5 shadow-none"><Send />{esistente ? "Salva modifiche" : "Pubblica annuncio"}</Button>
          </div>
        </form>
        )}
      </section>
    </SiteLayout>
  );
}
