import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy e dati personali — SEMI" }, { name: "robots", content: "noindex" }] }),
  component: Privacy,
});
function Privacy() {
  return <SiteLayout><section className="mx-auto max-w-3xl px-6 py-16">
    <p className="text-xs font-bold uppercase tracking-widest text-primary">Protezione dei dati personali</p>
    <h1 className="mt-3 text-4xl font-bold">Privacy e dati personali</h1>
    <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-5 text-sm">
      <strong>Informativa in preparazione.</strong> Questo testo è una descrizione preliminare delle funzioni di SEMI, non un'informativa GDPR completa né un documento legale definitivo. Prima dell'attivazione delle candidature deve essere sostituito da un'informativa approvata dal titolare del trattamento.
    </div>
    <div className="mt-8 space-y-6 leading-relaxed">
      <section><h2 className="text-xl font-bold">Quali dati vengono raccolti</h2><p className="mt-2 text-muted-foreground">Durante la registrazione e la candidatura possono essere raccolti nome, email, numero di telefono, messaggio facoltativo e curriculum vitae. La piattaforma gestisce inoltre annunci e messaggi privati tra candidati e servizi.</p></section>
      <section><h2 className="text-xl font-bold">Con chi vengono condivisi</h2><p className="mt-2 text-muted-foreground">I dati inviati per candidarsi sono resi accessibili al servizio educativo responsabile dell'annuncio. Le conversazioni sono riservate al candidato e al servizio coinvolti.</p></section>
      <section><h2 className="text-xl font-bold">Cosa va ancora definito</h2><p className="mt-2 text-muted-foreground">Identità e recapiti del titolare, basi giuridiche, ruoli e responsabilità dei servizi destinatari, fornitori, tempi di conservazione, eventuali trasferimenti internazionali, esercizio dei diritti e gestione delle richieste di cancellazione.</p></section>
      <section><h2 className="text-xl font-bold">Contatti</h2><p className="mt-2 text-muted-foreground">Per richieste relative ai dati personali: <a href="mailto:info@semilavoro.it" className="underline">info@semilavoro.it</a>. Il ruolo di questo recapito nell'informativa definitiva deve essere confermato dal titolare.</p></section>
    </div>
    <Link to="/" className="mt-10 inline-block font-semibold text-primary underline">Torna alla homepage</Link>
  </section></SiteLayout>;
}
