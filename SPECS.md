# SPECS.md - Specifiche Tecniche Calcolatore IMU

> **Documento vivente** - Aggiornato man mano che procede l'analisi
>
> **Ultimo aggiornamento**: 10 Dicembre 2025
>
> **Stato**: Analisi documentazione normativa in corso - 34 funzionalità identificate

---

## INDICE

1. [Fonte Dati](#1-fonte-dati)
2. [Analisi Excel Originale 2022](#2-analisi-excel-originale-2022)
3. [Normativa IMU 2025](#3-normativa-imu-2025)
4. [Tabella Confronto 2022 vs 2025](#4-tabella-confronto-2022-vs-2025)
5. [Modifiche Necessarie](#5-modifiche-necessarie)
6. [Nuove Funzionalità App 2025](#6-nuove-funzionalità-app-2025)
7. [Specifiche Validate](#7-specifiche-validate)
8. [Changelog](#8-changelog)
9. [Riferimenti Normativi](#9-riferimenti-normativi)

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
| Guida Calcolo IMU 2025 | `aggiornamenti/imu-2025-come-calcolare-e-pagare-l-imposta.md` | ✅ Analizzato |
| IMU Base imponibile e aliquote | `aggiornamenti/IMU – Base imponibile e aliquote/imu_base_imponibile_aliquote.md` | ✅ Analizzato |
| Novità IMU Bilancio 2024 | `aggiornamenti/IMU – Base imponibile e aliquote/Articoli operativi/novita_imu_bilancio_2024.md` | ✅ Analizzato |
| IMU Dichiarazione | `aggiornamenti/IMU - Dichiarazione/imu_dichiarazione.md` | ✅ Analizzato |
| **D.M. 24/04/2024 Dichiarazione IMU** | `aggiornamenti/IMU - Dichiarazione/decreto_mef_24042024_dichiarazione_imu.md` | ✅ Analizzato (vigente) |
| Specifiche tecniche IMU/IMPi | `aggiornamenti/IMU - Dichiarazione/2024_IMU-IMPi_SpecificheTecniche_2024.04.24.md` | ✅ Analizzato |
| Istruzioni modello IMU/IMPi | `aggiornamenti/IMU - Dichiarazione/IMU_IMPi_Istruzioni_2024_Definitivo-24.04.2024.md` | ✅ Analizzato |
| Modello IMU/IMPi (PDF) | `aggiornamenti/IMU - Dichiarazione/IMU_IMPi_Modello_2024_Definitivo.pdf` | Riferimento visivo |
| **Istruzioni modello IMU ENC** | `aggiornamenti/IMU - Dichiarazione/IMU_ENC_Istr_24-Definitivo.md` | ✅ Analizzato |
| **Specifiche tecniche IMU ENC** | `aggiornamenti/IMU - Dichiarazione/2024_ENC_SpecificheTecniche_2024.04.24.md` | ✅ Analizzato |
| Modello IMU ENC (PDF) | `aggiornamenti/IMU - Dichiarazione/IMU_ENC_Modello_2024_Definitivo.pdf` | Riferimento visivo |

### 1.3 Strumenti Metodologici

| Documento | Posizione | Note |
|-----------|-----------|------|
| Check List Acconto IMU 2025 | `aggiornamenti/IMU – Base imponibile e aliquote/Strumenti utili/checklist_acconto_imu_2025.md` | ✅ Riferimento per UI/UX |
| Check List Acconto IMU 2024 | `aggiornamenti/IMU – Base imponibile e aliquote/Strumenti utili/checklist_acconto_imu_2024.md` | Versione precedente |

> **Utilizzo checklist**: Queste checklist definiscono la **sequenza logica di raccolta dati** e le **verifiche da effettuare** per ogni immobile. Costituiscono un riferimento fondamentale per:
> - Progettazione del flusso wizard dell'app
> - Definizione dei campi obbligatori/opzionali
> - Ordine delle domande all'utente
> - Validazione completezza dati inseriti

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

### 2.4 Foglio "Terreni" - Struttura Colonne e Formule

#### Campi Input

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

**Flag globale**: E3 = Coltivatore diretto/IAP (0=NO, 1=SI, 2=CD/IAP con riduzione)

#### Formule Estratte (Riga 6 come esempio)

```excel
I6 = IF($E$3=0,0,IF(F6>0,IF($E$3=1,135,75),0))
     → Coefficiente: 135 per NON CD/IAP(1), 75 per riduzione(2)

J6 = ROUND(IF(F6=0,0,(F6*C6/100)*1.25*I6),2)
     → Base imponibile: (Reddito_Dom × %possesso/100) × 1.25 × Coefficiente

K6 = IF($E$3=2,'Riduzione terreni'!D13,0)
     → Valore ridotto per CD/IAP scaglionato (OBSOLETO)

L6 = IF($E$3=1,J6,IF($E$3=2,K6,0))
     → Base finale: J6 se SI(1), K6 se riduzione(2), 0 se NO(0)

M6 = ROUND((L6*(G6/100)*(D6/12)),2)
     → IMU 1° rata: Base × Aliquota% × Mesi_1_sem/12

N6 = IF(M6>0,M6/2,0)
     → Acconto: IMU_1_rata / 2

O6 = M6-N6
     → Saldo 1° rata: IMU_1_rata - Acconto

P6 = ROUND(IF(L6>0,(L6*(H6/100)*(E6/12)),0),2)
     → IMU periodo dicembre: Base × Aliq_saldo% × Mesi_2_sem/12

R6 = ROUND(IF(L6>0,(L6*(H6/100)*((D6+E6)/12)),0),2)
     → IMU annuale: Base × Aliq_saldo% × Mesi_totali/12

S6 = IF(R6>M6,R6-M6,0)
     → Conguaglio: max(0, IMU_annuale - IMU_1_rata)

T6 = M6+S6
     → Totale IMU: IMU_1_rata + Conguaglio

U6 = IF(M6>0,1,0)  → Flag: 1° rata dovuta
V6 = IF(S6>0,1,0)  → Flag: saldo dovuto
W6 = IF(AND($E$3=2,H6>0.76),T6-M37,0)  → Eccedenza su 0.76%
```

> ⚠️ **IMU 2025**: Sistema CD/IAP con riduzione scaglionata (E3=2) è **ABOLITO**.
> I terreni CD/IAP sono ora completamente **ESENTI** (IMU = 0)

### 2.5 Foglio "Fabbricati rurali" - Struttura e Formule

#### Campi Input

| Col | Campo | Tipo |
|-----|-------|------|
| A | Numero | AUTO |
| B | Ubicazione/estremi | INPUT |
| C | % possesso | INPUT |
| D | Mesi 1° semestre | INPUT |
| E | Mesi 2° semestre | INPUT |
| F | Rendita catastale | INPUT |
| G | Aliquota 1° rata (%) | INPUT |
| H | Aliquota saldo (%) | INPUT |
| I | Coefficiente | INPUT |

#### Formule Estratte (Riga 5 come esempio)

```excel
J5 = ROUND(IF(F5=0,0,(F5*C5/100)*1.05*I5),2)
     → Base imponibile: (Rendita × %possesso/100) × 1.05 × Coefficiente

K5 = ROUND((J5*(G5/100)*(D5/12)),2)
     → IMU 1° rata: Base × Aliquota% × Mesi_1_sem/12

L5 = IF(J5>0,ROUND(J5*H5/100*((D5+E5)/12),2),0)
     → IMU annuale: Base × Aliq_saldo% × Mesi_totali/12

M5 = ROUND(IF(L5-K5>0,L5-K5,0),2)
     → Saldo: max(0, IMU_annuale - IMU_1_rata)

N5 = K5+M5
     → Totale IMU

O5 = IF(K5>0,1,0)  → Flag: 1° rata dovuta
P5 = IF(M5>0,1,0)  → Flag: saldo dovuto
Q5 = IF(H5>0.2,N5-M20,0)  → Eccedenza su aliquota base 0.20%
```

> **IMU 2025**: Aliquota base fabbricati rurali: **0,10%** (era 0,20%)

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

#### Formule Estratte

```excel
// DETRAZIONE FIGLI (ABOLITA nel 2025!)
C8 = IF(OR(Home!D9=2012,Home!D9=2013),
        IF(C4=1,50,IF(C4=2,100,IF(C4=3,150,IF(C4=4,200,
        IF(C4=5,250,IF(C4=6,300,IF(C4=7,350,400))))))),0)
     → €50 per figlio, max €400 - **ABOLITA DAL 2014**

// CALCOLO IMMOBILE (Riga 13 - Abitazione principale)
J13 = IF(G13>0,160,0)
      → Coefficiente: 160 per abitazione principale

K13 = ROUND(IF(G13=0,0,(G13*D13/100)*1.05*J13),2)
      → Base imponibile: (Rendita × %possesso/100) × 1.05 × 160

L13 = ROUND((K13*(H13/100)*(E13/12)),2)
      → IMU 1° rata: Base × Aliquota% × Mesi/12

N13 = IF(K13>0,ROUND(K13*(I13/100)*((E13+F13)/12),2),0)
      → IMU annuale: Base × Aliq_saldo% × Mesi_totali/12

O13 = IF(N13-L13>0,N13-L13,0)
      → Saldo: max(0, IMU_annuale - IMU_1_rata)

P13 = L13+O13
      → Totale IMU
```

> ⚠️ **IMU 2025**:
> - Detrazione figli **ABOLITA** - Mantenere solo detrazione base €200
> - Aliquota base: **0,50%** (era 0,40%)
> - Pertinenze max 1 per categoria (C/2, C/6, C/7)

### 2.7 Foglio "Altri fabbricati" - Struttura e Formule

#### Campi Input

| Col | Campo | Tipo | Note |
|-----|-------|------|------|
| A | Numero | AUTO | |
| B | Ubicazione/estremi | INPUT | |
| C | Tipologia | INPUT | 1=A, 2=C345, 3=B, 4=A10/D5, 5=D, 6=C1 |
| D | Storico/inagibile | INPUT | 1=NO, 2=SI → riduzione 50% |
| E | Comodato parenti | INPUT | 1=NO, 2=SI → riduzione 50% |
| F | Canone concordato | INPUT | 1=NO, 2=SI → riduzione 25% aliquota |
| G | % possesso | INPUT | |
| H | Mesi 1° semestre | INPUT | |
| I | Mesi 2° semestre | INPUT | |
| J | Rendita catastale | INPUT | |
| K | Aliquota 1° rata | INPUT | |
| L | Aliquota saldo | INPUT | |

#### Formule Estratte (Riga 5)

```excel
// COEFFICIENTE per categoria
M5 = IF(J5>0,IF(C5=0,0,IF(C5=1,160,IF(C5=2,140,IF(C5=3,140,
        IF(C5=4,80,IF(C5=5,65,IF(C5=6,55,0))))))),0)
     → Tipologia: 1→160, 2→140, 3→140, 4→80, 5(D)→65, 6→55

// BASE IMPONIBILE
N5 = ROUND(IF(J5=0,0,(J5*G5/100)*1.05*M5),2)
     → (Rendita × %possesso/100) × 1.05 × Coefficiente

// RIDUZIONE BASE (storico/inagibile E comodato)
O5 = IF(AND(D5=1,E5=1),N5,
        IF(AND(D5=2,E5=1),N5/2,
        IF(AND(D5=1,E5=2),N5/2,
        IF(AND(D5=2,E5=2),N5/4,0))))
     → Base ridotta: 100%, 50%, 50%, o 25%

// IMU 1° RATA con riduzione canone concordato
P5 = ROUND(IF(F5=2,((O5*(K5/100)*(H5/6)))*0.75,
               ((O5*(K5/100)*(H5/12)))),2)
     → Se canone concordato: aliquota × 0.75

// QUOTA STATO (solo categoria D = tipologia 5)
Q5 = IF(C5=5,IF(K5>0.76,P5-R5,0),0)
     → Eccedenza su 0.76% (per 1° rata)

R5 = IF(C5=5,IF(K5>0.76,(O5*(0.76/100)*(H5/12)),P5),0)
     → Quota stato: Base × 0.76% × Mesi/12

// CONGUAGLIO DICEMBRE
U5 = ROUND(IF(F5=2,((O5*(L5/100)*((H5+I5)/12)))*0.75,
               ((O5*(L5/100)*((H5+I5)/12)))),2)
     → IMU annuale con aliquota dicembre

V5 = IF(U5-P5>0,U5-P5,0)
     → Saldo: max(0, annuale - 1°rata)

W5 = P5+V5
     → Totale IMU
```

> ⚠️ **IMU 2025**:
> - Quota Stato (0,76%) **SOLO per gruppo D** (tipologia 5) - CORRETTO
> - Aliquota base: **0,86%** (era 0,76%)
> - Aggiungere riduzione pensionati esteri (50% base)

### 2.8 Foglio "Aree fabbricabili" - Struttura e Formule

#### Campi Input

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

#### Formule Estratte (Riga 5)

```excel
// BASE IMPONIBILE (valore venale)
I5 = ROUND(IF(F5=0,0,(F5*C5/100)),2)
     → Valore × %possesso/100

// IMU 1° RATA
J5 = ROUND((I5*(D5/12)*(G5/100)),2)
     → Base × Mesi_1_sem/12 × Aliquota%

K5 = IF(J5>0,J5/2,0)
     → Acconto: IMU/2

L5 = J5-K5
     → Saldo 1° rata

// IMU ANNUALE
O5 = ROUND(IF(I5>0,(I5*(H5/100)*((D5+E5)/12)),0),2)
     → Base × Aliq_saldo% × Mesi_totali/12

P5 = IF(O5>J5,O5-J5,0)
     → Conguaglio: max(0, annuale - 1°rata)

Q5 = J5+P5
     → Totale IMU
```

> **IMU 2025**: Aliquota base: **0,86%** - Nessuna quota Stato

### 2.9 Foglio "Riepilogo" - Codici Tributo F24

```excel
// CODICI TRIBUTO
D10 = IF(OR(G10>0,H10>0),3912,"")  → Abitazione principale
D16 = IF(OR(G16>0,H16>0),3914,"")  → Terreni
D17 = IF(OR(G17>0,H17>0),3913,"")  → Fabbricati rurali
D18 = IF(G18>0,3916,"")            → Aree fabbricabili
D19 = IF(G19>0,3918,"")            → Altri fabbricati (COMUNE)
D20 = IF(G20>0,IF(C5=5,3925,""),"")  → Gruppo D (STATO)
D21 = IF(G21>0,IF(C5=5,3930,""),"")  → Gruppo D (COMUNE eccedenza)
```

**Codici Tributo F24 Validati**:
| Codice | Descrizione |
|--------|-------------|
| 3912 | IMU - Abitazione principale e pertinenze - COMUNE |
| 3913 | IMU - Fabbricati rurali strumentali - COMUNE |
| 3914 | IMU - Terreni - COMUNE |
| 3916 | IMU - Aree fabbricabili - COMUNE |
| 3918 | IMU - Altri fabbricati - COMUNE |
| 3925 | IMU - Immobili gruppo D - STATO |
| 3930 | IMU - Immobili gruppo D - COMUNE (incremento) |
| **3939** | **IMU - Fabbricati beni merce (impresa costruttrice) - COMUNE** |

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

### 3.2.1 Coefficienti Fabbricati Gruppo D Non Iscritti in Catasto (DM 14/3/2025)

**Ambito di applicazione:** Fabbricati classificabili nel gruppo catastale D che siano:
- Non iscritti in catasto con attribuzione di rendita
- Interamente posseduti da imprese
- Distintamente contabilizzati

**Formula:** Valore = Costo contabilizzato × Coefficiente (per anno di formazione)

| Anno | Coefficiente | Anno | Coefficiente | Anno | Coefficiente |
|------|--------------|------|--------------|------|--------------|
| 2025 | 1,00 | 2010 | 1,32 | 1995 | 2,04 |
| 2024 | 1,00 | 2009 | 1,34 | 1994 | 2,11 |
| 2023 | 1,02 | 2008 | 1,39 | 1993 | 2,15 |
| 2022 | 1,14 | 2007 | 1,44 | 1992 | 2,17 |
| 2021 | 1,19 | 2006 | 1,48 | 1991 | 2,21 |
| 2020 | 1,19 | 2005 | 1,52 | 1990 | 2,32 |
| 2019 | 1,20 | 2004 | 1,61 | 1989 | 2,42 |
| 2018 | 1,22 | 2003 | 1,66 | 1988 | 2,53 |
| 2017 | 1,22 | 2002 | 1,72 | 1987 | 2,74 |
| 2016 | 1,23 | 2001 | 1,76 | 1986 | 2,95 |
| 2015 | 1,23 | 2000 | 1,82 | 1985 | 3,16 |
| 2014 | 1,23 | 1999 | 1,85 | 1984 | 3,37 |
| 2013 | 1,24 | 1998 | 1,87 | 1983 | 3,58 |
| 2012 | 1,27 | 1997 | 1,92 | 1982 | 3,79 |
| 2011 | 1,30 | 1996 | 1,98 | | |

> **Fonte:** D.M. MEF 14 marzo 2025; art. 1, comma 746, L. 160/2019; art. 5, comma 3, D.Lgs. 504/1992

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

### 3.8 Soggetti Passivi (art. 1, c. 743)

| Soggetto | Condizione |
|----------|------------|
| Proprietario | - |
| Titolare diritto reale | Usufrutto, uso, abitazione, enfiteusi, superficie |
| Concessionario | Aree demaniali |
| **Locatario leasing** | Dalla stipula, per tutta la durata (anche immobili da costruire) |
| Genitore assegnatario | Casa familiare con diritto di abitazione |

**Contitolarità**: In presenza di più soggetti passivi sullo stesso immobile:
- Ognuno ha **autonoma obbligazione tributaria**
- Si considera la singola quota di possesso
- Esenzioni/agevolazioni applicate **individualmente**

### 3.9 Regola del Mese (art. 1, c. 761)

L'imposta è proporzionale ai mesi di possesso:

| Situazione | Conteggio |
|------------|-----------|
| Possesso > metà giorni del mese | **Mese intero** |
| Giorno di trasferimento | A carico dell'**acquirente** |
| Giorni possesso uguali (cedente = acquirente) | Mese intero all'**acquirente** |

### 3.10 Immobili Assimilati ad Abitazione Principale (art. 1, c. 741, lett. c)

| Fattispecie | Note |
|-------------|------|
| Cooperative edilizie a proprietà indivisa | Abitazione principale soci assegnatari |
| Cooperative edilizie per studenti universitari | Anche **senza residenza** anagrafica |
| Alloggi sociali (D.M. 22/4/2008) | Con residenza e dimora dell'assegnatario |
| Casa familiare assegnata a genitore affidatario | Con diritto di abitazione |
| Immobile Forze armate/polizia | 1 solo immobile, non locato |
| Anziani/disabili in istituto | **Facoltà** del Comune (se non locato) |

**Alloggi sociali liberati** (Ris. 2/DF del 20/3/2023):
- Esenzione valida durante operazioni amministrative/tecniche per riassegnazione
- Periodo congruo indicativo: **4-6 mesi**
- Non richiesta dichiarazione IMU (Cass. 23680/2020)

**Locazione parziale abitazione principale** (CTR Abruzzo 8/2022):
- **Mantiene esenzione** anche se parte dell'immobile è locata

### 3.11 Aree Pertinenziali (Circ. 1/DF del 18/3/2020, par. 8)

| Situazione | Trattamento |
|------------|-------------|
| Accatastate unitariamente al fabbricato (anche "graffatura") | **Pertinenza** |
| Non accatastate unitariamente | **Area fabbricabile** (soggetta autonomamente) |

### 3.12 Valori Venali Aree Fabbricabili (art. 1, c. 777, lett. d)

I Comuni possono determinare **valori venali per zone omogenee**.

**Effetto**: Se il contribuente versa su valore ≥ valore predeterminato dal Comune → **limitazione potere di accertamento**.

### 3.13 Aliquote per il Saldo

| Situazione | Aliquote da applicare |
|------------|----------------------|
| Delibera comunale pubblicata **entro 28 ottobre** | Aliquote nuove anno corrente |
| Delibera **non pubblicata** entro 28 ottobre | Aliquote anno precedente |

---

## 4. TABELLA CONFRONTO 2022 vs 2025

### 4.1 Differenze Critiche (Excel 2022 → App 2025)

| Elemento | Excel 2022 | IMU 2025 | Stato |
|----------|------------|----------|-------|
| **Normativa base** | D.L. 201/2011 | L. 160/2019 | ✅ Implementato |
| **Aliquota abitaz. princ.** | 0,40% | 0,50% | ✅ Implementato |
| **Aliquota fabbr. rurali** | 0,20% | 0,10% | ✅ Implementato |
| **Aliquota altri/aree** | 0,76% | 0,86% | ✅ Implementato |
| **Detrazione figli** | €50/figlio (max €400) | ABOLITA | ✅ Rimosso |
| **Terreni CD/IAP** | Riduzione scaglioni | ESENZIONE totale | ✅ Implementato |
| **Quota Stato generica** | 0,38% | Solo gruppo D (0,76%) | ✅ Implementato |
| **Coefficiente A/11** | Non presente | 160 | ✅ Implementato |
| **Beni merce** | Non gestiti | Esenti (dal 2022) | ✅ Implementato |
| **Occupati abusivamente** | Non gestiti | Esenti (dal 2023) | ✅ Implementato |
| **F/2 collabenti** | Non gestiti | Esclusi | ✅ Implementato |
| **Pensionati esteri** | Non gestiti | Riduzione 50% | ✅ Implementato |
| **Alert obbligo dichiarativo** | Non presente | Da implementare | ⏳ Pendente |

> **Riferimento codice:** `src/utils/constants.ts`, `src/utils/calcolo.ts`, `src/types/index.ts`

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

## 5. MODIFICHE NECESSARIE (rispetto a Excel 2022)

> **Stato complessivo:** 9/10 implementate (90%)

### 5.1 Priorità ALTA (🔴) - ✅ COMPLETATE

1. ✅ **Rimuovere detrazione figli** → Solo `DETRAZIONE_ABITAZIONE_PRINCIPALE = 200`
2. ✅ **Terreni CD/IAP → esenzione** → Flag `terrenoCdIap` in `Esenzioni`
3. ✅ **Quota Stato solo gruppo D** → `calcolaQuoteGruppoD()` con `QUOTA_STATO_GRUPPO_D = 0.76`
4. ✅ **Riferimento L. 160/2019** → Commenti e documentazione aggiornati

### 5.2 Priorità MEDIA (🟡) - ✅ COMPLETATE

5. ✅ **Aliquote base aggiornate** → `ALIQUOTE_BASE` (0.50%, 0.10%, 0.86%)
6. ✅ **Coefficiente A/11** → `'A/11': 160` in `COEFFICIENTI`
7. ✅ **Riferimenti temporali dinamici** → Parametro `anno` nelle funzioni

### 5.3 Priorità BASSA (🟢) - 2/3 COMPLETATE

8. ✅ **Nuove esenzioni** → `beneMerce`, `occupatoAbusivamente`, `collabente` in `Esenzioni`
9. ✅ **Pensionati esteri** → `pensionatoEstero` in `Riduzioni` (riduzione 50%)
10. ⏳ **Alert obbligo dichiarativo** → **DA IMPLEMENTARE** (casistiche in sezione 6.24)

---

## 6. NUOVE FUNZIONALITÀ APP 2025

> Funzionalità aggiuntive rispetto all'Excel originale 2022, basate sulla documentazione normativa analizzata.

### 6.1 Gestione Occupazione Abusiva (Corte Cost. 60/2024)

**Fonte:** D.Lgs. 23/2011 art. 9 comma 1, come integrato da Corte Cost. 60/2024

**Funzionalità:**
- Flag "Immobile occupato abusivamente" per ciascun immobile
- Campo data presentazione denuncia/azione giudiziaria
- Calcolo automatico esenzione dal periodo in cui sussistono le condizioni

**Logica:**
```
SE occupato_abusivamente = SI E denuncia_presentata = SI:
   IMU = 0 (per il periodo)
```

**Note:** L'esenzione ha efficacia retroattiva. Reati rilevanti:
- Art. 614 comma 2 c.p. (violazione di domicilio aggravata)
- Art. 633 c.p. (invasione di terreni o edifici)

### 6.2 Gestione Abitazione Principale Post Corte Cost. 209/2022

**Fonte:** D.L. 201/2011 art. 13 comma 2, come modificato da Corte Cost. 209/2022

**Novità normativa:**
- Eliminato riferimento al "nucleo familiare"
- È sufficiente che il **solo possessore** dimori e risieda nell'immobile
- Coniugi/conviventi possono avere **due abitazioni principali** in comuni diversi

**Funzionalità:**
- Rimozione campo "nucleo familiare residente"
- Verifica solo dimora + residenza del possessore
- Alert informativo per coniugi con immobili in comuni diversi

### 6.3 Gestione Casa Familiare Estesa (Circ. MEF 1/DF 2020)

**Fonte:** L. 160/2019 art. 1 comma 741 lett. c) n. 4

**Novità rispetto a Excel 2022:**
- Include anche coppie **non sposate** con figli
- La "casa familiare" è definita dal **provvedimento del Giudice**
- Si prescinde dalla proprietà (può essere anche di terzi)
- Non rilevanti residenza e dimora dell'assegnatario

**Funzionalità:**
- Campo "Assegnazione giudiziale casa familiare" (SI/NO)
- Se SI → assimilazione ad abitazione principale → esenzione

### 6.4 Gestione Pertinenze Fiscali (Circ. MEF 1/DF 2020, par. 8)

**Fonte:** L. 160/2019 art. 1 comma 741 lett. a)

**Novità:** Dal 01/01/2020 la nozione di pertinenza è **esclusivamente fiscale**, non più civilistica (artt. 817 ss. c.c.)

**Regola:**
| Situazione | Trattamento |
|------------|-------------|
| Area accatastata unitariamente (graffatura) | **Pertinenza** del fabbricato |
| Area NON accatastata unitariamente | **Area fabbricabile** autonoma |

**Funzionalità:**
- Campo "Accatastamento unitario" per aree adiacenti a fabbricati
- Se NO → area soggetta autonomamente come edificabile

### 6.5 Gestione Leasing Immobiliare (Circ. MEF 1/DF 2020, par. 9)

**Fonte:** L. 160/2019 art. 1 comma 743

**Chiarimento MEF:**
- Soggetto passivo = **locatario** dalla data della stipula
- Fine soggettività = **scadenza contratto** (NON riconsegna del bene)

**Differenza con TASI (abolita):**
- TASI: soggettività fino alla riconsegna (verbale di consegna)
- IMU: soggettività fino a fine contratto

**Funzionalità:**
- Campo "Immobile in leasing" (SI/NO)
- Se SI: data stipula contratto, data fine contratto
- Calcolo automatico mesi di possesso

### 6.6 Gestione IACP/ERP Migliorata (Circ. MEF 1/DF 2020, par. 3)

**Fonte:** L. 160/2019 art. 1 comma 749 e comma 754

**Chiarimenti MEF:**

| Tipo immobile | Trattamento |
|---------------|-------------|
| Alloggi IACP/ERP regolarmente assegnati | Detrazione €200, aliquota ordinaria |
| Alloggi IACP/ERP sfitti | Possibilità azzeramento aliquota (c. 754) |
| Alloggi sociali (DM 22/04/2008) | **Esenti** se adibiti ad abitazione principale |

**ATTENZIONE:** Alloggi IACP non sono automaticamente "alloggi sociali". L'esenzione vale solo se conformi al DM 22/04/2008.

**Funzionalità:**
- Tipologia "IACP/ERP" con sottotipologie
- Campo "Alloggio sociale DM 22/04/2008" (SI/NO)
- Logica detrazione/esenzione automatica

### 6.7 Esenzioni Terreni Agricoli Complete (L. 160/2019 c. 758)

**Fonte:** Art. 1 comma 758 L. 160/2019

**Esenzioni totali:**
1. Terreni posseduti e condotti da **CD/IAP** (qualunque ubicazione)
2. Terreni nelle **isole minori** (Allegato A L. 448/2001)
3. Terreni a **proprietà collettiva** indivisibile/inusucapibile
4. Terreni in **zone montane/collinari** (elenco ISTAT)

**Funzionalità:**
- Flag per ciascuna tipologia di esenzione
- Verifica automatica tramite codice catastale comune (per zone montane/isole)

### 6.8 Esenzioni Storiche D.Lgs. 504/1992 art. 7

**Fonte:** D.Lgs. 504/1992 art. 7 (ancora vigente per rinvio)

**Esenzioni da implementare:**

| Lettera | Descrizione | Implementazione |
|---------|-------------|-----------------|
| a) | Enti pubblici (Stato, Regioni, ecc.) | Flag tipologia soggetto |
| b) | Categorie E/1 - E/9 | Automatico da categoria |
| c) | Fabbricati usi culturali (art. 5-bis DPR 601/73) | Flag |
| d) | Fabbricati culto | Flag |
| e) | Fabbricati Santa Sede | Flag |
| f) | Stati esteri / Org. internazionali | Flag |
| g) | Inagibili recuperati per attività L. 104/92 | Flag + periodo |
| h) | Terreni montani/collinari | Automatico da comune |
| i) | Enti non commerciali (ENC) | Flag + verifica modalità |

### 6.9 Gestione Pensionati Esteri/AIRE (L. 178/2020)

**Fonte:** L. 178/2020 art. 1 comma 48; L. 160/2019 art. 1 comma 741

**Requisiti per riduzione 50%:**
- Cittadino italiano residente all'estero
- Iscritto AIRE
- Pensionato nel Paese di residenza
- **Un solo immobile** in Italia
- Non locato né in comodato

**Funzionalità:**
- Flag "Pensionato estero AIRE" (SI/NO)
- Verifica unicità immobile
- Riduzione automatica 50% base imponibile

### 6.10 Alert Obbligo Dichiarazione IMU

**Fonte:** L. 160/2019 art. 1 comma 769

**Termine:** 30 giugno anno successivo

**Casi con obbligo dichiarativo:**
- Inizio possesso
- Variazioni rilevanti
- Beni merce (Cass. 32115/2024)
- Comodato a parenti (prima dichiarazione)

**Funzionalità:**
- Alert automatico se presenti fattispecie con obbligo
- Indicazione scadenza presentazione

### 6.11 Gestione Aliquote e Mancata Pubblicazione

**Fonte:** L. 160/2019 art. 1 comma 767; Circ. MEF 1/DF 2020 par. 4; **Art. 1, c. 74, L. 213/2023**

**Regola:**
```
SE delibera_pubblicata_entro_28_ottobre = SI:
   Usa aliquote anno corrente
ALTRIMENTI:
   Usa aliquote anno precedente
```

**Proroga automatica termini (dal 2024 - art. 1, c. 74, L. 213/2023):**
- Se 14 ottobre o 28 ottobre cadono di **sabato o domenica** → proroga al **primo giorno lavorativo successivo**
- Regola permanente (non limitata a singolo anno)

**Importo minimo:** €12 (se comune non delibera diversamente)

**Funzionalità:**
- Campo "Aliquote definitive" (SI/NO)
- Se NO: usa aliquote precedenti o base
- Verifica importo minimo versamento
- Calcolo automatico proroga weekend per termini 14/28 ottobre

### 6.12 IMPI - Piattaforme Marine (Art. 38 D.L. 124/2019)

**Fonte:** Art. 38 D.L. 124/2019

**Caratteristiche:**
- Imposta sulle piattaforme marine
- Aliquota fissa (comuni NON possono variare)
- Versamento unica soluzione 16 dicembre

**Funzionalità:** Da valutare se includere (fattispecie molto specifica)

### 6.13 Prospetto Aliquote Obbligatorio 2025 (D.M. 7/7/2023 e D.M. 6/9/2024)

**Fonte:** D.M. 7 luglio 2023 (definizione prospetto), D.M. 6 settembre 2024 (proroga al 2025)

**Novità dal 2025:**
- I Comuni sono obbligati ad utilizzare il **Prospetto delle aliquote** ministeriale
- Struttura predefinita con fattispecie codificate
- Possibilità di diversificare aliquote per fattispecie specifiche
- Obbligo decorre dall'anno di imposta 2025 (art. 6-ter, comma 1, D.L. n. 132/2023)

**Proroga 2025 (Art. 6, L. 108/2025 - D.L. 84/2025 "Decreto Fiscale"):**
- Comuni che **non** hanno adottato la delibera entro il 28/02/2025 → possono approvare entro **15 settembre 2025**
- Comuni che hanno adottato delibera entro 28/02/2025 **senza** Prospetto → possono sanare entro **15 settembre 2025**
- Sono **valide** le delibere adottate tra 1/03/2025 e 18/06/2025 (data entrata in vigore D.L. 84/2025)
- Delibera senza Prospetto = **non idonea** a produrre effetti costitutivi

**Impatto app:**
- Possibile integrazione con il portale MEF per aliquote ufficiali
- Validazione automatica delle aliquote inserite
- Alert per scadenza 15/09/2025 (proroga)

### 6.14 Gestione Enti Non Commerciali (ENC) - Regime Speciale

**Fonte:** L. 160/2019 art. 1 cc. 759, 770; Circ. MEF 2/DF 16/7/2024; **Art. 1, c. 71, L. 213/2023 (Bilancio 2024)**

**Caratteristiche distintive:**

| Elemento | Regime ordinario | Regime ENC |
|----------|------------------|------------|
| Rate versamento | 2 (16/6 e 16/12) | **3** (16/6, 16/6, 16/12) |
| Dichiarazione | Ordinaria (30/6 anno successivo) | **Annuale specifica** entro 30/6 anno successivo |
| Esenzioni | Generali | Con requisiti soggettivi + oggettivi |
| Proporzione uso | N/A | Calcolo proporzionale per attività miste |

**Esenzione ENC (art. 1, c. 759 L. 160/2019):**
- Destinazione esclusiva ad attività non commerciali
- Se uso promiscuo: esenzione proporzionale alla superficie non commerciale
- Accatastamento autonomo parti commerciali se superficie > percentuale regolamentare

**Interpretazione autentica L. 213/2023 (Bilancio 2024):**

| Termine | Interpretazione (art. 1, c. 71) |
|---------|--------------------------------|
| **"Posseduti"** | Include immobili in **comodato** a ENC/trust/OICR se: (1) comodatario funzionalmente/strutturalmente collegato al concedente, (2) attività non commerciali svolte nell'immobile |
| **"Utilizzati"** | Strumentali alle attività anche **senza esercizio attuale**, purché non cessazione definitiva della strumentalità |

**Giurisprudenza:** Cass. 8073/2019 - Esenzione riconosciuta per immobile in comodato tra enti con "compenetrazione" e "medesima architettura strutturale"

**Funzionalità:**
- Tipologia soggetto "Ente Non Commerciale"
- Campo "Uso promiscuo" con % superficie non commerciale
- Campo "Immobile in comodato a ENC collegato"
- Calcolo automatico tre rate
- Alert dichiarazione specifica

### 6.15 Semplificazione ENC Attività Sportive (Art. 6-bis D.L. 84/2025)

**Fonte:** Art. 6-bis D.L. 84/2025

**Novità 2025:**
- Semplificazione per ENC che svolgono **attività sportive dilettantistiche**
- Allineamento con riforma sport (D.Lgs. 36/2021)

**Funzionalità:**
- Flag "Attività sportiva dilettantistica" per ENC
- Regime semplificato calcolo esenzione

### 6.16 Trust e Trustee come Soggetto Passivo (Cass. 16550/2019, 15988/2020)

**Fonte:** Cass. 20 giugno 2019, n. 16550; Cass. 27 luglio 2020, n. 15988

**Principio:**
- Per immobili vincolati in **trust**, il soggetto passivo IMU è il **trustee**
- Il trust è privo di personalità giuridica
- I beni sono trasferiti fiduciariamente al trustee
- Non viola il principio di segregazione patrimoniale

**Funzionalità:**
- Tipologia soggetto "Trust"
- Campo "Trustee" come soggetto passivo
- Info: segregazione patrimoniale mantenuta

### 6.17 Rapporto IMU/IRPEF per Immobili Non Locati (Art. 9 c. 9 D.Lgs. 23/2011)

**Fonte:** Art. 9, comma 9, D.Lgs. n. 23/2011 (non abrogato)

**Regola:**

| Situazione | Comune | IMU | IRPEF |
|------------|--------|-----|-------|
| Immobile non locato | **Diverso** da abitaz. princ. | ✅ | ❌ No |
| Immobile non locato | **Stesso** abitaz. princ. | ✅ | ✅ **50%** reddito |
| Immobile locato | Qualsiasi | ✅ | ✅ 100% (o cedolare) |

**Funzionalità:**
- Alert "Reddito fondiario 50% IRPEF" se immobile non locato stesso comune
- Info per dichiarazione redditi

### 6.18 Coniugi con Doppia Abitazione Principale - Dettagli

**Fonte:** Corte Cost. 209/2022; Cass. 9620/2025; Cass. 34813/2022

**Casistiche chiarite:**

| Situazione | Esenzione |
|------------|-----------|
| Coniugi in due abitazioni **stesso comune** | ✅ Entrambi esenti |
| Coniugi in due abitazioni **comuni diversi** | ✅ Entrambi esenti |
| Unità **contigue** formanti unica abitazione | ✅ Esenti (Cass. 34813/2022) |
| Coniugi proprietari esclusivi unità adiacenti | ✅ Entrambi esenti (CTR Lombardia 894/2024) |

**Art. 5-decies D.L. 146/2021:** Dichiarato **incostituzionale**

**Funzionalità:**
- Rimozione limitazione "un solo immobile per nucleo"
- Gestione immobili contigui
- Alert informativo post Corte Cost. 209/2022

### 6.19 CD/IAP Pensionati (Art. 78-bis L. 126/2020)

**Fonte:** Art. 78-bis L. 13 ottobre 2020, n. 126 (D.L. Agosto)

**Novità:**
Si considerano **coltivatori diretti e IAP** anche i **pensionati** che:
- Continuano a svolgere attività in agricoltura
- Mantengono l'iscrizione nella gestione previdenziale agricola

**Effetto:** Beneficiano delle agevolazioni IMU per terreni agricoli (esenzione)

**Funzionalità:**
- Flag "Pensionato con attività agricola"
- Verifica mantenimento iscrizione previdenza agricola
- Applicazione esenzione terreni

### 6.20 Contitolarità Terreni dal 2020 - Esenzione Individuale

**Fonte:** Art. 1, comma 743, L. n. 160/2019; Ris. MEF 2/DF del 10 marzo 2020

**Regola dal 01/01/2020:**
In caso di **contitolarità** di terreni:
- L'esenzione CD/IAP spetta **solo al contitolare con requisiti**
- Non si estende più agli altri comproprietari
- Ogni soggetto ha **autonoma obbligazione tributaria**

**Prima del 2020:** L'agevolazione si estendeva a tutti i comproprietari

**ECCEZIONE IMPORTANTE (Ris. MEF 2/DF 2020):**
Per le **aree fabbricabili con utilizzo agro-silvo-pastorale** da CD/IAP:
- La *fictio iuris* di non edificabilità ha carattere **OGGETTIVO**
- Si estende a **TUTTI i comproprietari** (anche senza qualifica CD/IAP)
- Cass. 15566/2010: "la destinazione del fondo a scopo agricolo integra una situazione incompatibile con lo sfruttamento edilizio"

**Funzionalità:**
- Gestione quote possesso per terreni agricoli
- Verifica requisiti CD/IAP per singola quota
- Calcolo IMU separato per contitolari senza requisiti
- **Flag "Area fabbricabile con utilizzo agro-silvo-pastorale"** → esenzione a tutti

### 6.21 Fabbricati in Corso di Costruzione/Ristrutturazione

**Fonte:** Art. 1, comma 746, L. 160/2019

**Regola:**
Per fabbricati in corso di:
- costruzione
- ricostruzione (previa demolizione)
- recupero edilizio (restauro, ristrutturazione edilizia/urbanistica)

**L'IMU si applica sull'area fabbricabile**, non sul fabbricato in corso d'opera.

**Durata:** Fino a ultimazione lavori o utilizzo (se anteriore)

**Eccezione:** Manutenzione ordinaria/straordinaria → IMU sul fabbricato

**Funzionalità:**
- Flag "In costruzione/ristrutturazione"
- Campo data inizio lavori, data fine prevista
- Calcolo IMU su valore area

### 6.22 Soggetti Passivi - Casi Particolari (Art. 1 c. 768 L. 160/2019)

**Fonte:** Art. 1, comma 768, L. 160/2019; Circ. MEF 1/DF 2020

**Casi speciali di soggettività passiva:**

| Fattispecie | Soggetto passivo/obbligato | Note |
|-------------|---------------------------|------|
| **Fallimento/liquidazione coatta** | Curatore fallimentare / Commissario liquidatore | Versamento entro 3 mesi dal decreto di trasferimento |
| **Multiproprietà (proprietà turnaria)** | Amministratore della multiproprietà | Se azionaria: società proprietaria |
| **Parti comuni condominiali** | Amministratore di condominio | Per beni comuni censibili accatastati autonomamente |
| **Cooperative prop. divisa** | Cooperativa | Fino alla data di assegnazione al socio |
| **Cooperative prop. indivisa** | Sempre la cooperativa | - |
| **ATER/IACP con patto riscatto** | NON l'assegnatario | Soggetto passivo resta l'ente |
| **Immobili in eredità** | Eredi | Pro quota |
| **Coniuge superstite** | Coniuge superstite | Unico soggetto passivo (art. 540 c.c.) |
| **Immobili in leasing** | Locatario | Dalla stipula alla risoluzione formale |
| **Misure conservative giudiziarie** | Custode/amministratore giudiziario | Se disposto dal giudice |

**Funzionalità app:**
- Tipologia soggetto con casi particolari
- Gestione fallimento con data decreto trasferimento
- Gestione multiproprietà/condominio
- Alert scadenza versamento 3 mesi (fallimento)

### 6.26 Deducibilità IMU Immobili Strumentali

**Fonte:** Art. 1, cc. 772-773, L. 160/2019; Circ. Agenzia Entrate 10/E del 14/5/2014

**Evoluzione storica deducibilità:**

| Periodo | Percentuale Deducibile |
|---------|------------------------|
| 2012 | 0% (Corte Cost.: incostituzionale) |
| 2013 | 30% |
| 2014-2018 | 20% |
| 2019 | 50% |
| 2020-2021 | 60% |
| **Dal 2022** | **100%** |

**Immobili ammessi:**
- Immobili strumentali **per natura** (non suscettibili di diversa destinazione)
- Immobili strumentali **per destinazione** (utilizzo effettivo)
- Per lavoratori autonomi: solo se uso **esclusivo** per attività

**Immobili esclusi:**
- Fabbricati uso promiscuo (Circ. 10/E/2014)
- Immobili patrimonio
- Immobili merce (beni destinati alla vendita)

**Note operative:**
- Deduzione per **cassa** (anno del pagamento, non competenza)
- Si deduce l'IMU **effettivamente versata**
- Interessi e sanzioni **non deducibili**
- **Indeducibile da IRAP** (espressa previsione c. 772)
- Si applica anche a IMI (Bolzano) e IMIS (Trento)

**Funzionalità app:**
- Alert per contribuenti con immobili strumentali
- Info per dichiarazione redditi (deduzione integrale)

### 6.27 Valutazione Aree Fabbricabili - Parametri Obbligatori (Cass. 27067/2024)

**Fonte:** Cass. 18/10/2024 n. 27067; art. 5, c. 5, D.Lgs. 504/1992

**Principio:** Il valore venale delle aree fabbricabili deve essere determinato in base ai **parametri tassativi** previsti dalla legge:

1. **Zona territoriale** di ubicazione
2. **Indice di edificabilità**
3. **Destinazione d'uso** consentita
4. **Oneri** per eventuali lavori di adattamento del terreno
5. **Prezzi medi** di mercato per aree analoghe

**Giurisprudenza conforme:** Cass. 9529/2023; Cass. 11445/2018

**Funzionalità app:**
- Checklist parametri per valutazione aree
- Campo note per documentazione valore dichiarato
- Alert se valore < valore comunale predeterminato

### 6.28 Esenzioni IMU per Eventi Sismici

**Fonte:** Art. 1, c. 422, L. 213/2023 (Bilancio 2024); D.L. 189/2016

**Esenzioni prorogate per sisma 2016-2017 (Italia Centrale):**
- Fabbricati distrutti o inagibili (ordinanza sindacale di sgombero entro 31/12/2018)
- Esenzione IMU dal 16/12/2016 fino a ricostruzione/agibilità, **max 31/12/2024**
- Esenzione IRPEF/IRES sui redditi dei fabbricati fino a ricostruzione, **max anno 2023**
- Esenzione imposta di bollo e registro fino al **31/12/2024**

**Regioni interessate:**
- Abruzzo (Allegati 1, 2, 2-bis D.L. 189/2016)
- Lazio (Allegati 1, 2)
- Marche (Allegati 1, 2)
- Umbria (Allegati 1, 2)

**Esenzione sisma Umbertide 9/3/2023 (art. 1, c. 560, L. 213/2023):**
- Fabbricati abitativi distrutti o con ordinanza di sgombero
- Esenzione per anno 2024 o fino a ricostruzione/agibilità

**Funzionalità app:**
- Flag "Immobile zona sismica" con selezione evento
- Verifica comune in allegati D.L. 189/2016
- Calcolo automatico esenzione per periodo

### 6.29 ILIA - Imposta Locale Immobiliare Autonoma (Friuli Venezia Giulia)

**Fonte:** Art. 1, c. 528, L. 213/2023; L.R. FVG 17/2022

**Ambito:** Regione Friuli Venezia Giulia (dal 2023)

**Caratteristiche:**
- ILIA **sostituisce** IMU e IRPEF/addizionali per redditi fondiari di immobili non locati
- Disciplina analoga a IMU nazionale (art. 8, c. 1, D.Lgs. 23/2011)
- Deducibilità IMU strumentali si applica anche a ILIA

**Funzionalità app:**
- Rilevamento automatico comune FVG → calcolo ILIA invece di IMU
- Alert specifico per contribuenti FVG

### 6.30 Mappatura Checklist → Campi App (Riferimento UI/UX)

**Fonte:** Check List Acconto IMU 2025 (Wolters Kluwer OneFiscale)

Questa mappatura definisce la corrispondenza tra le voci della checklist professionale e i campi dell'applicazione, utile per la progettazione del wizard di inserimento dati.

#### Step 1: Dati Immobile

| Checklist | Campo App | Tipo | Obbligatorio |
|-----------|-----------|------|--------------|
| Tipo di immobile | `tipoImmobile` | Select | ✅ |
| Percentuale di possesso | `percentualePossesso` | Number (0-100) | ✅ |
| Mesi di possesso | `mesiPossesso` | Number (1-12) | ✅ |
| Immobile cat. D privo di rendita | `gruppoD_noRendita` | Boolean | Se cat. D |
| Imbullonati | `verificaImbullonati` | Boolean | Se cat. D |

#### Step 2: Abitazione Principale

| Checklist | Campo App | Tipo | Obbligatorio |
|-----------|-----------|------|--------------|
| Categoria lusso (A/1, A/8, A/9) | `categoriaLusso` | Boolean | Se abit. princ. |
| Pertinenze | `pertinenze[]` | Array | Opzionale |
| Coniugi residenza diversa | `coniugiResidenzaDiversa` | Boolean | Opzionale |
| Assimilazione | `tipoAssimilazione` | Select | Se applicabile |

#### Step 3: Riduzioni e Agevolazioni

| Checklist | Campo App | Tipo | Obbligatorio |
|-----------|-----------|------|--------------|
| Comodato genitori/figli | `comodatoParenti` | Boolean | Opzionale |
| Canone concordato | `canoneLocazione` | Select | Se locato |
| Interesse storico/artistico | `interesseStorico` | Boolean | Opzionale |
| Inagibile/inabitabile | `inagibile` | Boolean | Opzionale |
| Occupato abusivamente | `occupatoAbusivamente` | Boolean | Opzionale |

#### Step 4: Terreni (se applicabile)

| Checklist | Campo App | Tipo | Obbligatorio |
|-----------|-----------|------|--------------|
| CD/IAP | `coltivatoreDiretto` | Boolean | Se terreno |
| Isole minori | `isolaMinore` | Boolean (auto) | Auto da comune |
| Proprietà collettiva | `proprietaCollettiva` | Boolean | Se terreno |
| Comune montano (Circ. 9/1993) | `comuneMontano` | Select (auto) | Auto da comune |

#### Step 5: Aliquote e Versamento

| Checklist | Campo App | Tipo | Obbligatorio |
|-----------|-----------|------|--------------|
| Aliquota applicata | `aliquota` | Number | ✅ |
| Comune | `codiceComune` | Select | ✅ |
| Anno imposta | `annoImposta` | Number | ✅ |
| Importo minimo | `importoMinimo` | Number | Default 12 |

#### Validazioni da Implementare

1. **Pertinenze**: Max 3 (una per categoria C/2, C/6, C/7)
2. **Comodato**: Verifica requisiti (stesso comune, unico immobile, contratto registrato)
3. **Canone concordato**: Riduzione 75% automatica
4. **CD/IAP**: Esenzione totale terreni
5. **Categoria lusso**: Detrazione €200 applicabile

### 6.23 Sintesi Nuove Funzionalità vs Excel 2022

| Funzionalità | Excel 2022 | App 2025 | Priorità |
|--------------|------------|----------|----------|
| Occupazione abusiva | ❌ | ✅ Esenzione | Alta |
| Abitazione princ. coniugi separati | ❌ Nucleo fam. | ✅ Solo possessore | Alta |
| Casa familiare coppie non sposate | ❌ | ✅ | Media |
| Pertinenze fiscali (graffatura) | ❌ Civilistiche | ✅ Fiscali | Media |
| Leasing (fine contratto) | ❌ | ✅ | Media |
| IACP vs Alloggi sociali | ❌ Confusi | ✅ Distinti | Media |
| Terreni isole minori | ❌ | ✅ Esenti | Bassa |
| Terreni proprietà collettiva | ❌ | ✅ Esenti | Bassa |
| Esenzioni cat. E/1-E/9 | ❌ | ✅ Automatiche | Bassa |
| Pensionati esteri 50% | ❌ | ✅ | Media |
| Alert dichiarazione | ❌ | ✅ | Bassa |
| Importo minimo €12 | ❌ | ✅ | Bassa |
| Prospetto aliquote obbligatorio | ❌ | ✅ Integrazione | Media |
| ENC regime 3 rate | ❌ | ✅ | Bassa |
| ENC attività sportive | ❌ | ✅ Semplificato | Bassa |
| Trust/Trustee soggetto passivo | ❌ | ✅ | Bassa |
| IMU/IRPEF 50% stesso comune | ❌ | ✅ Alert | Media |
| Immobili contigui coniugi | ❌ | ✅ | Media |
| CD/IAP pensionati | ❌ | ✅ | Media |
| Contitolarità terreni individuale | ❌ | ✅ | Media |
| Fabbricati in costruzione | ❌ | ✅ Area fabbricabile | Media |
| Soggetti passivi casi particolari | ❌ | ✅ Fallimento/multiproprietà/condominio | Bassa |
| Adempimenti completi (scadenze/sanzioni) | ❌ Parziale | ✅ Completo | Alta |
| **Società di persone NO agevolazioni** | ❌ | ✅ Alert automatico | Media |
| **Termini decadenza accertamento** | ❌ | ✅ Calcolo automatico | Media |
| **Cumulo sanzioni pluriennali** | ❌ | ✅ Info regime continuazione | Bassa |
| **Deducibilità IMU 100%** | ❌ | ✅ Info dichiarazione redditi | Media |
| **Valutazione aree (parametri obbligatori)** | ❌ | ✅ Checklist + alert | Media |
| **Coefficienti Gruppo D non catastati** | ❌ | ✅ Tabella completa 2025 | Bassa |
| **Esenzioni sisma 2016-2017** | ❌ | ✅ Flag + verifica comune | Bassa |
| **ILIA Friuli VG** | ❌ | ✅ Rilevamento automatico | Bassa |
| **ENC comodato collegato** | ❌ | ✅ Interpretazione L. 213/2023 | Bassa |
| **Proroga termini weekend** | ❌ | ✅ Calcolo automatico | Bassa |
| **Checklist professionale integrata** | ❌ | ✅ Mappatura UI/UX | Alta |

### 6.24 Adempimenti IMU - Scadenze e Sanzioni

**Fonte:** Art. 1, cc. 762-769, L. 160/2019; Decreto 24 aprile 2024

#### Scadenze versamento

| Scadenza | Adempimento | Note |
|----------|-------------|------|
| **16 giugno** | Versamento acconto (I rata) | Calcolato su aliquote anno precedente |
| **16 dicembre** | Versamento saldo (II rata) | Calcolato su aliquote pubblicate entro 28/10 |
| 16 giugno | Unica soluzione (facoltativa) | Importo annuo intero |

**Non residenti:** Possono versare in unica soluzione entro 16/12 con interessi **3%** sulla I rata.

**Versamento:** Non rateizzabile. Modalità: F24, bollettino postale, PagoPA.

#### Scadenze dichiarazione

| Scadenza | Adempimento | Note |
|----------|-------------|------|
| **30 giugno** anno successivo | Dichiarazione IMU ordinaria | Solo se variazioni rilevanti |
| **30 giugno** anno successivo | Dichiarazione IMU ENC | **Annuale obbligatoria** |
| 29 settembre | Dichiarazione tardiva (+90gg) | Sanzione ridotta 1/10 |

**Occupazione abusiva:** Dichiarazione **solo telematica** (art. 1, c. 759, lett. g-bis).

#### Quando è obbligatoria la dichiarazione

**Fonte:** Art. 1, c. 769, L. 160/2019; D.M. 24/4/2024; Circ. MEF 1/DF/2020

**Obbligo sussiste per:**
- Immobili che godono di **riduzioni** dell'imposta
- Immobili per cui il comune **non ha le informazioni** necessarie
- **Variazioni di soggettività passiva** (sia chi cessa sia chi inizia)

**Efficacia pluriennale:** La dichiarazione ha effetto anche per gli anni successivi, fino a nuova variazione.

#### Esonero dalla dichiarazione (casi in cui NON è dovuta)

| Caso | Motivazione | Riferimento |
|------|-------------|-------------|
| Atti con MUI | Informazioni acquisite tramite Modello Unico Informatico (notai) | Art. 1, c. 769 |
| Regolamento comunale | Procedure specifiche previste dal comune per agevolazioni | Regolamento locale |

**MUI (Modello Unico Informatico):** Per compravendite, donazioni, successioni gestite tramite notaio con procedure telematiche, il comune acquisisce automaticamente i dati - nessuna dichiarazione necessaria.

#### Modalità di presentazione dichiarazione

| Modalità | Descrizione | Note |
|----------|-------------|------|
| **Cartacea** - consegna | Direttamente al comune (rilascio ricevuta) | |
| **Cartacea** - posta | Raccomandata senza A/R con dicitura "Dichiarazione IMU IMPi" | Data = consegna ufficio postale |
| **PEC** | Posta elettronica certificata | |
| **Telematica** | Fisconline / Entratel (diretto o tramite intermediario) | Obbligatoria per occupazione abusiva |

**Intermediari abilitati:** Art. 3, c. 3, D.P.R. 322/1998 (commercialisti, CAF, etc.).

#### Tipologie di dichiarazione (D.M. 24/04/2024)

| Tipo | Utilizzo |
|------|----------|
| **Nuova** | Prima dichiarazione per l'immobile |
| **Sostitutiva** | Sostituisce integralmente una precedente |
| **Multipla** | Per più immobili nello stesso comune |

**Immobile su più comuni:** Dichiarazione al comune con **superficie prevalente** dell'immobile.

**Variazione circoscrizioni territoriali:** Dichiarazione al comune dove l'immobile risulta ubicato al **1° gennaio** dell'anno d'imposta.

#### Modelli dichiarativi vigenti (D.M. 24/04/2024)

**Fonte:** D.M. MEF 24/04/2024 (Id: 19253) - Testo completo in `decreto_mef_24042024_dichiarazione_imu.md`

| Modello | Destinatari | Sostituisce | Modalità |
|---------|-------------|-------------|----------|
| **IMU/IMPi** | Tutti i soggetti passivi | D.M. 29/07/2022 | Cartacea o telematica |
| **IMU ENC** | Enti non commerciali (art. 1, c. 759, lett. g) | D.M. 4/05/2023 | **Solo telematica** |

**IMU ENC (art. 7 D.M.):**
- Deve essere utilizzato per **tutti gli immobili posseduti** (non solo quelli con attività meritevoli)
- Presentazione **esclusivamente telematica** (Fisconline/Entratel)
- Dichiarazione **annuale** (non pluriennale come IMU/IMPi)

#### Dichiarazione IMU ENC - Approfondimento

**Fonte:** `IMU_ENC_Istr_24-Definitivo.md` - Istruzioni per la compilazione D.M. 18/07/2024

**Soggetti obbligati:** Enti non commerciali ex art. 73, c. 1, lett. c) TUIR (enti pubblici e privati diversi dalle società che non hanno per oggetto esclusivo o principale l'esercizio di attività commerciale).

**Obbligo dichiarazione ANNUALE:** A differenza del modello IMU/IMPi (efficacia pluriennale), la dichiarazione ENC **deve essere presentata ogni anno** (art. 1, c. 770, L. 160/2019) perché i parametri per determinare il rapporto proporzionale variano di anno in anno.

**Struttura modello - 4 Quadri:**

| Quadro | Contenuto | Note |
|--------|-----------|------|
| **A** | Immobili e relative utilizzazioni | Sempre da compilare, anche se totalmente esenti |
| **B** | Rapporto proporzionale (utilizzo misto) | Solo se colonna 12 Quadro A barrata |
| **C** | IMU dovuta per comune | Riepilogo versamenti |
| **D** | Sottoscrizione dichiarazione | Firma rappresentante legale |

**Quadro A - Colonne utilizzazione (11-17):**

| Col. | Descrizione | Conseguenza |
|------|-------------|-------------|
| **11** | Attività meritevoli solo modalità NON commerciali | Totalmente esente |
| **12** | Utilizzo misto (commerciale + non commerciale) | Compilare Quadro B |
| **13** | Attività NON meritevoli | Totalmente imponibile |
| **14** | Occupazione abusiva (art. 1, c. 759, lett. g-bis) | Esente con denuncia |
| **15** | Non utilizzabile né disponibile (denuncia ex artt. 614 c.2 / 633 c.p.) | Esente (allegare denuncia) |
| **16** | Comodato a ENC collegato (art. 1, c. 71, lett. a, L. 213/2023) | Verifica collegamento |
| **17** | Strumentale senza esercizio attuale (art. 1, c. 71, lett. b, L. 213/2023) | Esente se strumentalità |

**Codici attività (Quadro A, col. 19):**

| Codice | Attività meritevole |
|--------|---------------------|
| 1 | Assistenziale |
| 2 | Previdenziale |
| 3 | Sanitaria |
| 4 | Ricerca scientifica |
| 5 | Didattica |
| 6 | Ricettiva |
| 7 | Culturale |
| 8 | Ricreativa |
| 9 | Sportiva |
| 10 | Religione e culto |
| 11 | Altre attività (non meritevoli) |

**Rapporto proporzionale (Quadro B) - Art. 5 Reg. 200/2012:**

| Criterio | Quando si applica | Formula |
|----------|-------------------|---------|
| **Spazio** (Sez. I) | Utilizzo promiscuo di parti immobile | mq non commerciale / mq totali × 100 |
| **Tempo** (Sez. II) | Utilizzo temporaneo | giorni non comm. / giorni totali × 100 |
| **Soggetti** (Sez. III) | Modalità non riconducibili artt. 3-4 | n. soggetti non comm. / n. totale × 100 |
| **Miste** (Sez. IV) | Pluralità di attività | (spazio × tempo) / 100 |

**Requisiti generali non commercialità (art. 3 Reg. 200/2012):**
- **a)** Divieto distribuzione utili/avanzi gestione (salvo eccezioni per legge)
- **b)** Obbligo reinvestire utili per sviluppo attività solidarietà sociale
- **c)** Obbligo devoluzione patrimonio a ENC analogo in caso di scioglimento

**Requisiti di settore (art. 4 Reg. 200/2012):**

| Attività | Requisiti specifici |
|----------|---------------------|
| Assistenziali/Sanitarie | Accreditate/contrattualizzate OPPURE gratuite/corrispettivo simbolico (<50% mercato) |
| Didattiche | Paritarie + non discriminazione + obblighi handicap + CCNL + standard strutture + pubblicità bilancio + gratuità/simbolico |
| Ricettive | Accessibilità limitata a destinatari propri + discontinuità apertura (NO strutture alberghiere/paralberghiere) |
| Culturali/Ricreative | Gratuite o corrispettivo simbolico (<50% mercato) |
| Sportive | Discipline CONI, associazioni affiliate FSN/EPS, attività agonistica organizzata (NO mera messa a disposizione) |
| Ricerca scientifica | Interesse collettivo, contributo alla conoscenza, pubblicazione risultati |

**Interpretazione autentica (art. 1, c. 71, L. 213/2023):**

| Concetto | Interpretazione |
|----------|-----------------|
| **"Posseduti"** (lett. a) | Include comodato a ENC funzionalmente/strutturalmente collegato (Cass. 27761/2023) |
| **"Utilizzati"** (lett. b) | Strumentali anche senza esercizio attuale (se non cessazione definitiva strumentalità) |

**Collegamento funzionale:** Attività comodatario accessorie/integrative rispetto ad attività istituzionali comodante (es. università + ESU per diritto allo studio).

**Collegamento strutturale:** Comodatario appartiene alla stessa struttura del concedente ("compenetrazione").

**Monitoraggio UE - Concluso:**
- CGUE C-261/23 P del 5/9/2024: annullata decisione Commissione 2055/2016
- Obbligo recupero ICI 2006-2011 decaduto
- Procedura infrazione 2014/4202 chiusa
- **Nuovo modello senza prospetto Monitoraggio UE**

**Versamento IMU ENC:**

| Scadenza | Rata |
|----------|------|
| **16 giugno** | Acconto (aliquote anno precedente) |
| **16 dicembre** | Saldo a conguaglio |

**Codici tributo F24:** Identici a IMU ordinaria (3912, 3913, 3914, 3916, 3918, 3925, 3930).

#### Specifiche tecniche trasmissione telematica IMU ENC

**Fonte:** `2024_ENC_SpecificheTecniche_2024.04.24.md`

**Struttura record:** 1.900 caratteri fissi per record, limite fornitura **3 MB compressi** (come IMU/IMPi).

**Tipi record:**

| Tipo | Contenuto | Note |
|------|-----------|------|
| **A** | Testa fornitura | Dati fornitore, tipologia dichiarazione |
| **B** | Frontespizio | Dati contribuente, rappresentante, comune |
| **C** | Quadro A | **2 immobili** per record (totalmente imponibili/esenti) |
| **D** | Quadro B | **1 immobile** per record (parzialmente imponibili/esenti) |
| **E** | Quadri C + D | Determinazione IMU, compensazioni |
| **Z** | Coda fornitura | Riepilogo record |

**Regola dichiarazione per comune:** Una singola dichiarazione deve riferirsi a immobili di un **singolo comune**. Tante dichiarazioni quanti sono i comuni.

**Tipologia dichiarazione (Record A, campo 6):**

| Codice | Tipo | Controllo |
|--------|------|-----------|
| **N** | Nuova | Scarto se esiste già per anno/comune/CF |
| **S** | Sostitutiva | Scarto se NON esiste precedente |
| **M** | Multipla | Per invii successivi al primo (dimensione > 3MB) |

**Codici caratteristiche immobile (Record C/D, campo 9/19):**

| Codice | Descrizione |
|--------|-------------|
| 1 | Terreno |
| 2 | Area fabbricabile |
| 3 | Fabbricato - valore da rendita catastale |
| 4 | Fabbricato gruppo D - valore da scritture contabili |

**Codici riduzioni ENC (Record C, campo 24):**

| Codice | Riduzione |
|--------|-----------|
| 0 | Nessuna riduzione |
| 1 | Immobile storico/artistico |
| 2 | Immobile inagibile/inabitabile |
| 3 | Altre riduzioni |

**Codici esenzioni ENC - Quadro A (Record C, campo 25):**

| Codice | Esenzione |
|--------|-----------|
| 0 | Nessuna esenzione |
| 1 | Immobili non utilizzabili né disponibili (occupazione abusiva) |
| 2 | Esenzione quadro temporaneo Aiuti di Stato |
| 3 | Altre esenzioni |

**Tipologia attività svolta - Quadro B (Record D, campi 9-18):**

| Campo | Attività | Checkbox |
|-------|----------|----------|
| 9 | Assistenziali | CB |
| 10 | Previdenziali | CB |
| 11 | Sanitarie | CB |
| 12 | Didattiche | CB |
| 13 | Ricettive | CB |
| 14 | Culturali | CB |
| 15 | Ricreative | CB |
| 16 | Sportive | CB |
| 17 | Religione e culto | CB |
| 18 | Ricerca scientifica | CB |

**Comodato/Immobili strutturali (Record D, campo 44):**

| Codice | Tipo |
|--------|------|
| 1 | Comodato (art. 1, c. 71, lett. a, L. 213/2023) |
| 2 | Immobili strumentali (art. 1, c. 71, lett. b, L. 213/2023) |

**Calcolo attività didattica (Record D, campi 46-67):**

| Variabile | Descrizione |
|-----------|-------------|
| **Cm** | Corrispettivo medio percepito dall'ENC |
| **Cms** | Costo medio studente (pubblicato dal Ministero) |
| Se Cm < Cms | Esenzione totale attività didattica |
| Se Cm ≥ Cms | Valore imponibile = Valore × (1 - Cms/Cm) |

**Calcolo altre attività (Record D, campi 68-82):**

| Variabile | Descrizione |
|-----------|-------------|
| **Cenc** | Corrispettivo medio percepito dall'ENC |
| **Cm** | Corrispettivo medio mercato stesso ambito territoriale |
| Criterio | Simbolicità se < 50% del corrispettivo medio mercato |

**Importi in centesimi:** Campi Cm, Cms, Cenc e valori attività didattica/altre attività sono espressi in **centesimi senza virgola** (es. €100,00 = 10000).

**Codice carica dichiarante ENC (Record B, campo 25):**

| Codice | Descrizione |
|--------|-------------|
| 1 | Rappresentante legale, negoziale o di fatto |
| 2 | Rappresentante minore/inabilitato/interdetto, curatore, amministratore sostegno |
| 3 | Curatore fallimentare / liquidazione giudiziale |
| 4 | Commissario liquidatore |
| 5 | Custode giudiziario, commissario giudiziale |
| 6 | Rappresentante fiscale non residente |
| 7 | Erede |
| 8 | Liquidatore (volontaria) |
| 9 | Soggetto per operazioni straordinarie |
| 10 | Tutore minore/interdetto (funzione istituzionale) |
| 11 | Liquidatore ditta individuale (ante liquidazione) |
| 12 | Amministratore di condominio |

**Novità D.M. 24/04/2024 rispetto a D.M. 29/07/2022:**

| Novità | Riferimento | Dettaglio |
|--------|-------------|-----------|
| **Occupazione abusiva** | Art. 1, c. 759, lett. g-bis, L. 160/2019 | Esenzione per immobili con denuncia ex artt. 614 c.2 o 633 c.p. - **obbligo telematico** |
| **Interpretazione ENC** | Art. 1, c. 71, L. 213/2023 | "Posseduti" include comodato a ente collegato; "utilizzati" anche senza esercizio attuale |

**Trattamento dati (art. 9 D.M.):**
- **Titolare trattamento:** MEF (acquisizione, trasmissione, conservazione, messa a disposizione)
- **Comuni:** Titolari dal momento della disponibilità della dichiarazione
- **Responsabile:** Sogei S.p.A. (gestione sistema informativo)
- **Base giuridica:** Art. 1, cc. 769-770, L. 160/2019; Reg. UE 2016/679 art. 6

#### Dichiarazione obbligatoria a pena di decadenza

**Fonte:** Art. 1, c. 769, L. 160/2019; Cass. 37385/2022; Cass. 32115/2024

> ⚠️ **IMPORTANTE:** Il mancato adempimento dell'obbligo dichiarativo determina **decadenza dal beneficio** (Cass. 37385/2022).

| Fattispecie | Riferimento | Note |
|-------------|-------------|------|
| **Alloggi sociali** adibiti ad abitazione principale | Art. 1, c. 741, lett. c), n. 3 | Assimilazione ex lege |
| **Forze Armate/Polizia/VV.FF.** - immobile senza dimora e residenza | Art. 1, c. 741, lett. c), n. 5 | Non richiesti requisiti ordinari |
| **Beni-merce** - fabbricati destinati vendita impresa costruttrice | Art. 1, c. 751, terzo periodo | Esenzione dal 2022 |

**Beni-merce (Cass. 32115/2024):** L'art. 1, c. 769, L. 160/2019 non ha abrogato l'art. 2, c. 5-bis, D.L. 102/2013; l'esenzione è subordinata alla dichiarazione **a pena di decadenza**.

#### Casistiche obbligo dichiarativo (Istruzioni D.M. 24/04/2024)

**Fonte:** `IMU_IMPi_Istruzioni_2024_Definitivo-24.04.2024.md`

**Principio generale:** Obbligo dichiarativo sorge quando:
1. Variazioni rispetto a dichiarazioni già presentate
2. Variazioni non conoscibili dal comune

**A) Immobili con RIDUZIONI:**

| Fattispecie | Riduzione | Obbligo |
|-------------|-----------|---------|
| Storico/artistico (art. 10 D.Lgs. 42/2004) | 50% base | Acquisto **e** perdita |
| Inagibile/inabitabile + non utilizzato | 50% base | Solo **perdita** diritto |
| Comodato parenti 1° grado (contratto registrato) | 50% base | Sempre |
| Pensionati esteri AIRE | 50% (37.5% nel 2022) | Sempre |
| **Canone concordato L. 431/1998** | 75% imposta | **NO obbligo** (info disponibile via Puntofisco) |

**B) Comune NON in possesso informazioni:**

| Fattispecie | Note |
|-------------|------|
| Locazione finanziaria (leasing) | Soggetto passivo = locatario dalla stipula |
| Concessione aree demaniali | Soggetto passivo = concessionario |
| Aree fabbricabili | Valore non in banca dati catastale |
| Terreno agricolo → area fabbricabile | Variazione destinazione |
| Demolizione fabbricato → area edificabile | Fino ultimazione/utilizzo |
| Cooperativa edilizia a proprietà indivisa | Assegnazione socio / variazione destinazione |
| IACP/Enti edilizia residenziale | Concessione in locazione |
| Fabbricati usi culturali (art. 5-bis DPR 601/73) | Esenzione |
| Terreni CD/IAP | Esenzione (anche aree fabbricabili coltivate) |
| Acquisto/perdita esenzione | Variazione status |
| Fabbricati gruppo D non catastati | Valore da scritture contabili |
| Riunione usufrutto non dichiarata | Non risulta in catasto |
| Estinzione diritto (abitazione, uso, enfiteusi, superficie) | Se non dichiarata/MUI |
| Parti comuni (art. 1117 n. 2 c.c.) | Bene comune censibile - dichiarazione amministratore |
| Multiproprietà (D.Lgs. 427/1998) | Dichiarazione amministratore |
| Fusione/incorporazione/scissione | Persone giuridiche |
| Acquisto/cessazione diritto reale per legge | Es. usufrutto legale genitori |

**C) Modalità presentazione:**

| Modalità | Dettaglio |
|----------|-----------|
| **Cartacea** | Consegna diretta (con ricevuta) / Raccomandata s.r.r. / PEC |
| **Telematica** | Fisconline / Entratel (diretto o tramite intermediario) |
| **Solo telematica** | Occupazione abusiva (art. 1, c. 759, lett. g-bis) |

**Termine:** 30 giugno anno successivo. Efficacia **pluriennale** (salvo variazioni).

#### Compilazione Quadro A - Campi per l'app

**Fonte:** Istruzioni D.M. 24/04/2024, pagg. 14-18

| Campo | Contenuto | Note app |
|-------|-----------|----------|
| **1** | Caratteristiche (1-7) | Già mappato in specifiche tecniche |
| **2** | Ubicazione | Via, civico, scala, piano, interno |
| **3-6** | Dati catastali | Sezione, foglio, particella, subalterno |
| **7** | Categoria/Qualità | Fabbricati: categoria; Terreni: qualità |
| **8** | Classe | Fabbricati o redditività terreni |
| **8a** | Tipo catasto | T=terreni, U=urbano |
| **11** | Valore | **Intero** (indipendente da quota possesso) |
| **12** | Quota possesso | Percentuale |
| **13** | Detrazione abitazione principale | Proporzionale al periodo |
| **13a** | Equiparazione | 1=alloggio sociale, 2=Forze Armate |
| **14** | Riduzioni | 0-5 (già mappato) |
| **15** | Esenzioni | 0-3 (già mappato) |
| **16/17** | Acquisto/Cessione | Barrare campo appropriato |
| **18** | Altro | Circostanze non contemplate |
| **20** | Data | Inizio/termine possesso o variazione |
| **21** | Inizio/Termine agevolazione | I=inizio, T=termine |
| **22-24** | Occupazione abusiva | Tipo, autorità, data denuncia |

**Regola compilazione multipla:** Se più vicende stesso immobile in date diverse → più quadri con stesso "Progressivo Immobile" ma numeri d'ordine crescenti.

#### Conservazione dati e termini accertamento

**Periodo conservazione:** Fino al **31 dicembre del 5° anno successivo** a quello in cui la dichiarazione deve essere presentata (art. 1, c. 161, L. 296/2006).

#### Sanzioni

| Violazione | Sanzione |
|------------|----------|
| Omessa dichiarazione | **100%-200%** tributo (min. €50) |
| Dichiarazione infedele | **50%-100%** maggiore imposta |
| Errori formali | **€50-€250** |
| Omesso/insufficiente versamento | **30%** tributo |

**Ravvedimento operoso:** Applicabile (riduzioni sanzioni in base ai tempi).

#### Cumulo sanzioni per violazioni pluriennali (Art. 12 D.Lgs. 472/1997)

**Fonte:** Cass. 11432/2022; Art. 12, c. 5, D.Lgs. n. 472/1997

**Principio:** In caso di omesso versamento ICI/IMU per più annualità successive con identici accertamenti, si applica il **regime della continuazione attenuata**:

| Tipo cumulo | Applicazione | Sanzione |
|-------------|--------------|----------|
| **Continuazione** (c. 5) | Violazioni stessa indole in periodi diversi | Sanzione base **aumentata da metà a triplo** |
| Concorso formale/materiale (c. 1) | Una azione viola più norme | Sanzione più grave **aumentata da 1/4 al doppio** |
| Progressione (c. 2) | Violazioni pregiudicanti liquidazione | Sanzione più grave aumentata |

**Caratteristiche regime continuazione:**
- **Obbligatorio** (non facoltativo per l'Ente)
- **Irrilevanza elemento psicologico** (non richiesta "medesima risoluzione")
- **Irrilevanza elemento temporale** (non limitata allo stesso periodo d'imposta)

#### Termini di decadenza accertamento (L. 296/2006, art. 1, c. 161)

**Fonte:** Cass. 16467/2022; L. 296/2006, art. 1, comma 161

**Regola generale:** Notifica avviso accertamento entro **31 dicembre del 5° anno successivo**.

**Dies a quo differenti:**

| Fattispecie | Dies a quo | Termine decadenza |
|-------------|------------|-------------------|
| Dichiarazione presentata + omesso versamento | Termine pagamento imposta | 31/12 del **5° anno** successivo all'anno d'imposta |
| Omessa dichiarazione | Termine presentazione dichiarazione | 31/12 del **5° anno** successivo = **6° anno** dall'anno d'imposta |

**Esempio pratico:**
- Anno d'imposta: **2019**
- Dichiarazione IMU da presentare entro: **30/6/2020**
- Termine decadenza omessa dichiarazione: **31/12/2025** (5° anno da 2020)
- Termine decadenza omesso versamento: **31/12/2024** (5° anno da 2019)

#### Funzionalità app

- Calendario scadenze con alert
- Calcolo ravvedimento operoso
- Generazione codici tributo F24
- Alert dichiarazione obbligatoria per fattispecie specifiche
- **Calcolo termine decadenza accertamento**
- **Info regime cumulo sanzioni per violazioni pluriennali**

#### Specifiche tecniche trasmissione telematica (D.M. 24/04/2024)

**Fonte:** `2024_IMU-IMPi_SpecificheTecniche_2024.04.24.md`

**Struttura file:**
- Record a lunghezza fissa: **1.900 caratteri**
- Limite dimensionale: **3 MB compressi**
- Tipi record: A (testa), B (frontespizio), C (contitolari), D (immobili IMU), E (IMPi), Z (coda)

**Tipologie dichiarazione (Record A, campo 6):**

| Codice | Tipo | Uso |
|--------|------|-----|
| **N** | Nuova | Prima dichiarazione per anno/comune/contribuente |
| **S** | Sostitutiva | Integrazione/rettifica (sostituisce integralmente) |
| **M** | Multipla | Invii frazionati (oltre 3 MB) |

**Codici Caratteristiche immobile (Record D, campo 9):**

| Codice | Tipologia | Mapping app |
|--------|-----------|-------------|
| **1** | Terreno | Terreni agricoli |
| **2** | Area fabbricabile | Aree edificabili |
| **3** | Fabbricato (valore da rendita) | Fabbricati ordinari |
| **4** | Fabbricato (valore da scritture contabili) | Gruppo D non catastati |
| **5** | Abitazione principale | Abitazione A/1, A/8, A/9 |
| **6** | Pertinenza | C/2, C/6, C/7 (max 1 per tipo) |
| **7** | Beni merce | Imprese costruttrici |

**Codici Equiparazione abitazione principale (Record D, campo 25):**

| Codice | Fattispecie |
|--------|-------------|
| **1** | Alloggio sociale |
| **2** | Alloggio di servizio (Forze Armate, Polizia, VV.FF.) |

**Codici Riduzioni (Record D, campo 26):**

| Codice | Riduzione | % |
|--------|-----------|---|
| **0** | Nessuna | - |
| **1** | Immobile storico/artistico | 50% |
| **2** | Inagibile/inabitabile | 50% |
| **3** | Comodato a parenti 1° grado | 50% |
| **4** | Pensionato estero (AIRE) | 50%/62,5% |
| **5** | Altre riduzioni | Variabile |

**Codici Esenzione (Record D, campo 27):**

| Codice | Esenzione |
|--------|-----------|
| **0** | Nessuna esenzione |
| **1** | Immobili occupati abusivamente (art. 614 c.2 / 633 c.p.) |
| **2** | Quadro temporaneo Aiuti di Stato |
| **3** | Altre esenzioni |

**Codici Carica dichiarante (Record B, campo 31):**

| Codice | Carica |
|--------|--------|
| **1** | Rappresentante legale / socio amministratore |
| **2** | Tutore minore/inabilitato/interdetto |
| **3** | Curatore fallimentare |
| **4** | Commissario liquidatore |
| **5** | Custode giudiziario |
| **6** | Rappresentante fiscale non residente |
| **7** | Erede |
| **8** | Liquidatore (volontaria) |
| **9** | Cessionario/incorporante/beneficiario |
| **10** | Tutore istituzionale |
| **11** | Liquidatore (ditta individuale ante liquidazione) |
| **12** | Amministratore condominio |

**Dati occupazione abusiva (Record D, campi 36-38):**

| Campo | Contenuto | Note |
|-------|-----------|------|
| Tipo (36) | 1 = art. 614 c.2 o 633 c.p.; 2 = altra denuncia | Obbligatorio se esenzione = 1 |
| Autorità (37) | Denominazione autorità giudiziaria | Obbligatorio se esenzione = 1 |
| Data (38) | Data denuncia/provvedimento (GGMMAAAA) | Obbligatorio se esenzione = 1 |

**Funzionalità app (aggiuntive):**
- Validazione input secondo formati specifiche (CF, date, percentuali)
- Generazione file telematico conforme a specifiche
- Mapping automatico campi app → record D

### 6.25 Società di Persone - Esclusione Agevolazioni Abitazione Principale

**Fonte:** Cass. 18554/2022; Cass. 23682/2019

**Principio:** Le agevolazioni IMU per l'abitazione principale (esenzione, aliquota ridotta, detrazione) **NON si applicano** agli immobili posseduti da **società di persone**, comprese le società semplici di mero godimento.

**Motivazione giuridica:**
- La società (anche semplice) è **soggetto autonomo** diverso dalle persone fisiche che la compongono
- Il socio è **mero detentore** dell'immobile, non soggetto passivo IMU
- Il possesso è in capo alla società (persona giuridica), non al socio (persona fisica)
- Le norme agevolative richiedono interpretazione **stretta** (art. 14 disp. gen.)

**Schema:**

| Soggetto | Posizione | Agevolazioni abitazione principale |
|----------|-----------|-----------------------------------|
| **Società di persone** | Soggetto passivo IMU | ❌ **NO** agevolazioni |
| **Socio** | Mero detentore/utilizzatore | ❌ **NO** - non è soggetto passivo |
| **Persona fisica** proprietaria | Soggetto passivo IMU | ✅ **SÌ** - se ricorrono requisiti |

**Art. 2248 c.c. non applicabile:** La disciplina sulla comunione non si applica, essendo la società un soggetto giuridico distinto.

**Funzionalità app:**
- Tipologia soggetto "Società di persone" (s.s., s.n.c., s.a.s.)
- Alert automatico: "Agevolazioni abitazione principale non applicabili"
- Calcolo IMU con aliquota ordinaria (non ridotta)

---

## 7. SPECIFICHE VALIDATE

### 7.1 Formule Confermate

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

### 7.2 Coefficienti Validati

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

### 7.3 Aliquote Base Validate

| Fattispecie | Aliquota Base | Fonte | Stato |
|-------------|---------------|-------|-------|
| Abitazione princ. | 0,50% | c. 748 | ✅ |
| Fabbricati rurali | 0,10% | c. 750 | ✅ |
| Terreni agricoli | 0,76% | c. 752 | ✅ |
| Gruppo D | 0,86% | c. 753 | ✅ |
| Altri fabbricati | 0,86% | c. 754 | ✅ |
| Aree fabbricabili | 0,86% | c. 754 | ✅ |

### 7.4 Esempi Pratici di Calcolo

#### Esempio 1: Appartamento A/2

```
DATI INPUT:
- Rendita catastale: € 1.000
- Categoria: A/2
- Aliquota comunale: 1,06%
- Possesso: 100%
- Mesi: 12

CALCOLO:
1. Rivalutazione:     1.000 × 1,05 = € 1.050
2. Base imponibile:   1.050 × 160 = € 168.000
3. IMU annua:         168.000 × 1,06% = € 1.780,80
4. Acconto (16/6):    € 890,40
5. Saldo (16/12):     € 890,40

CODICE TRIBUTO F24: 3918 (altri fabbricati - COMUNE)
```

#### Esempio 2: Fabbricato D/1 (con quota Stato)

```
DATI INPUT:
- Rendita catastale: € 5.000
- Categoria: D/1
- Aliquota comunale totale: 1,06%
- Possesso: 100%
- Mesi: 12

CALCOLO:
1. Rivalutazione:     5.000 × 1,05 = € 5.250
2. Base imponibile:   5.250 × 65 = € 341.250
3. Quota STATO:       341.250 × 0,76% = € 2.593,50 → Codice 3925
4. Quota COMUNE:      341.250 × 0,30% = € 1.023,75 → Codice 3930
   (dove 0,30% = 1,06% - 0,76%)
5. IMU totale:        € 3.617,25
```

#### Esempio 3: Immobile a Canone Concordato

```
DATI INPUT:
- Base imponibile: € 168.000
- Aliquota comunale: 1,06%
- Tipo contratto: Canone concordato (L. 431/1998)

CALCOLO CORRETTO:
Riduzione 25% si applica all'ALIQUOTA, non alla base:

IMU = 168.000 × (1,06% × 0,75)
IMU = 168.000 × 0,795%
IMU = € 1.335,60

⚠️ ERRORE COMUNE DA EVITARE:
NON fare: (168.000 × 0,75) × 1,06% = 126.000 × 1,06%
```

#### Esempio 4: Terreno Agricolo (non CD/IAP)

```
DATI INPUT:
- Reddito dominicale: € 500
- Aliquota comunale: 0,86%
- Possesso: 50%
- Mesi: 12

CALCOLO:
1. Rivalutazione:     500 × 1,25 = € 625
2. Base imponibile:   625 × 135 = € 84.375
3. Quota possesso:    84.375 × 50% = € 42.187,50
4. IMU annua:         42.187,50 × 0,86% = € 362,81

CODICE TRIBUTO F24: 3914 (terreni - COMUNE)

⚠️ Se CD/IAP: ESENTE (IMU = €0)
```

---

## 8. CHANGELOG

| Data | Modifica |
|------|----------|
| 2025-12-10 | Creazione documento |
| 2025-12-10 | Analisi completa Excel 2022 |
| 2025-12-10 | Confronto con dossier IMU 2025 |
| 2025-12-10 | Identificazione differenze critiche |
| 2025-12-10 | Integrazione guida calcolo IMU 2025 (soggetti passivi, regola mese, esempi) |
| 2025-12-10 | **Estrazione completa formule Excel** da file .xlsm (1556 formule) |
| 2025-12-10 | Documentazione formule per Terreni, Fabbricati rurali, Abitazione principale, Altri fabbricati, Aree fabbricabili |
| 2025-12-10 | Mappatura codici tributo F24 |
| 2025-12-10 | **Analisi normativa completa**: D.L. 201/2011 art. 13, D.Lgs. 23/2011 art. 9, D.Lgs. 504/1992 art. 7 |
| 2025-12-10 | **Analisi Circolare MEF 1/DF 2020** - chiarimenti applicativi |
| 2025-12-10 | Creazione markdown da PDF: art-1-comma-758, art-13, art-9, comma-639, D.Lgs. 504/92, Circ. MEF |
| 2025-12-10 | **Identificazione 13 nuove funzionalità** per l'app rispetto a Excel 2022 |
| 2025-12-10 | Aggiunta sezione 6 "Nuove Funzionalità App 2025" |
| 2025-12-10 | **Integrazione documenti FEDELE**: prospetto aliquote 2025, ENC 3 rate, attività sportive |
| 2025-12-10 | Aggiunta Cass. 18940/2025 (occupazione abusiva retroattiva) |
| 2025-12-10 | Aggiornate funzionalità totali: **16** (da 13) |
| 2025-12-10 | **Conversione PDF Approfondimenti**: coniugi, aree fabbricabili, fabbricati, pertinenze, terreni |
| 2025-12-10 | **Conversione PDF Casi particolari**: trust/trustee, immobili non locati IMU/IRPEF |
| 2025-12-10 | Aggiunta giurisprudenza: Cass. 34813/2022, CTR Lombardia 894/2024, Cass. 16550/2019, 15988/2020 |
| 2025-12-10 | Aggiunte funzionalità 6.16-6.21: Trust, IMU/IRPEF 50%, coniugi contigui, CD/IAP pensionati, contitolarità, fabbricati in costruzione |
| 2025-12-10 | Aggiornate funzionalità totali: **21** (da 16) |
| 2025-12-10 | **Conversione PDF base**: ambito applicazione, presupposto oggettivo, presupposto soggettivo |
| 2025-12-10 | Aggiunta sezione 6.22: Soggetti passivi casi particolari (fallimento, multiproprietà, condominio) |
| 2025-12-10 | Aggiornate funzionalità totali: **22** (da 21) |
| 2025-12-10 | **Conversione PDF Adempimenti**: dichiarazione IMU, dichiarazione ENC, versamento acconto, versamento saldo |
| 2025-12-10 | Aggiunta sezione 6.24: Adempimenti IMU (scadenze, sanzioni, ravvedimento) |
| 2025-12-10 | Aggiunto codice tributo 3939 (beni merce impresa costruttrice) |
| 2025-12-10 | Aggiornate funzionalità totali: **23** (da 22) |
| 2025-12-10 | **Conversione PDF Articoli operativi**: CGT Taranto 674/2023, Corte Cost. 60/2024, Cass. 1919/2025 |
| 2025-12-10 | Aggiunta giurisprudenza: Cass. 1919/2025 (fabbricati rurali D/10 - conta catasto) |
| 2025-12-10 | **Conversione 12 PDF Articoli operativi**: decreto semplificazioni, dichiarazione IMU 2021-2022, ENC, coniugi, stabilimenti balneari |
| 2025-12-10 | Aggiunta giurisprudenza: Cass. 35123/2022, 2747/2023, 7769/2023, 11443/2023, CGT Firenze 137/2023 |
| 2025-12-10 | **Conversione ultimi 9 PDF Articoli operativi**: ruralità D/10, coniugi comuni diversi, esenzioni sisma, nullità cartella, cumulo sanzioni |
| 2025-12-10 | Aggiunta sezione 6.25: Società di persone - Esclusione agevolazioni abitazione principale |
| 2025-12-10 | Aggiunta sezione Termini decadenza accertamento (5° vs 6° anno) e Cumulo sanzioni pluriennali |
| 2025-12-10 | Aggiunta giurisprudenza: Cass. 18554/2022, 23682/2019, 16467/2022, 11432/2022 |
| 2025-12-10 | Aggiornate funzionalità totali: **26** (da 23) |
| 2025-12-10 | **Conversione gruppo 1 (3 PDF)**: deducibilità IMU strumentali, Cass. 13793/2019 leasing |
| 2025-12-10 | **Conversione gruppo 2 (3 PDF)**: trustee soggetto passivo, deducibilità piena, Cass. 19166/2019 (⚠️ CONFLITTO con 13793/2019) |
| 2025-12-10 | **Conversione gruppo 3 (3 PDF)**: IMPI piattaforme marine, deducibilità 100% 2022, Ris. MEF 2/DF 2020 (fictio iuris aree fabbricabili) |
| 2025-12-10 | **Analisi documento "IMU – Base imponibile e aliquote"** (Wolters Kluwer OneFiscale) |
| 2025-12-10 | Aggiunta tabella coefficienti 2025 fabbricati Gruppo D non catastati (DM 14/3/2025) |
| 2025-12-10 | Aggiornata sezione Prospetto Aliquote con proroga art. 6 L. 108/2025 (deadline 15/9/2025) |
| 2025-12-10 | Aggiunta sezione 6.26: Deducibilità IMU 100% dal 2022 per immobili strumentali |
| 2025-12-10 | Aggiunta sezione 6.27: Valutazione aree fabbricabili - parametri obbligatori (Cass. 27067/2024) |
| 2025-12-10 | Aggiunta giurisprudenza: Cass. 27067/2024, 9529/2023, 11445/2018 (valutazione aree) |
| 2025-12-10 | Aggiornate funzionalità totali: **29** (da 26) |
| 2025-12-10 | **Analisi "Novità IMU Bilancio 2024"** (Pratica Fiscale e Professionale) |
| 2025-12-10 | Aggiunta interpretazione autentica ENC "posseduti/utilizzati" (art. 1, c. 71, L. 213/2023) |
| 2025-12-10 | Aggiunta proroga automatica termini pubblicazione weekend (art. 1, c. 74, L. 213/2023) |
| 2025-12-10 | Aggiunta sezione 6.28: Esenzioni IMU eventi sismici 2016-2017 |
| 2025-12-10 | Aggiunta sezione 6.29: ILIA Friuli Venezia Giulia |
| 2025-12-10 | Aggiunta giurisprudenza: Cass. 8073/2019 (ENC comodato) |
| 2025-12-10 | Aggiornate funzionalità totali: **33** (da 29) |
| 2025-12-10 | **Conversione PDF Strumenti utili**: Check List Acconto IMU 2024/2025 |
| 2025-12-10 | Aggiunta sezione 1.3: Strumenti Metodologici (checklist come riferimento UI/UX) |
| 2025-12-10 | Aggiunta sezione 6.30: Mappatura Checklist → Campi App |
| 2025-12-10 | Aggiornate funzionalità totali: **34** (da 33) |
| 2025-12-10 | **Analisi "IMU - Dichiarazione"** (Wolters Kluwer OneFiscale) |
| 2025-12-10 | Espansa sezione 6.24: obbligo/esonero dichiarazione, modalità presentazione, MUI |
| 2025-12-10 | Aggiunti riferimenti: Ris. MEF 4/DF 2017, 3/DF 2015, Circ. 2/DF 2015 |
| 2025-12-10 | **Analisi D.M. 29/07/2022** - Modello dichiarazione IMU/IMPi (superato da D.M. 24/04/2024) |
| 2025-12-10 | Aggiunte tipologie dichiarazione (nuova/sostitutiva/multipla), regole multi-comune, conservazione dati |
| 2025-12-10 | **Integrazione D.M. 24/04/2024** - Modelli vigenti IMU/IMPi e IMU ENC |
| 2025-12-10 | Aggiunta sezione "Dichiarazione obbligatoria a pena di decadenza" (alloggi sociali, Forze Armate, beni-merce) |
| 2025-12-10 | Aggiunto D.M. 4/05/2023 (modello IMU ENC superato) e D.L. 102/2013 art. 2, c. 5-bis |
| 2025-12-10 | Integrata giurisprudenza Cass. 37385/2022 e 32115/2024 sulla decadenza |
| 2025-12-11 | **Analisi completa D.M. 24/04/2024** - Testo integrale decreto vigente |
| 2025-12-11 | Eliminato D.M. 29/07/2022 (superato), sostituito con D.M. 24/04/2024 |
| 2025-12-11 | Aggiunti dettagli artt. 1-9 D.M.: modelli, presentazione, termini, trattamento dati |
| 2025-12-11 | Tabella novità D.M. 24/04/2024: occupazione abusiva telematica, interpretazione ENC |
| 2025-12-11 | **Analisi Specifiche tecniche IMU/IMPi** - Trasmissione telematica D.M. 24/04/2024 |
| 2025-12-11 | Aggiunta sezione "Specifiche tecniche trasmissione telematica" in 6.24 |
| 2025-12-11 | Tabelle codici: Caratteristiche immobile, Riduzioni, Esenzioni, Equiparazioni, Cariche dichiarante |
| 2025-12-11 | Mapping campi app → record D dichiarazione telematica |
| 2025-12-11 | Aggiunti allegati D.M. 24/04/2024 alla lista documenti |
| 2025-12-11 | **Analisi Istruzioni modello IMU/IMPi** - Casistiche obbligo dichiarativo |
| 2025-12-11 | Aggiunta sezione "Casistiche obbligo dichiarativo" con riduzioni, comune senza info |
| 2025-12-11 | Tabella compilazione Quadro A - mapping campi dichiarazione |
| 2025-12-11 | Canone concordato: NO obbligo dichiarativo (info via Puntofisco) |
| 2025-12-11 | Regole compilazione multipla per più vicende stesso immobile |
| 2025-12-11 | **Analisi Istruzioni modello IMU ENC** - D.M. 18/07/2024 |
| 2025-12-11 | Aggiunta sezione "Dichiarazione IMU ENC - Approfondimento" in 6.24 |
| 2025-12-11 | Struttura 4 Quadri ENC (A-D), colonne utilizzazione 11-17 |
| 2025-12-11 | Tabella codici attività ENC (1-11: assistenziale → altre attività) |
| 2025-12-11 | Calcolo rapporto proporzionale (spazio, tempo, soggetti, miste) |
| 2025-12-11 | Requisiti generali/settore non commercialità (artt. 3-4 Reg. 200/2012) |
| 2025-12-11 | Interpretazione autentica ENC (L. 213/2023): collegamento funzionale/strutturale |
| 2025-12-11 | Monitoraggio UE concluso: CGUE C-261/23 P annulla decisione Commissione 2055/2016 |
| 2025-12-11 | **Analisi Specifiche tecniche IMU ENC** - Trasmissione telematica D.M. 24/04/2024 |
| 2025-12-11 | Aggiunta sezione "Specifiche tecniche trasmissione telematica IMU ENC" in 6.24 |
| 2025-12-11 | Struttura record ENC: tipi A/B/C/D/E/Z, 1.900 chars, 3MB limite |
| 2025-12-11 | Tipologia dichiarazione ENC: N (nuova), S (sostitutiva), M (multipla) |
| 2025-12-11 | Codici caratteristiche/riduzioni/esenzioni ENC (record C/D) |
| 2025-12-11 | Tipologia attività svolta ENC: 10 checkbox (campi 9-18 record D) |
| 2025-12-11 | Calcolo attività didattica: Cm vs Cms (esenzione se Cm < Cms) |
| 2025-12-11 | Calcolo altre attività: Cenc vs Cm (simbolicità < 50% mercato) |
| 2025-12-11 | Comodato/immobili strutturali: codici 1-2 (art. 1, c. 71, L. 213/2023) |
| 2025-12-11 | **Aggiornamento sezioni 4.1 e 5** - Stato implementazione vs codice sorgente |
| 2025-12-11 | Sezione 4.1: 12/13 differenze critiche implementate (alert dichiarativo pendente) |
| 2025-12-11 | Sezione 5: 9/10 modifiche completate (90%), riferimenti a file sorgente |

---

## 9. RIFERIMENTI NORMATIVI

### 9.1 Leggi e Decreti

| Norma | Contenuto | Markdown |
|-------|-----------|----------|
| **L. 160/2019, art. 1, cc. 739-783** | **Disciplina IMU dal 2020** | - |
| L. 160/2019, art. 1, c. 758 | Esenzioni terreni agricoli | `art-1-comma-758.md` |
| D.L. 201/2011, art. 13 | IMU sperimentale 2012-2019 (ABROGATO) | `decreto-legge-201-2011-art-13.md` |
| D.Lgs. 23/2011, art. 9 | Federalismo fiscale - Soggetti passivi | `decreto-legislativo-23-2011-art-9.md` |
| D.Lgs. 504/1992, art. 7 | Esenzioni ICI/IMU | `decreto-legislativo-504-1992-art-7.md` |
| L. 147/2013, c. 639 | Istituzione IUC (parzialmente abrogata) | `legge-147-2013-comma-639.md` |
| L. 197/2022, art. 1, c. 81 | Esenzione occupazione abusiva | - |
| L. 197/2022, art. 1, cc. 834-835 | ILIA Friuli-Venezia Giulia | - |
| L. 178/2020, art. 1, c. 48 | Riduzione pensionati esteri | - |
| L. 208/2015, art. 1, c. 10 | Abolizione scaglioni CD/IAP | - |
| L. 431/1998, art. 2, c. 3 | Canone concordato | - |
| D.M. 22/4/2008 | Definizione alloggi sociali | - |
| **D.M. 24/4/2024** | **Modello IMU/IMPi e IMU ENC (vigente)** | `decreto_mef_24042024_dichiarazione_imu.md` |
| D.M. 4/5/2023 | Modello IMU ENC precedente (superato) | - |
| D.M. 29/7/2022 | Modello IMU/IMPi precedente (superato) | - |
| **D.L. 102/2013, art. 2, c. 5-bis** | Beni-merce: dichiarazione a pena decadenza | - |
| D.L. 124/2019, art. 38 | IMPI - Piattaforme marine | - |
| **L. 126/2020, art. 78-bis** | CD/IAP pensionati con attività agricola | - |
| **D.M. 7/7/2023** | Prospetto aliquote obbligatorio | - |
| **D.M. 6/9/2024** | Proroga prospetto aliquote al 2025 | - |
| **D.L. 84/2025, art. 6-bis** | ENC attività sportive semplificazione | - |
| **D.M. 19/11/2012, n. 200** | Regolamento esenzione ENC - requisiti generali e di settore | - |
| **D.L. 1/2012, art. 91-bis** | Esenzione IMU enti non commerciali | - |
| **D.M. 18/7/2024** | Approvazione modello IMU ENC (sostituisce D.M. 4/5/2023) | - |
| **L. 108/2025, art. 6** | Proroga delibere Prospetto IMU al 15/9/2025 | - |
| **D.M. MEF 14/3/2025** | Coefficienti fabbricati gruppo D non catastati | - |
| **L. 213/2023 (Bilancio 2024)** | Novità IMU 2024 (ENC, termini, sisma) | - |
| **L. 213/2023, art. 1, c. 71** | Interpretazione "posseduti/utilizzati" ENC | - |
| **L. 213/2023, art. 1, c. 74** | Proroga automatica termini 14/28 ottobre weekend | - |
| **L. 213/2023, art. 1, c. 422** | Proroga esenzioni sisma 2016-2017 | - |
| **L. 213/2023, art. 1, c. 528** | ILIA Friuli VG sostituisce IMU | - |
| **D.L. 189/2016** | Elenco comuni colpiti da sisma 2016-2017 | - |
| **L.R. FVG 17/2022** | Istituzione ILIA Friuli Venezia Giulia | - |

### 9.2 Circolari e Risoluzioni MEF

| Documento | Contenuto | Markdown |
|-----------|-----------|----------|
| **Circ. 1/DF 18/3/2020** | **Chiarimenti applicativi nuova IMU** | `circolare-mef-1-df-2020.md` |
| Ris. 2/DF 20/3/2023 | Alloggi sociali liberati | - |
| Ris. 4/DF 16/11/2023 | Fabbricati collabenti F/2 | - |
| Ris. 5/DF 11/6/2021 | Pensionati esteri | - |
| Circ. 2/DF 16/7/2024 | Enti non commerciali | - |
| **Ris. 2/DF 10/3/2020** | Aree fabbricabili agro-silvo-pastorale: fictio iuris oggettiva | - |
| **Ris. 4/DF 2017** | Dichiarazione IMU - chiarimenti | - |
| **Ris. 3/DF 2015** | Dichiarazione IMU - modalità | - |
| **Circ. 2/DF 2015** | Dichiarazione IMU - obblighi | - |

### 9.3 Giurisprudenza

| Pronuncia | Contenuto |
|-----------|-----------|
| Corte Cost. 209/2022 | Abitazione principale - eliminato nucleo familiare |
| Corte Cost. 60/2024 | Occupazione abusiva retroattiva |
| Cass. 23680/2020 | Alloggi sociali - no dichiarazione |
| Cass. 37385/2022 | Dichiarazione a pena decadenza |
| Cass. 32115/2024 | Beni merce - dichiarazione obbligatoria |
| Cass. 9620/2025 | Coniugi - doppia esenzione stesso comune |
| **Cass. 18940/2025** | Occupazione abusiva - esenzione retroattiva |
| CTR Abruzzo 8/2022 | Locazione parziale - mantiene esenzione |
| **Cass. 34813/2022** | Immobili contigui formanti unica abitazione |
| **CTR Lombardia 894/2024** | Unità adiacenti coniugi - doppia esenzione |
| **Cass. 16550/2019** | Trust - trustee soggetto passivo IMU |
| **Cass. 15988/2020** | Trust - conferma trustee come proprietario |
| **Cass. 1919/2025** | Fabbricati rurali D/10 - conta catasto, non qualifica possessore |
| **Cass. 35123/2022** | Scuole paritarie ENC - esenzione solo se gratuità o corrispettivo simbolico |
| **Cass. 2747/2023** | Coniugi abitazione principale - onere prova dimora abituale al Comune |
| **Cass. 7769/2023** | Stabilimenti balneari precari - soggetti a IMU se capacità reddituale |
| **CGT Firenze 137/2023** | Occupazione abusiva - esenzione 2023 irretroattiva |
| **Cass. 11443/2023** | Aree fabbricabili - no obbligo dichiarazione oscillazioni valore |
| **Cass. 18554/2022** | Società di persone - NO agevolazioni abitazione principale |
| **Cass. 23682/2019** | Società semplici - socio è mero detentore, non soggetto passivo |
| **Cass. 16467/2022** | Termini decadenza - 5° anno omesso versamento, 6° anno omessa dichiarazione |
| **Cass. 11432/2022** | Cumulo sanzioni - regime continuazione per violazioni pluriennali ICI/IMU |
| **Cass. 13793/2019** | Leasing risolto: IMU su locatore dalla risoluzione (non dalla riconsegna) |
| **Cass. 19166/2019** | ⚠️ **CONFLITTO** - Leasing risolto: IMU su locatario fino alla riconsegna materiale |
| **Cass. 15566/2010** | Aree fabbricabili agro-silvo-pastorale: fictio iuris oggettiva per tutti i contitolari |
| **Cass. 27067/2024** | Aree fabbricabili: valore venale da parametri tassativi art. 5, c. 5, D.Lgs. 504/1992 |
| **Cass. 9529/2023** | Aree fabbricabili: conferma parametri tassativi per valutazione |
| **Cass. 11445/2018** | Aree fabbricabili: parametri vincolanti D.Lgs. 504/1992 |
| **Cass. 8073/2019** | ENC comodato: esenzione se "compenetrazione" tra enti |
| **Cass. 27761/2023** | ENC collegamento funzionale: Università + ESU = esenzione IMU |
| **CGUE C-261/23 P (5/9/2024)** | Annulla decisione Commissione 2055/2016 - fine obbligo recupero ICI 2006-2011 |

> ⚠️ **CONFLITTO GIURISPRUDENZIALE NON RISOLTO** (Leasing immobiliare):
> - **Cass. 13793/2019**: Dopo risoluzione anticipata, IMU in capo al **LOCATORE** (società di leasing)
> - **Cass. 19166/2019**: Dopo risoluzione, IMU sul **LOCATARIO** fino alla riconsegna materiale
> - Le Sezioni Unite non si sono ancora pronunciate. L'app deve **segnalare entrambe le interpretazioni**.

---

## NOTE

### Domande aperte

1. Gestione ILIA (Friuli-Venezia Giulia), IMIS (Trentino), IMI (Alto Adige)?
2. ~~Implementare prospetto aliquote obbligatorio dal 2025?~~ → **Risolto**: Aggiunto in 6.13
3. ~~Gestione enti non commerciali (IMU/ENC)?~~ → **Risolto**: Aggiunto in 6.14-6.15

---

*Documento di specifiche tecniche per il progetto Calcolatore IMU*
