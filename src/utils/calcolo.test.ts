/**
 * Test Calcolo IMU 2025
 * Verifica formule con esempi da SPECS.md
 */

import { describe, test, expect } from 'vitest';
import {
  calcolaBaseImponibileFabbricato,
  calcolaBaseImponibileTerreno,
  calcolaIMUPeriodo,
  calcolaQuoteGruppoD,
  calcolaIMUImmobile,
} from './calcolo';
import type { DatiImmobile } from '../types';

// Helper per creare immobile base
function creaImmobile(override: Partial<DatiImmobile>): DatiImmobile {
  return {
    id: 'test',
    comune: {
      comune: 'Roma',
      regione: 'Lazio',
      provincia: 'Roma',
      sigla_provincia: 'RM',
      codice_catastale: 'H501',
      label: 'H501 - Roma',
    },
    fattispecie_principale: 'altri_fabbricati',
    categoria: 'A/2',
    renditaCatastale: 1000,
    percentualePossesso: 100,
    dataInizio: '2026-01-01',
    dataFine: '2026-12-31',
    aliquotaAcconto: 1.06,
    aliquotaSaldo: 1.06,
    riduzioni: {
      storicoArtistico: false,
      inagibileInabitabile: false,
      comodatoParenti: false,
      canoneCorordato: false,
      pensionatoEstero: false,
    },
    esenzioni: {
      terrenoCdIap: false,
      beneMerce: false,
      occupatoAbusivamente: false,
      collabente: false,
    },
    ...override,
  };
}

describe('Calcolo Base Imponibile', () => {
  test('Fabbricato A/2: Rendita €1.000 → Base €168.000', () => {
    // SPECS.md Esempio 1
    const base = calcolaBaseImponibileFabbricato(1000, 'A/2', 100);
    expect(base).toBe(168000); // 1000 × 1.05 × 160 = 168.000
  });

  test('Fabbricato D/1: Rendita €5.000 → Base €341.250', () => {
    // SPECS.md Esempio 2
    const base = calcolaBaseImponibileFabbricato(5000, 'D/1', 100);
    expect(base).toBe(341250); // 5000 × 1.05 × 65 = 341.250
  });

  test('Terreno agricolo: RD €500, 50% possesso → Base €42.187,50', () => {
    // SPECS.md Esempio 4
    const base = calcolaBaseImponibileTerreno(500, 50);
    expect(base).toBe(42187.5); // (500 × 1.25 × 135) × 0.5 = 42.187,50
  });
});

describe('Calcolo IMU', () => {
  test('Appartamento A/2: Base €168.000, aliq 1.06% → IMU €1.780,80', () => {
    // SPECS.md Esempio 1
    const imu = calcolaIMUPeriodo(168000, 1.06, 12);
    expect(imu).toBe(1780.8);
  });

  test('Canone concordato: riduzione 25% aliquota', () => {
    // SPECS.md Esempio 3: 168.000 × (1.06% × 0.75) = €1.335,60
    const imu = calcolaIMUPeriodo(168000, 1.06, 12, true);
    expect(imu).toBe(1335.6);
  });

  test('Terreno agricolo: Base €42.187,50, aliq 0.86% → IMU €362,81', () => {
    // SPECS.md Esempio 4
    const imu = calcolaIMUPeriodo(42187.5, 0.86, 12);
    expect(imu).toBe(362.81);
  });
});

describe('Quote Stato/Comune Gruppo D', () => {
  test('D/1: Base €341.250, aliq 1.06% → Stato €2.593,50, Comune €1.023,75', () => {
    // SPECS.md Esempio 2
    const { quotaStato, quotaComune } = calcolaQuoteGruppoD(341250, 1.06, 12);
    expect(quotaStato).toBe(2593.5);   // 341.250 × 0.76%
    expect(quotaComune).toBe(1023.75); // 341.250 × (1.06% - 0.76%)
  });
});

describe('Calcolo IMU Immobile Completo', () => {
  test('Appartamento A/2 - calcolo completo', () => {
    const immobile = creaImmobile({
      categoria: 'A/2',
      renditaCatastale: 1000,
      aliquotaAcconto: 1.06,
      aliquotaSaldo: 1.06,
    });

    const risultato = calcolaIMUImmobile(immobile);

    expect(risultato.baseImponibileLorda).toBe(168000);
    expect(risultato.baseImponibileNetta).toBe(168000);
    expect(risultato.imuTotale).toBe(1780.8);
    expect(risultato.codiceTributoComune).toBe('3918');
    expect(risultato.esente).toBe(false);
  });

  test('Terreno CD/IAP - esente', () => {
    const immobile = creaImmobile({
      fattispecie_principale: 'terreni_agricoli',
      categoria: 'A/2', // Non usata per terreni
      redditoDominicale: 500,
      esenzioni: {
        terrenoCdIap: true, // CD/IAP = ESENTE
        beneMerce: false,
        occupatoAbusivamente: false,
        collabente: false,
      },
    });

    const risultato = calcolaIMUImmobile(immobile);

    expect(risultato.esente).toBe(true);
    expect(risultato.motivoEsenzione).toBe('Terreno agricolo CD/IAP');
    expect(risultato.imuTotale).toBe(0);
  });

  test('Fabbricato D/1 con quote Stato/Comune', () => {
    const immobile = creaImmobile({
      categoria: 'D/1',
      renditaCatastale: 5000,
      aliquotaAcconto: 1.06,
      aliquotaSaldo: 1.06,
    });

    const risultato = calcolaIMUImmobile(immobile);

    expect(risultato.baseImponibileLorda).toBe(341250);
    expect(risultato.quotaStato).toBe(2593.5);
    expect(risultato.quotaComune).toBe(1023.75);
    expect(risultato.codiceTributoComune).toBe('3930');
    expect(risultato.codiceTributoStato).toBe('3925');
  });

  test('Immobile con riduzione 50% (storico/artistico)', () => {
    const immobile = creaImmobile({
      categoria: 'A/2',
      renditaCatastale: 1000,
      riduzioni: {
        storicoArtistico: true,
        inagibileInabitabile: false,
        comodatoParenti: false,
        canoneCorordato: false,
        pensionatoEstero: false,
      },
    });

    const risultato = calcolaIMUImmobile(immobile);

    expect(risultato.baseImponibileLorda).toBe(168000);
    expect(risultato.fattoreRiduzione).toBe(0.5);
    expect(risultato.baseImponibileNetta).toBe(84000);
    expect(risultato.imuTotale).toBe(890.4); // 50% di 1780.80
  });

  test('Immobile con doppia riduzione 50% + 50% = 25%', () => {
    const immobile = creaImmobile({
      categoria: 'A/2',
      renditaCatastale: 1000,
      riduzioni: {
        storicoArtistico: true,
        inagibileInabitabile: true, // Seconda riduzione
        comodatoParenti: false,
        canoneCorordato: false,
        pensionatoEstero: false,
      },
    });

    const risultato = calcolaIMUImmobile(immobile);

    expect(risultato.fattoreRiduzione).toBe(0.25);
    expect(risultato.baseImponibileNetta).toBe(42000);
  });
});

