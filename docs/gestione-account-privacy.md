# SEMI — rilascio funzioni account, candidature e chat (16 ottobre 2026)

**Non distribuire ancora in produzione.** Modifiche nel ramo `restyling-homepage-semi`, senza migrazioni applicate e senza test end-to-end.

## Completato nel codice
- Icona fotocamera nell'area personale: JPG/PNG/WebP fino a 2 MB, avatar opzionale. **Il bucket è pubblico**: la foto caricata può essere vista da chiunque conosca l'URL; chiedere conferma di questa scelta prima del rilascio.
- Form candidatura: campo **Messaggio** al posto di **Lettera di presentazione**; il database conserva temporaneamente il nome storico `lettera` per compatibilità.
- Chat per candidatura accettata o colloquio: visibile solo ai due partecipanti grazie alle policy RLS, con aggiornamento periodico.
- Eliminazione annuncio anche con candidature, previa conferma. Il FK candidature→annunci deve avere `ON DELETE CASCADE`; i messaggi collegati sono cancellati via cascata. La rimozione dei CV dal browser potrebbe non avere permessi sui file di altri utenti: prevedere pulizia sicura lato server prima del rilascio.
- Pulsante eliminazione account: chiama Edge Function autenticata `elimina-account`; necessita deploy e test di eliminazione completa, comprese dipendenze RLS/storage.

## Configurazione necessaria
1. Applicare `supabase/migrations/20261016_profili_messaggi.sql` al database **corretto**, dopo revisione.
2. Deployare `supabase/functions/elimina-account/index.ts` con verifica JWT e segreti server-side, configurare `ALLOWED_ORIGINS` con il dominio ufficiale. Verificare gestione degli errori e dati orfani.
3. Eseguire build, lint e test reali dei ruoli educatore/servizio, CV, foto, chat e cancellazioni.
4. Prima del rilascio, implementare la cancellazione sicura dei CV degli altri candidati quando un servizio elimina un annuncio.
5. Testare i percorsi in cui un annuncio è eliminato mentre un colloquio o una conversazione è aperta.
6. Preparare una **vera informativa privacy** (identità e contatti del titolare, finalità, basi giuridiche, destinatari e ruoli dei servizi educativi, tempi di conservazione, diritti, trasferimenti, sicurezza, cookie se applicabili). Richiedere revisione di un professionista privacy.
7. Mostrare l'informativa e una presa visione non preselezionata al momento della registrazione e della candidatura, registrando versione e data quando opportuno. Consensi separati solo per trattamenti che si basano effettivamente sul consenso.

## Annunci di prova
**Non eliminati**: il repository non permette di identificare con certezza quali righe del database reale siano test. Prima raccogliere gli ID dei record da cancellare, verificare che non siano annunci reali, poi eseguire la cancellazione sul database corretto con backup. Mai cancellare massivamente per somiglianza del titolo.

## Note di sicurezza
La Edge Function elimina dati in più passaggi: se uno fallisce, può rimanere uno stato parziale. Per il rilascio definitivo serve un processo di eliminazione idempotente con log amministrativo e gestione dei fallimenti. Non presentare la funzione come verificata fino al test.
