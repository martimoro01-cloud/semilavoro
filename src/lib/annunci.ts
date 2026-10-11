export type Annuncio = {
  id: string;
  servizio: string;
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

export const areeDiIntervento: AreaDiIntervento[] = [
  {
    slug: "prima-infanzia",
    nome: "Prima infanzia",
    descrizione: "\n",
  },
  {
    slug: "minori",
    nome: "Minori",
    descrizione: "\n",
  },
  {
    slug: "mamma-bambino",
    nome: "Mamma-bambino",
    descrizione: "\n",
  },
  {
    slug: "dipendenze",
    nome: "Dipendenze",
    descrizione: "\n",
  },
  {
    slug: "donne-sotto-tutela",
    nome: "Donne sotto tutela",
    descrizione: "\n",
  },
  {
    slug: "migranti",
    nome: "Migranti",
    descrizione: "\n",
  },
  {
    slug: "disabilita",
    nome: "Disabilità",
    descrizione: "\n",
  },
  {
    slug: "anziani",
    nome: "Anziani",
    descrizione: "\n\n\n",
  },
];

export function trovaArea(slug: string): AreaDiIntervento | undefined {
  return areeDiIntervento.find((area) => area.slug === slug);
}

