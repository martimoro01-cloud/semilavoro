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
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [tipo, setTipo] = useState<"educatore" | "servizio">("educatore");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [code, setCode] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setError("");
    setInfo("");
    if (mode === "signup") {
      if (password.length < 8) return setError("Scegli una password di almeno 8 caratteri.");
      if (password !== String(form.get("conferma_password"))) return setError("Le due password non coincidono.");
    }
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
      setVerificationEmail(email);
      setCode("");
      setInfo("Ti abbiamo inviato un codice di 6 cifre via email. Inseriscilo qui per attivare l’account.");
    }
  }

  async function inviaRecupero(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    setError("");
    setInfo("");
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reimposta-password`,
    });
    setBusy(false);
    if (error) return setError("Non è stato possibile inviare l’email di recupero. Riprova tra poco.");
    setInfo("Se l’indirizzo è registrato, riceverai un’email con il link per impostare una nuova password. Controlla anche lo spam.");
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");
    if (!/^\\d{6}$/.test(code.trim())) return setError("Inserisci il codice di 6 cifre ricevuto via email.");
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email: verificationEmail, token: code.trim(), type: "signup" });
    setBusy(false);
    if (error) return setError("Codice non valido o scaduto. Controlla l’email o richiedi un nuovo codice.");
    navigate({ to: "/area-personale" });
  }

  async function resendCode() {
    setError("");
    setInfo("");
    setBusy(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: verificationEmail });
    setBusy(false);
    if (error) return setError("Non è stato possibile inviare un nuovo codice. Riprova tra poco.");
    setInfo("Ti abbiamo inviato un nuovo codice. Controlla anche la cartella spam.");
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-6 py-14">
        <div className="rounded-3xl border border-border bg-card p-8">
          {verificationEmail ? (
            <div>
              <h1 className="text-2xl font-bold">Verifica la tua email</h1>
              <p className="mt-2 text-sm text-muted-foreground">Abbiamo inviato un codice di 6 cifre a <strong>{verificationEmail}</strong>. Inseriscilo per attivare il tuo account.</p>
              <form className="mt-6 space-y-4" onSubmit={verifyCode}>
                <div>
                  <label htmlFor="verification-code" className="text-sm font-semibold">Codice di verifica *</label>
                  <input id="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(event) => setCode(event.target.value.replace(/\\D/g, "").slice(0, 6))} placeholder="000000" className={inputClass} />
                </div>
                {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                {info && <p role="status" className="text-sm text-foreground">{info}</p>}
                <Button type="submit" disabled={busy} className="w-full rounded-xl py-5 shadow-none">Verifica email <ArrowRight /></Button>
              </form>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                <button type="button" disabled={busy} onClick={resendCode} className="font-semibold text-primary underline disabled:opacity-50">Invia un nuovo codice</button>
                <button type="button" disabled={busy} onClick={() => { setVerificationEmail(""); setCode(""); setError(""); setInfo(""); }} className="text-muted-foreground underline">Cambia email</button>
              </div>
            </div>
          ) : mode === "forgot" ? <div>
            <h1 className="text-2xl font-bold">Password dimenticata?</h1>
            <p className="mt-2 text-sm text-muted-foreground">Inserisci l’email associata al tuo account SEMI. Ti invieremo un link per creare una nuova password.</p>
            <form onSubmit={inviaRecupero} className="mt-6 space-y-4">
              <div><label htmlFor="recupero-email" className="text-sm font-semibold">Email *</label><input id="recupero-email" name="email" type="email" required autoComplete="email" className={inputClass} /></div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              {info && <p role="status" className="text-sm text-foreground">{info}</p>}
              <Button type="submit" disabled={busy} className="w-full rounded-xl py-5 shadow-none">{busy ? "Invio..." : "Invia link di recupero"}</Button>
            </form>
            <button type="button" className="mt-5 text-sm font-semibold text-primary underline" onClick={() => { setMode("login"); setError(""); setInfo(""); }}>Torna all’accesso</button>
          </div> : <>
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
              <label htmlFor="password" className="text-sm font-semibold">{mode === "signup" ? "Crea la tua password *" : "Password *"}</label>
              <input id="password" name="password" type="password" required minLength={mode === "signup" ? 8 : 6} autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder="••••••••" className={inputClass} />
            </div>
            {mode === "login" && <button type="button" onClick={() => { setMode("forgot"); setError(""); setInfo(""); }} className="text-sm font-semibold text-primary underline underline-offset-2">Password dimenticata?</button>}
            {mode === "signup" && <div>
              <label htmlFor="conferma_password" className="text-sm font-semibold">Conferma password *</label>
              <input id="conferma_password" name="conferma_password" type="password" autoComplete="new-password" required minLength={8} className={inputClass} placeholder="Ripeti la password scelta" />
              <p className="mt-1.5 text-xs text-muted-foreground">Scegli una password personale di almeno 8 caratteri, diversa da quella della tua email.</p>
            </div>}
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
          </>}
        </div>
      </section>
    </SiteLayout>
  );
}
