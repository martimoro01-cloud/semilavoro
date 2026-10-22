import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, CalendarClock, Filter, Plus, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type Bando = Database["public"]["Tables"]["bandi"]["Row"];
const tipi = { concorso: "Concorso pubblico", avviso: "Avviso pubblico", bando_enti: "Bando per enti" } as const;
const dateIt = (value: string) => new Date(value).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
const isExpired = (value: string) => new Date(value).getTime() < Date.now();

export const Route = createFileRoute("/concorsi-bandi")({
  head: () => ({ meta: [{ title: "Concorsi e bandi — SEMI" }, { name: "description", content: "Concorsi pubblici, avvisi e bandi per il settore educativo e sociale: filtra per territorio e scadenza." }] }),
  component: ConcorsiBandi,
});

function ConcorsiBandi() {
  const { user } = useAccount();
  const client = useQueryClient();
  const [tipo, setTipo] = useState("tutti");
  const [regione, setRegione] = useState("tutte");
  const [soloAperti, setSoloAperti] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { data: admin = false } = useQuery({
    queryKey: ["bandi-admin", user?.id], enabled: !!user,
    queryFn: async () => { const { data, error } = await supabase.rpc("is_bandi_admin"); if (error) return false; return data === true; },
  });
  const { data: bandi = [], isLoading, isError } = useQuery({
    queryKey: ["bandi", admin],
    queryFn: async () => {
      const { data, error } = await supabase.from("bandi").select("*").order("scadenza", { ascending: true }).limit(300);
      if (error) throw error;
      return data;
    },
  });
  const pubblici = bandi.filter(b => admin || b.pubblicato);
  const regioni = [...new Set(pubblici.map(b => b.regione))].sort((a,b) => a.localeCompare(b));
  const filtrati = pubblici.filter(b => (tipo === "tutti" || b.tipo === tipo) && (regione === "tutte" || b.regione === regione) && (!soloAperti || !isExpired(b.scadenza)));
  async function crea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!admin) return;
    const form = event.currentTarget;
    const f = new FormData(form);
    const scadenza = String(f.get("scadenza"));
    const url = String(f.get("url_ufficiale")).trim();
    if (!url.startsWith("https://") || !scadenza) return setFeedback("Inserisci una scadenza e un link HTTPS alla fonte ufficiale.");
    setSaving(true); setFeedback("");
    const { error } = await supabase.from("bandi").insert({
      titolo: String(f.get("titolo")).trim(), ente: String(f.get("ente")).trim(),
      tipo: String(f.get("tipo")) as Bando["tipo"], regione: String(f.get("regione")).trim(),
      professione: String(f.get("professione")).trim(), descrizione: String(f.get("descrizione")).trim(),
      scadenza: new Date(scadenza).toISOString(), url_ufficiale: url,
      fonte: "manuale", verificato: true, pubblicato: false,
    });
    setSaving(false);
    if (error) return setFeedback("Non è stato possibile salvare il bando. Controlla i dati e i permessi.");
    form.reset(); setShowForm(false); setFeedback("Bando salvato come bozza. Puoi pubblicarlo dopo la verifica.");
    await client.invalidateQueries({ queryKey: ["bandi"] });
  }
  async function setPubblicato(b: Bando, pubblicato: boolean) {
    if (!admin) return;
    if (pubblicato && !b.verificato) return setFeedback("Verifica prima il bando e la fonte ufficiale.");
    const { error } = await supabase.from("bandi").update({ pubblicato, updated_at: new Date().toISOString() }).eq("id", b.id);
    if (error) return setFeedback("Aggiornamento non riuscito.");
    await client.invalidateQueries({ queryKey: ["bandi"] });
  }
  async function verifica(b: Bando) {
    if (!admin) return;
    const { error } = await supabase.from("bandi").update({ verificato: true, updated_at: new Date().toISOString() }).eq("id", b.id);
    if (error) return setFeedback("Verifica non riuscita.");
    await client.invalidateQueries({ queryKey: ["bandi"] });
  }
  return <SiteLayout>
    <section className="border-b border-border bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Torna alla homepage</Link>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-primary">Opportunità, selezioni e finanziamenti</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-bold leading-tight md:text-7xl">Concorsi <span className="font-display italic text-primary">&</span> bandi.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">Scopri le opportunità per chi lavora nell'educazione e nel sociale. Consulta sempre il testo ufficiale prima di candidarti.</p>
      </div>
    </section>
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Esplora le opportunità</h2>
        {admin && <Button className="rounded-full" onClick={() => setShowForm(v => !v)}><Plus className="h-4 w-4" /> {showForm ? "Chiudi modulo" : "Inserisci bando"}</Button>}
      </div>
      {feedback && <p role="status" className="mt-4 rounded-xl border border-border p-4 text-sm">{feedback}</p>}
      {admin && showForm && <form onSubmit={crea} className="mt-6 grid gap-4 rounded-3xl border border-border bg-card p-6 md:grid-cols-2">
        <p className="font-semibold md:col-span-2">Nuovo bando (salvato come bozza)</p>
        {([["titolo","Titolo"],["ente","Ente promotore"],["regione","Regione / Nazionale"],["professione","Professione / destinatari"],["url_ufficiale","Link ufficiale HTTPS"]] as const).map(([name,label]) => <label key={name} className="grid gap-1 text-sm font-semibold">{label}<input name={name} required={name !== "professione"} minLength={name === "titolo" ? 8 : undefined} type={name === "url_ufficiale" ? "url" : "text"} className="rounded-xl border border-input bg-background px-4 py-3 font-normal" /></label>)}
        <label className="grid gap-1 text-sm font-semibold">Tipologia<select name="tipo" className="rounded-xl border border-input bg-background px-4 py-3 font-normal">{Object.entries(tipi).map(([key,value]) => <option key={key} value={key}>{value}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-semibold">Scadenza<input name="scadenza" type="datetime-local" required className="rounded-xl border border-input bg-background px-4 py-3 font-normal" /></label>
        <label className="grid gap-1 text-sm font-semibold md:col-span-2">Descrizione<textarea name="descrizione" rows={3} className="rounded-xl border border-input bg-background px-4 py-3 font-normal" /></label>
        <Button type="submit" disabled={saving} className="w-fit rounded-full">{saving ? "Salvataggio..." : "Salva bozza"}</Button>
      </form>}
      <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="grid gap-2 text-sm font-semibold"><span className="flex items-center gap-2"><Filter className="h-4 w-4" /> Tipologia</span><select value={tipo} onChange={e => setTipo(e.target.value)} className="rounded-xl border border-input bg-background px-4 py-3 font-normal"><option value="tutti">Tutte le tipologie</option>{Object.entries(tipi).map(([key,value]) => <option key={key} value={key}>{value}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-semibold">Territorio<select value={regione} onChange={e => setRegione(e.target.value)} className="rounded-xl border border-input bg-background px-4 py-3 font-normal"><option value="tutte">Tutte le regioni</option>{regioni.map(r => <option key={r}>{r}</option>)}</select></label>
        <label className="flex items-center gap-2 pb-3 text-sm font-semibold"><input type="checkbox" checked={soloAperti} onChange={e => setSoloAperti(e.target.checked)} /> Solo bandi aperti</label>
      </div>
      {isLoading && <p className="mt-8 text-muted-foreground">Caricamento opportunità...</p>}
      {isError && <p role="alert" className="mt-8 text-muted-foreground">I bandi non sono ancora disponibili. La funzione richiede l'attivazione del database.</p>}
      {!isLoading && !isError && filtrati.length === 0 && <p className="mt-8 rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">Nessuna opportunità corrisponde ai filtri selezionati.</p>}
      <div className="mt-8 grid gap-4">
        {filtrati.map(b => <article key={b.id} className="grid gap-5 rounded-3xl border border-border bg-card p-6 transition-shadow hover:shadow-lg md:grid-cols-[120px_1fr_auto] md:items-center md:p-8">
          <div className="flex w-fit min-w-24 flex-col items-center rounded-2xl bg-muted/50 px-5 py-4 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Scadenza</span>
            <strong className="mt-1 text-3xl">{new Date(b.scadenza).toLocaleDateString("it-IT", {day:"2-digit"})}</strong>
            <span className="text-sm font-semibold uppercase">{new Date(b.scadenza).toLocaleDateString("it-IT", {month:"short",year:"numeric"})}</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary"><span>{tipi[b.tipo]}</span><span>·</span><span>{b.regione}</span>{isExpired(b.scadenza) && <span className="text-muted-foreground">· Scaduto</span>}{admin && !b.pubblicato && <span className="text-muted-foreground">· Bozza</span>}</div>
            <h3 className="mt-2 text-xl font-bold md:text-2xl">{b.titolo}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{b.ente}{b.professione ? ` · ${b.professione}` : ""}</p>
            {b.descrizione && <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{b.descrizione}</p>}
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><CalendarClock className="h-4 w-4" /> Scade il {dateIt(b.scadenza)} · Fonte {b.fonte === "automatica" ? "importata" : "inserita manualmente"}</p>
            {admin && <div className="mt-4 flex flex-wrap gap-2">
              {!b.verificato && <Button size="sm" variant="outline" onClick={() => verifica(b)}><ShieldCheck className="h-4 w-4" /> Segna verificato</Button>}
              <Button size="sm" variant="outline" onClick={() => setPubblicato(b, !b.pubblicato)}>{b.pubblicato ? "Nascondi" : "Pubblica"}</Button>
            </div>}
          </div>
          <a href={b.url_ufficiale} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-90">Fonte ufficiale <ArrowUpRight className="h-4 w-4" /></a>
        </article>)}
      </div>
    </section>
  </SiteLayout>;
}
