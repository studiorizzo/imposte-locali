/**
 * Costanti per il calcolo IMU 2025
 * Fonte: L. 160/2019, art. 1, cc. 739-783
 */

import type { CategoriaCatastale } from '../../types';

// Coefficienti moltiplicatori per categoria catastale
export const COEFFICIENTI: Record<CategoriaCatastale, number> = {
  // Gruppo A - Abitazioni
  'A/1': 160,   // Abitazioni di tipo signorile
  'A/2': 160,   // Abitazioni di tipo civile
  'A/3': 160,   // Abitazioni di tipo economico
  'A/4': 160,   // Abitazioni di tipo popolare
  'A/5': 160,   // Abitazioni di tipo ultrapopolare
  'A/6': 160,   // Abitazioni di tipo rurale
  'A/7': 160,   // Abitazioni in villini
  'A/8': 160,   // Abitazioni in ville
  'A/9': 160,   // Castelli, palazzi di pregio
  'A/10': 80,   // Uffici e studi privati
  'A/11': 160,  // Abitazioni tipiche dei luoghi (dal 2020)

  // Gruppo B - Edifici collettivi
  'B/1': 140,   // Collegi, convitti
  'B/2': 140,   // Case di cura, ospedali
  'B/3': 140,   // Prigioni, riformatori
  'B/4': 140,   // Uffici pubblici
  'B/5': 140,   // Scuole, laboratori
  'B/6': 140,   // Biblioteche, musei
  'B/7': 140,   // Cappelle, oratori
  'B/8': 140,   // Magazzini sotterranei

  // Gruppo C - Commerciale/Varie
  'C/1': 55,    // Negozi e botteghe
  'C/2': 160,   // Magazzini e locali di deposito
  'C/3': 140,   // Laboratori per arti e mestieri
  'C/4': 140,   // Fabbricati per esercizi sportivi
  'C/5': 140,   // Stabilimenti balneari
  'C/6': 160,   // Stalle, scuderie, rimesse, autorimesse
  'C/7': 160,   // Tettoie chiuse o aperte

  // Gruppo D - Speciale
  'D/1': 65,    // Opifici
  'D/2': 65,    // Alberghi e pensioni
  'D/3': 65,    // Teatri, cinematografi
  'D/4': 65,    // Case di cura, ospedali (privati)
  'D/5': 80,    // Istituti di credito
  'D/6': 65,    // Fabbricati sportivi
  'D/7': 65,    // Fabbricati per attività industriali
  'D/8': 65,    // Fabbricati commerciali
  'D/9': 65,    // Edifici galleggianti
  'D/10': 65,   // Fabbricati rurali strumentali
};

// Coefficiente per terreni agricoli
export const COEFFICIENTE_TERRENI = 135;

// Rivalutazioni
export const RIVALUTAZIONE_RENDITA = 1.05;     // 5% per fabbricati
export const RIVALUTAZIONE_TERRENI = 1.25;     // 25% per terreni

// Quota stato per gruppo D (fissa)
export const QUOTA_STATO_GRUPPO_D = 0.76;      // 0.76%

// Detrazione abitazione principale
export const DETRAZIONE_ABITAZIONE_PRINCIPALE = 200;  // €200

// Categorie abitazione principale tassabili (di lusso)
export const CATEGORIE_ABITAZIONE_PRINCIPALE_TASSABILI: CategoriaCatastale[] = [
  'A/1', 'A/8', 'A/9'
];

// Pertinenze ammesse per abitazione principale
export const CATEGORIE_PERTINENZE: CategoriaCatastale[] = [
  'C/2', 'C/6', 'C/7'
];

// Codici tributo F24
export const CODICI_TRIBUTO = {
  abitazionePrincipale: { comune: '3912' },
  fabbricatiRurali: { comune: '3913' },
  terreni: { comune: '3914' },
  areeFabbricabili: { comune: '3916' },
  altriFabbricati: { comune: '3918' },
  gruppoD: { comune: '3930', stato: '3925' },
};

// Aliquote base 2025
export const ALIQUOTE_BASE_2025 = {
  abitazionePrincipale: 0.50,    // 0.50% (A/1, A/8, A/9)
  fabbricatiRurali: 0.10,        // 0.10%
  terreniAgricoli: 0.76,         // 0.76%
  gruppoD: 0.86,                 // 0.86% (min 0.76% stato)
  altriFabbricati: 0.86,         // 0.86%
  areeFabbricabili: 0.86,        // 0.86%
};

// Soglia minima versamento
export const SOGLIA_MINIMA_VERSAMENTO = 12;    // €12

// Scadenze
export const SCADENZE = {
  acconto: '16 giugno',
  saldo: '16 dicembre',
};
