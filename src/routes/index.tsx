import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchAnnunci } from "@/lib/annunci-db";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
import { Button } from "@/components/ui/button";
import { Megaphone, Search, MapPin, Clock, ArrowRight, Mail, Star, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "semi — Il lavoro educativo cresce qui" },
      {
        name: "description",
        content:
          "semi è il punto d'incontro tra chi lavora nel sociale e chi sta cercando proprio te. Pubblica un annuncio o trova lavoro in ambito educativo.",
      },
      { property: "og:title", content: "semi — Il lavoro educativo cresce qui" },
      {
        property: "og:description",
        content:
          "Il punto d'incontro tra chi lavora nel sociale e chi sta cercando proprio te.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Nunito+Sans:wght@400;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: annunciInPrimoPiano = [] } = useQuery({ queryKey: ["annunci", "primo-piano"], queryFn: () => fetchAnnunci({ primoPiano: true }) });
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        {/* Motivo grafico astratto: archi e trame, anziché illustrazioni botaniche */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-48 top-12 h-[540px] w-[540px] rounded-full border-[70px] border-[#B8D7A8]/40" />
          <div className="absolute -right-56 -top-48 h-[680px] w-[680px] rounded-full border-[90px] border-[#E3AD57]/[0.16]" />
        </div>
        <div className="relative mx-auto flex min-h-[560px] max-w-6xl flex-col items-center justify-center px-6 pb-24 pt-20 text-center md:min-h-[660px] md:pb-32 md:pt-24">
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Il lavoro educativo
            <br />
            cresce qui
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            Il punto d'incontro tra chi lavora nel sociale e chi sta cercando
            proprio te.
          </p>
          <div className="mx-auto mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-2 md:gap-6">
            <Link
              to="/pubblica-annuncio"
              className="group flex min-h-28 items-center justify-between gap-4 rounded-[1.75rem] border border-primary/10 bg-primary px-7 py-7 text-left text-base font-semibold text-primary-foreground shadow-xl shadow-primary/10 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/15 sm:px-8"
            >
              <span className="flex items-center gap-3">
                <Megaphone className="h-5 w-5" />
                Pubblica annuncio
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20 transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/trova-lavoro"
              className="group flex min-h-24 items-center justify-between gap-4 rounded-2xl bg-primary px-6 py-6 text-left text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 sm:px-7"
            >
              <span className="flex items-center gap-3">
                <Search className="h-5 w-5" />
                Trova lavoro
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20 transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
          <div className="mt-16 h-px w-16 bg-brand-green/50" aria-hidden="true" />
        </div>
      </section>

      {/* Annunci in primo piano */}
      <section id="annunci" className="scroll-mt-24 border-t border-border bg-muted/30 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-bold md:text-4xl">
