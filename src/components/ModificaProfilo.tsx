import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Trash2, UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CvViewer } from "@/components/CvViewer";

const inputClass = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

export function ModificaProfilo({ userId, tipo }: { userId: string; tipo: "educatore" | "servizio" }) {
  const queryClient = useQueryClient();
  const [aperto, setAperto] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; testo: string } | null>(null);
  const [cvAperto, setCvAperto] = useState(false);
  const servizio = tipo === "servizio";

  const { data: profilo } = useQuery({
    queryKey: ["profilo-completo", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  function aggiorna() {
    queryClient.invalidateQueries({ queryKey: ["profilo-completo", userId] });
    queryClient.invalidateQueries({ queryKey: ["profilo", userId] });
  }

  async function salva(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const testo = (k: string) => String(f.get(k) || "").trim() || null;
    setBusy(true);
    setMsg(null);
    let cv_path = profilo?.cv_path ?? null;
    const file = f.get("cv") as File | null;
    if (!servizio && file && file.size > 0) {
      const nuovo = `${userId}/profilo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const up = await supabase.storage.from("cv").upload(nuovo, file);
      if (up.error) { setBusy(false); return setMsg({ ok: false, testo: "Caricamento del CV non riuscito." }); }
      if (cv_path) await supabase.storage.from("cv").remove([cv_path]);
      cv_path = nuovo;
    }
    const { error } = await supabase.from("profiles").update({
      nome: String(f.get("nome") || "").trim(),
      telefono: testo("telefono"),
      citta: testo("citta"),
      descrizione: testo("descrizione"),
      ...(servizio ? { sito_web: testo("sito_web") } : { qualifica: testo("qualifica"), esperienza: testo("esperienza"), cv_path }),
    }).eq("id", userId);
    setBusy(false);
    if (error) return setMsg({ ok: false, testo: "Salvataggio non riuscito, riprova." });
    setMsg({ ok: true, testo: "Profilo aggiornato." });
    aggiorna();
  }

  async function eliminaCv() {
    if (!profilo?.cv_path) return;
    setBusy(true);
    await supabase.storage.from("cv").remove([profilo.cv_path]);
    const { error } = await supabase.from("profiles").update({ cv_path: null }).eq("id", userId);
    setBusy(false);
    setMsg(error ? { ok: false, testo: "Eliminazione non riuscita." } : { ok: true, testo: "CV eliminato." });
    aggiorna();
  }

  return (
    <div className="mt-8 rounded-3xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold"><UserCog className="h-5 w-5 text-primary" />Modifica profilo</h2>
        <Button variant="outline" size="sm" className="rounded-full shadow-none" onClick={() => setAperto((v) => !v)} aria-expanded={aperto}>{aperto ? "Chiudi" : "Modifica"}</Button>
      </div>
      {aperto && profilo && (
        <form key={profilo.cv_path ?? "no-cv"} onSubmit={salva} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="p-nome" className="text-sm font-medium">{servizio ? "Nome dell’organizzazione *" : "Nome e cognome *"}</label>
            <input id="p-nome" name="nome" required defaultValue={profilo.nome} className={inputClass} />
          </div>
          <div>
            <label htmlFor="p-tel" className="text-sm font-medium">Telefono</label>
            <input id="p-tel" name="telefono" type="tel" defaultValue={profilo.telefono ?? ""} className={inputClass} />
          </div>
          <div>
            <label htmlFor="p-citta" className="text-sm font-medium">{servizio ? "Sede / indirizzo" : "Città"}</label>
            <input id="p-citta" name="citta" defaultValue={profilo.citta ?? ""} className={inputClass} />
          </div>
          {servizio ? (
            <div className="sm:col-span-2">
              <label htmlFor="p-sito" className="text-sm font-medium">Sito web</label>
              <input id="p-sito" name="sito_web" type="url" placeholder="https://" defaultValue={profilo.sito_web ?? ""} className={inputClass} />
            </div>
          ) : (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="p-qual" className="text-sm font-medium">Qualifica / titolo di studio</label>
                <input id="p-qual" name="qualifica" defaultValue={profilo.qualifica ?? ""} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="p-esp" className="text-sm font-medium">Esperienze professionali</label>
                <textarea id="p-esp" name="esperienza" rows={3} defaultValue={profilo.esperienza ?? ""} className={inputClass} />
              </div>
            </>
          )}
          <div className="sm:col-span-2">
            <label htmlFor="p-desc" className="text-sm font-medium">{servizio ? "Descrizione dell’organizzazione" : "Presentazione"}</label>
            <textarea id="p-desc" name="descrizione" rows={3} defaultValue={profilo.descrizione ?? ""} className={inputClass} />
          </div>
          {!servizio && (
            <div className="sm:col-span-2">
              <label htmlFor="p-cv" className="text-sm font-medium">{profilo.cv_path ? "Sostituisci il CV" : "Carica il CV"}</label>
              <input id="p-cv" name="cv" type="file" accept=".pdf,.doc,.docx" className={inputClass} />
              {profilo.cv_path && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="outline" className="rounded-full shadow-none" onClick={() => setCvAperto(true)}><FileText />Vedi CV attuale</Button>
                  <Button type="button" size="sm" variant="outline" disabled={busy} className="rounded-full text-destructive shadow-none" onClick={eliminaCv}><Trash2 />Elimina CV</Button>
                </div>
              )}
              <p className="mt-1 text-xs text-muted-foreground">I CV già inviati con le candidature restano invariati.</p>
            </div>
          )}
          {msg && <p role={msg.ok ? "status" : "alert"} className={`text-sm sm:col-span-2 ${msg.ok ? "text-foreground" : "text-destructive"}`}>{msg.testo}</p>}
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit" disabled={busy} className="rounded-full shadow-none">Salva profilo</Button>
          </div>
        </form>
      )}
      <CvViewer path={profilo?.cv_path ?? null} open={cvAperto} onOpenChange={setCvAperto} title="Il mio CV" />
    </div>
  );
}
