import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reimposta-password")({
  component: ReimpostaPassword,
});

function ReimpostaPassword() {
  const [pronto, setPronto] = useState(false);
  const [autorizzato, setAutorizzato] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errore, setErrore] = useState("");
  const [successo, setSuccesso] = useState(false);

  useEffect(() => {
    let active = true;
    async function verifica() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setAutorizzato(!!data.session);
      setPronto(true);
    }
    void verifica();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setAutorizzato(true);
        setPronto(true);
      }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function salva(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nuova = String(form.get("nuova") || "");
    const conferma = String(form.get("conferma") || "");
    setErrore("");
    if (nuova.length < 8) return setErrore("La password deve contenere almeno 8 caratteri.");
    if (nuova !== conferma) return setErrore("Le password non coincidono.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: nuova });
    setBusy(false);
    if (error) return setErrore(`Non è stato possibile aggiornare la password: ${error.message}`);
    setSuccesso(true);
    await supabase.auth.signOut();
  }

  return <SiteLayout>
    <section className="mx-auto max-w-md px-6 py-14">
      <div className="rounded-3xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold">Reimposta password</h1>
        {!pronto ? <p className="mt-4 text-sm">Verifica del link in corso...</p> :
          successo ? <div className="mt-4 space-y-4"><p role="status">Password aggiornata correttamente. Ora puoi accedere con la nuova password.</p><Link to="/auth" className="font-semibold text-primary underline">Vai all’accesso</Link></div> :
          !autorizzato ? <div className="mt-4 space-y-4"><p>Il link non è valido o è scaduto. Richiedi un nuovo link dalla pagina di accesso.</p><Link to="/auth" className="font-semibold text-primary underline">Torna all’accesso</Link></div> :
          <form className="mt-6 space-y-4" onSubmit={salva}>
            <div><label htmlFor="nuova" className="text-sm font-semibold">Nuova password *</label><input id="nuova" name="nuova" type="password" autoComplete="new-password" minLength={8} required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
            <div><label htmlFor="conferma" className="text-sm font-semibold">Conferma nuova password *</label><input id="conferma" name="conferma" type="password" autoComplete="new-password" minLength={8} required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
            {errore && <p role="alert" className="text-sm text-destructive">{errore}</p>}
            <Button type="submit" disabled={busy} className="w-full rounded-xl">{busy ? "Salvataggio..." : "Salva nuova password"}</Button>
          </form>}
      </div>
    </section>
  </SiteLayout>;
}
