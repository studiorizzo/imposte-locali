# Reverse Engineering - Calcolatore IMU Excel

## Panoramica

Il file `fiscaleDoc_10SM0000003516.xls` è un calcolatore IMU (Imposta Municipale Unica) sviluppato da Wolters Kluwer Italia S.r.l., versione 1.3 (giugno 2022), ideato da Saverio Mucci.

Il foglio di calcolo permette di calcolare l'IMU per diverse tipologie di immobili e terreni.

---

## Struttura del File Excel

### Fogli Presenti (11 totali)

| # | Nome Foglio | Descrizione | Righe | Colonne |
|---|-------------|-------------|-------|---------|
| 1 | Home | Dati generali contribuente | 28 | 8 |
| 2 | Terreni | Calcolo IMU terreni agricoli | 66 | 23 |
| 3 | Fabbricati rurali | Calcolo IMU fabbricati rurali strumentali | 34 | 17 |
| 4 | Abitazione principale | Calcolo IMU abitazione principale e pertinenze | 47 | 19 |
| 5 | Altri fabbricati | Calcolo IMU altri fabbricati | 30 | 25 |
| 6 | Aree fabbricabili | Calcolo IMU aree fabbricabili | 20 | 19 |
| 7 | Riepilogo | Riepilogo totali e scadenze | 32 | 8 |
| 8 | Istruzioni | Istruzioni d'uso (vuoto) | 0 | 0 |
| 9 | Novità | Note sulle novità (vuoto) | 0 | 0 |
| 10 | Oggetti | Tabelle di lookup (coefficienti, liste) | 16 | 3 |
| 11 | Riduzione terreni | Calcolo riduzioni CD/IAP | 38 | 4 |

---

## Costanti e Coefficienti (Foglio "Oggetti")

### Coefficienti Moltiplicatori per Categoria Catastale

| Categorie Catastali | Coefficiente |
|---------------------|--------------|
| A/1 - A/9, C/2, C/6, C/7 | 160 |
| C/3, C/4, C/5 | 140 |
| B/1 - B/8 | 140 |
| A/10, D/5 | 80 |
| Categoria D (esclusi D/5 e D/10) | 65 |
| C/1 | 55 |

### Altre Costanti

- **Rivalutazione rendita catastale**: 5% (moltiplicatore 1.05)
- **Rivalutazione reddito dominicale**: 25% (moltiplicatore 1.25)
- **Moltiplicatore terreni agricoli**: 135
- **Detrazione base abitazione principale**: €200
- **Detrazione massima per figli**: €400
- **Detrazione per figlio < 26 anni**: €50

---

## Scaglioni Riduzione Terreni CD/IAP (Foglio "Riduzione terreni")

Per i Coltivatori Diretti e Imprenditori Agricoli Professionali:

| Da (€) | A (€) | Percentuale Imponibile |
|--------|-------|------------------------|
| 0 | 6.000 | 0% (ESENTE) |
| 6.000,01 | 15.500 | 30% |
| 15.500,01 | 25.500 | 50% |
| 25.500,01 | 32.000 | 75% |
| > 32.000 | - | 100% |

---

## Logica di Calcolo

### 1. Calcolo Base Imponibile

#### Fabbricati
```
Base Imponibile = Rendita Catastale × 1.05 × Coefficiente Moltiplicatore
```

#### Terreni Agricoli
```
Base Imponibile = Reddito Dominicale × 1.25 × 135
```

#### Aree Fabbricabili
```
Base Imponibile = Valore Venale (valore di mercato)
```

### 2. Calcolo Imposta

```
Imposta Lorda = Base Imponibile × (% Possesso / 100) × (Mesi / 12) × (Aliquota / 100)
```

### 3. Detrazioni Abitazione Principale

```
Detrazione Figli = MIN(50 × n_figli, 400)
Detrazione Teorica = 200 + Detrazione Figli
Detrazione Spettante = MIN(Detrazione Teorica × % possesso / 100, Imposta Lorda)
Imposta Netta = MAX(Imposta Lorda - Detrazione Spettante, 0)
```

### 4. Riduzioni Speciali

- **Immobili storici/artistici**: Base imponibile ridotta al 50%
- **Immobili inagibili/inabitabili**: Base imponibile ridotta al 50%
- **Comodato a parenti**: Base imponibile ridotta al 50%

### 5. Rateizzazione

```
1° Rata (Acconto) = 50% dell'imposta annua → Scadenza: 16 giugno
2° Rata (Saldo) = Imposta annua - 1° Rata → Scadenza: 16 dicembre
```

---

## Mappatura Campi Input/Output

### Foglio HOME - Dati Generali

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Contribuente | INPUT (testo) | Nome/ragione sociale |
| Periodo d'imposta | INPUT (numero) | Anno di riferimento |
| Comune | INPUT (testo) | Nome del comune |
| Codice catastale | INPUT (codice) | Codice catastale del comune |

### Foglio TERRENI AGRICOLI

**Campi Input (per riga, max 25 terreni):**

| Colonna | Campo | Tipo |
|---------|-------|------|
| A | Numero progressivo | AUTO |
| B | Ubicazione/estremi catastali | INPUT (testo) |
| C | % possesso | INPUT (0-100) |
| D | Mesi 1° semestre | INPUT (0-6) |
| E | Mesi 2° semestre | INPUT (0-6) |
| F | Reddito dominicale | INPUT (€) |
| G | Aliquota 1° rata | INPUT (%) |
| H | Aliquota saldo | INPUT (%) |

**Flag Globale:**
- Coltivatore diretto/IAP: SI/NO

**Campi Calcolati:**

| Colonna | Campo | Formula |
|---------|-------|---------|
| I | Coefficiente rivalutazione | 1.25 × 135 = 168.75 |
| J | Valore IMU (NO riduzione) | F × I × C/100 × (D+E)/12 |
| K | Valore IMU (SI riduzione) | Applicazione scaglioni |
| L | Valore IMU finale | SE(CD/IAP; K; J) |
| M | IMU 1° rata | L × G/100 / 2 |
| N | IMU acconto comune | Quota comunale |
| O | IMU acconto Stato | Quota statale (0.38%) |
| P | IMU saldo | Saldo finale |
| T | Totale IMU | Somma importi |

### Foglio FABBRICATI RURALI STRUMENTALI

**Campi Input (max 10):**

| Colonna | Campo | Tipo |
|---------|-------|------|
| A | Numero | AUTO |
| B | Ubicazione/estremi | INPUT (testo) |
| C | % possesso | INPUT (0-100) |
| D | Mesi 1° semestre | INPUT (0-6) |
| E | Mesi 2° semestre | INPUT (0-6) |
| F | Rendita catastale | INPUT (€) |
| G | Aliquota 1° rata | INPUT (%) |
| H | Aliquota saldo | INPUT (%) |
| I | Coefficiente | INPUT (default 160) |

**Campi Calcolati:**

| Colonna | Formula |
|---------|---------|
| J | Valore IMU = F × 1.05 × I × C/100 × (D+E)/12 |
| K | IMU 1° rata = J × G/100 / 2 |
| L | IMU saldo = J × H/100 - K |
| N | Totale IMU = K + L |

### Foglio ABITAZIONE PRINCIPALE

**Campi Input Generali:**

| Campo | Tipo | Default |
|-------|------|---------|
| Numero rate | INPUT (1-3) | 1 |
| Numero figli < 26 anni | INPUT (0-n) | 0 |
| % spettanza detrazione | INPUT (0-100) | 100 |
| Detrazione deliberata | INPUT (€) | 200 |
| Categoria catastale | INPUT (A/1, A/8, A/9) | - |

**Campi Input per Immobile:**

| Campo | Tipo |
|-------|------|
| Ubicazione/estremi | INPUT (testo) |
| Aventi diritto detrazione | INPUT (numero) |
| % possesso | INPUT (0-100) |
| Mesi 1° semestre | INPUT (0-6) |
| Mesi 2° semestre | INPUT (0-6) |
| Rendita catastale | INPUT (€) |
| Aliquota 1° rata | INPUT (%) |
| Aliquota saldo | INPUT (%) |

**Righe Immobili:**
- Abitazione principale
- Pertinenza C/2 (magazzini, locali di deposito)
- Pertinenza C/6 (autorimesse, box)
- Pertinenza C/7 (tettoie)

### Foglio ALTRI FABBRICATI

**Campi Input (max 25):**

| Colonna | Campo | Tipo |
|---------|-------|------|
| A | Numero | AUTO |
| B | Ubicazione/estremi | INPUT (testo) |
| C | Tipologia (categoria) | INPUT (selezione) |
| D | Storico/inagibile | INPUT (SI/NO) |
| E | Comodato parenti | INPUT (SI/NO) |
| F | Locaz. canone concordato | INPUT (SI/NO) |
| G | % possesso | INPUT (0-100) |
| H | Mesi 1° semestre | INPUT (0-6) |
| I | Mesi 2° semestre | INPUT (0-6) |
| J | Rendita catastale | INPUT (€) |
| K | Aliquota 1° rata | INPUT (%) |
| L | Aliquota saldo | INPUT (%) |

### Foglio AREE FABBRICABILI

**Campi Input (max 15):**

| Colonna | Campo | Tipo |
|---------|-------|------|
| A | Numero | AUTO |
| B | Ubicazione/estremi | INPUT (testo) |
| C | % possesso | INPUT (0-100) |
| D | Mesi 1° semestre | INPUT (0-6) |
| E | Mesi 2° semestre | INPUT (0-6) |
| F | Valore area | INPUT (€) |
| G | Aliquota 1° rata | INPUT (%) |
| H | Aliquota saldo | INPUT (%) |

### Foglio RIEPILOGO

**Sezioni:**

1. **Abitazione principale e pertinenze**
   - IMU 1° rata
   - IMU saldo
   - Totale
   - Detrazione spettante

2. **Altri immobili**
   - Terreni agricoli
   - Fabbricati rurali strumentali
   - Aree fabbricabili
   - Altri fabbricati
   - Gruppo D - quota Stato
   - Gruppo D - quota Comune

3. **Totali**
   - TOTALE 1° RATA (scadenza 16 giugno)
   - TOTALE 2° RATA (scadenza 16 dicembre)
   - TOTALE IMPOSTA DOVUTA

4. **Eccedenze**
   - Eccedenza terreni
   - Eccedenza fabbricati rurali
   - Eccedenza abitazione principale
   - Totale da versare entro 16/01 anno successivo

---

## Aliquote Standard IMU

| Tipologia | Aliquota Base | Range Consentito |
|-----------|---------------|------------------|
| Abitazione principale (A/1, A/8, A/9) | 0.4% | 0.2% - 0.6% |
| Altri fabbricati | 0.76% | 0.46% - 1.06% |
| Fabbricati rurali strumentali | 0.2% | Fissa |
| Terreni agricoli | 0.76% | 0.46% - 1.06% |
| Aree fabbricabili | 0.76% | 0.46% - 1.06% |
| Fabbricati gruppo D | 0.76% | 0.76% - 1.06% |

---

## Codici Tributo F24

| Tipologia | Codice Comune | Codice Stato |
|-----------|---------------|--------------|
| Abitazione principale | 3912 | - |
| Fabbricati rurali | 3913 | - |
| Terreni agricoli | 3914 | - |
| Aree fabbricabili | 3916 | - |
| Altri fabbricati | 3918 | - |
| Fabbricati D | 3930 | 3925 |

---

## Validazioni e Vincoli

1. **Percentuale possesso**: 0-100%
2. **Mesi possesso**: 0-12 totali (0-6 per semestre)
3. **Aliquote**: Devono rispettare i range consentiti
4. **Pertinenze abitazione principale**: Max 1 per categoria (C/2, C/6, C/7)
5. **Detrazione figli**: Max €400 totali
6. **Arrotondamento**: All'euro (€0.49 arrotonda a €0, €0.50 arrotonda a €1)

---

## Note sulla Ripartizione Stato/Comune (Storico 2012-2013)

Nel periodo 2012-2013 era prevista una ripartizione dell'IMU tra Stato e Comune:

- **Quota Stato base**: 0.38% (riserva erariale)
- **Quota Comune**: Eccedenza rispetto alla quota statale
- **Abitazione principale**: Interamente al Comune
- **Fabbricati D**: Quota fissa allo Stato (0.76%), eccedenza al Comune

Dal 2014 l'IMU è interamente destinata ai Comuni (esclusa quota fabbricati D).

---

## Changelog Normativo

- **2012**: Introduzione IMU (D.L. 201/2011)
- **2013**: Abolizione IMU abitazione principale (esclusi A/1, A/8, A/9)
- **2014**: Introduzione TASI, modifiche aliquote
- **2020**: Abolizione TASI, nuova IMU unificata (L. 160/2019)
- **2022**: Esenzione abitazione principale coniugi (sent. Corte Cost.)

---

*Documento generato tramite reverse engineering del file Excel originale*
