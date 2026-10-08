export type Annuncio = {
  titolo: string;
  area: string;
  sede: string;
  orario: string;
};

export type AreaDiIntervento = {
  slug: string;
  nome: string;
  descrizione: string;
};

export const annunci: Annuncio[] = [
  {
    titolo: "Operatore/trice sociale residenziale",
    area: "Anziani",
    sede: "Firenze",
    orario: "Full-time",
  },
  {
    titolo: "Coordinatore/trice di progetto",
    area: "Disabilità",
    sede: "Bologna",
    orario: "Full-time",
  },
  {
    titolo: "Educatore/trice per centro diurno",
    area: "Minori",
    sede: "Milano",
    orario: "Full-time",
  },
  {
    titolo: "Educatore/trice in comunità mamma-bambino",
    area: "Mamma-bambino",
    sede: "Roma",
    orario: "Part-time",
  },
  {
    titolo: "Animatore/trice educativo in comunità terapeutica",
    area: "Dipendenze",
    sede: "Napoli",
    orario: "Full-time",
  },
  {
    titolo: "Mediatore/trice culturale nel servizio di accoglienza",
    area: "Migranti",
    sede: "Torino",
    orario: "Part-time",
  },
];

export const annunciInPrimoPiano: Annuncio[] = annunci.slice(0, 3);

export const areeDiIntervento: AreaDiIntervento[] = [
  {
    slug: "prima-infanzia",
    nome: "Prima infanzia",
    descrizione: "Asili nido, micronidi e servizi per bambini da 0 a 3 anni.",
  },
  {
    slug: "minori",
    nome: "Minori",
    descrizione:
      "Centri diurni, comunità educative e doposcuola per bambini e ragazzi.",
  },
  {
    slug: "mamma-bambino",
    nome: "Mamma-bambino",
    descrizione: "Comunità e servizi di accoglienza per mamme con bambini.",
  },
  {
    slug: "dipendenze",
    nome: "Dipendenze",
    descrizione: "Comunità terapeutiche e servizi di recupero dalle dipendenze.",
  },
  {
    slug: "donne-sotto-tutela",
    nome: "Donne sotto tutela",
    descrizione: "Servizi di accoglienza e protezione per donne sotto tutela.",
  },
  {
    slug: "migranti",
    nome: "Migranti",
    descrizione: "Servizi di accoglienza e inclusione per persone migranti.",
  },
  {
    slug: "disabilita",
    nome: "Disabilità",
    descrizione: "Servizi educativi e riabilitativi per persone con disabilità.",
  },
  {
    slug: "anziani",
    nome: "Anziani",
    descrizione: "Residenze, centri diurni e assistenza domiciliare per anziani.",
  },
];

export function trovaArea(slug: string): AreaDiIntervento | undefined {
  return areeDiIntervento.find((area) => area.slug === slug);
}

export function annunciPerArea(nome: string): Annuncio[] {
  return annunci.filter((annuncio) => annuncio.area === nome);
}
