import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Download, Eye, LogOut, Mail, MapPin, Phone, Users, Pencil, Archive, PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
import { statoLabel, type AnnuncioRow, type CandidaturaRow, type StatoCandidatura } from "@/lib/annunci-db";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/area-personale")({
  head: () => ({
    meta: [
      { title: "Area personale — semi" },
      { name: "description", content: "Il tuo profilo su semi: candidature, risposte, colloqui e candidati." },
      { property: "og:title", content: "Area personale — semi" },
      { property: "og:description", content: "Gestisci candidature e annunci su semi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AreaPersonale,
});

const inputClass = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function formatData(value: string | null) {
  return value ? new Date(value).toLocaleString("it-IT", { dateStyle: "full", timeStyle: "short" }) : "";
}

function StatoBadge({ stato }: { stato: StatoCandidatura }) {
  const tone = stato === "rifiutata" ? "border border-border text-muted-foreground" : stato === "in_attesa" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{statoLabel[stato]}</span>;
}

async function gestisciCv(path: string, mode: "view" | "download") {
  if (!path) throw new Error("CV non disponibile.");
  const { data, error } = await supabase.storage.from("cv").download(path);
  if (error || !data) throw error ?? new Error("Download non disponibile.");
  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = path.split("/").pop() || "curriculum";
  if (mode === "view") {
    // Apertura nel contesto corrente: evita i blocchi popup.
    window.location.assign(url);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } else {
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}

function AreaPersonale() {
  const { user, tipo, loading } = useAccount();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profilo } = useQuery({
    queryKey: ["profilo", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("nome").eq("id", user!.id).maybeSingle()).data,
  });

  const [modificaProfilo, setModificaProfilo] = useState(false);
  const [nome, setNome] = useState("");
  const [salvataggioProfilo, setSalvataggioProfilo] = useState(false);
  const [erroreProfilo, setErroreProfilo] = useState("");

  async function salvaProfilo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !nome.trim()) return;
    setSalvataggioProfilo(true);
    setErroreProfilo("");
    const { error } = await supabase.from("profiles").update({ nome: nome.trim() }).eq("id", user.id);
    setSalvataggioProfilo(false);
    if (error) return setErroreProfilo("Non è stato possibile salvare il profilo.");
    await queryClient.invalidateQueries({ queryKey: ["profilo", user.id] });
    setModificaProfilo(false);
  }

  async function esci() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {tipo === "servizio" ? "Servizio educativo" : tipo === "educatore" ? "Educatore / operatore" : ""}
            </p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Ciao{profilo?.nome ? `, ${profilo.nome}` : ""}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" className="rounded-full shadow-none" onClick={esci}><LogOut />Esci</Button>
        </div>
        {user && <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div><h2 className="text-xl font-bold">Il mio profilo</h2><p className="mt-1 text-sm text-muted-foreground">Aggiorna il nome visualizzato sul tuo account.</p></div>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => { setNome(profilo?.nome ?? ""); setErroreProfilo(""); setModificaProfilo(!modificaProfilo); }}><Pencil className="h-4 w-4" />Modifica</Button>
          </div>
          {modificaProfilo && <form className="mt-5 space-y-3 border-t border-border pt-5" onSubmit={salvaProfilo}>
            <label htmlFor="nome-profilo" className="block text-sm font-semibold">Nome o nome del servizio</label>
            <input id="nome-profilo" className={inputClass} value={nome} onChange={e => setNome(e.target.value)} maxLength={120} required />
            {erroreProfilo && <p role="alert" className="text-sm text-destructive">{erroreProfilo}</p>}
            <Button type="submit" disabled={salvataggioProfilo} className="rounded-full">{salvataggioProfilo ? "Salvataggio..." : "Salva modifiche"}</Button>
          </form>}
        </div>}
        {loading ? null : tipo === "servizio" ? <AreaServizio userId={user!.id} /> : user ? <AreaEducatore userId={user.id} /> : null}
      </section>
    </SiteLayout>
  );
}

function AreaEducatore({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["mie-candidature", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidature")
        .select("*, annunci(mansione, servizio, area, provincia, impegno)")
        .eq("candidato_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const colloqui = (data ?? []).filter((c) => c.colloquio_at);

  return (
    <>
      <h2 className="mt-10 text-2xl font-bold">Colloqui fissati</h2>
      {colloqui.length === 0 ? (
        <p className="mt-3 text-muted-foreground">Nessun colloquio fissato per ora.</p>
      ) : (
        <div className="mt-4 grid gap-3">
          {colloqui.map((c) => (
            <div key={c.id} className="flex items-start gap-3 rounded-2xl border border-brand-green p-5">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold">{c.annunci?.mansione} — {c.annunci?.servizio}</p>
                <p className="text-sm">{formatData(c.colloquio_at)}</p>
                {c.colloquio_luogo && <p className="text-sm text-muted-foreground">{c.colloquio_luogo}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 text-2xl font-bold">Le mie candidature</h2>
      {isLoading ? null : (data ?? []).length === 0 ? (
        <div className="mt-4 rounded-3xl border border-border p-8 text-center">
          <p className="font-semibold">Non ti sei ancora candidato a nessun annuncio.</p>
          <Button asChild className="mt-4 rounded-full shadow-none"><Link to="/trova-lavoro">Trova lavoro</Link></Button>
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          {data!.map((c) => (
            <article key={c.id} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">{c.annunci?.mansione}</h3>
                  <p className="text-sm text-muted-foreground">{c.annunci?.servizio} · {c.annunci?.area} · {c.annunci?.provincia} · {c.annunci?.impegno}</p>
                </div>
                <StatoBadge stato={c.stato} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Inviata il {new Date(c.created_at).toLocaleDateString("it-IT")}</p>
              {c.risposta && (
                <div className="mt-4 rounded-xl bg-secondary p-4 text-sm">
                  <p className="font-semibold">Risposta del servizio</p>
                  <p className="mt-1 whitespace-pre-line">{c.risposta}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function AreaServizio({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["miei-annunci", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("annunci")
        .select("*, candidature(*)")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">I miei annunci</h2>
        <Button asChild className="rounded-full shadow-none"><Link to="/pubblica-annuncio">Pubblica un annuncio</Link></Button>
      </div>
      {isLoading ? null : (data ?? []).length === 0 ? (
        <p className="mt-4 text-muted-foreground">Non hai ancora pubblicato annunci.</p>
      ) : (
        <div className="mt-4 grid gap-6">
          {data!.map((a) => <AnnuncioCandidati key={a.id} annuncio={a} candidature={a.candidature} />)}
        </div>
      )}
    </>
  );
}

function AnnuncioCandidati({ annuncio, candidature }: { annuncio: AnnuncioRow; candidature: CandidaturaRow[] }) {
  const queryClient = useQueryClient();
  const [working, setWorking] = useState(false);
  const [errorAction, setErrorAction] = useState("");
  const stato = annuncio.stato_pubblicazione;
  async function cambiaStato(next: "attivo" | "sospeso" | "archiviato") {
    setWorking(true);
    setErrorAction("");
    const { error } = await supabase.from("annunci").update({ stato_pubblicazione: next }).eq("id", annuncio.id).eq("owner_id", annuncio.owner_id!);
    setWorking(false);
    if (error) return setErrorAction("Impossibile aggiornare l'annuncio. Verifica che la migrazione del database sia stata applicata.");
    await queryClient.invalidateQueries({ queryKey: ["miei-annunci"] });
    await queryClient.invalidateQueries({ queryKey: ["annunci"] });
  }
  async function elimina() {
    if (candidature.length > 0) return setErrorAction("Questo annuncio ha candidature: per non perderle, archivialo invece di eliminarlo.");
    if (!window.confirm("Eliminare definitivamente questo annuncio? L'operazione non è reversibile.")) return;
    setWorking(true);
    setErrorAction("");
    const { error } = await supabase.from("annunci").delete().eq("id", annuncio.id).eq("owner_id", annuncio.owner_id!);
    setWorking(false);
    if (error) return setErrorAction("Eliminazione non riuscita. Verifica i permessi dell'account.");
    await queryClient.invalidateQueries({ queryKey: ["miei-annunci"] });
    await queryClient.invalidateQueries({ queryKey: ["annunci"] });
  }
  return (
    <article className="rounded-3xl border border-border bg-card p-6">
      <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">{annuncio.area}</span>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-bold">{annuncio.mansione}</h3>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">{stato === "attivo" ? "Attivo" : stato === "sospeso" ? "Sospeso" : "Archiviato"}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {stato !== "attivo" && <Button size="sm" variant="outline" disabled={working} onClick={() => cambiaStato("attivo")}><PlayCircle className="h-4 w-4" />Riattiva</Button>}
        {stato === "attivo" && <Button size="sm" variant="outline" disabled={working} onClick={() => cambiaStato("sospeso")}><PauseCircle className="h-4 w-4" />Sospendi</Button>}
        {stato !== "archiviato" && <Button size="sm" variant="outline" disabled={working} onClick={() => cambiaStato("archiviato")}><Archive className="h-4 w-4" />Archivia</Button>}
        <Button size="sm" variant="outline" disabled={working || candidature.length > 0} title={candidature.length ? "Archivia per conservare le candidature" : "Elimina definitivamente"} onClick={elimina}><Trash2 className="h-4 w-4" />Elimina</Button>
      </div>
      {errorAction && <p role="alert" className="mt-3 text-sm text-destructive">{errorAction}</p>}
      {candidature.length > 0 && <p className="mt-2 text-xs text-muted-foreground">Per conservare le candidature ricevute, puoi archiviare questo annuncio ma non eliminarlo.</p>}
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />{annuncio.provincia}, {annuncio.regione} · {annuncio.impegno}</p>
      <p className="mt-4 flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4 text-primary" />{candidature.length} {candidature.length === 1 ? "candidato" : "candidati"}</p>
      {candidature.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Ancora nessuna candidatura.</p>
      ) : (
        <div className="mt-3 grid gap-3">
          {candidature.map((c) => <CandidatoRow key={c.id} candidatura={c} />)}
        </div>
      )}
    </article>
  );
}

function CandidatoRow({ candidatura: c }: { candidatura: CandidaturaRow }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errore, setErrore] = useState("");
  const [erroreCv, setErroreCv] = useState("");
  const [cvBusy, setCvBusy] = useState(false);

  async function azioneCv(mode: "view" | "download") {
    setErroreCv("");
    setCvBusy(true);
    try { await gestisciCv(c.cv_path, mode); }
    catch { setErroreCv("Non è stato possibile recuperare il CV. Verifica i permessi e riprova."); }
    finally { setCvBusy(false); }
  }

  async function salva(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const stato = f.get("stato") as StatoCandidatura;
    const data = String(f.get("colloquio_at") || "");
    if (stato === "colloquio" && !data) return setErrore("Indica data e ora del colloquio.");
    setSaving(true);
    setErrore("");
    const { error } = await supabase.from("candidature").update({
      stato,
      risposta: String(f.get("risposta") || "") || null,
      colloquio_at: data ? new Date(data).toISOString() : null,
      colloquio_luogo: String(f.get("colloquio_luogo") || "") || null,
    }).eq("id", c.id);
    setSaving(false);
    if (error) return setErrore("Salvataggio non riuscito, riprova.");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["miei-annunci"] });
  }

  const localDate = c.colloquio_at ? new Date(new Date(c.colloquio_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 text-sm">
          <p className="text-base font-semibold">{c.nome || c.email}</p>
          <p className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary" /><a className="underline" href={`mailto:${c.email}`}>{c.email}</a></p>
          <p className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary" />{c.cellulare}</p>
          {c.colloquio_at && <p className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-primary" />{formatData(c.colloquio_at)}{c.colloquio_luogo ? ` · ${c.colloquio_luogo}` : ""}</p>}
        </div>
        <StatoBadge stato={c.stato} />
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-semibold">Lettera di presentazione</summary>
        <p className="mt-2 whitespace-pre-line text-muted-foreground">{c.lettera}</p>
      </details>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={cvBusy || !c.cv_path} className="rounded-full shadow-none" onClick={() => azioneCv("view")}><Eye />Visualizza CV</Button>
        <Button size="sm" variant="outline" disabled={cvBusy || !c.cv_path} className="rounded-full shadow-none" onClick={() => azioneCv("download")}><Download />Scarica CV</Button>
        <Button size="sm" className="rounded-full shadow-none" onClick={() => setOpen((v) => !v)}>Rispondi / fissa colloquio</Button>
      </div>
      {erroreCv && <p role="alert" className="mt-2 text-sm text-destructive">{erroreCv}</p>}
      {open && (
        <form onSubmit={salva} className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium" htmlFor={`stato-${c.id}`}>Esito</label>
            <select id={`stato-${c.id}`} name="stato" defaultValue={c.stato} className={inputClass}>
              {(Object.keys(statoLabel) as StatoCandidatura[]).map((s) => <option key={s} value={s}>{statoLabel[s]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor={`data-${c.id}`}>Data e ora colloquio</label>
            <input id={`data-${c.id}`} name="colloquio_at" type="datetime-local" defaultValue={localDate} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium" htmlFor={`luogo-${c.id}`}>Luogo o link del colloquio</label>
            <input id={`luogo-${c.id}`} name="colloquio_luogo" defaultValue={c.colloquio_luogo ?? ""} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium" htmlFor={`risposta-${c.id}`}>Messaggio al candidato</label>
            <textarea id={`risposta-${c.id}`} name="risposta" rows={3} defaultValue={c.risposta ?? ""} className={inputClass} />
          </div>
          {errore && <p role="alert" className="text-sm text-destructive sm:col-span-2">{errore}</p>}
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit" disabled={saving} className="rounded-full shadow-none">Salva risposta</Button>
          </div>
        </form>
      )}
    </div>
  );
}
