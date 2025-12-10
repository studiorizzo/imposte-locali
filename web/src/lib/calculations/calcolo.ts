/**
 * Modulo Calcolo IMU 2025
 */

import type {
  DatiImmobile,
  RisultatoCalcoloImmobile,
  RiepilogoIMU,
  CategoriaCatastale,
  TipoImmobile,
} from '../../types';

import {
  COEFFICIENTI,
  COEFFICIENTE_TERRENI,
  RIVALUTAZIONE_TERRENI,
  RIVALUTAZIONE_RENDITA,
  QUOTA_STATO_GRUPPO_D,
  DETRAZIONE_ABITAZIONE_PRINCIPALE,
  CATEGORIE_ABITAZIONE_PRINCIPALE_TASSABILI,
  CODICI_TRIBUTO,
} from './constants';

/**
 * Arrotonda a 2 decimali
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Verifica se categoria è del gruppo D
 */
function isGruppoD(categoria: CategoriaCatastale): boolean {
  return categoria.startsWith('D/');
}

/**
 * Calcola il coefficiente moltiplicatore per categoria
 */
export function getCoeffciente(categoria: CategoriaCatastale): number {
  return COEFFICIENTI[categoria] ?? 0;
}

/**
 * Calcola il fattore di riduzione base imponibile
 */
export function calcolaFattoreRiduzione(immobile: DatiImmobile): number {
  const { riduzioni } = immobile;

  const riduzioni50: boolean[] = [
    riduzioni.storicoArtistico,
    riduzioni.inagibileInabitabile,
    riduzioni.comodatoParenti,
    riduzioni.pensionatoEstero,
  ];

  const numeroRiduzioni = riduzioni50.filter(Boolean).length;
  return Math.pow(0.5, numeroRiduzioni);
}

/**
 * Verifica se l'immobile è esente
 */
export function verificaEsenzione(
  immobile: DatiImmobile
): { esente: boolean; motivo?: string } {
  const { esenzioni, tipo, categoria } = immobile;

  if (
    tipo === 'abitazione_principale' &&
    !CATEGORIE_ABITAZIONE_PRINCIPALE_TASSABILI.includes(categoria)
  ) {
    return { esente: true, motivo: 'Abitazione principale (non A/1, A/8, A/9)' };
  }

  if (tipo === 'terreno_agricolo' && esenzioni.terrenoCdIap) {
    return { esente: true, motivo: 'Terreno agricolo CD/IAP' };
  }

  if (esenzioni.beneMerce) {
    return { esente: true, motivo: 'Bene merce (dal 2022)' };
  }

  if (esenzioni.occupatoAbusivamente) {
    return { esente: true, motivo: 'Immobile occupato abusivamente (dal 2023)' };
  }

  if (esenzioni.collabente) {
    return { esente: true, motivo: 'Fabbricato collabente F/2' };
  }

  return { esente: false };
}

/**
 * Calcola la base imponibile per fabbricati
 * Formula: Rendita × 1.05 × Coefficiente
 */
export function calcolaBaseImponibileFabbricato(
  renditaCatastale: number,
  categoria: CategoriaCatastale,
  percentualePossesso: number
): number {
  if (renditaCatastale <= 0) return 0;

  const coefficiente = getCoeffciente(categoria);
  const base =
    renditaCatastale *
    (percentualePossesso / 100) *
    RIVALUTAZIONE_RENDITA *
    coefficiente;

  return round2(base);
}

/**
 * Calcola la base imponibile per terreni agricoli
 * Formula: Reddito Dominicale × 1.25 × 135
 */
export function calcolaBaseImponibileTerreno(
  redditoDominicale: number,
  percentualePossesso: number
): number {
  if (redditoDominicale <= 0) return 0;

  const base =
    redditoDominicale *
    (percentualePossesso / 100) *
    RIVALUTAZIONE_TERRENI *
    COEFFICIENTE_TERRENI;

  return round2(base);
}

/**
 * Calcola la base imponibile per aree fabbricabili
 * Formula: Valore venale × % possesso
 */
export function calcolaBaseImponibileArea(
  valoreVenale: number,
  percentualePossesso: number
): number {
  if (valoreVenale <= 0) return 0;
  return round2(valoreVenale * (percentualePossesso / 100));
}

/**
 * Calcola l'IMU per un periodo
 * Formula: Base × Aliquota × Mesi/12
 */
export function calcolaIMUPeriodo(
  baseImponibile: number,
  aliquota: number,
  mesi: number,
  riduzioneCanoneConcordato: boolean = false
): number {
  if (baseImponibile <= 0 || mesi <= 0) return 0;

  const aliquotaEffettiva = riduzioneCanoneConcordato
    ? aliquota * 0.75
    : aliquota;

  return round2(baseImponibile * (aliquotaEffettiva / 100) * (mesi / 12));
}

/**
 * Calcola la detrazione per abitazione principale
 */
export function calcolaDetrazione(
  percentualePossesso: number,
  mesi: number
): number {
  return round2(
    DETRAZIONE_ABITAZIONE_PRINCIPALE * (percentualePossesso / 100) * (mesi / 12)
  );
}

/**
 * Calcola le quote Stato/Comune per immobili gruppo D
 */
export function calcolaQuoteGruppoD(
  baseImponibile: number,
  aliquota: number,
  mesi: number
): { quotaStato: number; quotaComune: number } {
  const aliquotaStato = Math.min(aliquota, QUOTA_STATO_GRUPPO_D);
  const quotaStato = round2(
    baseImponibile * (aliquotaStato / 100) * (mesi / 12)
  );

  const aliquotaComune = Math.max(0, aliquota - QUOTA_STATO_GRUPPO_D);
  const quotaComune = round2(
    baseImponibile * (aliquotaComune / 100) * (mesi / 12)
  );

  return { quotaStato, quotaComune };
}

/**
 * Ottiene il codice tributo F24 per tipo immobile
 */
export function getCodiceTributo(
  tipo: TipoImmobile,
  categoria: CategoriaCatastale
): { comune: string; stato?: string } {
  if (isGruppoD(categoria)) {
    return CODICI_TRIBUTO.gruppoD;
  }

  switch (tipo) {
    case 'abitazione_principale':
    case 'pertinenza':
      return CODICI_TRIBUTO.abitazionePrincipale;
    case 'fabbricato_rurale':
      return CODICI_TRIBUTO.fabbricatiRurali;
    case 'terreno_agricolo':
      return CODICI_TRIBUTO.terreni;
    case 'area_fabbricabile':
      return CODICI_TRIBUTO.areeFabbricabili;
    default:
      return CODICI_TRIBUTO.altriFabbricati;
  }
}

/**
 * Calcola l'IMU completa per un singolo immobile
 */
export function calcolaIMUImmobile(
  immobile: DatiImmobile
): RisultatoCalcoloImmobile {
  const { esente, motivo } = verificaEsenzione(immobile);

  if (esente) {
    return {
      immobile,
      coefficiente: 0,
      baseImponibileLorda: 0,
      fattoreRiduzione: 1,
      baseImponibileNetta: 0,
      imuAcconto: 0,
      imuSaldo: 0,
      imuTotale: 0,
      esente: true,
      motivoEsenzione: motivo,
      codiceTributoComune: '',
    };
  }

  const {
    tipo,
    categoria,
    renditaCatastale,
    redditoDominicale,
    valoreVenale,
    percentualePossesso,
    mesiPrimoSemestre,
    mesiSecondoSemestre,
    aliquotaAcconto,
    aliquotaSaldo,
    riduzioni,
  } = immobile;

  const mesiTotali = mesiPrimoSemestre + mesiSecondoSemestre;
  const coefficiente = tipo === 'terreno_agricolo'
    ? COEFFICIENTE_TERRENI
    : getCoeffciente(categoria);

  // Calcola base imponibile lorda
  let baseImponibileLorda = 0;
  if (tipo === 'terreno_agricolo') {
    baseImponibileLorda = calcolaBaseImponibileTerreno(
      redditoDominicale ?? 0,
      percentualePossesso
    );
  } else if (tipo === 'area_fabbricabile') {
    baseImponibileLorda = calcolaBaseImponibileArea(
      valoreVenale ?? 0,
      percentualePossesso
    );
  } else {
    baseImponibileLorda = calcolaBaseImponibileFabbricato(
      renditaCatastale ?? 0,
      categoria,
      percentualePossesso
    );
  }

  // Applica riduzioni base
  const fattoreRiduzione = calcolaFattoreRiduzione(immobile);
  const baseImponibileNetta = round2(baseImponibileLorda * fattoreRiduzione);

  // Calcola IMU acconto (1° rata)
  const imuAccontoLordo = calcolaIMUPeriodo(
    baseImponibileNetta,
    aliquotaAcconto,
    mesiPrimoSemestre,
    riduzioni.canoneCorordato
  );

  // Calcola IMU annuale con aliquota saldo
  const imuAnnuale = calcolaIMUPeriodo(
    baseImponibileNetta,
    aliquotaSaldo,
    mesiTotali,
    riduzioni.canoneCorordato
  );

  // Saldo = max(0, annuale - acconto)
  const imuSaldo = round2(Math.max(0, imuAnnuale - imuAccontoLordo));

  // Totale
  let imuTotale = round2(imuAccontoLordo + imuSaldo);

  // Detrazione per abitazione principale
  let detrazione: number | undefined;
  if (
    tipo === 'abitazione_principale' &&
    CATEGORIE_ABITAZIONE_PRINCIPALE_TASSABILI.includes(categoria)
  ) {
    detrazione = calcolaDetrazione(percentualePossesso, mesiTotali);
    imuTotale = round2(Math.max(0, imuTotale - detrazione));
  }

  // Quote Stato/Comune per gruppo D
  let quotaStato: number | undefined;
  let quotaComune: number | undefined;
  if (isGruppoD(categoria)) {
    const quote = calcolaQuoteGruppoD(baseImponibileNetta, aliquotaSaldo, mesiTotali);
    quotaStato = quote.quotaStato;
    quotaComune = quote.quotaComune;
  }

  // Codici tributo
  const codici = getCodiceTributo(tipo, categoria);

  return {
    immobile,
    coefficiente,
    baseImponibileLorda,
    fattoreRiduzione,
    baseImponibileNetta,
    imuAcconto: imuAccontoLordo,
    imuSaldo,
    imuTotale,
    quotaStato,
    quotaComune,
    detrazione,
    esente: false,
    codiceTributoComune: codici.comune,
    codiceTributoStato: codici.stato,
  };
}

/**
 * Calcola il riepilogo IMU per tutti gli immobili
 */
export function calcolaRiepilogoIMU(
  anno: number,
  contribuente: string,
  immobili: DatiImmobile[],
  codiceFiscale?: string
): RiepilogoIMU {
  const risultati = immobili.map(calcolaIMUImmobile);

  const totaleAcconto = round2(
    risultati.reduce((sum, r) => sum + r.imuAcconto, 0)
  );
  const totaleSaldo = round2(
    risultati.reduce((sum, r) => sum + r.imuSaldo, 0)
  );
  const totaleAnnuo = round2(
    risultati.reduce((sum, r) => sum + r.imuTotale, 0)
  );

  const totaliPerCodice: Record<string, number> = {};
  for (const r of risultati) {
    if (r.codiceTributoComune) {
      totaliPerCodice[r.codiceTributoComune] =
        (totaliPerCodice[r.codiceTributoComune] ?? 0) + r.imuTotale;
    }
    if (r.codiceTributoStato && r.quotaStato) {
      totaliPerCodice[r.codiceTributoStato] =
        (totaliPerCodice[r.codiceTributoStato] ?? 0) + r.quotaStato;
    }
  }

  return {
    anno,
    contribuente,
    codiceFiscale,
    immobili: risultati,
    totaleAcconto,
    totaleSaldo,
    totaleAnnuo,
    totaliPerCodice,
    scadenzaAcconto: `16/06/${anno}`,
    scadenzaSaldo: `16/12/${anno}`,
  };
}
