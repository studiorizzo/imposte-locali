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

// Comune (da istat.json)
export interface Comune {
  comune: string;
  regione: string;
  provincia: string;
  sigla_provincia: string;
  codice_catastale: string;
  codice_comune: string;            // Codice ISTAT alfanumerico (es. "28001")
  abitanti: number;                 // Popolazione residente (ISTAT 2025)
  label: string;                    // "codice_catastale - comune" per autocomplete
}

// Fattispecie principale (allineato ai prospetti ministeriali)
export type FattispeciePrincipale =
  | 'abitazione_principale_lusso'    // A/1, A/8, A/9 - aliquota 0.50%
  | 'pertinenze'                     // C/2, C/6, C/7 (max 1 per cat.) - aliquota 0.50% (stessa ab. principale)
  | 'fabbricati_gruppo_d'            // D/1-D/9 (quota stato 0.76%) - aliquota 0.86%
  | 'terreni_agricoli'               // Terreni - aliquota 0.76%
  | 'fabbricati_rurali_strumentali'  // D/10 - aliquota 0.10%
  | 'aree_fabbricabili'              // Aree edificabili - aliquota 0.86%
  | 'altri_fabbricati';              // Tutti gli altri (A/2-A/11, B, C) - aliquota 0.86%

// Riduzioni applicabili (caratteristiche dell'immobile)
export interface Riduzioni {
  storicoArtistico: boolean;      // -50% base
  inagibileInabitabile: boolean;  // -50% base
  comodatoParenti: boolean;       // -50% base (1° grado, stesso comune)
  canoneCorordato: boolean;       // -25% aliquota (L. 431/1998)
  // pensionatoEstero spostato in TipologiaContribuente
}

// Esenzioni
export interface Esenzioni {
  terrenoCdIap: boolean;          // Coltivatore diretto / IAP
  beneMerce: boolean;             // Dal 2022
  occupatoAbusivamente: boolean;  // Dal 2023
  collabente: boolean;            // F/2
}

// Dati immobile
export interface DatiImmobile {
  id: string;
  descrizione?: string;
  comune: Comune;                   // Comune dove si trova l'immobile
  fattispecie_principale: FattispeciePrincipale;
  categoria: CategoriaCatastale;

  // Dati catastali
  renditaCatastale?: number;      // Per fabbricati (€)
  redditoDominicale?: number;     // Per terreni (€)
  valoreVenale?: number;          // Per aree fabbricabili (€)

  // Possesso
  percentualePossesso: number;    // 0-100
  dataInizio: string;             // Format: "YYYY-MM-DD" (default: primo giorno anno)
  dataFine: string;               // Format: "YYYY-MM-DD" (default: ultimo giorno anno)

  // Aliquote
  aliquotaAcconto: number;        // % (es. 0.86)
  aliquotaSaldo: number;          // % (es. 0.86)

  // Riduzioni ed esenzioni
  riduzioni: Riduzioni;
  esenzioni: Esenzioni;

  // Condizioni residente estero (art. 1, c. 48-48bis, L. 178/2020)
  // Visibili solo per: residente estero + comune < 5000 ab. + altri_fabbricati + cat. A (no A/10)
  immobileNonLocatoNonComodato?: boolean;  // Immobile non locato né concesso in comodato d'uso
  immobileUltimaResidenza?: boolean;       // Immobile ubicato nel comune di ultima residenza

  // Condizioni forze armate (art. 1, c. 741, lett. c, n. 5, L. 160/2019)
  // Visibili solo per: forze armate + abitazione_principale_lusso o pertinenze
  immobileNonLocatoForzeArmate?: boolean;  // Immobile non concesso in locazione
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

// Tipologia contribuente
export type TipologiaContribuente =
  | 'persona_fisica'                      // Standard
  | 'persona_fisica_residente_estero'     // Emigrato estero (art. 1, c. 48-48bis, L. 178/2020 mod. 2026)
  | 'persona_fisica_anziano_ricoverato'   // Assimilazione ab. principale (art. 1, c. 741, lett. c, n. 6)
  | 'persona_fisica_forze_armate'         // Assimilazione ab. principale (art. 1, c. 741, lett. c, n. 5)
  | 'persona_giuridica';

// Soluzione di pagamento
export type SoluzionePagamento = 'rateizzato' | 'rata_unica';

// Dati anagrafici persona fisica
export interface DatiAnagrafici {
  cognome: string;
  nome: string;
  codiceFiscale: string;
  sesso: 'M' | 'F' | '';
  dataNascita: string;           // Format: "YYYY-MM-DD"
  comuneNascita: string;
  provinciaNascita: string;
}

// Domicilio fiscale
export interface DomicilioFiscale {
  indirizzo: string;
  civico: string;
  comune: string;
  provincia: string;
  cap: string;
}

// Dati pagamento
export interface DatiPagamento {
  iban: string;
  soluzionePagamento: SoluzionePagamento;
  dataVersamento: string;        // Format: "YYYY-MM-DD"
}

// Dati contribuente (per UI)
export interface Contribuente {
  tipologia: TipologiaContribuente;
  datiAnagrafici: DatiAnagrafici;
  domicilioFiscale: DomicilioFiscale;
  pagamento: DatiPagamento;
}

// Step del wizard (per UI)
export interface WizardStep {
  id: string;
  title: string;
}
