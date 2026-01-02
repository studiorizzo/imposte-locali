/**
 * Costanti IMU 2025
 * Fonte: L. 160/2019, art. 1, cc. 739-783
 */

import type { CategoriaCatastale, FattispeciePrincipale } from '../types';

// Descrizioni categorie catastali
export const DESCRIZIONI_CATEGORIE: Record<CategoriaCatastale, string> = {
  // Gruppo A - Abitazioni
  'A/1': 'Abitazioni di tipo signorile',
  'A/2': 'Abitazioni di tipo civile',
  'A/3': 'Abitazioni di tipo economico',
  'A/4': 'Abitazioni di tipo popolare',
  'A/5': 'Abitazioni di tipo ultrapopolare',
  'A/6': 'Abitazioni di tipo rurale',
  'A/7': 'Abitazioni in villini',
  'A/8': 'Abitazioni in ville',
  'A/9': 'Castelli, palazzi di eminenti pregi artistici o storici',
  'A/10': 'Uffici e studi privati',
  'A/11': 'Abitazioni ed alloggi tipici dei luoghi',

  // Gruppo B - Edifici collettivi
  'B/1': 'Collegi e convitti, educandati, ricoveri, orfanotrofi, ospizi, conventi, seminari, caserme',
  'B/2': 'Case di cura e ospedali (senza fine di lucro)',
  'B/3': 'Prigioni e riformatori',
  'B/4': 'Uffici pubblici',
  'B/5': 'Scuole e laboratori scientifici',
  'B/6': 'Biblioteche, pinacoteche, musei, gallerie, accademie (non commerciali)',
  'B/7': 'Cappelle e oratori non destinati all\'esercizio pubblico del culto',
  'B/8': 'Magazzini sotterranei per depositi di derrate',

  // Gruppo C - Commerciali
  'C/1': 'Negozi e botteghe',
  'C/2': 'Magazzini e locali di deposito',
  'C/3': 'Laboratori per arti e mestieri',
  'C/4': 'Fabbricati e locali per esercizi sportivi (senza fine di lucro)',
  'C/5': 'Stabilimenti balneari e di acque curative (senza fine di lucro)',
  'C/6': 'Stalle, scuderie, rimesse, autorimesse (senza fine di lucro)',
  'C/7': 'Tettoie chiuse o aperte',

  // Gruppo D - Speciali
  'D/1': 'Opifici',
  'D/2': 'Alberghi e pensioni (con fine di lucro)',
  'D/3': 'Teatri, cinematografi, sale per concerti e spettacoli (con fine di lucro)',
  'D/4': 'Case di cura e ospedali (con fine di lucro)',
  'D/5': 'Istituti di credito, cambio e assicurazione (con fine di lucro)',
  'D/6': 'Fabbricati e locali per esercizi sportivi (con fine di lucro)',
  'D/7': 'Fabbricati costruiti o adattati per speciali esigenze industriali',
  'D/8': 'Fabbricati costruiti o adattati per speciali esigenze commerciali',
  'D/9': 'Edifici galleggianti o sospesi, assicurati a punti fissi',
  'D/10': 'Fabbricati per funzioni produttive connesse alle attività agricole',
};

// Categorie di lusso per abitazione principale (A/1, A/8, A/9 pagano IMU)
export const CATEGORIE_LUSSO: CategoriaCatastale[] = ['A/1', 'A/8', 'A/9'];

// Coefficienti moltiplicatori per categoria catastale (art. 1, c. 745)
export const COEFFICIENTI: Record<CategoriaCatastale, number> = {
  // Gruppo A
  'A/1': 160, 'A/2': 160, 'A/3': 160, 'A/4': 160, 'A/5': 160,
  'A/6': 160, 'A/7': 160, 'A/8': 160, 'A/9': 160,
  'A/10': 80,   // Uffici/studi privati
  'A/11': 160,  // Abitazioni tipiche locali

  // Gruppo B
  'B/1': 140, 'B/2': 140, 'B/3': 140, 'B/4': 140,
  'B/5': 140, 'B/6': 140, 'B/7': 140, 'B/8': 140,

  // Gruppo C
  'C/1': 55,   // Negozi/botteghe
  'C/2': 160,  // Magazzini/locali deposito
  'C/3': 140, 'C/4': 140, 'C/5': 140,  // Laboratori, palestre, stabilimenti
  'C/6': 160,  // Autorimesse
  'C/7': 160,  // Tettoie

  // Gruppo D
  'D/1': 65, 'D/2': 65, 'D/3': 65, 'D/4': 65,
  'D/5': 80,   // Istituti di credito
  'D/6': 65, 'D/7': 65, 'D/8': 65, 'D/9': 65,
  'D/10': 65,
};

// Coefficiente rivalutazione terreni agricoli (art. 1, c. 746)
export const COEFFICIENTE_TERRENI = 135;
export const RIVALUTAZIONE_TERRENI = 1.25;  // 25%

// Coefficiente rivalutazione rendite catastali (art. 1, c. 745)
export const RIVALUTAZIONE_RENDITA = 1.05;  // 5%

// Aliquote ministeriali per fattispecie principale (art. 1, cc. 748-754)
export const ALIQUOTE_MINISTERO: Record<FattispeciePrincipale, number> = {
  abitazione_principale_lusso: 0.50,    // c. 748 (A/1, A/8, A/9)
  pertinenze: 0.50,                     // c. 748 (stessa aliquota abitazione principale)
  fabbricati_rurali_strumentali: 0.10,  // c. 750 (D/10)
  terreni_agricoli: 0.76,               // c. 752
  fabbricati_gruppo_d: 0.86,            // c. 753 (D/1-D/9)
  altri_fabbricati: 0.86,               // c. 754
  aree_fabbricabili: 0.86,              // c. 754
};

// Aliquote massime per fattispecie principale
export const ALIQUOTE_MAX: Record<FattispeciePrincipale, number> = {
  abitazione_principale_lusso: 0.60,    // c. 748
  pertinenze: 0.60,                     // c. 748 (stessa aliquota abitazione principale)
  fabbricati_rurali_strumentali: 0.10,  // c. 750 (non aumentabile)
  terreni_agricoli: 1.06,               // c. 752
  fabbricati_gruppo_d: 1.14,            // c. 753
  altri_fabbricati: 1.14,               // c. 754
  aree_fabbricabili: 1.14,              // c. 754
};

// Quota Stato per gruppo D (art. 1, c. 753)
export const QUOTA_STATO_GRUPPO_D = 0.76;  // 0.76%

// Detrazione abitazione principale (art. 1, c. 749)
export const DETRAZIONE_ABITAZIONE_PRINCIPALE = 200;  // €200

// Categorie per fattispecie principale
// abitazione_principale_lusso accetta tutte le cat. A abitative (escluso A/10 uffici)
// Le cat. di lusso (A/1, A/8, A/9) pagano IMU, le altre sono esenti
export const CATEGORIE_PER_FATTISPECIE: Record<FattispeciePrincipale, CategoriaCatastale[] | null> = {
  abitazione_principale_lusso: ['A/1', 'A/2', 'A/3', 'A/4', 'A/5', 'A/6', 'A/7', 'A/8', 'A/9', 'A/11'],
  pertinenze: ['C/2', 'C/6', 'C/7'],
  fabbricati_rurali_strumentali: ['D/10'],
  fabbricati_gruppo_d: ['D/1', 'D/2', 'D/3', 'D/4', 'D/5', 'D/6', 'D/7', 'D/8', 'D/9'],
  terreni_agricoli: null,      // usa reddito dominicale
  aree_fabbricabili: null,     // usa valore venale
  altri_fabbricati: null,      // tutte le altre categorie
};

// Labels per fattispecie principale (UI)
export const FATTISPECIE_LABELS: Record<FattispeciePrincipale, string> = {
  abitazione_principale_lusso: 'Abitazione Principale',
  pertinenze: 'Pertinenza Abitazione Principale',
  fabbricati_rurali_strumentali: 'Fabbricato Rurale Strumentale',
  fabbricati_gruppo_d: 'Fabbricato Gruppo D',
  terreni_agricoli: 'Terreno Agricolo',
  aree_fabbricabili: 'Area Fabbricabile',
  altri_fabbricati: 'Altro Fabbricato',
};

// Codici tributo F24
export const CODICI_TRIBUTO = {
  abitazionePrincipale: { comune: '3912' },
  fabbricatiRurali: { comune: '3913' },
  terreni: { comune: '3914' },
  areeFabbricabili: { comune: '3916' },
  altriFabbricati: { comune: '3918' },
  gruppoD: { stato: '3925', comune: '3930' },
};

// Scadenze
export const SCADENZE = {
  acconto: { giorno: 16, mese: 6 },   // 16 giugno
  saldo: { giorno: 16, mese: 12 },    // 16 dicembre
};

// Soglia minima versamento
export const SOGLIA_MINIMA_VERSAMENTO = 12;  // €12 (art. 1, c. 759)

// Anno di riferimento per il calcolo IMU
export const ANNO_RIFERIMENTO = 2026;

// Date di default per il possesso
export const DATA_INIZIO_DEFAULT = `${ANNO_RIFERIMENTO}-01-01`;
export const DATA_FINE_DEFAULT = `${ANNO_RIFERIMENTO}-12-31`;

/**
 * Calcola i mesi di possesso applicando la Regola del Mese (art. 1, c. 761)
 * Se possesso > metà giorni del mese → mese intero
 */
export function calcolaMesiPossesso(
  dataInizio: string,
  dataFine: string,
  anno: number = ANNO_RIFERIMENTO
): { mesiPrimoSemestre: number; mesiSecondoSemestre: number; mesiTotali: number } {
  const inizio = new Date(dataInizio);
  const fine = new Date(dataFine);

  // Valida le date
  if (isNaN(inizio.getTime()) || isNaN(fine.getTime())) {
    return { mesiPrimoSemestre: 0, mesiSecondoSemestre: 0, mesiTotali: 0 };
  }

  if (fine < inizio) {
    return { mesiPrimoSemestre: 0, mesiSecondoSemestre: 0, mesiTotali: 0 };
  }

  let mesiPrimoSemestre = 0;
  let mesiSecondoSemestre = 0;

  // Calcola per ogni mese dell'anno
  for (let mese = 0; mese < 12; mese++) {
    const giorniMese = new Date(anno, mese + 1, 0).getDate(); // Giorni nel mese
    const primoGiornoMese = new Date(anno, mese, 1);
    const ultimoGiornoMese = new Date(anno, mese, giorniMese);

    // Calcola intersezione tra periodo possesso e mese corrente
    const inizioPeriodo = inizio > primoGiornoMese ? inizio : primoGiornoMese;
    const finePeriodo = fine < ultimoGiornoMese ? fine : ultimoGiornoMese;

    if (inizioPeriodo <= finePeriodo) {
      // Calcola giorni di possesso nel mese
      // +1 perché entrambi i giorni sono inclusi
      const giorniPossesso = Math.floor(
        (finePeriodo.getTime() - inizioPeriodo.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

      // Regola del Mese: conta il mese se possesso > metà giorni
      // Se giorni pari, > metà significa strettamente maggiore di giorniMese/2
      const metaGiorni = giorniMese / 2;
      if (giorniPossesso > metaGiorni) {
        if (mese < 6) {
          mesiPrimoSemestre++;
        } else {
          mesiSecondoSemestre++;
        }
      }
    }
  }

  return {
    mesiPrimoSemestre,
    mesiSecondoSemestre,
    mesiTotali: mesiPrimoSemestre + mesiSecondoSemestre,
  };
}

/**
 * Verifica se due periodi si sovrappongono
 */
export function verificaSovrapposizionePeriodi(
  inizio1: string,
  fine1: string,
  inizio2: string,
  fine2: string
): boolean {
  return inizio1 <= fine2 && inizio2 <= fine1;
}

/**
 * Verifica le regole di unicità per fattispecie
 * - abitazione_principale_lusso: max 1 nello stesso periodo
 * - pertinenze: max 1 per categoria (C/2, C/6, C/7) nello stesso periodo
 */
export function verificaUnicita(
  fattispecie: FattispeciePrincipale,
  categoria: CategoriaCatastale,
  dataInizio: string,
  dataFine: string,
  immobiliEsistenti: Array<{
    fattispecie_principale: FattispeciePrincipale;
    categoria: CategoriaCatastale;
    dataInizio: string;
    dataFine: string;
  }>
): { valido: boolean; errore?: string } {
  // Regola 1: Max 1 abitazione principale nello stesso periodo
  if (fattispecie === 'abitazione_principale_lusso') {
    const sovrapposizionePeriodo = immobiliEsistenti.some(
      (imm) =>
        imm.fattispecie_principale === 'abitazione_principale_lusso' &&
        verificaSovrapposizionePeriodi(dataInizio, dataFine, imm.dataInizio, imm.dataFine)
    );
    if (sovrapposizionePeriodo) {
      return {
        valido: false,
        errore: 'Sono presenti più fabbricati dichiarati come abitazione principale nello stesso periodo',
      };
    }
  }

  // Regola 2: Max 1 pertinenza per categoria nello stesso periodo
  if (fattispecie === 'pertinenze') {
    const sovrapposizionePeriodo = immobiliEsistenti.some(
      (imm) =>
        imm.fattispecie_principale === 'pertinenze' &&
        imm.categoria === categoria &&
        verificaSovrapposizionePeriodi(dataInizio, dataFine, imm.dataInizio, imm.dataFine)
    );
    if (sovrapposizionePeriodo) {
      return {
        valido: false,
        errore: 'Sono presenti più fabbricati dichiarati come pertinenza abitazione principale nello stesso periodo',
      };
    }
  }

  return { valido: true };
}
