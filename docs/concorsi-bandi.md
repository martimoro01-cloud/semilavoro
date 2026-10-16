# Concorsi e bandi — attivazione

La pagina `/concorsi-bandi` e il pannello editoriale sono implementati nel ramo di sviluppo, **non in produzione**.

## Prima della pubblicazione
1. Verificare il database Supabase corretto e applicare `supabase/migrations/20261013_bandi.sql`.
2. Con privilegi SQL amministrativi, assegnare l'account editor:
   `INSERT INTO public.bandi_amministratori(user_id) VALUES ('UUID_ACCOUNT');`
   L'UUID va recuperato dagli utenti autenticati; non è un indirizzo email.
3. Verificare in anteprima: lettura pubblica, RLS, inserimento bozza, verifica, pubblicazione, nascondimento e filtri.
4. Configurare il workflow su GitHub con secret `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (mai client-side), e variable `BANDI_FEEDS_JSON`, una lista JSON di feed RSS/Atom **ufficiali verificati**. Nessun feed è configurato di default.
5. Testare ciascun feed: molti feed riportano la data di pubblicazione ma non la scadenza. L'importer ignora gli elementi senza data di scadenza strutturata esplicita. Non deduce scadenze dai titoli e non pubblica automaticamente.
6. Verificare un processo di aggiornamento e ritiro delle opportunità rettificate: la prima versione importa bozze e non aggiorna automaticamente i bandi già importati.
7. L'esecuzione programmata di GitHub Actions funziona sul ramo di default dopo il merge, non nel ramo di sviluppo.

## Dati e sicurezza
- RLS: chiunque legge solo i bandi pubblicati; solo gli amministratori autorizzati possono scrivere.
- L'importer usa la service role **solo lato GitHub Actions**, non nel browser.
- Link consentiti solo in HTTPS; per importazioni automatiche l'host deve essere in allowlist del feed.
- Le date scadute sono evidenziate e filtrate lato client; le fonti restano responsabilità della redazione.
- Non sono stati inseriti concorsi inventati o dati di esempio spacciati per reali.

## Limiti attuali
- La verifica automatica delle rettifiche non è implementata.
- L'importer supporta RSS e Atom solo quando è disponibile un campo di scadenza esplicito.
- Non sono stati eseguiti build e test end-to-end né verificati i permessi del database reale.
