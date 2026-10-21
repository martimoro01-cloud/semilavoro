import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy e dati personali — SEMI" }, { name: "description", content: "Informativa sulla privacy di SEMI ai sensi dell'art. 13 GDPR." }] }),
  component: Privacy,
});

const bullet = "list-disc space-y-2 pl-6 text-muted-foreground";
const paragraph = "mt-3 leading-relaxed text-muted-foreground";

function Privacy() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Protezione dei dati personali</p>
        <h1 className="mt-3 text-4xl font-bold">Privacy e dati personali</h1>
        <p className="mt-3 text-sm text-muted-foreground">Informativa sulla privacy (Art. 13 GDPR)</p>

        <div className="mt-10 space-y-9">
          <section>
            <h2 className="text-xl font-bold">1. Titolare del Trattamento</h2>
            <p className={paragraph}>I Titolari del trattamento dei dati sono Valeria Bonalda e Martina Moro. Per qualsiasi richiesta o comunicazione riguardante i propri dati personali, è possibile contattarci all'indirizzo e-mail: <a className="font-semibold text-primary underline" href="mailto:info@semilavoro.it">info@semilavoro.it</a>.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold">2. Tipologia di Dati Raccolti</h2>
            <p className={paragraph}>Raccogliamo i dati forniti volontariamente dagli utenti per usufruire del servizio gratuito:</p>
            <ul className={`mt-3 ${bullet}`}>
              <li><strong>Per i Candidati:</strong> Nome, cognome, indirizzo e-mail, numero di telefono e i dati contenuti nel Curriculum Vitae caricato.</li>
              <li><strong>Per i Servizi Educativi/Aziende:</strong> Nome del referente, e-mail di contatto e informazioni contenute negli annunci di lavoro pubblicati.</li>
              <li><strong>Dati di Log/Sistema:</strong> Indirizzo IP e orari di accesso per motivi di sicurezza informatica.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold">3. Finalità e Base Giuridica del Trattamento</h2>
            <p className={paragraph}>I dati personali vengono raccolti esclusivamente per:</p>
            <ol className="mt-3 list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Consentire la creazione dell'account e l'accesso ai servizi della piattaforma.</li>
              <li>Permettere la pubblicazione degli annunci di lavoro e la trasmissione delle candidature.</li>
              <li>Rispondere a eventuali richieste di supporto.</li>
            </ol>
            <p className={paragraph}><strong>Base giuridica:</strong> L'esecuzione del servizio richiesto dall'utente e il consenso fornito al momento della registrazione.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold">4. Conservazione dei Dati</h2>
            <p className={paragraph}>I dati personali rimarranno conservati e gestiti fintanto che l'account dell'utente rimarrà attivo. In caso di cancellazione dell'account da parte dell'utente (o di richiesta esplicita di rimozione), i dati personali e i relativi file (es. CV) verranno eliminati definitivamente dai nostri sistemi entro 30 giorni.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold">5. Condivisione dei Dati</h2>
            <p className={paragraph}>I dati non saranno venduti o ceduti a terzi per finalità commerciali. I CV dei candidati saranno resi visibili o trasmessi esclusivamente ai soggetti (Servizi Educativi/Aziende) a cui il candidato sceglie autonomamente di inviare la propria candidatura.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold">6. Diritti dell'Utente</h2>
            <p className={paragraph}>In conformità al Regolamento UE 2016/679 (GDPR), l'utente ha il diritto in qualsiasi momento di:</p>
            <ul className={`mt-3 ${bullet}`}>
              <li>Accedere ai propri dati o chiederne una copia.</li>
              <li>Chiedere la rettifica o l'aggiornamento dei dati.</li>
              <li>Chiedere la cancellazione definitiva del proprio account e dei propri dati.</li>
              <li>Revocare il consenso al trattamento.</li>
            </ul>
            <p className={paragraph}>Per esercitare tali diritti, è sufficiente inviare una richiesta all'indirizzo e-mail: <a className="font-semibold text-primary underline" href="mailto:info@semilavoro.it">info@semilavoro.it</a>.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold">7. Cookie</h2>
            <p className={paragraph}>Questo sito non fa uso di cookie di profilazione o di tracciamento commerciale. Vengono impiegati unicamente cookie o identificatori tecnici strettamente indispensabili per permettere la navigazione autenticata e la sicurezza dell'account.</p>
          </section>
        </div>
        <Link to="/" className="mt-12 inline-block font-semibold text-primary underline">Torna alla homepage</Link>
      </section>
    </SiteLayout>
  );
}
