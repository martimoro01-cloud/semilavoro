import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/chi-siamo")({
  head: () => ({ meta: [{ title: "Chi siamo — SEMI" }, { name: "description", content: "Scopri chi ha dato vita a SEMI e perché nasce il progetto dedicato al lavoro educativo e sociale." }] }),
  component: ChiSiamo,
});

function ChiSiamo() {
  return (
    <SiteLayout>
      <section className="min-h-[65vh] border-t border-border bg-background py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-brand-green">Il progetto e le persone dietro SEMI</span>
            <h1 className="text-4xl font-bold md:text-5xl">Chi siamo</h1>
            <p className="mt-8 text-xl font-semibold leading-relaxed md:text-2xl">SEMI nasce da chi il mondo educativo lo vive ogni giorno.</p>
            <div className="mt-7 space-y-5 leading-relaxed text-muted-foreground">
              <p>Siamo due educatrici e, attraverso le nostre esperienze professionali in Italia e all'estero, abbiamo conosciuto da vicino le opportunità, le sfide e le difficoltà che caratterizzano il settore educativo e sociale.</p>
              <p>Nel nostro percorso abbiamo riscontrato un'esigenza concreta: rendere più semplice e accessibile l'incontro tra chi cerca lavoro e le realtà che cercano personale qualificato.</p>
              <p>Le opportunità professionali, infatti, sono spesso distribuite tra canali frammentati e poco specifici, rendendo la ricerca e la selezione più complicate del necessario.</p>
              <p>Da questa consapevolezza è nato <strong className="text-foreground">SEMI – Il lavoro educativo cresce qui</strong>, uno spazio dedicato a educatori, pedagogisti, professionisti del sociale, enti e organizzazioni.</p>
              <p>Il nostro obiettivo è creare uno strumento semplice, chiaro e accessibile, capace di valorizzare le professionalità del settore e favorire nuove opportunità di incontro e collaborazione.</p>
            </div>
            <p className="mt-8 border-l-4 border-primary pl-5 text-lg font-bold">Perché crediamo che il lavoro educativo meriti uno spazio tutto suo.</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
