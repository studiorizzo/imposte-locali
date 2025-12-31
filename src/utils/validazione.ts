/**
 * Validazione Codice Fiscale Italiano
 * Basato su DM 12/03/1974 e successive modifiche
 */

// Caratteri dispari (posizioni 1, 3, 5, 7, 9, 11, 13, 15)
const DISPARI: Record<string, number> = {
  '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
  'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
  'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
  'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
};

// Caratteri pari (posizioni 2, 4, 6, 8, 10, 12, 14)
const PARI: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
  'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
  'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
};

// Carattere di controllo (resto della divisione per 26)
const CONTROLLO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Mesi nel codice fiscale
const MESI_CF = 'ABCDEHLMPRST';

export interface RisultatoValidazioneCF {
  valido: boolean;
  errore?: string;
}

/**
 * Valida il formato del codice fiscale persona fisica (16 caratteri)
 */
export function validaCodiceFiscale(cf: string): RisultatoValidazioneCF {
  if (!cf) {
    return { valido: true }; // Campo vuoto, non obbligatorio
  }

  const cfUpper = cf.toUpperCase().trim();

  // Lunghezza
  if (cfUpper.length !== 16) {
    return { valido: false, errore: 'Il codice fiscale deve essere di 16 caratteri' };
  }

  // Formato: 6 lettere + 2 numeri + 1 lettera + 2 numeri + 1 lettera + 3 alfanumerici + 1 lettera
  const formatoRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9A-Z]{3}[A-Z]$/;
  if (!formatoRegex.test(cfUpper)) {
    return { valido: false, errore: 'Formato codice fiscale non valido' };
  }

  // Verifica mese (posizione 8, indice 8)
  const letteraMese = cfUpper[8];
  if (!MESI_CF.includes(letteraMese)) {
    return { valido: false, errore: 'Mese nel codice fiscale non valido' };
  }

  // Verifica giorno (posizioni 9-10)
  const giorno = parseInt(cfUpper.substring(9, 11), 10);
  // Giorno: 01-31 per maschi, 41-71 per femmine
  if (!((giorno >= 1 && giorno <= 31) || (giorno >= 41 && giorno <= 71))) {
    return { valido: false, errore: 'Giorno nel codice fiscale non valido' };
  }

  // Calcolo carattere di controllo
  let somma = 0;
  for (let i = 0; i < 15; i++) {
    const char = cfUpper[i];
    if (i % 2 === 0) {
      // Posizione dispari (1-based: 1, 3, 5, ...)
      somma += DISPARI[char] ?? 0;
    } else {
      // Posizione pari (1-based: 2, 4, 6, ...)
      somma += PARI[char] ?? 0;
    }
  }

  const carattereControlloCalcolato = CONTROLLO[somma % 26];
  const carattereControlloPresente = cfUpper[15];

  if (carattereControlloCalcolato !== carattereControlloPresente) {
    return { valido: false, errore: 'Carattere di controllo non valido' };
  }

  return { valido: true };
}

/**
 * Valida IBAN
 * Formato: 2 lettere + 2 cifre + 1 lettera + 5 cifre ABI + 5 cifre CAB + 12 alfanumerici = 27 caratteri
 */
export function validaIBAN(iban: string): RisultatoValidazioneCF {
  if (!iban) {
    return { valido: true }; // Campo vuoto, non obbligatorio
  }

  const ibanClean = iban.toUpperCase().replace(/\s/g, '');

  // Lunghezza
  if (ibanClean.length !== 27) {
    return { valido: false, errore: 'IBAN deve essere di 27 caratteri' };
  }

  // Deve iniziare con IT
  if (!ibanClean.startsWith('IT')) {
    return { valido: false, errore: 'IBAN deve iniziare con IT' };
  }

  // Formato: IT + 2 cifre + 1 lettera CIN + 5 cifre ABI + 5 cifre CAB + 12 alfanumerici
  const formatoRegex = /^IT[0-9]{2}[A-Z][0-9]{5}[0-9]{5}[0-9A-Z]{12}$/;
  if (!formatoRegex.test(ibanClean)) {
    return { valido: false, errore: 'Formato IBAN non valido' };
  }

  // Validazione checksum ISO 7064 (Mod 97)
  const riordinato = ibanClean.substring(4) + ibanClean.substring(0, 4);
  let numerico = '';
  for (const char of riordinato) {
    if (char >= 'A' && char <= 'Z') {
      numerico += (char.charCodeAt(0) - 55).toString();
    } else {
      numerico += char;
    }
  }

  // Mod 97
  let resto = 0;
  for (let i = 0; i < numerico.length; i++) {
    resto = (resto * 10 + parseInt(numerico[i], 10)) % 97;
  }

  if (resto !== 1) {
    return { valido: false, errore: 'IBAN non valido (checksum errato)' };
  }

  return { valido: true };
}

/**
 * Valida CAP italiano (5 cifre)
 */
export function validaCAP(cap: string): RisultatoValidazioneCF {
  if (!cap) {
    return { valido: true };
  }

  if (!/^[0-9]{5}$/.test(cap)) {
    return { valido: false, errore: 'CAP deve essere di 5 cifre' };
  }

  return { valido: true };
}
