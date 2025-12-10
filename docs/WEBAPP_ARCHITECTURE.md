# Architettura Web App - Calcolatore IMU

## Panoramica del Progetto

Web application per il calcolo dell'IMU (Imposta Municipale Unica) basata sul reverse engineering del foglio Excel originale.

---

## Stack Tecnologico Proposto

### Frontend
- **Framework**: React 18 con TypeScript
- **State Management**: Zustand o React Context
- **UI Components**: Tailwind CSS + Shadcn/ui
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts (per grafici riepilogativi)

### Backend (opzionale - può essere tutto frontend)
- **Runtime**: Node.js
- **Framework**: Express.js o Fastify
- **Database**: SQLite/PostgreSQL (per salvare calcoli)

### Alternativa Full Frontend
- **Storage**: localStorage/IndexedDB
- **Export**: jsPDF per PDF, xlsx per Excel

---

## Struttura del Progetto

```
imposte-locali/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                    # Componenti UI base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Table.tsx
│   │   │
│   │   ├── forms/                 # Form per ogni sezione
│   │   │   ├── ContribuenteForm.tsx
│   │   │   ├── TerreniForm.tsx
│   │   │   ├── FabbricatiRuraliForm.tsx
│   │   │   ├── AbitazionePrincipaleForm.tsx
│   │   │   ├── AltriFabbricatiForm.tsx
│   │   │   └── AreeFabbricabiliForm.tsx
│   │   │
│   │   ├── calculators/           # Componenti calcolo
│   │   │   ├── TerrenoCalculator.tsx
│   │   │   ├── FabbricatoCalculator.tsx
│   │   │   └── RiepilogoCalculator.tsx
│   │   │
│   │   └── layout/                # Layout
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Navigation.tsx
│   │       └── Footer.tsx
│   │
│   ├── lib/
│   │   ├── calculations/          # Logica di calcolo
│   │   │   ├── imu-terreni.ts
│   │   │   ├── imu-fabbricati.ts
│   │   │   ├── imu-abitazione.ts
│   │   │   ├── imu-aree.ts
│   │   │   ├── detrazioni.ts
│   │   │   └── riepilogo.ts
│   │   │
│   │   ├── constants/             # Costanti
│   │   │   ├── coefficienti.ts
│   │   │   ├── aliquote.ts
│   │   │   ├── categorie-catastali.ts
│   │   │   └── codici-tributo.ts
│   │   │
│   │   ├── utils/                 # Utility
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── rounding.ts
│   │   │
│   │   └── types/                 # TypeScript types
│   │       ├── contribuente.ts
│   │       ├── terreno.ts
│   │       ├── fabbricato.ts
│   │       └── calcolo.ts
│   │
│   ├── hooks/                     # Custom hooks
│   │   ├── useIMUCalculation.ts
│   │   ├── useLocalStorage.ts
│   │   └── useExport.ts
│   │
│   └── store/                     # State management
│       └── imu-store.ts
│
├── public/
│   └── data/
│       └── comuni.json            # Database comuni italiani
│
├── tests/
│   ├── calculations/
│   └── components/
│
└── docs/
    ├── REVERSE_ENGINEERING.md
    └── WEBAPP_ARCHITECTURE.md
```

---

## Modelli Dati (TypeScript Interfaces)

### Contribuente
```typescript
interface Contribuente {
  nome: string;
  codiceFiscale?: string;
  annoImposta: number;
  comune: string;
  codiceCatastaleComune: string;
}
```

### Terreno Agricolo
```typescript
interface TerrenoAgricolo {
  id: string;
  ubicazione: string;
  estremiCatastali: string;
  percentualePossesso: number;      // 0-100
  mesiPrimoSemestre: number;        // 0-6
  mesiSecondoSemestre: number;      // 0-6
  redditoDominicale: number;        // €
  aliquotaPrimaRata: number;        // %
  aliquotaSaldo: number;            // %
  isColtivatoreDiretto: boolean;
}
```

### Fabbricato Rurale
```typescript
interface FabbricatoRurale {
  id: string;
  ubicazione: string;
  estremiCatastali: string;
  percentualePossesso: number;
  mesiPrimoSemestre: number;
  mesiSecondoSemestre: number;
  renditaCatastale: number;
  aliquotaPrimaRata: number;
  aliquotaSaldo: number;
  coefficienteRivalutazione: number;  // default 160
}
```

### Abitazione Principale
```typescript
interface AbitazionePrincipale {
  id: string;
  ubicazione: string;
  estremiCatastali: string;
  categoriaCatastale: 'A/1' | 'A/8' | 'A/9';
  aventiDirittoDetrazione: number;
  percentualePossesso: number;
  mesiPrimoSemestre: number;
  mesiSecondoSemestre: number;
  renditaCatastale: number;
  aliquotaPrimaRata: number;
  aliquotaSaldo: number;
}

interface Pertinenza {
  id: string;
  tipo: 'C/2' | 'C/6' | 'C/7';
  ubicazione: string;
  estremiCatastali: string;
  percentualePossesso: number;
  mesiPrimoSemestre: number;
  mesiSecondoSemestre: number;
  renditaCatastale: number;
}

interface DatiAbitazionePrincipale {
  abitazione: AbitazionePrincipale | null;
  pertinenze: Pertinenza[];
  numeroRate: 1 | 2 | 3;
  numeroFigliMinori26: number;
  percentualeSpettanzaDetrazione: number;
  detrazioneDeliberataCorrente: number;
}
```

### Altri Fabbricati
```typescript
interface AltroFabbricato {
  id: string;
  ubicazione: string;
  estremiCatastali: string;
  tipologia: CategoriaCatastale;
  isStoricoArtistico: boolean;
  isInagibileInabitabile: boolean;
  isComodatoParenti: boolean;
  isLocazioneCanoneConcordato: boolean;
  percentualePossesso: number;
  mesiPrimoSemestre: number;
  mesiSecondoSemestre: number;
  renditaCatastale: number;
  aliquotaPrimaRata: number;
  aliquotaSaldo: number;
}
```

### Area Fabbricabile
```typescript
interface AreaFabbricabile {
  id: string;
  ubicazione: string;
  estremiCatastali: string;
  percentualePossesso: number;
  mesiPrimoSemestre: number;
  mesiSecondoSemestre: number;
  valoreArea: number;             // Valore venale
  aliquotaPrimaRata: number;
  aliquotaSaldo: number;
}
```

### Risultati Calcolo
```typescript
interface RisultatoCalcoloImmobile {
  baseImponibile: number;
  valoreIMU: number;
  imuPrimaRata: number;
  imuSaldo: number;
  imuTotale: number;
  quotaComune?: number;
  quotaStato?: number;
}

interface Riepilogo {
  abitazionePrincipale: {
    imuLorda: number;
    detrazione: number;
    imuNetta: number;
    primaRata: number;
    saldo: number;
  };
  terreniAgricoli: RisultatoCalcoloImmobile;
  fabbricatiRurali: RisultatoCalcoloImmobile;
  areeFabbricabili: RisultatoCalcoloImmobile;
  altriFabbricati: RisultatoCalcoloImmobile;
  totali: {
    primaRata: number;        // Scadenza 16 giugno
    saldo: number;            // Scadenza 16 dicembre
    totaleAnnuo: number;
  };
}
```

---

## Logica di Calcolo (Core Functions)

### Calcolo Base Imponibile
```typescript
// lib/calculations/base-imponibile.ts

const RIVALUTAZIONE_RENDITA = 1.05;
const RIVALUTAZIONE_REDDITO_DOMINICALE = 1.25;
const MOLTIPLICATORE_TERRENI = 135;

const COEFFICIENTI_CATASTALI: Record<string, number> = {
  'A/1': 160, 'A/2': 160, 'A/3': 160, 'A/4': 160,
  'A/5': 160, 'A/6': 160, 'A/7': 160, 'A/8': 160,
  'A/9': 160, 'A/10': 80,
  'B/1': 140, 'B/2': 140, 'B/3': 140, 'B/4': 140,
  'B/5': 140, 'B/6': 140, 'B/7': 140, 'B/8': 140,
  'C/1': 55,
  'C/2': 160, 'C/3': 140, 'C/4': 140, 'C/5': 140,
  'C/6': 160, 'C/7': 160,
  'D/1': 65, 'D/2': 65, 'D/3': 65, 'D/4': 65,
  'D/5': 80, 'D/6': 65, 'D/7': 65, 'D/8': 65,
  'D/9': 65, 'D/10': 65,
};

export function calcolaBaseImponibileFabbricato(
  renditaCatastale: number,
  categoria: string
): number {
  const coefficiente = COEFFICIENTI_CATASTALI[categoria] || 160;
  return renditaCatastale * RIVALUTAZIONE_RENDITA * coefficiente;
}

export function calcolaBaseImponibileTerreno(
  redditoDominicale: number
): number {
  return redditoDominicale * RIVALUTAZIONE_REDDITO_DOMINICALE * MOLTIPLICATORE_TERRENI;
}

export function calcolaBaseImponibileArea(valoreVenale: number): number {
  return valoreVenale;
}
```

### Calcolo IMU
```typescript
// lib/calculations/imu.ts

export function calcolaIMU(
  baseImponibile: number,
  percentualePossesso: number,
  mesiPossesso: number,
  aliquota: number
): number {
  return baseImponibile *
    (percentualePossesso / 100) *
    (mesiPossesso / 12) *
    (aliquota / 100);
}

export function calcolaIMUConRiduzione(
  baseImponibile: number,
  percentualePossesso: number,
  mesiPossesso: number,
  aliquota: number,
  riduzione: number = 0
): number {
  const baseRidotta = baseImponibile * (1 - riduzione);
  return calcolaIMU(baseRidotta, percentualePossesso, mesiPossesso, aliquota);
}
```

### Calcolo Detrazioni
```typescript
// lib/calculations/detrazioni.ts

const DETRAZIONE_BASE = 200;
const DETRAZIONE_PER_FIGLIO = 50;
const MAX_DETRAZIONE_FIGLI = 400;

export function calcolaDetrazione(
  numeroFigli: number,
  percentualePossesso: number,
  detrazioneDeliberata: number = DETRAZIONE_BASE
): number {
  const detrazioneFigli = Math.min(
    numeroFigli * DETRAZIONE_PER_FIGLIO,
    MAX_DETRAZIONE_FIGLI
  );
  const detrazioneTeorica = detrazioneDeliberata + detrazioneFigli;
  return detrazioneTeorica * (percentualePossesso / 100);
}

export function calcolaIMUNetta(
  imuLorda: number,
  detrazione: number
): number {
  return Math.max(imuLorda - detrazione, 0);
}
```

### Riduzione Terreni CD/IAP
```typescript
// lib/calculations/riduzione-terreni.ts

const SCAGLIONI_RIDUZIONE = [
  { da: 0, a: 6000, percentuale: 0 },
  { da: 6000.01, a: 15500, percentuale: 0.30 },
  { da: 15500.01, a: 25500, percentuale: 0.50 },
  { da: 25500.01, a: 32000, percentuale: 0.75 },
  { da: 32000.01, a: Infinity, percentuale: 1.00 },
];

export function calcolaRiduzioneCDIAP(valoreTerreno: number): number {
  for (const scaglione of SCAGLIONI_RIDUZIONE) {
    if (valoreTerreno >= scaglione.da && valoreTerreno <= scaglione.a) {
      return valoreTerreno * scaglione.percentuale;
    }
  }
  return valoreTerreno;
}
```

### Arrotondamento
```typescript
// lib/utils/rounding.ts

export function arrotondaEuro(importo: number): number {
  return Math.round(importo);  // €0.49 → €0, €0.50 → €1
}

export function arrotondaCentesimi(importo: number): number {
  return Math.round(importo * 100) / 100;
}
```

---

## Componenti UI Principali

### 1. Dashboard / Home
- Riepilogo situazione IMU
- Quick actions (nuovo calcolo, carica precedente)
- Totali da pagare con scadenze

### 2. Wizard Multi-Step
1. **Step 1**: Dati contribuente e comune
2. **Step 2**: Terreni agricoli
3. **Step 3**: Fabbricati rurali
4. **Step 4**: Abitazione principale
5. **Step 5**: Altri fabbricati
6. **Step 6**: Aree fabbricabili
7. **Step 7**: Riepilogo e stampa

### 3. Form Immobili
- Tabella dinamica con righe aggiungibili/rimuovibili
- Calcolo automatico al cambio di ogni campo
- Validazione in tempo reale
- Tooltip informativi

### 4. Riepilogo
- Tabella riassuntiva per tipologia
- Totali 1° rata e saldo
- Scadenze con alert
- Export PDF/Excel
- Generazione F24

---

## Funzionalità Aggiuntive

### 1. Database Comuni
- Autocomplete comune con codice catastale
- Aliquote deliberate per comune (se disponibili)

### 2. Salvataggio
- Salvataggio locale (localStorage/IndexedDB)
- Export/Import JSON
- Storico calcoli

### 3. Export
- PDF riepilogo
- Excel dettagliato
- Stampa modello F24 precompilato

### 4. Multi-anno
- Confronto IMU anni diversi
- Storico versamenti

### 5. Simulazioni
- Simulatore variazione aliquote
- Calcolo ravvedimento operoso

---

## Flusso Utente

```
┌─────────────────┐
│   Home Page     │
│  (Dashboard)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Dati Contribu-  │
│  ente e Comune  │
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┬────────┐
    ▼         ▼        ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│Terreni│ │Fabbr. │ │Abita- │ │ Altri │ │ Aree  │
│       │ │Rurali │ │zione  │ │Fabbr. │ │Fabbr. │
└───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
    │         │        │        │        │
    └────┬────┴────────┴────────┴────────┘
         │
         ▼
┌─────────────────┐
│   Riepilogo     │
│  e Calcolo      │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│ PDF   │ │  F24  │
│Export │ │Export │
└───────┘ └───────┘
```

---

## Responsive Design

### Mobile
- Form verticali
- Accordion per sezioni
- Swipe tra step

### Tablet
- Form a 2 colonne
- Sidebar collassabile

### Desktop
- Layout completo
- Tabelle espanse
- Preview affiancata

---

## Accessibilità

- ARIA labels
- Keyboard navigation
- High contrast mode
- Screen reader support

---

## Testing Strategy

### Unit Tests
- Funzioni di calcolo
- Validazioni
- Formatters

### Integration Tests
- Form submission
- Calcoli completi
- Export

### E2E Tests
- Flusso completo wizard
- Salvataggio/caricamento

---

## Deployment

### Opzioni
1. **Static Hosting**: Vercel, Netlify, GitHub Pages
2. **Container**: Docker + qualsiasi cloud
3. **Self-hosted**: nginx/Apache

### CI/CD
- GitHub Actions
- Test automatici
- Build e deploy automatico

---

## Roadmap Sviluppo

### Fase 1: MVP
- [ ] Setup progetto (Next.js + TypeScript)
- [ ] Componenti UI base
- [ ] Form contribuente
- [ ] Calcolo terreni agricoli
- [ ] Calcolo fabbricati
- [ ] Riepilogo base

### Fase 2: Completamento
- [ ] Tutti i tipi di immobili
- [ ] Detrazioni complete
- [ ] Riduzioni CD/IAP
- [ ] Export PDF

### Fase 3: Funzionalità Avanzate
- [ ] Database comuni
- [ ] Aliquote per comune
- [ ] Generazione F24
- [ ] Storico calcoli

### Fase 4: Ottimizzazioni
- [ ] PWA (offline support)
- [ ] Multi-lingua
- [ ] Dark mode
- [ ] Performance

---

*Architettura basata sul reverse engineering del file Excel originale*
