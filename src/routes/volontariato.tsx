import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, HeartHandshake, SearchX } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { fetchAnnunci } from "@/lib/annunci-db";
import { AnnuncioCard } from "@/routes/trova-lavoro.$area";

export const Route = createFileRoute("/volontariato")({
  head: () => ({ meta: [{ title: "Opportunità di volontariato — SEMI" }, { name: "description", content: "Scopri gli annunci di volontariato pubblicati dagli enti del terzo settore." }] }),
  component: Volontariato,
});

function Volontariato() {
  const { data: annunci = [], isLoading, isError } = useQuery({
    queryKey: ["annunci", "volontariato"],
    queryFn: () => fetchAnnunci({ tipo: "volontario" }),
  });
  return <SiteLayout><section className="mx-auto max-w-4xl px-6 py-16">
    <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Torna alla homepage</Link>
    <div className="mt-9 flex items-center gap-3"><HeartHandshake className="h-8 w-8 text-primary" /><p className="text-xs font-bold uppercase tracking-widest text-primary">Non solo annunci di lavoro</p></div>
    <h1 className="mt-4 text-4xl font-bold md:text-5xl">Opportunità di volontariato</h1>
    <p className="mt-4 text-lg text-muted-foreground">Scopri le opportunità di volontariato proposte da servizi e organizzazioni del terzo settore e candidati direttamente alle attività che ti interessano.</p>
    {isLoading && <p className="mt-10 text-muted-foreground">Caricamento opportunità...</p>}
    {isError && <p role="alert" className="mt-10 text-destructive">Impossibile caricare le opportunità. Verifica l'attivazione della nuova categoria nel database.</p>}
    {!isLoading && !isError && annunci.length === 0 && <div className="mt-12 rounded-3xl border border-border bg-card p-12 text-center"><SearchX className="mx-auto h-7 w-7 text-primary" /><p className="mt-4 font-bold">Nessuna opportunità disponibile per ora.</p></div>}
    <div className="mt-10 grid gap-6">{[...annunci].sort((a,b) => Number(!!b.in_primo_piano) - Number(!!a.in_primo_piano)).map(annuncio => <AnnuncioCard key={annuncio.id} annuncio={annuncio} />)}</div>
  </section></SiteLayout>;
}
