/**
 * Tipi per il Calcolatore IMU 2025
 * Basato su L. 160/2019, art. 1, cc. 739-783
 */

// Categorie catastali
export type CategoriaGruppoA = 'A/1' | 'A/2' | 'A/3' | 'A/4' | 'A/5' | 'A/6' | 'A/7' | 'A/8' | 'A/9' | 'A/10' | 'A/11';
export type CategoriaGruppoB = 'B/1' | 'B/2' | 'B/3' | 'B/4' | 'B/5' | 'B/6' | 'B/7' | 'B/8';
export type CategoriaGruppoC = 'C/1' | 'C/2' | 'C/3' | 'C/4' | 'C/5' | 'C/6' | 'C/7';
export type CategoriaGruppoD = 'D/1' | 'D/2' | 'D/3' | 'D/4' | 'D/5' | 'D/6' | 'D/7' | 'D/8' | 'D/9' | 'D/10';
export type CategoriaCatastale = CategoriaGruppoA | CategoriaGruppoB | CategoriaGruppoC | CategoriaGruppoD;

// Tipologie immobile
export type TipoImmobile =
  | 'abitazione_principale'    // A/1, A/8, A/9 con residenza
  | 'pertinenza'               // C/2, C/6, C/7 di abitazione principale
  | 'terreno_agricolo'         // Terreni
  | 'fabbricato_rurale'        // Fabbricati rurali strumentali
  | 'area_fabbricabile'        // Aree edificabili
  | 'altro_fabbricato';        // Tutti gli altri

// Riduzioni applicabili
export interface Riduzioni {
  storicoArtistico: boolean;      // -50% base
  inagibileInabitabile: boolean;  // -50% base
  comodatoParenti: boolean;       // -50% base (1° grado, stesso comune)
  canoneCorordato: boolean;       // -25% aliquota (L. 431/1998)
  pensionatoEstero: boolean;      // -50% base (1 immobile, non locato)
}

// Esenzioni
export interface Esenzioni {
  abitazionePrincipale: boolean;  // Non A/1, A/8, A/9
  terrenoCdIap: boolean;          // Coltivatore diretto / IAP
  beneMerce: boolean;             // Dal 2022
  occupatoAbusivamente: boolean;  // Dal 2023
  collabente: boolean;            // F/2
}

// Dati immobile
export interface DatiImmobile {
  id: string;
  descrizione?: string;
  tipo: TipoImmobile;
  categoria: CategoriaCatastale;

  // Dati catastali
  renditaCatastale?: number;      // Per fabbricati (€)
  redditoDominicale?: number;     // Per terreni (€)
  valoreVenale?: number;          // Per aree fabbricabili (€)

  // Possesso
  percentualePossesso: number;    // 0-100
  mesiPrimoSemestre: number;      // 0-6
  mesiSecondoSemestre: number;    // 0-6

  // Aliquote
  aliquotaAcconto: number;        // % (es. 0.86)
  aliquotaSaldo: number;          // % (es. 0.86)

  // Riduzioni ed esenzioni
  riduzioni: Riduzioni;
  esenzioni: Esenzioni;
}

// Risultato calcolo singolo immobile
export interface RisultatoCalcoloImmobile {
  immobile: DatiImmobile;

  // Calcoli intermedi
  coefficiente: number;
  baseImponibileLorda: number;
  fattoreRiduzione: number;       // 1, 0.5, 0.25
  baseImponibileNetta: number;

  // Importi
  imuAcconto: number;             // Prima rata (16/06)
  imuSaldo: number;               // Seconda rata (16/12)
  imuTotale: number;

  // Quote (solo per gruppo D)
  quotaStato?: number;            // 0.76%
  quotaComune?: number;           // Eccedenza

  // Detrazione (solo abitazione principale)
  detrazione?: number;            // €200

  // Esenzione
  esente: boolean;
  motivoEsenzione?: string;

  // Codice tributo F24
  codiceTributoComune: string;
  codiceTributoStato?: string;
}

// Riepilogo complessivo
export interface RiepilogoIMU {
  anno: number;
  contribuente: string;
  codiceFiscale?: string;

  immobili: RisultatoCalcoloImmobile[];

  // Totali
  totaleAcconto: number;
  totaleSaldo: number;
  totaleAnnuo: number;

  // Totali per codice tributo
  totaliPerCodice: Record<string, number>;

  // Scadenze
  scadenzaAcconto: string;        // "16/06/YYYY"
  scadenzaSaldo: string;          // "16/12/YYYY"
}

// Configurazione comune
export interface ConfigurazioneComune {
  codice: string;
  nome: string;
  provincia: string;

  // Aliquote deliberate
  aliquote: {
    abitazionePrincipale: number;  // Default 0.50%
    fabbricatiRurali: number;      // Default 0.10%
    terreniAgricoli: number;       // Default 0.76%
    gruppoD: number;               // Default 0.86% (min 0.76%)
    altriFabbricati: number;       // Default 0.86%
    areeFabbricabili: number;      // Default 0.86%
  };
}

// Dati contribuente
export interface Contribuente {
  nome: string;
  codiceFiscale: string;
  anno: number;
  codiceComune?: string;
  comuneResidenza?: string;
}

// Step del wizard
export interface WizardStep {
  id: string;
  title: string;
}
