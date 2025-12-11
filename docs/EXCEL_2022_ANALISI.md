# Analisi Excel Originale 2022

> **Documento di archivio** - Reverse engineering del file Excel originale
>
> **Scopo**: Documentare la struttura e le formule del file Excel che ha ispirato l'app.
> La logica è stata reimplementata in `src/utils/calcolo.ts`.
>
> **File analizzato**: `excel-originale/fiscaleDoc_10SM0000003516.xls`

---

## 1. Struttura Fogli

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

---

## 2. Foglio "Oggetti" - Costanti

### 2.1 Coefficienti Moltiplicatori (Excel 2022)

| Categorie | Coefficiente | Cella |
|-----------|--------------|-------|
| A/1 - A/9, C/2, C/6, C/7 | 160 | C5 |
| C/3, C/4, C/5 | 140 | C6 |
| B/1 - B/8 | 140 | C7 |
| A/10, D/5 | 80 | C8 |
| Cat. D (no D/5, D/10) | 65 | C9 |
| C/1 | 55 | C10 |

### 2.2 Liste Dropdown

| Lista | Valori | Celle |
|-------|--------|-------|
| CD/IAP | NO, SI | B12:B13 |
| Rate | 2, 3 | B15:B16 |

---

## 3. Foglio "Riduzione terreni" - Scaglioni CD/IAP

> **OBSOLETO**: Questo sistema di riduzione è stato **abolito**. Dal 2014 i terreni CD/IAP sono **ESENTI**.

| Da (€) | A (€) | % Imponibile | Celle |
|--------|-------|--------------|-------|
| 0 | 6.000 | 0% | A5:C5 |
| 6.000,01 | 15.500 | 30% | A6:C6 |
| 15.500,01 | 25.500 | 50% | A7:C7 |
| 25.500,01 | 32.000 | 75% | A8:C8 |
| 32.000,01 | ∞ | 100% | A9:C9 |

---

## 4. Foglio "Terreni" - Struttura Colonne e Formule

### 4.1 Campi Input

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

### 4.2 Formule Estratte (Riga 6 come esempio)

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

> **IMU 2025**: Sistema CD/IAP con riduzione scaglionata (E3=2) è **ABOLITO**.
> I terreni CD/IAP sono ora completamente **ESENTI** (IMU = 0)

---

## 5. Foglio "Fabbricati rurali" - Struttura e Formule

### 5.1 Campi Input

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

### 5.2 Formule Estratte (Riga 5 come esempio)

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

---

## 6. Foglio "Abitazione principale" - Struttura

### 6.1 Parametri Generali

| Cella | Campo | Valore Default | Stato 2025 |
|-------|-------|----------------|------------|
| C3 | Numero di rate | 1 | Valido |
| C4 | Numero figli < 26 anni | (input) | **ABOLITO** |
| C5 | % spettanza detrazione | (input) | **ABOLITO** |
| C6 | Detrazione anno precedente | (input) | - |
| C7 | Detrazione anno corrente | (input) | Solo base €200 |
| C8 | Detrazione figli massima | 400 | **ABOLITO** |
| C9 | Detrazione figli spettante | (calc) | **ABOLITO** |
| C10 | Categoria catastale | (input) | Valido |

### 6.2 Righe Immobili

| Riga | Tipo Immobile |
|------|---------------|
| 13 | Abitazione principale |
| 14 | Pertinenza C/2 |
| 15 | Pertinenza C/6 |
| 16 | Pertinenza C/7 |

### 6.3 Formule Estratte

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

> **IMU 2025**:
> - Detrazione figli **ABOLITA** - Mantenere solo detrazione base €200
> - Aliquota base: **0,50%** (era 0,40%)
> - Pertinenze max 1 per categoria (C/2, C/6, C/7)

---

## 7. Foglio "Altri fabbricati" - Struttura e Formule

### 7.1 Campi Input

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

### 7.2 Formule Estratte (Riga 5)

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

> **IMU 2025**:
> - Quota Stato (0,76%) **SOLO per gruppo D** (tipologia 5) - CORRETTO
> - Aliquota base: **0,86%** (era 0,76%)
> - Aggiungere riduzione pensionati esteri (50% base)

---

## 8. Foglio "Aree fabbricabili" - Struttura e Formule

### 8.1 Campi Input

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

### 8.2 Formule Estratte (Riga 5)

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

---

## 9. Foglio "Riepilogo" - Codici Tributo F24

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

### 9.1 Codici Tributo F24 Validati

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

## Note sulla Migrazione a IMU 2025

Le principali differenze tra Excel 2022 e normativa IMU 2025 sono documentate in [SPECS.md](../SPECS.md), sezione 4.
