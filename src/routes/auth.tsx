import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Accedi o registrati — semi" },
      { name: "description", content: "Accedi alla tua area personale su semi o crea un account come educatore o servizio." },
      { property: "og:title", content: "Accedi o registrati — semi" },
      { property: "og:description", content: "Entra nella tua area personale su semi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const inputClass =
  "mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [tipo, setTipo] = useState<"educatore" | "servizio">("educatore");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setError("");
    setInfo("");
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError("Email o password non corretti.");
      navigate({ to: "/area-personale" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/area-personale`,
          data: { nome: String(form.get("nome")), tipo },
        },
      });
      setBusy(false);
      if (error) return setError(error.message.includes("registered") ? "Questa email è già registrata." : "Registrazione non riuscita. Controlla i dati e riprova.");
      setInfo("Ti abbiamo inviato un’email: clicca il link di conferma per attivare l’account.");
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-6 py-14">
        <div className="rounded-3xl border border-border bg-card p-8">
          <div className="flex items-center gap-2">
            {mode === "login" ? <LogIn className="h-5 w-5 text-primary" /> : <UserPlus className="h-5 w-5 text-primary" />}
            <h1 className="text-2xl font-bold">{mode === "login" ? "Accedi" : "Registrati"}</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Entra nella tua area personale" : "Crea il tuo account su semi"}
          </p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            {mode === "signup" && (
              <>
                <fieldset>
                  <legend className="text-sm font-semibold">Sono *</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {([
                      ["educatore", "Educatore / operatore"],
                      ["servizio", "Servizio educativo"],
                    ] as const).map(([value, label]) => (
                      <Button key={value} type="button" variant={tipo === value ? "default" : "outline"} aria-pressed={tipo === value} onClick={() => setTipo(value)} className="h-auto whitespace-normal rounded-xl py-2.5 shadow-none">
                        {label}
                      </Button>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label htmlFor="nome" className="text-sm font-semibold">
                    {tipo === "servizio" ? "Nome del servizio *" : "Nome e cognome *"}
                  </label>
                  <input id="nome" name="nome" required className={inputClass} />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="text-sm font-semibold">Email *</label>
              <input id="email" name="email" type="email" required placeholder="tu@email.it" className={inputClass} />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-semibold">Password *</label>
              <input id="password" name="password" type="password" required minLength={6} placeholder="••••••••" className={inputClass} />
            </div>
            {mode === "signup" && <p className="text-xs text-muted-foreground">Prima di registrarti consulta la <a href="/privacy" className="font-semibold text-primary underline">pagina privacy di SEMI</a>. L'informativa completa è in preparazione.</p>}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            {info && <p role="status" className="text-sm text-foreground">{info}</p>}
            <Button type="submit" disabled={busy} className="w-full rounded-xl py-5 shadow-none">
              {mode === "login" ? "Accedi" : "Crea account"} <ArrowRight />
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Non hai un account? " : "Hai già un account? "}
            <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setInfo(""); }} className="font-semibold text-primary underline">
              {mode === "login" ? "Registrati" : "Accedi"}
            </button>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
