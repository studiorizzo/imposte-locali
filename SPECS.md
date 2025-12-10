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
8. [Riferimenti Normativi](#8-riferimenti-normativi)

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

### 6.4 Esempi Pratici di Calcolo

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

## 7. CHANGELOG

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

---

## 8. RIFERIMENTI NORMATIVI

### 8.1 Leggi e Decreti

| Norma | Contenuto |
|-------|-----------|
| L. 160/2019, art. 1, cc. 739-783 | Disciplina IMU dal 2020 |
| L. 197/2022, art. 1, c. 81 | Esenzione occupazione abusiva |
| L. 197/2022, art. 1, cc. 834-835 | ILIA Friuli-Venezia Giulia |
| L. 178/2020, art. 1, c. 48 | Riduzione pensionati esteri |
| L. 431/1998, art. 2, c. 3 | Canone concordato |
| D.M. 22/4/2008 | Definizione alloggi sociali |
| D.M. 24/4/2024 | Modello dichiarazione IMU |

### 8.2 Circolari e Risoluzioni MEF

| Documento | Contenuto |
|-----------|-----------|
| Circ. 1/DF 18/3/2020 | Aree pertinenziali (par. 8) |
| Ris. 2/DF 20/3/2023 | Alloggi sociali liberati |
| Ris. 4/DF 16/11/2023 | Fabbricati collabenti F/2 |
| Ris. 5/DF 11/6/2021 | Pensionati esteri |
| Circ. 2/DF 16/7/2024 | Enti non commerciali |

### 8.3 Giurisprudenza

| Pronuncia | Contenuto |
|-----------|-----------|
| Corte Cost. 209/2022 | Abitazione principale - eliminato nucleo familiare |
| Corte Cost. 60/2024 | Occupazione abusiva retroattiva |
| Cass. 23680/2020 | Alloggi sociali - no dichiarazione |
| Cass. 37385/2022 | Dichiarazione a pena decadenza |
| Cass. 32115/2024 | Beni merce - dichiarazione obbligatoria |
| Cass. 9620/2025 | Coniugi - doppia esenzione |
| CTR Abruzzo 8/2022 | Locazione parziale - mantiene esenzione |

---

## NOTE

### Domande aperte

1. Gestione ILIA (Friuli-Venezia Giulia), IMIS (Trentino), IMI (Alto Adige)?
2. Implementare prospetto aliquote obbligatorio dal 2025?
3. Gestione enti non commerciali (IMU/ENC)?

---

*Documento di specifiche tecniche per il progetto Calcolatore IMU*
