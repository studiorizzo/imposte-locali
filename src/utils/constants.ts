/**
 * Costanti IMU 2025
 * Fonte: L. 160/2019, art. 1, cc. 739-783
 */

import type { CategoriaCatastale } from '../types';

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

// Aliquote base 2025 (art. 1, cc. 748-754)
export const ALIQUOTE_BASE = {
  abitazionePrincipale: 0.50,   // c. 748 (A/1, A/8, A/9)
  fabbricatiRurali: 0.10,       // c. 750
  terreniAgricoli: 0.76,        // c. 752
  gruppoD: 0.86,                // c. 753
  altriFabbricati: 0.86,        // c. 754
  areeFabbricabili: 0.86,       // c. 754
};

// Alias per compatibilità
export const ALIQUOTE_BASE_2025 = ALIQUOTE_BASE;

// Aliquote massime
export const ALIQUOTE_MAX = {
  abitazionePrincipale: 0.60,   // c. 748
  fabbricatiRurali: 0.10,       // c. 750 (non aumentabile)
  terreniAgricoli: 1.06,        // c. 752
  gruppoD: 1.14,                // c. 753
  altriFabbricati: 1.14,        // c. 754
  areeFabbricabili: 1.14,       // c. 754
};

// Quota Stato per gruppo D (art. 1, c. 753)
export const QUOTA_STATO_GRUPPO_D = 0.76;  // 0.76%

// Detrazione abitazione principale (art. 1, c. 749)
export const DETRAZIONE_ABITAZIONE_PRINCIPALE = 200;  // €200

// Categorie abitazione principale tassabili (non esenti)
export const CATEGORIE_ABITAZIONE_PRINCIPALE_TASSABILI: CategoriaCatastale[] = [
  'A/1',  // Abitazioni signorili
  'A/8',  // Ville
  'A/9',  // Castelli/palazzi storici
];

// Categorie pertinenze
export const CATEGORIE_PERTINENZE: CategoriaCatastale[] = ['C/2', 'C/6', 'C/7'];

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
