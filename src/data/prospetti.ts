/**
 * Servizio lookup prospetti IMU
 *
 * Trova le aliquote comunali in base a:
 * - Regione e sigla provincia del comune
 * - Anno di riferimento (2026 → 2025 → aliquote ministeriali)
 */

import type { Comune } from '../types';

// Tipi per le delibere
export interface Delibera {
  anno_riferimento: number;
  num_delibera: string;
  data_delibera: string;
  data_pubblicazione: string;
  codice_tributo: string;
  note: string;
  nome_prospetto: string;
  link_prospetto: string;
  key_documentum: string;
}

export interface ComuneDelibere {
  url_pagina: string;
  comune: string;
  codice_catastale: string;
  provincia: string;
  delibere: Delibera[];
}

// Tipi per il prospetto estratto
export interface AliquotaBase {
  fattispecie_principale: string;
  aliquota: string | boolean;
}

export interface AliquotaPersonalizzata {
  fattispecie_principale: string;
  categoria_catastale?: string;
  requisiti_oggettivi?: string;
  requisiti_soggettivi?: string;
  attivita?: string;
  ateco?: string;
  dipendenti?: string;
  collocazione?: string;
  destinazione_uso?: string;
  aliquota: string;
}

export interface Prospetto {
  comune: string;
  id_prospetto: string;
  anno: number;
  delibera: {
    numero: number;
    data: string;
    organo: string;
  };
  aliquote_base: AliquotaBase[];
  aliquote_personalizzate: AliquotaPersonalizzata[];
  esenzioni: string[];
}

/**
 * Converte la data formato "DD-MM-YYYY" o "DD/MM/YYYY" in Date
 */
function parseDataDelibera(data: string): Date {
  const parts = data.split(/[-/]/);
  if (parts.length !== 3) return new Date(0);
  const [giorno, mese, anno] = parts.map(Number);
  return new Date(anno, mese - 1, giorno);
}

/**
 * Trova la delibera più recente per un dato anno
 */
export function trovaDeliberaPiuRecente(
  delibere: Delibera[],
  anno: number
): Delibera | null {
  const delibereAnno = delibere.filter(d => d.anno_riferimento === anno);

  if (delibereAnno.length === 0) return null;
  if (delibereAnno.length === 1) return delibereAnno[0];

  // Ordina per data_delibera decrescente e prendi la più recente
  return delibereAnno.sort((a, b) => {
    const dataA = parseDataDelibera(a.data_delibera);
    const dataB = parseDataDelibera(b.data_delibera);
    return dataB.getTime() - dataA.getTime();
  })[0];
}

/**
 * Trova la delibera applicabile per un comune
 * Logica: 2026 → 2025 → null (usa aliquote ministeriali)
 */
export function trovaDeliberaApplicabile(
  delibere: Delibera[],
  annoCorrente: number = 2026
): Delibera | null {
  // Prima cerca anno corrente
  let delibera = trovaDeliberaPiuRecente(delibere, annoCorrente);
  if (delibera) return delibera;

  // Poi anno precedente
  delibera = trovaDeliberaPiuRecente(delibere, annoCorrente - 1);
  if (delibera) return delibera;

  return null;
}

/**
 * Estrae il nome del file JSON dal nome del prospetto PDF
 * Es: "10322_DIMUNIC-08ge25d969d.pdf" → "10322_DIMUNIC-08ge25d969d.json"
 */
export function getNomeFileProspetto(nomeProspetto: string): string {
  return nomeProspetto.replace(/\.pdf$/i, '.json');
}

/**
 * Costruisce il percorso del file delibere per una provincia
 * Es: regione="LIGURIA", sigla="GE" → "LIGURIA/delibere_imu_LIGURIA_GE.json"
 */
export function getPercorsoDelibere(regione: string, siglaProvincia: string): string {
  const regioneUpper = regione.toUpperCase();
  const siglaUpper = siglaProvincia.toUpperCase();
  return `${regioneUpper}/delibere_imu_${regioneUpper}_${siglaUpper}.json`;
}

/**
 * Costruisce il percorso del file prospetto
 * Es: regione="LIGURIA", nomeProspetto="10322_DIMUNIC-08ge25d969d.pdf"
 *     → "LIGURIA/10322_DIMUNIC-08ge25d969d.json"
 */
export function getPercorsoProspetto(regione: string, nomeProspetto: string): string {
  const regioneUpper = regione.toUpperCase();
  const nomeFile = getNomeFileProspetto(nomeProspetto);
  return `${regioneUpper}/${nomeFile}`;
}

/**
 * Cerca il comune nell'elenco delibere
 */
export function trovaComuneInDelibere(
  delibereProvince: ComuneDelibere[],
  codiceCatastale: string
): ComuneDelibere | null {
  return delibereProvince.find(
    c => c.codice_catastale.toUpperCase() === codiceCatastale.toUpperCase()
  ) || null;
}

/**
 * Risultato della ricerca prospetto
 */
export interface RisultatoLookup {
  trovato: boolean;
  percorsoProspetto: string | null;
  delibera: Delibera | null;
  usaAliquoteMinisteriali: boolean;
}

/**
 * Esegue il lookup completo per un comune
 * Restituisce le informazioni necessarie per caricare il prospetto
 */
export function lookupProspetto(
  comune: Comune,
  delibereProvince: ComuneDelibere[],
  annoCorrente: number = 2026
): RisultatoLookup {
  // Cerca il comune
  const comuneDelibere = trovaComuneInDelibere(
    delibereProvince,
    comune.codice_catastale
  );

  if (!comuneDelibere || comuneDelibere.delibere.length === 0) {
    return {
      trovato: false,
      percorsoProspetto: null,
      delibera: null,
      usaAliquoteMinisteriali: true,
    };
  }

  // Trova la delibera applicabile
  const delibera = trovaDeliberaApplicabile(comuneDelibere.delibere, annoCorrente);

  if (!delibera) {
    return {
      trovato: false,
      percorsoProspetto: null,
      delibera: null,
      usaAliquoteMinisteriali: true,
    };
  }

  // Costruisci il percorso del prospetto
  const percorsoProspetto = getPercorsoProspetto(
    comune.regione,
    delibera.nome_prospetto
  );

  return {
    trovato: true,
    percorsoProspetto,
    delibera,
    usaAliquoteMinisteriali: false,
  };
}
