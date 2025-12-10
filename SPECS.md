# SPECS.md - Specifiche Tecniche Calcolatore IMU

> **Documento vivente** - Aggiornato man mano che procede l'analisi
>
> **Ultimo aggiornamento**: 10 Dicembre 2025
>
> **Stato**: Analisi iniziale completata, in attesa di ulteriore documentazione 2025

---

## INDICE

1. [Fonte Dati](#1-fonte-dati)
2. [Analisi Excel Originale 2022](#2-analisi-excel-originale-2022)
3. [Normativa IMU 2025](#3-normativa-imu-2025)
4. [Tabella Confronto 2022 vs 2025](#4-tabella-confronto-2022-vs-2025)
5. [Modifiche Necessarie](#5-modifiche-necessarie)
6. [Specifiche Validate](#6-specifiche-validate)
7. [Changelog](#7-changelog)

---

## 1. FONTE DATI

### 1.1 Excel Originale

| Attributo | Valore |
|-----------|--------|
| File | `excel-originale/fiscaleDoc_10SM0000003516.xls` |
| Versione | 1.3 |
| Data versione | Giugno 2022 |
| Autore | Saverio Cinieri |
| Copyright | Wolters Kluwer Italia S.r.l. – Ipsoa |
| Normativa base | Art. 13, D.L. 6 dicembre 2011, n. 201 |
| **Stato normativa** | **ABROGATA dal 01/01/2020** |

### 1.2 Documentazione IMU 2025

| Documento | Posizione | Stato |
|-----------|-----------|-------|
| Dossier IMU 2025 | `aggiornamenti/dossier_imu_2025.md` | ✅ Analizzato |

---

## 2. ANALISI EXCEL ORIGINALE 2022

### 2.1 Struttura Fogli

| # | Foglio | Righe | Colonne | Scopo |
|---|--------|-------|---------|-------|
| 1 | Home | 28 | 8 | Dati contribuente, anno, comune |
| 2 | Terreni | 66 | 23 | Calcolo IMU terreni agricoli (max 25) |
| 3 | Fabbricati rurali | 34 | 17 | Calcolo IMU fabbricati rurali (max 10) |
| 4 | Abitazione principale | 47 | 19 | Calcolo IMU abitazione + pertinenze |
| 5 | Altri fabbricati | 30 | 25 | Calcolo IMU altri immobili (max 25) |
| 6 | Aree fabbricabili | 20 | 19 | Calcolo IMU aree edificabili (max 15) |
| 7 | Riepilogo | 32 | 8 | Totali, scadenze, importi |
| 8 | Istruzioni | 0 | 0 | (vuoto) |
| 9 | Novità | 0 | 0 | (vuoto) |
| 10 | Oggetti | 16 | 3 | Tabelle lookup (coefficienti, liste) |
| 11 | Riduzione terreni | 38 | 4 | Scaglioni riduzione CD/IAP |

### 2.2 Foglio "Oggetti" - Costanti

#### 2.2.1 Coefficienti Moltiplicatori (Excel 2022)

| Categorie | Coefficiente | Cella |
|-----------|--------------|-------|
| A/1 - A/9, C/2, C/6, C/7 | 160 | C5 |
| C/3, C/4, C/5 | 140 | C6 |
| B/1 - B/8 | 140 | C7 |
| A/10, D/5 | 80 | C8 |
| Cat. D (no D/5, D/10) | 65 | C9 |
| C/1 | 55 | C10 |

#### 2.2.2 Liste Dropdown

| Lista | Valori | Celle |
|-------|--------|-------|
| CD/IAP | NO, SI | B12:B13 |
| Rate | 2, 3 | B15:B16 |

### 2.3 Foglio "Riduzione terreni" - Scaglioni CD/IAP

> ⚠️ **OBSOLETO**: Questo sistema di riduzione è stato **abolito**. Dal 2014 i terreni CD/IAP sono **ESENTI**.

| Da (€) | A (€) | % Imponibile | Celle |
|--------|-------|--------------|-------|
| 0 | 6.000 | 0% | A5:C5 |
| 6.000,01 | 15.500 | 30% | A6:C6 |
| 15.500,01 | 25.500 | 50% | A7:C7 |
| 25.500,01 | 32.000 | 75% | A8:C8 |
| 32.000,01 | ∞ | 100% | A9:C9 |

### 2.4 Foglio "Terreni" - Struttura Colonne

#### Sezione 1: Calcolo con Rate

| Col | Campo | Tipo | Note |
|-----|-------|------|------|
| A | Numero | AUTO | Progressivo 1-25 |
| B | Ubicazione/estremi catastali | INPUT | Testo |
| C | % possesso | INPUT | 0-100 |
| D | Mesi 1° semestre | INPUT | 0-6 |
| E | Mesi 2° semestre | INPUT | 0-6 |
| F | Reddito dominicale | INPUT | € |
| G | Aliquota 1° rata (%) | INPUT | % |
| H | Aliquota saldo (%) | INPUT | % |
| I | Coefficiente rivalutazione | CALC | 1.25 × 135 = 168.75 |
| J | Valore IMU NO riduzione | CALC | F × I × C/100 × (D+E)/12 |
| K | Valore IMU SI riduzione | CALC | Applicazione scaglioni |
| L | Valore IMU finale | CALC | Basato su flag CD/IAP |
| M | IMU 1° rata | CALC | |
| N | IMU 1° acconto comune | CALC | |
| O | IMU 1° acconto Stato | CALC | ⚠️ Quota Stato abolita |
| P | IMU con aliq deliberata | CALC | |
| Q | IMU saldo comune | CALC | |
| R | IMU 2014 | CALC | Riferimento storico |
| S | IMU a saldo | CALC | |
| T | Totale IMU | CALC | |
| U-V | Conteggio fabbricati | CALC | Per F24 |
| W | Eccedenza su aliquota base | CALC | |

**Flag globale**: E3 = Coltivatore diretto/IAP (1=SI)

### 2.5 Foglio "Fabbricati rurali" - Struttura Colonne

| Col | Campo | Tipo |
|-----|-------|------|
| A | Numero | AUTO |
| B | Ubicazione/estremi catastali | INPUT |
| C | % possesso | INPUT |
| D | Mesi 1° semestre | INPUT |
| E | Mesi 2° semestre | INPUT |
| F | Rendita catastale | INPUT |
| G | Aliquota 1° rata (%) | INPUT |
| H | Aliquota saldo (%) | INPUT |
| I | Coefficiente rivalutazione | INPUT/CALC |
| J | Valore IMU | CALC |
| K | IMU 1° rata | CALC |
| L | IMU dovuta aliq deliberata | CALC |
| M | IMU a saldo | CALC |
| N | Totale IMU | CALC |
| O-P | Conteggio fabbricati | CALC |
| Q | Eccedenza su aliquota base | CALC |

### 2.6 Foglio "Abitazione principale" - Struttura

#### Parametri Generali

| Cella | Campo | Valore Default | Stato 2025 |
|-------|-------|----------------|------------|
| C3 | Numero di rate | 1 | ✅ Valido |
| C4 | Numero figli < 26 anni | (input) | ❌ **ABOLITO** |
| C5 | % spettanza detrazione | (input) | ❌ **ABOLITO** |
| C6 | Detrazione anno precedente | (input) | - |
| C7 | Detrazione anno corrente | (input) | ✅ Solo base €200 |
| C8 | Detrazione figli massima | 400 | ❌ **ABOLITO** |
| C9 | Detrazione figli spettante | (calc) | ❌ **ABOLITO** |
| C10 | Categoria catastale | (input) | ✅ Valido |

#### Righe Immobili

| Riga | Tipo Immobile |
|------|---------------|
| 13 | Abitazione principale |
| 14 | Pertinenza C/2 |
| 15 | Pertinenza C/6 |
| 16 | Pertinenza C/7 |

#### Calcolo Detrazioni (OBSOLETO)

- Riga 18: Detrazione teorica (base + figli) → **ABOLIRE calcolo figli**
- Riga 19: Detrazione rateizzata
- Riga 20: Detrazione spettante
- Riga 21: IMU al netto detrazione
- Riga 24: "Calcolo detrazione figli" → **DA RIMUOVERE**

### 2.7 Foglio "Altri fabbricati" - Struttura

| Col | Campo | Tipo | Note |
|-----|-------|------|------|
| A | Numero | AUTO | |
| B | Ubicazione/estremi | INPUT | |
| C | Tipologia | INPUT | Categoria catastale |
| D | Storico/inagibile | INPUT | SI/NO → riduzione 50% |
| E | Comodato parenti | INPUT | SI/NO → riduzione 50% |
| F | Canone concordato | INPUT | SI/NO → riduzione 25% aliquota |
| G | % possesso | INPUT | |
| H | Mesi 1° semestre | INPUT | |
| I | Mesi 2° semestre | INPUT | |
| J | Rendita catastale | INPUT | |
| K | Aliquota 1° rata | INPUT | |
| L | Aliquota saldo | INPUT | |
| M | Coefficiente | CALC | Basato su tipologia |
| N | Valore IMU (no riduzione) | CALC | |
| O | Valore IMU | CALC | Con riduzioni |
| P | IMU 1° rata | CALC | |
| Q-R | IMU acconto Comune/Stato | CALC | ⚠️ Quota Stato da rivedere |
| S-T | IMU saldo Comune/Stato | CALC | |
| U-V | IMU anno / 2° rata | CALC | |
| W | Totale IMU | CALC | |

### 2.8 Foglio "Aree fabbricabili" - Struttura

| Col | Campo | Tipo |
|-----|-------|------|
| A | Numero | AUTO |
| B | Ubicazione/estremi | INPUT |
| C | % possesso | INPUT |
| D | Mesi 1° semestre | INPUT |
| E | Mesi 2° semestre | INPUT |
| F | Valore area | INPUT |
| G | Aliquota 1° rata | INPUT |
| H | Aliquota saldo | INPUT |
| I | Valore IMU | CALC |
| J-P | IMU rate e quote | CALC |
| Q | Totale IMU | CALC |

### 2.9 Foglio "Riepilogo"

**Riferimenti temporali nel foglio** (da aggiornare):
- "entro il 16/1/2014"
- "17 SETTEMBRE 2012"
- "ENTRO IL 16/01/2014"

---

## 3. NORMATIVA IMU 2025

### 3.1 Base Giuridica

| Norma | Stato |
|-------|-------|
| Art. 1, L. 27/12/2019, n. 160 | **VIGENTE** dal 01/01/2020 |
| Art. 13, D.L. 06/12/2011, n. 201 | ABROGATA |

### 3.2 Coefficienti Moltiplicatori (2025)

| Categorie | Coefficiente | Note |
|-----------|--------------|------|
| A/1 - A/11 (escluso A/10) | 160 | Include A/11 |
| A/10 | 80 | |
| B/1 - B/8 | 140 | |
| C/1 | 55 | |
| C/2, C/6, C/7 | 160 | |
| C/3, C/4, C/5 | 140 | |
| D/1 - D/10 (escluso D/5) | 65 | |
| D/5 | 80 | |

### 3.3 Aliquote Base 2025

| Fattispecie | Base | Min | Max |
|-------------|------|-----|-----|
| Abitazione principale A/1, A/8, A/9 | **0,50%** | 0% | 0,60% |
| Fabbricati rurali strumentali | **0,10%** | 0% | 0,10% |
| Terreni agricoli | 0,76% | 0% | 1,06% |
| Fabbricati gruppo D | **0,86%** | 0,76% | 1,14% |
| Altri fabbricati | **0,86%** | 0% | 1,14% |
| Aree fabbricabili | **0,86%** | 0% | 1,14% |

> **Nota**: Maggiorazione +0,08% in sostituzione TASI (c. 755)

### 3.4 Esenzioni 2025

| Fattispecie | Stato |
|-------------|-------|
| Abitazione principale (non A/1, A/8, A/9) | ESENTE |
| Terreni agricoli CD/IAP | **ESENTI** (non ridotti) |
| Beni merce | ESENTI (dal 2022) |
| Immobili occupati abusivamente | ESENTI (dal 2023) |
| Fabbricati collabenti F/2 | ESCLUSI |

### 3.5 Riduzioni 2025

| Riduzione | Tipo | Condizioni |
|-----------|------|------------|
| 50% base | Storico/artistico | - |
| 50% base | Inagibile/inabitabile | Perizia o dichiarazione |
| 50% base | Comodato parenti 1° grado | Contratto registrato, stessa residenza |
| **25% aliquota** | Canone concordato | Art. 2 c.3 L. 431/1998 |
| 50% base | Pensionati esteri | Un solo immobile, non locato |

### 3.6 Detrazioni 2025

| Tipo | Importo | Note |
|------|---------|------|
| Base abitazione principale | **€200** | Solo A/1, A/8, A/9 |
| Per figli < 26 anni | **€0** | **ABOLITA dal 2014** |

### 3.7 Quote Stato/Comune

| Tipologia | Quota Stato | Quota Comune |
|-----------|-------------|--------------|
| Gruppo D | 0,76% | Eccedenza |
| Tutto il resto | 0% | 100% |

---

## 4. TABELLA CONFRONTO 2022 vs 2025

### 4.1 Differenze Critiche

| Elemento | Excel 2022 | IMU 2025 | Impatto |
|----------|------------|----------|---------|
| **Normativa base** | D.L. 201/2011 | L. 160/2019 | 🔴 CRITICO |
| **Aliquota abitaz. princ.** | 0,40% | 0,50% | 🟡 AGGIORNARE |
| **Aliquota fabbr. rurali** | 0,20% | 0,10% | 🟡 AGGIORNARE |
| **Aliquota altri/aree** | 0,76% | 0,86% | 🟡 AGGIORNARE |
| **Detrazione figli** | €50/figlio (max €400) | ABOLITA | 🔴 RIMUOVERE |
| **Terreni CD/IAP** | Riduzione scaglioni | ESENZIONE totale | 🔴 RIMUOVERE |
| **Quota Stato generica** | 0,38% | Solo gruppo D | 🔴 RIMUOVERE |
| **Coefficiente A/11** | Non presente | 160 | 🟡 AGGIUNGERE |
| **Beni merce** | Non gestiti | Esenti | 🟢 AGGIUNGERE |
| **Occupati abusivamente** | Non gestiti | Esenti | 🟢 AGGIUNGERE |
| **F/2 collabenti** | Non gestiti | Esclusi | 🟢 AGGIUNGERE |
| **Pensionati esteri** | Non gestiti | Riduzione 50% | 🟢 AGGIUNGERE |

### 4.2 Elementi Confermati/Validi

| Elemento | Stato |
|----------|-------|
| Formula base imponibile fabbricati: R × 1.05 × C | ✅ VALIDO |
| Formula base imponibile terreni: RD × 1.25 × 135 | ✅ VALIDO |
| Coefficienti A/1-A/10, B, C, D | ✅ VALIDO |
| Riduzione 50% storico/artistico | ✅ VALIDO |
| Riduzione 50% inagibile/inabitabile | ✅ VALIDO |
| Riduzione 50% comodato parenti | ✅ VALIDO |
| Riduzione 25% canone concordato | ✅ VALIDO |
| Detrazione base €200 | ✅ VALIDO |
| Pertinenze C/2, C/6, C/7 (max 1 per cat.) | ✅ VALIDO |
| Scadenze 16/06 e 16/12 | ✅ VALIDO |

---

## 5. MODIFICHE NECESSARIE

### 5.1 Priorità ALTA (🔴)

1. **Rimuovere detrazione figli**
   - Eliminare campo "Numero figli < 26 anni"
   - Eliminare campo "% spettanza detrazione figli"
   - Eliminare campo "Detrazione per figli massima"
   - Eliminare sezione "Calcolo detrazione figli"
   - Mantenere solo detrazione base €200

2. **Rimuovere sistema riduzione terreni CD/IAP**
   - Eliminare foglio "Riduzione terreni"
   - Sostituire con flag "CD/IAP" → se SI, ESENZIONE totale

3. **Rimuovere quota Stato generica**
   - Mantenere quota Stato solo per gruppo D (0,76%)
   - Rimuovere colonne "IMU Stato" da tutti i fogli tranne gruppo D

4. **Aggiornare riferimento normativo**
   - Da "D.L. 201/2011" a "L. 160/2019"

### 5.2 Priorità MEDIA (🟡)

5. **Aggiornare aliquote base**
   - Abitazione principale: 0,40% → 0,50%
   - Fabbricati rurali: 0,20% → 0,10%
   - Altri fabbricati/aree: 0,76% → 0,86%

6. **Aggiungere coefficiente A/11**
   - Categoria A/11: coefficiente 160

7. **Aggiornare riferimenti temporali**
   - Rimuovere date fisse (2012, 2013, 2014)
   - Usare "anno corrente" e "anno successivo"

### 5.3 Priorità BASSA (🟢)

8. **Aggiungere nuove esenzioni**
   - Beni merce (flag)
   - Immobili occupati abusivamente (flag)
   - Fabbricati F/2 (esclusione automatica)

9. **Aggiungere nuove riduzioni**
   - Pensionati esteri (flag → riduzione 50% base)

10. **Gestione dichiarazione IMU**
    - Alert per casi con obbligo dichiarativo

---

## 6. SPECIFICHE VALIDATE

### 6.1 Formule Confermate

#### Base Imponibile Fabbricati
```
BASE_IMPONIBILE = RENDITA_CATASTALE × 1.05 × COEFFICIENTE
```
✅ **VALIDATA** - Confermata in art. 1, c. 745, L. 160/2019

#### Base Imponibile Terreni Agricoli
```
BASE_IMPONIBILE = REDDITO_DOMINICALE × 1.25 × 135
```
✅ **VALIDATA** - Confermata in art. 1, c. 746, L. 160/2019

#### Base Imponibile Aree Fabbricabili
```
BASE_IMPONIBILE = VALORE_VENALE
```
✅ **VALIDATA** - Confermata in art. 1, c. 746, L. 160/2019

#### Calcolo IMU
```
IMU = BASE_IMPONIBILE × (% POSSESSO / 100) × (MESI / 12) × (ALIQUOTA / 100)
```
✅ **VALIDATA** - Formula standard

#### Detrazione Abitazione Principale
```
DETRAZIONE = €200 × (% POSSESSO / 100)
```
⚠️ **PARZIALMENTE VALIDATA** - La formula per figli è ABOLITA

#### Riduzione Canone Concordato
```
ALIQUOTA_EFFETTIVA = ALIQUOTA_DELIBERATA × 0.75
```
✅ **VALIDATA** - Art. 1, c. 760, L. 160/2019

### 6.2 Coefficienti Validati

| Categoria | Coefficiente | Fonte | Stato |
|-----------|--------------|-------|-------|
| A/1 - A/9 | 160 | c. 745 | ✅ |
| A/10 | 80 | c. 745 | ✅ |
| A/11 | 160 | c. 745 | ✅ (DA AGGIUNGERE) |
| B/1 - B/8 | 140 | c. 745 | ✅ |
| C/1 | 55 | c. 745 | ✅ |
| C/2, C/6, C/7 | 160 | c. 745 | ✅ |
| C/3, C/4, C/5 | 140 | c. 745 | ✅ |
| D (no D/5, D/10) | 65 | c. 745 | ✅ |
| D/5 | 80 | c. 745 | ✅ |

### 6.3 Aliquote Base Validate

| Fattispecie | Aliquota Base | Fonte | Stato |
|-------------|---------------|-------|-------|
| Abitazione princ. | 0,50% | c. 748 | ✅ |
| Fabbricati rurali | 0,10% | c. 750 | ✅ |
| Terreni agricoli | 0,76% | c. 752 | ✅ |
| Gruppo D | 0,86% | c. 753 | ✅ |
| Altri fabbricati | 0,86% | c. 754 | ✅ |
| Aree fabbricabili | 0,86% | c. 754 | ✅ |

---

## 7. CHANGELOG

| Data | Modifica |
|------|----------|
| 2025-12-10 | Creazione documento |
| 2025-12-10 | Analisi completa Excel 2022 |
| 2025-12-10 | Confronto con dossier IMU 2025 |
| 2025-12-10 | Identificazione differenze critiche |

---

## NOTE

### Documenti in attesa di analisi

_Aggiungere qui i riferimenti a documenti aggiuntivi man mano che vengono caricati in `aggiornamenti/`_

### Domande aperte

1. Gestione ILIA (Friuli-Venezia Giulia), IMIS (Trentino), IMI (Alto Adige)?
2. Implementare prospetto aliquote obbligatorio dal 2025?
3. Gestione enti non commerciali (IMU/ENC)?

---

*Documento di specifiche tecniche per il progetto Calcolatore IMU*
