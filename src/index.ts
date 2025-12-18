/**
 * Calcolatore IMU 2025
 *
 * Basato su:
 * - L. 160/2019, art. 1, cc. 739-783
 * - Formule estratte da fiscaleDoc_10SM0000003516.xlsm
 *
 * @packageDocumentation
 */

// Tipi
export * from './types';

// Costanti
export * from './utils/constants';

// Dati
export { COMUNI, cercaComune, getComuneByCodice } from './data/comuni';

// Funzioni di calcolo
export {
  getCoeffciente,
  calcolaFattoreRiduzione,
  verificaEsenzione,
  calcolaBaseImponibileFabbricato,
  calcolaBaseImponibileTerreno,
  calcolaBaseImponibileArea,
  calcolaIMUPeriodo,
  calcolaDetrazione,
  calcolaQuoteGruppoD,
  getCodiceTributo,
  calcolaIMUImmobile,
  calcolaRiepilogoIMU,
} from './utils/calcolo';
