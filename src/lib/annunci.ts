export type Annuncio = {
  titolo: string;
  area: string;
  sede: string;
  orario: string;
};

export const annunciInPrimoPiano: Annuncio[] = [
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
];

export const areeDiIntervento = [
  {
    nome: "Prima infanzia",
    descrizione: "Asili nido, micronidi e servizi per bambini da 0 a 3 anni.",
  },
  {
    nome: "Minori",
    descrizione: "Centri diurni, comunità educative e doposcuola per bambini e ragazzi.",
  },
  {
    nome: "Mamma-bambino",
    descrizione: "Comunità e servizi di accoglienza per mamme con bambini.",
  },
  {
    nome: "Dipendenze",
    descrizione: "Comunità terapeutiche e servizi di recupero dalle dipendenze.",
  },
  {
    nome: "Donne sotto tutela",
    descrizione: "Servizi di accoglienza e protezione per donne sotto tutela.",
  },
  {
    nome: "Migranti",
    descrizione: "Servizi di accoglienza e inclusione per persone migranti.",
  },
  {
    nome: "Disabilità",
    descrizione: "Servizi educativi e riabilitativi per persone con disabilità.",
  },
  {
    nome: "Anziani",
    descrizione: "Residenze, centri diurni e assistenza domiciliare per anziani.",
  },
];
