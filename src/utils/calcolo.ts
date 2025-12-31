/**
 * Modulo Calcolo IMU 2025
 *
 * Formule estratte da fiscaleDoc_10SM0000003516.xlsm
 * Aggiornate per normativa L. 160/2019
 */

import type {
  DatiImmobile,
  RisultatoCalcoloImmobile,
  RiepilogoIMU,
  CategoriaCatastale,
  FattispeciePrincipale,
  TipologiaContribuente,
} from '../types';

import {
  COEFFICIENTI,
  COEFFICIENTE_TERRENI,
  RIVALUTAZIONE_TERRENI,
  RIVALUTAZIONE_RENDITA,
  QUOTA_STATO_GRUPPO_D,
  DETRAZIONE_ABITAZIONE_PRINCIPALE,
  CODICI_TRIBUTO,
  SOGLIA_MINIMA_VERSAMENTO,
  calcolaMesiPossesso,
} from './constants';

/**
 * Arrotonda a 2 decimali (come Excel ROUND)
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
 * Equivalente Excel: M5 = IF(J5>0,IF(C5=0,0,IF(C5=1,160,...)),0)
 */
export function getCoeffciente(categoria: CategoriaCatastale): number {
  return COEFFICIENTI[categoria] ?? 0;
}

/**
 * Calcola il fattore di riduzione base imponibile
 * Equivalente Excel: O5 = IF(AND(D5=1,E5=1),N5, IF(AND(D5=2,E5=1),N5/2,...))
 */
export function calcolaFattoreRiduzione(immobile: DatiImmobile): number {
  const { riduzioni } = immobile;

  // Conta le riduzioni al 50% applicabili (caratteristiche immobile)
  const riduzioni50: boolean[] = [
    riduzioni.storicoArtistico,
    riduzioni.inagibileInabitabile,
    riduzioni.comodatoParenti,
  ];

  const numeroRiduzioni = riduzioni50.filter(Boolean).length;

  // Le riduzioni si cumulano moltiplicativamente
  // 1 riduzione = 50%, 2 riduzioni = 25%, ecc.
  return Math.pow(0.5, numeroRiduzioni);
}

/**
 * Verifica se la categoria è abitativa (gruppo A escluso A/10 uffici)
 */
function isCategoriaAbitativa(categoria: CategoriaCatastale): boolean {
  return categoria.startsWith('A/') && categoria !== 'A/10';
}

/**
 * Calcola il fattore di riduzione IMU per residente estero
 * Art. 1, c. 48-48bis, L. 178/2020 (modificato dal 2026)
 *
 * Si applica SOLO a unità immobiliari a uso abitativo (cat. A escluso A/10)
 *
 * Requisiti (da verificare manualmente):
 * - Trasferito all'estero dopo almeno 5 anni di residenza in Italia
 * - Una sola unità immobiliare a uso abitativo, non locata né in comodato
 * - Immobile nel comune di ultima residenza con popolazione < 5.000 abitanti
 *
 * @returns fattore moltiplicatore sull'imposta (0 = esente, 0.4, 0.67, 1)
 */
export function calcolaFattoreResidenteEstero(renditaCatastale: number): number {
  if (renditaCatastale <= 200) {
    return 0; // Esente
  } else if (renditaCatastale <= 300) {
    return 0.40; // IMU al 40%
  } else if (renditaCatastale <= 500) {
    return 0.67; // IMU al 67%
  } else {
    return 1; // IMU piena
  }
}

/**
 * Verifica se l'immobile è esente
 */
export function verificaEsenzione(
  immobile: DatiImmobile
): { esente: boolean; motivo?: string } {
  const { esenzioni, fattispecie_principale } = immobile;

  // Terreno CD/IAP
  if (fattispecie_principale === 'terreni_agricoli' && esenzioni.terrenoCdIap) {
    return { esente: true, motivo: 'Terreno agricolo CD/IAP' };
  }

  // Bene merce
  if (esenzioni.beneMerce) {
    return { esente: true, motivo: 'Bene merce (dal 2022)' };
  }

  // Occupato abusivamente
  if (esenzioni.occupatoAbusivamente) {
    return { esente: true, motivo: 'Immobile occupato abusivamente (dal 2023)' };
  }

  // Collabente F/2
  if (esenzioni.collabente) {
    return { esente: true, motivo: 'Fabbricato collabente F/2' };
  }

  return { esente: false };
}

/**
 * Calcola la base imponibile per fabbricati
 * Formula: Rendita × 1.05 × Coefficiente
 * Equivalente Excel: J5 = ROUND(IF(F5=0,0,(F5*C5/100)*1.05*I5),2)
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
 * Equivalente Excel: J6 = ROUND(IF(F6=0,0,(F6*C6/100)*1.25*I6),2)
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
 * Equivalente Excel: I5 = ROUND(IF(F5=0,0,(F5*C5/100)),2)
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
 * Equivalente Excel: K5 = ROUND((J5*(G5/100)*(D5/12)),2)
 */
export function calcolaIMUPeriodo(
  baseImponibile: number,
  aliquota: number,
  mesi: number,
  riduzioneCanoneConcordato: boolean = false
): number {
  if (baseImponibile <= 0 || mesi <= 0) return 0;

  // Riduzione 25% aliquota per canone concordato (art. 1, c. 760)
  const aliquotaEffettiva = riduzioneCanoneConcordato
    ? aliquota * 0.75
    : aliquota;

  return round2(baseImponibile * (aliquotaEffettiva / 100) * (mesi / 12));
}

/**
 * Calcola la detrazione per abitazione principale
 * Formula: €200 × % possesso (proporzionata ai mesi)
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
 * Equivalente Excel: R5 = IF(C5=5,IF(K5>0.76,(O5*(0.76/100)*(H5/12)),P5),0)
 */
export function calcolaQuoteGruppoD(
  baseImponibile: number,
  aliquota: number,
  mesi: number
): { quotaStato: number; quotaComune: number } {
  // Quota Stato: sempre 0.76% (fino al massimo dell'aliquota)
  const aliquotaStato = Math.min(aliquota, QUOTA_STATO_GRUPPO_D);
  const quotaStato = round2(
    baseImponibile * (aliquotaStato / 100) * (mesi / 12)
  );

  // Quota Comune: eccedenza su 0.76%
  const aliquotaComune = Math.max(0, aliquota - QUOTA_STATO_GRUPPO_D);
  const quotaComune = round2(
    baseImponibile * (aliquotaComune / 100) * (mesi / 12)
  );

  return { quotaStato, quotaComune };
}

/**
 * Ottiene il codice tributo F24 per fattispecie immobile
 */
export function getCodiceTributo(
  fattispecie: FattispeciePrincipale,
  categoria: CategoriaCatastale
): { comune: string; stato?: string } {
  if (isGruppoD(categoria)) {
    return CODICI_TRIBUTO.gruppoD;
  }

  switch (fattispecie) {
    case 'abitazione_principale_lusso':
    case 'pertinenze':
      return CODICI_TRIBUTO.abitazionePrincipale;
    case 'fabbricati_rurali_strumentali':
      return CODICI_TRIBUTO.fabbricatiRurali;
    case 'terreni_agricoli':
      return CODICI_TRIBUTO.terreni;
    case 'aree_fabbricabili':
      return CODICI_TRIBUTO.areeFabbricabili;
    default:
      return CODICI_TRIBUTO.altriFabbricati;
  }
}

/**
 * Calcola l'IMU completa per un singolo immobile
 */
export function calcolaIMUImmobile(
  immobile: DatiImmobile,
  tipologiaContribuente: TipologiaContribuente = 'persona_fisica'
): RisultatoCalcoloImmobile {
  // Verifica esenzione
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
    fattispecie_principale,
    categoria,
    renditaCatastale,
    redditoDominicale,
    valoreVenale,
    percentualePossesso,
    dataInizio,
    dataFine,
    aliquotaAcconto,
    aliquotaSaldo,
    riduzioni,
  } = immobile;

  // Esenzione residente estero per rendita ≤ 200€ (art. 1, c. 48-bis, lett. a)
  // Si applica SOLO a: fattispecie "altri_fabbricati" + categoria A (escluso A/10)
  if (tipologiaContribuente === 'persona_fisica_residente_estero' &&
      fattispecie_principale === 'altri_fabbricati' &&
      isCategoriaAbitativa(categoria) &&
      renditaCatastale !== undefined &&
      renditaCatastale <= 200) {
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
      motivoEsenzione: 'Residente estero - rendita ≤ €200 (art. 1, c. 48-bis, lett. a)',
      codiceTributoComune: '',
    };
  }

  // Calcola i mesi di possesso applicando la Regola del Mese
  const { mesiPrimoSemestre, mesiSecondoSemestre, mesiTotali } = calcolaMesiPossesso(dataInizio, dataFine);
  const coefficiente = fattispecie_principale === 'terreni_agricoli'
    ? COEFFICIENTE_TERRENI
    : getCoeffciente(categoria);

  // Calcola base imponibile lorda
  let baseImponibileLorda = 0;
  if (fattispecie_principale === 'terreni_agricoli') {
    baseImponibileLorda = calcolaBaseImponibileTerreno(
      redditoDominicale ?? 0,
      percentualePossesso
    );
  } else if (fattispecie_principale === 'aree_fabbricabili') {
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

  // Applica riduzioni base (caratteristiche immobile)
  const fattoreRiduzione = calcolaFattoreRiduzione(immobile);
  const baseImponibileNetta = round2(baseImponibileLorda * fattoreRiduzione);

  // Calcola IMU acconto (1° rata)
  let imuAccontoLordo = calcolaIMUPeriodo(
    baseImponibileNetta,
    aliquotaAcconto,
    mesiPrimoSemestre,
    riduzioni.canoneCorordato
  );

  // Calcola IMU annuale con aliquota saldo
  let imuAnnuale = calcolaIMUPeriodo(
    baseImponibileNetta,
    aliquotaSaldo,
    mesiTotali,
    riduzioni.canoneCorordato
  );

  // Applica riduzione per residente estero sull'imposta (art. 1, c. 48-bis)
  // Si applica SOLO a: fattispecie "altri_fabbricati" + categoria A (escluso A/10)
  if (tipologiaContribuente === 'persona_fisica_residente_estero' &&
      fattispecie_principale === 'altri_fabbricati' &&
      isCategoriaAbitativa(categoria) &&
      renditaCatastale !== undefined) {
    const fattoreResidenteEstero = calcolaFattoreResidenteEstero(renditaCatastale);
    imuAccontoLordo = round2(imuAccontoLordo * fattoreResidenteEstero);
    imuAnnuale = round2(imuAnnuale * fattoreResidenteEstero);
  }

  // Saldo = max(0, annuale - acconto)
  const imuSaldo = round2(Math.max(0, imuAnnuale - imuAccontoLordo));

  // Totale
  let imuTotale = round2(imuAccontoLordo + imuSaldo);

  // Detrazione per abitazione principale (A/1, A/8, A/9)
  let detrazione: number | undefined;
  if (fattispecie_principale === 'abitazione_principale_lusso') {
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
  const codici = getCodiceTributo(fattispecie_principale, categoria);

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
  codiceFiscale?: string,
  tipologiaContribuente: TipologiaContribuente = 'persona_fisica'
): RiepilogoIMU {
  const risultati = immobili.map(imm => calcolaIMUImmobile(imm, tipologiaContribuente));

  // Totali
  const totaleAcconto = round2(
    risultati.reduce((sum, r) => sum + r.imuAcconto, 0)
  );
  const totaleSaldo = round2(
    risultati.reduce((sum, r) => sum + r.imuSaldo, 0)
  );
  const totaleAnnuo = round2(
    risultati.reduce((sum, r) => sum + r.imuTotale, 0)
  );

  // Totali per codice tributo
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
