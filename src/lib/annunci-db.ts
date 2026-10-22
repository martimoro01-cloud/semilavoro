import { supabase } from "@/integrations/supabase/client";
import type { Annuncio } from "@/lib/annunci";
import type { Database } from "@/integrations/supabase/types";

export type AnnuncioRow = Database["public"]["Tables"]["annunci"]["Row"];
export type CandidaturaRow = Database["public"]["Tables"]["candidature"]["Row"];
export type StatoCandidatura = Database["public"]["Enums"]["stato_candidatura"];

export const statoLabel: Record<StatoCandidatura, string> = {
  in_attesa: "In attesa di risposta",
  accettata: "Accettata",
  rifiutata: "Non selezionata",
  colloquio: "Colloquio fissato",
};

export function toAnnuncio(row: AnnuncioRow): Annuncio {
  return {
    id: row.id,
    servizio: row.servizio,
    titolo: row.mansione,
    area: row.area,
    sede: row.provincia,
    orario: row.impegno,
    tipo_opportunita: row.tipo_opportunita,
    in_primo_piano: row.in_primo_piano,
    informazioni: row.informazioni,
    chiuso: row.stato_pubblicazione !== "attivo",
  };
}

export async function fetchAnnunci(filter: { area?: string; primoPiano?: boolean; tipo?: "operatore" | "volontario" } = {}) {
  let query = supabase.from("annunci").select("*").eq("stato_pubblicazione", "attivo").order("created_at", { ascending: false });
  query = query.eq("tipo_opportunita", filter.tipo ?? "operatore");
  if (filter.area) query = query.eq("area", filter.area);
  if (filter.primoPiano) query = query.eq("in_primo_piano", true).limit(3);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toAnnuncio);
}

export type StatoPubblicazione = "attivo" | "sospeso" | "archiviato";
export const statoPubblicazioneLabel: Record<StatoPubblicazione, string> = {
  attivo: "Attivo",
  sospeso: "Sospeso",
  archiviato: "Archiviato",
};
