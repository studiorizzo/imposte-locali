/**
 * Elenco comuni italiani con codici catastali
 * Fonte: ISTAT - Elenco comuni italiani aggiornato al 30 giugno 2025
 */
import type { Comune } from '../types';
import comuniData from './comuni.json';

export const COMUNI: Comune[] = comuniData as Comune[];

/**
 * Cerca comuni per codice catastale o nome
 * @param query - Stringa di ricerca
 * @param maxResults - Numero massimo di risultati (default 10)
 */
export function cercaComune(query: string, maxResults = 10): Comune[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase();
  return COMUNI
    .filter(c => c.label.toLowerCase().includes(q))
    .slice(0, maxResults);
}

/**
 * Trova un comune per codice catastale
 * @param codiceCatastale - Codice catastale (es. "H501" per Roma)
 */
export function getComuneByCodice(codiceCatastale: string): Comune | undefined {
  return COMUNI.find(c => c.codice_catastale === codiceCatastale.toUpperCase());
}
