import { useState } from "react";
import { createFileRoute, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, ChevronDown, Download, Eye, LogOut, Mail, MapPin, Phone, Users, Pencil, Archive, PauseCircle, PlayCircle, Trash2, Camera } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
import { statoLabel, type AnnuncioRow, type CandidaturaRow, type StatoCandidatura } from "@/lib/annunci-db";
import { Button } from "@/components/ui/button";
import { ChatCandidatura } from "@/components/ChatCandidatura";

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
  const location = useLocation();
  const section = location.hash.replace(/^#/, "") || "dashboard";
  const queryClient = useQueryClient();
  const { data: profilo } = useQuery({
    queryKey: ["profilo", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("nome, foto_path").eq("id", user!.id).maybeSingle()).data,
  });

  const [modificaPassword, setModificaPassword] = useState(false);
  const [salvataggioPassword, setSalvataggioPassword] = useState(false);
  const [errorePassword, setErrorePassword] = useState("");
  const [successoPassword, setSuccessoPassword] = useState("");
  const [eliminazioneAccount, setEliminazioneAccount] = useState(false);
  const [erroreEliminazione, setErroreEliminazione] = useState("");
  const [caricamentoFoto, setCaricamentoFoto] = useState(false);
  const [erroreFoto, setErroreFoto] = useState("");
  const [fotoVersione, setFotoVersione] = useState(0);
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

  async function cambiaPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user?.email) return;
    const form = event.currentTarget;
    const dati = new FormData(form);
    const attuale = String(dati.get("password_attuale") || "");
    const nuova = String(dati.get("password_nuova") || "");
    const conferma = String(dati.get("password_conferma") || "");
    setErrorePassword("");
    setSuccessoPassword("");
    if (nuova.length < 8) return setErrorePassword("La nuova password deve contenere almeno 8 caratteri.");
    if (nuova !== conferma) return setErrorePassword("Le nuove password non coincidono.");
    if (nuova === attuale) return setErrorePassword("La nuova password deve essere diversa da quella attuale.");
    setSalvataggioPassword(true);
    const verifica = await supabase.auth.signInWithPassword({ email: user.email, password: attuale });
    if (verifica.error) {
      setSalvataggioPassword(false);
      return setErrorePassword("La password attuale non è corretta.");
    }
    const { error } = await supabase.auth.updateUser({ password: nuova });
    setSalvataggioPassword(false);
    if (error) return setErrorePassword("Non è stato possibile modificare la password. Riprova.");
    form.reset();
    setModificaPassword(false);
    setSuccessoPassword("Password aggiornata correttamente.");
  }

  async function aggiornaFoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!user || !file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setErroreFoto("Seleziona una foto JPG, PNG o WebP di massimo 2 MB.");
      return;
    }
    setCaricamentoFoto(true); setErroreFoto("");
    const estensione = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${user.id}/profilo-${Date.now()}.${estensione}`;
    const { error: uploadError } = await supabase.storage.from("foto-profilo").upload(path, file, { contentType: file.type });
    if (uploadError) { setCaricamentoFoto(false); return setErroreFoto("Caricamento non riuscito. Verifica che la migrazione delle foto sia stata applicata."); }
    const { error } = await supabase.from("profiles").update({ foto_path: path }).eq("id", user.id);
    setCaricamentoFoto(false);
    if (error) return setErroreFoto("Foto caricata, ma aggiornamento del profilo non riuscito.");
    setFotoVersione(v => v + 1);
    await queryClient.invalidateQueries({ queryKey: ["profilo", user.id] });
  }

  async function eliminaAccount() {
    if (!user) return;
    if (!window.confirm("Sei sicuro di voler eliminare definitivamente il tuo account? Verranno eliminati anche annunci, candidature e messaggi associati. L’operazione non può essere annullata.")) return;
    setEliminazioneAccount(true); setErroreEliminazione("");
    const { data, error } = await supabase.functions.invoke("elimina-account", { method: "POST" });
    setEliminazioneAccount(false);
    if (error || !data?.ok) return setErroreEliminazione("Non è stato possibile eliminare l’account. Riprova oppure contatta info@semilavoro.it.");
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
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
          <div className="flex items-center gap-5">
            {user && <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-2xl font-bold text-primary">
                {profilo?.foto_path ? <img key={fotoVersione} src={supabase.storage.from("foto-profilo").getPublicUrl(profilo.foto_path).data.publicUrl} alt="Foto profilo" className="h-full w-full object-cover" /> : (profilo?.nome || user.email || "S").charAt(0).toUpperCase()}
              </div>
              <label title="Cambia foto profilo" className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card shadow-sm">
                <Camera className="h-4 w-4" />
                <span className="sr-only">Carica o cambia foto profilo</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={aggiornaFoto} disabled={caricamentoFoto} className="sr-only" />
              </label>
            </div>}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {tipo === "servizio" ? "Servizio educativo" : tipo === "educatore" ? "Educatore / operatore" : ""}
            </p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Ciao, {(profilo?.nome?.trim() || String(user?.user_metadata?.nome || "").trim() || user?.email?.split("@")[0] || "utente").split(/\s+/)[0]}!</h1>
            <p className="mt-2 font-display text-xl font-semibold sm:text-2xl">Benvenuta su SEMI</p>
            <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
            {erroreFoto && <p role="alert" className="mt-2 text-xs text-destructive">{erroreFoto}</p>}
            {caricamentoFoto && <p className="mt-2 text-xs text-muted-foreground">Caricamento foto...</p>}
          </div></div>
          <Button variant="outline" className="rounded-full shadow-none" onClick={esci}><LogOut />Esci</Button>
        </div>
        {loading ? null : tipo === "servizio" && (section === "dashboard" || section === "miei-annunci") ? <AreaServizio userId={user!.id} /> : tipo !== "servizio" && user && (section === "dashboard" || section === "colloqui-fissati" || section === "mie-candidature") ? <AreaEducatore userId={user.id} section={section} /> : null}
        {user && section === "profilo" && <div id="profilo" className="scroll-mt-8 mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
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
        {user && section === "password-sicurezza" && <div id="password-sicurezza" className="scroll-mt-8 mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="text-xl font-bold">Password e sicurezza</h2></div>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => { setModificaPassword(v => !v); setErrorePassword(""); setSuccessoPassword(""); }}>Cambia password</Button>
          </div>
          {modificaPassword && <form onSubmit={cambiaPassword} className="mt-5 space-y-4 border-t border-border pt-5">
            <div><label htmlFor="password-attuale" className="text-sm font-semibold">Password attuale *</label><input id="password-attuale" name="password_attuale" type="password" autoComplete="current-password" required className={inputClass} /></div>
            <div><label htmlFor="password-nuova" className="text-sm font-semibold">Nuova password *</label><input id="password-nuova" name="password_nuova" type="password" autoComplete="new-password" minLength={8} required className={inputClass} /></div>
            <div><label htmlFor="password-conferma" className="text-sm font-semibold">Conferma nuova password *</label><input id="password-conferma" name="password_conferma" type="password" autoComplete="new-password" minLength={8} required className={inputClass} /></div>
            {errorePassword && <p role="alert" className="text-sm text-destructive">{errorePassword}</p>}
            <Button type="submit" disabled={salvataggioPassword} className="rounded-full">{salvataggioPassword ? "Salvataggio..." : "Salva nuova password"}</Button>
          </form>}
          {successoPassword && <p role="status" className="mt-3 text-sm text-primary">{successoPassword}</p>}
        </div>}
        {user && section === "gestione-account" && <div id="gestione-account" className="scroll-mt-8 mt-10 border-t border-border pt-6">
          <h2 className="text-lg font-bold">Gestione account</h2>
          <p className="mt-2 text-sm text-muted-foreground">Puoi richiedere l'eliminazione definitiva del tuo account. Questa operazione elimina anche annunci, candidature e conversazioni associate.</p>
          <Button type="button" variant="outline" disabled={eliminazioneAccount} onClick={eliminaAccount} className="mt-4 rounded-full text-destructive"><Trash2 className="h-4 w-4" /> {eliminazioneAccount ? "Eliminazione..." : "Elimina account"}</Button>
          {erroreEliminazione && <p role="alert" className="mt-3 text-sm text-destructive">{erroreEliminazione}</p>}
        </div>}

      </section>
    </SiteLayout>
  );
}

function AreaEducatore({ userId, section }: { userId: string; section: "dashboard" | "colloqui-fissati" | "mie-candidature" }) {
  const [aperta, setAperta] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["mie-candidature", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidature")
        .select("*, annunci(mansione, servizio, area, provincia, impegno, tipo_opportunita)")
        .eq("candidato_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const colloqui = (data ?? []).filter((c) => c.colloquio_at);

  return (
    <>
      {(section === "dashboard" || section === "colloqui-fissati") && <><h2 id="colloqui-fissati" className="scroll-mt-8 mt-10 text-2xl font-bold">Colloqui fissati</h2>
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

      </>}
      {(section === "dashboard" || section === "mie-candidature" || section === "colloqui-fissati") && <><h2 id="mie-candidature" className="scroll-mt-8 mt-10 text-2xl font-bold">Le mie candidature</h2>
      {isLoading ? null : (data ?? []).length === 0 ? (
        <div className="mt-4 rounded-3xl border border-border p-8 text-center">
          <p className="font-semibold">Non ti sei ancora candidato a nessun annuncio.</p>
          <Button asChild className="mt-4 rounded-full shadow-none"><Link to="/trova-lavoro">Trova lavoro</Link></Button>
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          {data!.map((c) => (
            <article key={c.id} className="rounded-3xl border border-border bg-card p-6 transition-shadow hover:shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">{c.annunci?.mansione}</h3>
                  <p className="text-sm text-muted-foreground">{c.annunci?.servizio} · {c.annunci?.area} · {c.annunci?.provincia} · {c.annunci?.impegno}</p>
                </div>
                <StatoBadge stato={c.stato} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Inviata il {new Date(c.created_at).toLocaleDateString("it-IT")}</p>
              <button type="button" aria-expanded={aperta === c.id} aria-controls={`dettagli-candidatura-${c.id}`} onClick={() => setAperta(aperta === c.id ? null : c.id)} className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"> {aperta === c.id ? "Chiudi dettagli" : "Visualizza candidatura"} <ChevronDown className={`h-4 w-4 transition-transform ${aperta === c.id ? "rotate-180" : ""}`} /></button>
              {aperta === c.id && <div id={`dettagli-candidatura-${c.id}`} className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
                <p><strong>Annuncio:</strong> {c.annunci?.mansione} — {c.annunci?.servizio}</p>
                <p><strong>Email utilizzata:</strong> {c.email}</p>
                <p><strong>Cellulare:</strong> {c.cellulare}</p>
                <div><p className="font-semibold">Messaggio</p><p className="mt-1 whitespace-pre-line text-muted-foreground">{c.lettera}</p></div>
                <ChatCandidatura candidaturaId={c.id} stato={c.stato} nomeServizio={c.annunci?.servizio} />
                {c.colloquio_at && <p><strong>Colloquio:</strong> {formatData(c.colloquio_at)}{c.colloquio_luogo ? ` · ${c.colloquio_luogo}` : ""}</p>}
                <p className="text-xs text-muted-foreground">Stato: {statoLabel[c.stato]}</p>
              </div>}
              <ChatCandidatura candidaturaId={c.id} stato={c.stato} nomeServizio={c.annunci?.servizio} />
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
      </>}
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
      <div id="miei-annunci" className="scroll-mt-8 mt-10 flex flex-wrap items-center justify-between gap-3">
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
  // Gli annunci precedenti alla migrazione possono non avere ancora uno stato: non considerarli archiviati.
  const stato = annuncio.stato_pubblicazione ?? "attivo";
  async function cambiaStato(next: "attivo" | "sospeso") {
    setWorking(true);
    setErrorAction("");
    const { error } = await supabase.from("annunci").update({ stato_pubblicazione: next }).eq("id", annuncio.id).eq("owner_id", annuncio.owner_id!);
    setWorking(false);
    if (error) return setErrorAction("Impossibile aggiornare l'annuncio. Verifica che la migrazione del database sia stata applicata.");
    await queryClient.invalidateQueries({ queryKey: ["miei-annunci"] });
    await queryClient.invalidateQueries({ queryKey: ["annunci"] });
  }
  async function elimina() {
    if (!window.confirm("Eliminare definitivamente questo annuncio e tutte le candidature ricevute? L'operazione non è reversibile.")) return;
    setWorking(true);
    setErrorAction("");
    const { error } = await supabase.from("annunci").delete().eq("id", annuncio.id).eq("owner_id", annuncio.owner_id!);
    setWorking(false);
    if (error) return setErrorAction("Eliminazione non riuscita. Verifica i permessi e i vincoli del database.");
    const paths = candidature.map(c => c.cv_path).filter(Boolean);
    if (paths.length) {
      const result = await supabase.storage.from("cv").remove(paths);
      if (result.error) setErrorAction("Annuncio eliminato, ma la pulizia dei CV richiede intervento amministrativo.");
    }
    await queryClient.invalidateQueries({ queryKey: ["miei-annunci"] });
    await queryClient.invalidateQueries({ queryKey: ["annunci"] });
  }
  return (
    <article className="rounded-3xl border border-border bg-card p-6">
      <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">{annuncio.tipo_opportunita === "volontario" ? "Volontariato · " : ""}{annuncio.area}</span>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-bold">{annuncio.mansione}</h3>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">{stato === "sospeso" ? "Sospeso" : stato === "archiviato" ? "Archiviato" : "Attivo"}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={working} onClick={() => cambiaStato(stato === "sospeso" ? "attivo" : "sospeso")}>{stato === "sospeso" ? "Riattiva" : "Sospendi"}</Button>
        <Button size="sm" variant="outline" disabled={working} title="Elimina definitivamente annuncio e candidature" onClick={elimina}><Trash2 className="h-4 w-4" />Elimina</Button>
      </div>
      {errorAction && <p role="alert" className="mt-3 text-sm text-destructive">{errorAction}</p>}

      <details className="mt-3 rounded-xl border border-border p-3 text-sm">
        <summary className="cursor-pointer font-semibold">Visualizza dettagli annuncio</summary>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          <div><dt className="font-semibold">Servizio</dt><dd>{annuncio.servizio}</dd></div>
          <div><dt className="font-semibold">Contratto</dt><dd>{annuncio.tipo_opportunita === "volontario" ? "Volontariato" : (annuncio.tipologia_contratto || "—")}</dd></div>
          {annuncio.tipo_opportunita !== "volontario" && <div><dt className="font-semibold">Retribuzione annua lorda</dt><dd>€ {annuncio.guadagno_min.toLocaleString("it-IT")} – € {annuncio.guadagno_max.toLocaleString("it-IT")}</dd></div>}
          <div><dt className="font-semibold">Email</dt><dd>{annuncio.email}</dd></div>
          <div className="sm:col-span-2"><dt className="font-semibold">Informazioni</dt><dd className="whitespace-pre-line">{annuncio.informazioni}</dd></div>
        </dl>
      </details>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />{annuncio.provincia}, {annuncio.regione} · {annuncio.impegno}</p>
      <p className="mt-4 flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4 text-primary" />{candidature.length} {candidature.length === 1 ? "candidato" : "candidati"}</p>
      {candidature.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Ancora nessuna candidatura.</p>
      ) : (
        <div className="mt-3 grid gap-3">
          {candidature.map((c) => <CandidatoRow key={c.id} candidatura={c} volontario={annuncio.tipo_opportunita === "volontario"} nomeServizio={annuncio.servizio} />)}
        </div>
      )}
    </article>
  );
}

function CandidatoRow({ candidatura: c, volontario = false, nomeServizio }: { candidatura: CandidaturaRow; volontario?: boolean; nomeServizio?: string }) {
  const queryClient = useQueryClient();
  const [erroreCv, setErroreCv] = useState("");
  const [cvBusy, setCvBusy] = useState(false);

  async function azioneCv(mode: "view" | "download") {
    setErroreCv("");
    setCvBusy(true);
    try { await gestisciCv(c.cv_path, mode); }
    catch { setErroreCv("Non è stato possibile recuperare l’allegato. Verifica i permessi e riprova."); }
    finally { setCvBusy(false); }
  }

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
        <summary className="cursor-pointer font-semibold">Messaggio del candidato</summary>
        <p className="mt-2 whitespace-pre-line text-muted-foreground">{c.lettera}</p>
      </details>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={cvBusy || !c.cv_path} className="rounded-full shadow-none" onClick={() => azioneCv("view")}><Eye />{volontario ? "Visualizza lettera" : "Visualizza CV"}</Button>
        <Button size="sm" variant="outline" disabled={cvBusy || !c.cv_path} className="rounded-full shadow-none" onClick={() => azioneCv("download")}><Download />{volontario ? "Scarica lettera" : "Scarica CV"}</Button>
      </div>
      <ChatCandidatura candidaturaId={c.id} stato={c.stato} nomeCandidato={c.nome || c.email} nomeServizio={nomeServizio} />
      {erroreCv && <p role="alert" className="mt-2 text-sm text-destructive">{erroreCv}</p>}

    </div>
  );
}
