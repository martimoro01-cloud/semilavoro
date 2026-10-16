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
  };
}

export async function fetchAnnunci(filter: { area?: string; primoPiano?: boolean } = {}) {
  let query = supabase.from("annunci").select("*").eq("stato_pubblicazione", "attivo").order("created_at", { ascending: false });
  if (filter.area) query = query.eq("area", filter.area);
  if (filter.primoPiano) query = query.eq("in_primo_piano", true).limit(3);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toAnnuncio);
}
