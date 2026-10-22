import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
import { Button } from "@/components/ui/button";

export function ChatCandidatura({ candidaturaId, stato }: { candidaturaId: string; stato: string }) {
  const { user } = useAccount();
  const [testo, setTesto] = useState("");
  const [busy, setBusy] = useState(false);
  const [errore, setErrore] = useState("");
  const client = useQueryClient();
  const aperta = true;
  const { data: messaggi = [], isError } = useQuery({
    queryKey: ["messaggi-candidatura", candidaturaId],
    enabled: aperta && !!user,
    refetchInterval: 15000,
    queryFn: async () => {
      const { data, error } = await supabase.from("messaggi_candidatura").select("*").eq("candidatura_id", candidaturaId).order("created_at", { ascending: true }).limit(200);
      if (error) throw error;
      return data;
    },
  });
  async function invia(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !aperta || !testo.trim() || busy) return;
    setBusy(true); setErrore("");
    const { error } = await supabase.from("messaggi_candidatura").insert({ candidatura_id: candidaturaId, mittente_id: user.id, testo: testo.trim() });
    setBusy(false);
    if (error) return setErrore("Invio non riuscito. Verifica che la candidatura sia accettata e riprova.");
    setTesto("");
    await client.invalidateQueries({ queryKey: ["messaggi-candidatura", candidaturaId] });
  }
  if (!aperta) return null;
  return <section className="mt-5 rounded-2xl border border-primary/20 bg-primary/[0.03] p-4" aria-label="Messaggi con il servizio educativo">
    <h4 className="flex items-center gap-2 font-semibold"><MessageCircle className="h-4 w-4 text-primary" /> Messaggi con il servizio educativo</h4>
    <p className="mt-1 text-xs text-muted-foreground">Conversazione privata disponibile dopo l’invio della candidatura. Evita di condividere dati sensibili non necessari.</p>
    <div className="mt-4 max-h-72 space-y-2 overflow-y-auto" aria-live="polite">
      {messaggi.length === 0 && <p className="text-sm text-muted-foreground">Nessun messaggio. Scrivi per concordare data, ora e luogo.</p>}
      {messaggi.map(m => <div key={m.id} className={`rounded-xl p-3 text-sm ${m.mittente_id === user?.id ? "ml-8 bg-primary/10" : "mr-8 bg-background"}`}>
        <p className="text-xs font-semibold text-muted-foreground">{m.mittente_id === user?.id ? "Tu" : "Interlocutore"} · {new Date(m.created_at).toLocaleString("it-IT")}</p>
        <p className="mt-1 whitespace-pre-wrap break-words">{m.testo}</p>
      </div>)}
      {isError && <p role="alert" className="text-sm text-destructive">Messaggi non disponibili. La chat richiede l'attivazione sul database.</p>}
    </div>
    <form onSubmit={invia} className="mt-3 flex gap-2">
      <label className="sr-only" htmlFor={`chat-${candidaturaId}`}>Nuovo messaggio</label>
      <input id={`chat-${candidaturaId}`} value={testo} onChange={e => setTesto(e.target.value)} maxLength={2000} required placeholder="Scrivi un messaggio..." className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm" />
      <Button type="submit" disabled={busy || !testo.trim()} aria-label="Invia messaggio"><Send className="h-4 w-4" /></Button>
    </form>
    {errore && <p role="alert" className="mt-2 text-xs text-destructive">{errore}</p>}
  </section>;
}
