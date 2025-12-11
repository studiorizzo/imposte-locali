# SPECS.md - Specifiche Tecniche Calcolatore IMU

> **Documento vivente** - Aggiornato man mano che procede l'analisi
>
> **Ultimo aggiornamento**: 11 Dicembre 2025
>
> **Stato**: Sezione Funzionalità ristrutturata per flusso logico calcolo

---

## INDICE

1. [Fonte Dati](#1-fonte-dati)
2. [Normativa IMU Aggiornata](#2-normativa-imu-aggiornata)
3. [Funzionalità](#3-funzionalità)
4. [Changelog](#4-changelog)

---

## 1. FONTE DATI

### 1.1 Excel Originale

**File:** `excel-originale/fiscaleDoc_10SM0000003516.xlsm`

**Analisi completa:** [docs/EXCEL_2022_ANALISI.md](docs/EXCEL_2022_ANALISI.md)
- Struttura degli 11 fogli Excel
- Costanti e coefficienti
- Formule estratte per ogni tipo di immobile
- Codici tributo F24
- Note migrazione a IMU 2025

> La logica è stata reimplementata in `src/utils/calcolo.ts`

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

### 1.4 Leggi e Decreti

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

### 1.5 Circolari e Risoluzioni MEF

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

### 1.6 Giurisprudenza

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

## 2. NORMATIVA IMU AGGIORNATA

### 2.1 Base Giuridica

| Norma | Stato |
|-------|-------|
| Art. 1, L. 27/12/2019, n. 160 | **VIGENTE** dal 01/01/2020 |
| Art. 13, D.L. 06/12/2011, n. 201 | ABROGATA |

### 2.2 Coefficienti Moltiplicatori (2025)

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

### 2.2.1 Coefficienti Fabbricati Gruppo D Non Iscritti in Catasto (DM 14/3/2025)

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

### 2.3 Aliquote Base 2025

| Fattispecie | Base | Min | Max |
|-------------|------|-----|-----|
| Abitazione principale A/1, A/8, A/9 | **0,50%** | 0% | 0,60% |
| Fabbricati rurali strumentali | **0,10%** | 0% | 0,10% |
| Terreni agricoli | 0,76% | 0% | 1,06% |
| Fabbricati gruppo D | **0,86%** | 0,76% | 1,14% |
| Altri fabbricati | **0,86%** | 0% | 1,14% |
| Aree fabbricabili | **0,86%** | 0% | 1,14% |

> **Nota**: Maggiorazione +0,08% in sostituzione TASI (c. 755)

### 2.4 Esenzioni 2025

| Fattispecie | Stato |
|-------------|-------|
| Abitazione principale (non A/1, A/8, A/9) | ESENTE |
| Terreni agricoli CD/IAP | **ESENTI** (non ridotti) |
| Beni merce | ESENTI (dal 2022) |
| Immobili occupati abusivamente | ESENTI (dal 2023) |
| Fabbricati collabenti F/2 | ESCLUSI |

### 2.5 Riduzioni 2025

| Riduzione | Tipo | Condizioni |
|-----------|------|------------|
| 50% base | Storico/artistico | - |
| 50% base | Inagibile/inabitabile | Perizia o dichiarazione |
| 50% base | Comodato parenti 1° grado | Contratto registrato, stessa residenza |
| **25% aliquota** | Canone concordato | Art. 2 c.3 L. 431/1998 |
| 50% base | Pensionati esteri | Un solo immobile, non locato |

### 2.6 Detrazioni 2025

| Tipo | Importo | Note |
|------|---------|------|
| Base abitazione principale | **€200** | Solo A/1, A/8, A/9 |
| Per figli < 26 anni | **€0** | **ABOLITA dal 2014** |

### 2.7 Quote Stato/Comune

| Tipologia | Quota Stato | Quota Comune |
|-----------|-------------|--------------|
| Gruppo D | 0,76% | Eccedenza |
| Tutto il resto | 0% | 100% |

### 2.8 Soggetti Passivi (art. 1, c. 743)

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

### 2.9 Regola del Mese (art. 1, c. 761)

L'imposta è proporzionale ai mesi di possesso:

| Situazione | Conteggio |
|------------|-----------|
| Possesso > metà giorni del mese | **Mese intero** |
| Giorno di trasferimento | A carico dell'**acquirente** |
| Giorni possesso uguali (cedente = acquirente) | Mese intero all'**acquirente** |

### 2.10 Immobili Assimilati ad Abitazione Principale (art. 1, c. 741, lett. c)

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

### 2.11 Aree Pertinenziali (Circ. 1/DF del 18/3/2020, par. 8)

| Situazione | Trattamento |
|------------|-------------|
| Accatastate unitariamente al fabbricato (anche "graffatura") | **Pertinenza** |
| Non accatastate unitariamente | **Area fabbricabile** (soggetta autonomamente) |

### 2.12 Valori Venali Aree Fabbricabili (art. 1, c. 777, lett. d)

I Comuni possono determinare **valori venali per zone omogenee**.

**Effetto**: Se il contribuente versa su valore ≥ valore predeterminato dal Comune → **limitazione potere di accertamento**.

### 2.13 Aliquote per il Saldo

| Situazione | Aliquote da applicare |
|------------|----------------------|
| Delibera comunale pubblicata **entro 28 ottobre** | Aliquote nuove anno corrente |
| Delibera **non pubblicata** entro 28 ottobre | Aliquote anno precedente |

---

## 3. FUNZIONALITÀ

> Funzionalità del calcolatore IMU, organizzate per flusso logico del calcolo.
>
> **Struttura:** Presupposti → Base Imponibile → Esenzioni → Riduzioni → Aliquote → Calcolo → Imposte Regionali → Adempimenti → Altre Imposte

### Indice Sezione 3

| Sezione | Contenuto | Stato |
|---------|-----------|-------|
| **3.1** | Presupposti (chi paga, cosa si tassa) | ⏳ |
| **3.2** | Base imponibile | ⏳ |
| **3.3** | Esenzioni | ⏳ |
| **3.4** | Riduzioni | ⏳ |
| **3.5** | Aliquote e detrazioni | ⏳ |
| **3.6** | Calcolo | ⏳ |
| **3.7** | Imposte sostitutive/regionali | ⏳ |
| **3.8** | Adempimenti | ⏳ |
| **3.9** | Rapporto altre imposte | ⏳ |

> **Legenda:** ✅ Implementato | 🔶 Parziale | ⏳ Da implementare

---

### 3.1 PRESUPPOSTI

> **Fonti documentali:**
> - `aggiornamenti/IMU – Definizione e presupposti/presupposto-soggettivo-imu.md`
> - `aggiornamenti/IMU – Definizione e presupposti/presupposto-oggettivo-imu.md`
> - `aggiornamenti/IMU – Definizione e presupposti/ambito-di-applicazione-e-territorialita-imu.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Casi particolari/trustee-soggetto-passivo-imu.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Riferimenti/circolare-mef-1-df-2020.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Approfondimenti/imu-abitazioni-coniugi.md`
> - `aggiornamenti/articolo_ipsoa_imu_2025.md`

#### 3.1.1 Presupposto Soggettivo (Chi Paga)

**Fonte:** Art. 1, c. 743, L. 160/2019; Circ. MEF 1/DF 2020

**Soggetti passivi IMU:**

| Soggetto | Condizione |
|----------|------------|
| Proprietario | - |
| Titolare diritto reale | Usufrutto, uso, abitazione, enfiteusi, superficie |
| Concessionario | Aree demaniali |
| **Locatario leasing** | Dalla stipula, per tutta la durata |
| Genitore assegnatario | Casa familiare con diritto di abitazione |

**Contitolarità (art. 1, c. 743):**
- Ogni contitolare ha **autonoma obbligazione tributaria**
- Si considera la singola quota di possesso
- Esenzioni/agevolazioni applicate **individualmente** (dal 2020)

**Contitolarità terreni CD/IAP:**
- L'esenzione spetta **solo al contitolare con requisiti**
- Non si estende più agli altri comproprietari (prima del 2020 sì)

**ECCEZIONE - Aree fabbricabili agro-silvo-pastorale (Ris. MEF 2/DF 2020):**
- La *fictio iuris* di non edificabilità ha carattere **OGGETTIVO**
- Si estende a **TUTTI i comproprietari** (anche senza qualifica CD/IAP)
- Cass. 15566/2010: incompatibilità destinazione agricola con sfruttamento edilizio

**Funzionalità app:**
- Gestione quote possesso per terreni agricoli
- Verifica requisiti CD/IAP per singola quota
- Flag "Area fabbricabile con utilizzo agro-silvo-pastorale" → esenzione a tutti

#### 3.1.2 Presupposto Oggettivo (Cosa si Tassa)

**Fonte:** Art. 1, c. 740-741, L. 160/2019

**Oggetto dell'imposta:**
- Fabbricati
- Aree fabbricabili
- Terreni agricoli

**Esclusioni oggettive:**
- Fabbricati rurali ad uso strumentale (ubicati in comuni montani/parzialmente montani)
- Terreni agricoli in comuni montani (elenco ISTAT Circ. 9/1993)

#### 3.1.3 Casi Particolari Soggettività

##### Leasing Immobiliare

**Fonte:** L. 160/2019 art. 1 c. 743; Circ. MEF 1/DF 2020 par. 9

**Regola:**
- Soggetto passivo = **locatario** dalla data della stipula
- Fine soggettività = **scadenza contratto** (NON riconsegna del bene)

> ⚠️ **CONFLITTO GIURISPRUDENZIALE NON RISOLTO:**
> - **Cass. 13793/2019**: Dopo risoluzione anticipata, IMU in capo al **LOCATORE**
> - **Cass. 19166/2019**: Dopo risoluzione, IMU sul **LOCATARIO** fino alla riconsegna
> - Le Sezioni Unite non si sono pronunciate. L'app deve **segnalare entrambe le interpretazioni**.

**Funzionalità:**
- Campo "Immobile in leasing" (SI/NO)
- Se SI: data stipula contratto, data fine contratto
- Alert conflitto giurisprudenziale in caso di risoluzione anticipata

##### Trust e Trustee

**Fonte:** Cass. 16550/2019; Cass. 15988/2020

**Principio:**
- Per immobili vincolati in **trust**, il soggetto passivo IMU è il **trustee**
- Il trust è privo di personalità giuridica
- I beni sono trasferiti fiduciariamente al trustee
- Non viola il principio di segregazione patrimoniale

**Funzionalità:**
- Tipologia soggetto "Trust"
- Campo "Trustee" come soggetto passivo

##### Società di Persone

**Fonte:** Cass. 18554/2022; Cass. 23682/2019

**Principio:** Le agevolazioni IMU per l'abitazione principale **NON si applicano** agli immobili posseduti da società di persone (s.s., s.n.c., s.a.s.).

| Soggetto | Posizione | Agevolazioni |
|----------|-----------|--------------|
| Società di persone | Soggetto passivo IMU | ❌ NO |
| Socio | Mero detentore | ❌ NO (non è soggetto passivo) |
| Persona fisica proprietaria | Soggetto passivo IMU | ✅ SÌ |

**Funzionalità:**
- Tipologia soggetto "Società di persone"
- Alert automatico: "Agevolazioni abitazione principale non applicabili"

##### Altri Casi Particolari

**Fonte:** Art. 1, c. 768, L. 160/2019

| Fattispecie | Soggetto passivo | Note |
|-------------|------------------|------|
| Fallimento/liquidazione coatta | Curatore/Commissario | Versamento entro 3 mesi dal decreto |
| Multiproprietà | Amministratore | Se azionaria: società proprietaria |
| Parti comuni condominiali | Amministratore | Beni comuni censibili |
| Cooperative prop. divisa | Cooperativa | Fino all'assegnazione al socio |
| Cooperative prop. indivisa | Cooperativa | Sempre |
| ATER/IACP con patto riscatto | Ente (NON assegnatario) | - |
| Immobili in eredità | Eredi | Pro quota |
| Coniuge superstite | Coniuge superstite | Unico soggetto passivo (art. 540 c.c.) |

---

### 3.2 BASE IMPONIBILE

> **Fonti documentali:**
> - `aggiornamenti/IMU – Base imponibile e aliquote/imu_base_imponibile_aliquote.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Approfondimenti/imu-fabbricati.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Approfondimenti/imu-area-fabbricabile.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Approfondimenti/imu-pertinenze.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Approfondimenti/imu-terreni-agricoli.md`
> - `aggiornamenti/articolo_ipsoa_imu_2025.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Riferimenti/circolare-mef-1-df-2020.md`

#### 3.2.1 Fabbricati (Rendita × Coefficiente)

**Fonte:** Art. 1, c. 745, L. 160/2019

**Formula:**
```
Base imponibile = Rendita catastale × 1,05 × Coefficiente moltiplicatore
```

**Coefficienti moltiplicatori (2025):**

| Categorie | Coefficiente |
|-----------|--------------|
| A/1 - A/11 (escluso A/10) | 160 |
| A/10 | 80 |
| B/1 - B/8 | 140 |
| C/1 | 55 |
| C/2, C/6, C/7 | 160 |
| C/3, C/4, C/5 | 140 |
| D/1 - D/10 (escluso D/5) | 65 |
| D/5 | 80 |

##### Fabbricati in Corso di Costruzione/Ristrutturazione

**Fonte:** Art. 1, c. 746, L. 160/2019

Per fabbricati in corso di costruzione, ricostruzione o recupero edilizio:
- **L'IMU si applica sull'area fabbricabile**, non sul fabbricato
- Durata: fino a ultimazione lavori o utilizzo (se anteriore)
- Eccezione: manutenzione ordinaria/straordinaria → IMU sul fabbricato

**Funzionalità:**
- Flag "In costruzione/ristrutturazione"
- Campo data inizio lavori, data fine prevista
- Calcolo IMU su valore area

#### 3.2.2 Fabbricati Gruppo D Non Catastati

**Fonte:** Art. 1, c. 746, L. 160/2019; D.M. MEF 14/3/2025

**Ambito:** Fabbricati classificabili nel gruppo D che siano:
- Non iscritti in catasto con attribuzione di rendita
- Interamente posseduti da imprese
- Distintamente contabilizzati

**Formula:**
```
Valore = Costo contabilizzato × Coefficiente (per anno di formazione)
```

**Coefficienti D.M. 14/3/2025:**

| Anno | Coeff. | Anno | Coeff. | Anno | Coeff. |
|------|--------|------|--------|------|--------|
| 2025 | 1,00 | 2015 | 1,23 | 2005 | 1,52 |
| 2024 | 1,00 | 2014 | 1,23 | 2004 | 1,61 |
| 2023 | 1,02 | 2013 | 1,24 | 2003 | 1,66 |
| 2022 | 1,14 | 2012 | 1,27 | 2002 | 1,72 |
| 2021 | 1,19 | 2011 | 1,30 | 2001 | 1,76 |
| 2020 | 1,19 | 2010 | 1,32 | 2000 | 1,82 |
| 2019 | 1,20 | 2009 | 1,34 | 1999 | 1,85 |
| 2018 | 1,22 | 2008 | 1,39 | 1998 | 1,87 |
| 2017 | 1,22 | 2007 | 1,44 | ≤1982 | 3,79 |
| 2016 | 1,23 | 2006 | 1,48 | | |

**Funzionalità:**
- Flag "Fabbricato D non catastato"
- Campo anno formazione costo
- Calcolo automatico con coefficiente appropriato

#### 3.2.3 Terreni Agricoli

**Fonte:** Art. 1, c. 746, L. 160/2019

**Formula:**
```
Base imponibile = Reddito dominicale × 1,25 × 135
```

#### 3.2.4 Aree Fabbricabili

**Fonte:** Art. 1, c. 746, L. 160/2019; Cass. 27067/2024

**Base imponibile:** Valore venale in comune commercio al 1° gennaio

**Parametri obbligatori (art. 5, c. 5, D.Lgs. 504/1992):**
1. Zona territoriale di ubicazione
2. Indice di edificabilità
3. Destinazione d'uso consentita
4. Oneri per lavori di adattamento
5. Prezzi medi di mercato per aree analoghe

**Valori comunali (art. 1, c. 777, lett. d):**
I Comuni possono determinare valori venali per zone omogenee.
Se il contribuente versa su valore ≥ valore predeterminato → limitazione potere accertamento.

**Funzionalità:**
- Checklist parametri per valutazione
- Alert se valore < valore comunale predeterminato

#### 3.2.5 Pertinenze

**Fonte:** L. 160/2019 art. 1 c. 741 lett. a); Circ. MEF 1/DF 2020 par. 8

**Dal 01/01/2020:** Nozione di pertinenza **esclusivamente fiscale** (non più civilistica)

| Situazione | Trattamento |
|------------|-------------|
| Area accatastata unitariamente (graffatura) | **Pertinenza** del fabbricato |
| Area NON accatastata unitariamente | **Area fabbricabile** autonoma |

**Pertinenze abitazione principale:**
- Max **3 pertinenze** (una per categoria C/2, C/6, C/7)
- Godono dell'esenzione se abitazione principale esente

**Funzionalità:**
- Campo "Accatastamento unitario" per aree adiacenti
- Limite 3 pertinenze per abitazione principale

---

### 3.3 ESENZIONI

> **Fonti documentali:**
> - `aggiornamenti/dossier_imu_2025.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Approfondimenti/imu-terreni-agricoli.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Riferimenti/decreto-legislativo-504-1992-art-7.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Approfondimenti/imu-abitazioni-coniugi.md`
> - `aggiornamenti/IMU – Base imponibile e aliquote/Articoli operativi/novita_imu_bilancio_2024.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Articoli operativi/imu-esenzione-abitazione-principale-coniugi-corte-cost-209-2022.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Articoli operativi/imu-immobili-occupati-abusivamente-corte-cost-60-2024.md`
> - `aggiornamenti/IMU - Dichiarazione/IMU_ENC_Istr_24-Definitivo.md`
> - `aggiornamenti/articolo_ipsoa_imu_2025.md`

#### 3.3.1 Abitazione Principale

**Fonte:** Art. 1, c. 740-741, L. 160/2019; Corte Cost. 209/2022

**Definizione:** Immobile iscritto in catasto come unica unità immobiliare, in cui il **possessore** dimora abitualmente e risiede anagraficamente.

**ESENTI:** Abitazioni principali **non di lusso** (escluse A/1, A/8, A/9)

**Post Corte Cost. 209/2022:**
- Eliminato riferimento al "nucleo familiare"
- È sufficiente che il **solo possessore** dimori e risieda
- Coniugi/conviventi possono avere **due abitazioni principali**

**Giurisprudenza:**
- **Corte Cost. 209/2022**: abolizione limite nucleo familiare
- **Corte Cost. 49/2025**: conferma 209/2022
- **Cass. 9620/2025**: coniugi entrambi esenti anche stesso comune
- **Cass. 34813/2022**: unità contigue = unica abitazione (esente)
- **Cass. 2747/2023**: onere prova dimora abituale al **Comune**

##### Casa Familiare

**Fonte:** L. 160/2019 art. 1 c. 741 lett. c) n. 4

Include anche coppie **non sposate** con figli:
- La "casa familiare" è definita dal **provvedimento del Giudice**
- Si prescinde dalla proprietà (può essere anche di terzi)
- Non rilevanti residenza e dimora dell'assegnatario

##### Immobili Assimilati (art. 1, c. 741, lett. c)

| Fattispecie | Note |
|-------------|------|
| Cooperative edilizie prop. indivisa | Abitazione soci assegnatari |
| Cooperative per studenti universitari | Anche **senza residenza** |
| Alloggi sociali (D.M. 22/4/2008) | Con residenza e dimora |
| Casa familiare assegnata | Con diritto di abitazione |
| Forze armate/polizia | 1 solo immobile, non locato |
| Anziani/disabili in istituto | **Facoltà** del Comune |

**Funzionalità:**
- Verifica solo dimora + residenza del possessore
- Gestione immobili contigui
- Alert informativo post Corte Cost. 209/2022

#### 3.3.2 Terreni Agricoli

**Fonte:** Art. 1, c. 758, L. 160/2019

**Esenzioni totali:**

| Tipologia | Note |
|-----------|------|
| Terreni posseduti e condotti da **CD/IAP** | Qualunque ubicazione |
| Terreni nelle **isole minori** | Allegato A L. 448/2001 |
| Terreni a **proprietà collettiva** | Indivisibile/inusucapibile |
| Terreni in **zone montane/collinari** | Elenco ISTAT Circ. 9/1993 |

##### CD/IAP Pensionati

**Fonte:** Art. 78-bis L. 126/2020

Si considerano CD/IAP anche i **pensionati** che:
- Continuano a svolgere attività in agricoltura
- Mantengono l'iscrizione nella gestione previdenziale agricola

**Funzionalità:**
- Flag per ciascuna tipologia di esenzione
- Flag "Pensionato con attività agricola"
- Verifica automatica tramite codice catastale comune

#### 3.3.3 Fabbricati

**Fonte:** Art. 1, c. 751-759, L. 160/2019; D.Lgs. 504/1992 art. 7

| Esenzione | Riferimento |
|-----------|-------------|
| Beni merce (imprese costruttrici) | Dal 2022, con dichiarazione |
| Fabbricati collabenti F/2 | Esclusi (no rendita) |
| Categorie E/1 - E/9 | D.Lgs. 504/92 art. 7, lett. b |
| Fabbricati culto | D.Lgs. 504/92 art. 7, lett. d |
| Fabbricati Santa Sede | D.Lgs. 504/92 art. 7, lett. e |
| Stati esteri/Org. internazionali | D.Lgs. 504/92 art. 7, lett. f |
| Enti pubblici (Stato, Regioni, ecc.) | D.Lgs. 504/92 art. 7, lett. a |

##### IACP/ERP

**Fonte:** L. 160/2019 art. 1 cc. 749, 754; Circ. MEF 1/DF 2020 par. 3

| Tipo immobile | Trattamento |
|---------------|-------------|
| Alloggi IACP/ERP regolarmente assegnati | Detrazione €200, aliquota ordinaria |
| Alloggi IACP/ERP sfitti | Possibilità azzeramento aliquota |
| Alloggi sociali (D.M. 22/4/2008) | **Esenti** se abitazione principale |

> **ATTENZIONE:** IACP ≠ automaticamente "alloggi sociali". Esenzione solo se conformi a D.M. 22/4/2008.

#### 3.3.4 ENC (Enti Non Commerciali)

**Fonte:** L. 160/2019 art. 1 c. 759; D.M. 200/2012; Art. 1, c. 71, L. 213/2023

**Esenzione:** Immobili destinati esclusivamente ad attività non commerciali.

**Uso promiscuo:** Esenzione proporzionale alla superficie non commerciale.

**Attività meritevoli (art. 4 Reg. 200/2012):**

| Codice | Attività |
|--------|----------|
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

**Interpretazione autentica (art. 1, c. 71, L. 213/2023):**

| Termine | Interpretazione |
|---------|-----------------|
| **"Posseduti"** | Include immobili in **comodato** a ENC collegato |
| **"Utilizzati"** | Strumentali anche **senza esercizio attuale** |

**Collegamento funzionale/strutturale (Cass. 27761/2023):**
- Attività comodatario accessorie/integrative rispetto a comodante
- Es. università + ESU per diritto allo studio

##### ENC Attività Sportive

**Fonte:** Art. 6-bis D.L. 84/2025

Semplificazione per ENC con attività sportive dilettantistiche (D.Lgs. 36/2021).

**Funzionalità:**
- Tipologia soggetto "Ente Non Commerciale"
- Campo "Uso promiscuo" con % superficie
- Campo "Immobile in comodato a ENC collegato"
- Flag "Attività sportiva dilettantistica"

#### 3.3.5 Altre Esenzioni

##### Occupazione Abusiva

**Fonte:** Art. 1, c. 759, lett. g-bis, L. 160/2019; Corte Cost. 60/2024

**Esenzione:** Dal periodo in cui sussistono le condizioni (efficacia **retroattiva**).

**Requisiti:**
- Immobile occupato abusivamente
- Denuncia presentata (artt. 614 c.2 o 633 c.p.)

**Giurisprudenza:**
- **Corte Cost. 60/2024**: esenzione retroattiva
- **Cass. 18940/2025**: conferma retroattività

**Funzionalità:**
- Flag "Immobile occupato abusivamente"
- Campo data presentazione denuncia
- Dichiarazione **solo telematica** obbligatoria

##### Esenzioni Sisma

**Fonte:** Art. 1, c. 422, L. 213/2023; D.L. 189/2016

**Sisma 2016-2017 (Italia Centrale):**
- Fabbricati distrutti/inagibili (ordinanza entro 31/12/2018)
- Esenzione IMU fino a ricostruzione, **max 31/12/2024**
- Regioni: Abruzzo, Lazio, Marche, Umbria

**Sisma Umbertide 9/3/2023:**
- Esenzione per anno 2024 o fino a ricostruzione

**Funzionalità:**
- Flag "Immobile zona sismica" con selezione evento
- Verifica comune in allegati D.L. 189/2016

##### Esenzioni Storiche D.Lgs. 504/1992 art. 7

| Lettera | Descrizione |
|---------|-------------|
| a) | Enti pubblici (Stato, Regioni, ecc.) |
| c) | Fabbricati usi culturali (art. 5-bis DPR 601/73) |
| g) | Inagibili recuperati per attività L. 104/92 |
| h) | Terreni montani/collinari |

---

### 3.4 RIDUZIONI

> **Fonti documentali:**
> - `aggiornamenti/IMU – Base imponibile e aliquote/imu_base_imponibile_aliquote.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Adempimenti/imu-versamento-acconto.md`
> - `aggiornamenti/articolo_ipsoa_imu_2025.md`
> - `aggiornamenti/IMU - Dichiarazione/IMU_IMPi_Istruzioni_2024_Definitivo-24.04.2024.md`

#### 3.4.1 Riduzioni Base Imponibile (50%)

**Fonte:** Art. 1, cc. 747-750, L. 160/2019

| Riduzione | Condizioni | Dichiarazione |
|-----------|------------|---------------|
| Storico/artistico | Art. 10 D.Lgs. 42/2004 | Acquisto **e** perdita |
| Inagibile/inabitabile | Perizia o dichiarazione + non utilizzato | Solo **perdita** diritto |
| Comodato parenti 1° grado | Contratto registrato, stesso comune | Sempre |
| Pensionati esteri AIRE | Un solo immobile, non locato | Sempre |

##### Pensionati Esteri/AIRE

**Fonte:** L. 178/2020 art. 1 c. 48

**Requisiti:**
- Cittadino italiano residente all'estero
- Iscritto AIRE
- Pensionato nel Paese di residenza
- **Un solo immobile** in Italia
- Non locato né in comodato

**Funzionalità:**
- Flag "Pensionato estero AIRE"
- Verifica unicità immobile
- Riduzione automatica 50%

#### 3.4.2 Riduzioni Imposta (25%)

**Fonte:** Art. 1, c. 760, L. 160/2019

| Riduzione | Condizioni |
|-----------|------------|
| Canone concordato | Art. 2 c.3 L. 431/1998 |

**Note:** Riduzione 75% aliquota (= 25% imposta in meno).

---

### 3.5 ALIQUOTE E DETRAZIONI

> **Fonti documentali:**
> - `aggiornamenti/IMU – Base imponibile e aliquote/imu_base_imponibile_aliquote.md`
> - `aggiornamenti/articolo_ipsoa_imu_2025.md`
> - `aggiornamenti/dossier_imu_2025.md`
> - `aggiornamenti/IMU – Base imponibile e aliquote/Articoli operativi/novita_imu_bilancio_2024.md`

#### 3.5.1 Aliquote Base e Comunali

**Fonte:** Art. 1, cc. 748-755, L. 160/2019

| Fattispecie | Base | Min | Max |
|-------------|------|-----|-----|
| Abitazione principale A/1, A/8, A/9 | **0,50%** | 0% | 0,60% |
| Fabbricati rurali strumentali | **0,10%** | 0% | 0,10% |
| Terreni agricoli | 0,76% | 0% | 1,06% |
| Fabbricati gruppo D | **0,86%** | 0,76% | 1,14% |
| Altri fabbricati | **0,86%** | 0% | 1,14% |
| Aree fabbricabili | **0,86%** | 0% | 1,14% |

> **Nota**: Maggiorazione +0,08% in sostituzione TASI (c. 755)

**Regola pubblicazione (art. 1, c. 767; art. 1, c. 74, L. 213/2023):**

| Situazione | Aliquote da applicare |
|------------|----------------------|
| Delibera pubblicata **entro 28 ottobre** | Aliquote anno corrente |
| Delibera **non pubblicata** | Aliquote anno precedente |

**Proroga weekend (dal 2024):** Se 14/28 ottobre cadono di sabato/domenica → primo giorno lavorativo.

#### 3.5.2 Prospetto Aliquote Obbligatorio

**Fonte:** D.M. 7/7/2023; D.M. 6/9/2024; Art. 6, L. 108/2025

**Dal 2025:** Comuni obbligati ad utilizzare il Prospetto ministeriale.

**Proroga 2025 (Art. 6, L. 108/2025):**
- Comuni senza delibera entro 28/02/2025 → possono approvare entro **15/09/2025**
- Delibera senza Prospetto = **non idonea**

**Funzionalità:**
- Possibile integrazione portale MEF
- Alert per scadenza 15/09/2025

#### 3.5.3 Detrazioni

| Tipo | Importo | Note |
|------|---------|------|
| Abitazione principale (A/1, A/8, A/9) | **€200** | Proporzionale a mesi/quota |
| Per figli < 26 anni | **€0** | **ABOLITA dal 2014** |
| IACP/ERP regolarmente assegnati | **€200** | |

#### 3.5.4 Quote Stato/Comune

| Tipologia | Quota Stato | Quota Comune |
|-----------|-------------|--------------|
| Gruppo D | 0,76% | Eccedenza |
| Tutto il resto | 0% | 100% |

---

### 3.6 CALCOLO

> **Fonti documentali:**
> - `aggiornamenti/IMU – Base imponibile e aliquote/Strumenti utili/checklist_acconto_imu_2025.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Adempimenti/imu-versamento-acconto.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Adempimenti/imu-versamento-saldo.md`
> - `aggiornamenti/articolo_ipsoa_imu_2025.md`

#### 3.6.1 Formula Generale

```
IMU = Base imponibile × Aliquota × (Mesi / 12) × (Quota / 100) - Detrazioni
```

**Con riduzioni:**
```
IMU = (Base imponibile × Riduzione%) × Aliquota × (Mesi / 12) × (Quota / 100) - Detrazioni
```

#### 3.6.2 Regola del Mese

**Fonte:** Art. 1, c. 761, L. 160/2019

| Situazione | Conteggio |
|------------|-----------|
| Possesso > metà giorni del mese | **Mese intero** |
| Giorno di trasferimento | A carico dell'**acquirente** |
| Giorni possesso uguali | Mese intero all'**acquirente** |

#### 3.6.3 Importo Minimo

**Default:** €12 (se comune non delibera diversamente)

#### 3.6.4 Arrotondamenti

- Importo da versare: arrotondamento all'euro (€0,49 → €0; €0,50 → €1)

---

### 3.7 IMPOSTE SOSTITUTIVE/REGIONALI

> **Fonti documentali:**
> - `aggiornamenti/IMU – Definizione e presupposti/Articoli operativi/i10188722_IMPI_piattaforme_marine.md`
> - `aggiornamenti/IMU – Base imponibile e aliquote/Articoli operativi/novita_imu_bilancio_2024.md`
> - `aggiornamenti/dossier_imu_2025.md`
> - `aggiornamenti/IMU – Definizione e presupposti/ambito-di-applicazione-e-territorialita-imu.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Riferimenti/circolare-mef-1-df-2020.md`

#### 3.7.1 IMPI (Piattaforme Marine)

**Fonte:** Art. 38 D.L. 124/2019

**Caratteristiche:**
- Imposta sulle piattaforme marine
- Aliquota fissa (comuni NON possono variare)
- Versamento unica soluzione 16 dicembre

#### 3.7.2 ILIA (Friuli Venezia Giulia)

**Fonte:** Art. 1, c. 528, L. 213/2023; L.R. FVG 17/2022

**Dal 2023:** ILIA **sostituisce** IMU e IRPEF/addizionali per immobili non locati in FVG.

**Caratteristiche:**
- Disciplina analoga a IMU nazionale
- Deducibilità come IMU strumentali

**Funzionalità:**
- Rilevamento automatico comune FVG → calcolo ILIA

#### 3.7.3 IMIS (Trentino)

**Fonte:** L.P. Trento 14/2014

Imposta immobiliare semplice della Provincia autonoma di Trento.

#### 3.7.4 IMI (Alto Adige)

**Fonte:** L.P. Bolzano 3/2014

Imposta municipale immobiliare della Provincia autonoma di Bolzano.

---

### 3.8 ADEMPIMENTI

> **Fonti documentali:**
> - `aggiornamenti/IMU - Dichiarazione/imu_dichiarazione.md`
> - `aggiornamenti/IMU - Dichiarazione/IMU_IMPi_Istruzioni_2024_Definitivo-24.04.2024.md`
> - `aggiornamenti/IMU - Dichiarazione/IMU_ENC_Istr_24-Definitivo.md`
> - `aggiornamenti/IMU - Dichiarazione/decreto_mef_24042024_dichiarazione_imu.md`
> - `aggiornamenti/IMU - Dichiarazione/2024_IMU-IMPi_SpecificheTecniche_2024.04.24.md`
> - `aggiornamenti/IMU - Dichiarazione/2024_ENC_SpecificheTecniche_2024.04.24.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Adempimenti/imu-versamento-acconto.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Adempimenti/imu-versamento-saldo.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Adempimenti/imu-dichiarazione.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Adempimenti/imu-dichiarazione-enc.md`
> - `aggiornamenti/IMU – Base imponibile e aliquote/Strumenti utili/checklist_acconto_imu_2025.md`
> - `aggiornamenti/dossier_imu_2025.md`

#### 3.8.1 Versamento

**Fonte:** Art. 1, cc. 762-768, L. 160/2019

##### Scadenze

| Scadenza | Adempimento | Note |
|----------|-------------|------|
| **16 giugno** | Acconto (I rata) | Aliquote anno precedente |
| **16 dicembre** | Saldo (II rata) | Aliquote pubblicate entro 28/10 |
| 16 giugno | Unica soluzione | Facoltativa |

**Non residenti:** Unica soluzione entro 16/12 con interessi **3%** sulla I rata.

##### Modalità

- **F24**: ordinario, semplificato, EP
- **Bollettino postale**
- **PagoPA** (non ancora operativo)

##### Codici Tributo

| Codice | Descrizione |
|--------|-------------|
| 3912 | Abitazione principale e pertinenze (A/1, A/8, A/9) |
| 3913 | Fabbricati rurali strumentali |
| 3914 | Terreni |
| 3916 | Aree fabbricabili |
| 3918 | Altri fabbricati |
| 3925 | Fabbricati D - Stato |
| 3930 | Fabbricati D - Comune |

#### 3.8.2 Dichiarazione IMU

**Fonte:** Art. 1, c. 769, L. 160/2019; D.M. 24/4/2024

**Termine:** 30 giugno anno successivo

**Efficacia:** Pluriennale (fino a nuova variazione)

##### Obbligo Dichiarativo

**Sussiste per:**
- Immobili con **riduzioni**
- Variazioni **non conoscibili** dal comune
- **Beni merce** (Cass. 32115/2024: a pena decadenza)

**Esonero:**
- Atti con MUI (notai)
- Procedure specifiche regolamento comunale

##### Modalità Presentazione

| Modalità | Note |
|----------|------|
| Cartacea - consegna | Con ricevuta |
| Cartacea - posta | Raccomandata s.r.r. |
| PEC | |
| Telematica | Fisconline/Entratel |
| **Solo telematica** | Occupazione abusiva |

**Funzionalità:**
- Alert obbligo dichiarativo per fattispecie specifiche
- Indicazione scadenza presentazione

#### 3.8.3 Dichiarazione ENC (Annuale)

**Fonte:** Art. 1, c. 770, L. 160/2019; D.M. 24/4/2024

**Caratteristiche distintive:**

| Elemento | IMU Ordinaria | IMU ENC |
|----------|---------------|---------|
| Frequenza | Pluriennale | **Annuale** |
| Modalità | Cartacea/telematica | **Solo telematica** |
| Rate | 2 (16/6, 16/12) | 2 (16/6, 16/12) |

**Struttura modello - 4 Quadri:**

| Quadro | Contenuto |
|--------|-----------|
| A | Immobili e utilizzazioni |
| B | Rapporto proporzionale (uso misto) |
| C | IMU dovuta per comune |
| D | Sottoscrizione |

**Funzionalità:**
- Alert dichiarazione annuale ENC

#### 3.8.4 Sanzioni e Ravvedimento

**Fonte:** Art. 1, c. 767, L. 160/2019

| Violazione | Sanzione |
|------------|----------|
| Omessa dichiarazione | **100%-200%** (min. €50) |
| Dichiarazione infedele | **50%-100%** maggiore imposta |
| Errori formali | **€50-€250** |
| Omesso/insufficiente versamento | **30%** |

**Ravvedimento operoso:** Applicabile con riduzioni sanzioni in base ai tempi.

##### Cumulo Sanzioni Pluriennali

**Fonte:** Cass. 11432/2022; Art. 12 D.Lgs. 472/1997

Per omesso versamento pluriennale: **regime continuazione attenuata**.
- Sanzione base **aumentata da metà a triplo**
- Obbligatorio (non facoltativo per l'Ente)

#### 3.8.5 Termini Decadenza

**Fonte:** L. 296/2006, art. 1, c. 161; Cass. 16467/2022

**Regola:** Notifica avviso entro **31 dicembre del 5° anno successivo**.

| Fattispecie | Dies a quo | Termine |
|-------------|------------|---------|
| Omesso versamento (dichiarazione presentata) | Anno d'imposta | 5° anno successivo |
| Omessa dichiarazione | Termine presentazione | 5° anno = **6° anno** dall'imposta |

**Esempio:**
- Anno 2019, dichiarazione entro 30/6/2020
- Decadenza omessa dichiarazione: 31/12/2025
- Decadenza omesso versamento: 31/12/2024

**Funzionalità:**
- Calcolo termine decadenza accertamento
- Info regime cumulo sanzioni

---

### 3.9 RAPPORTO ALTRE IMPOSTE

> **Fonti documentali:**
> - `aggiornamenti/IMU – Definizione e presupposti/Casi particolari/imu-beni-immobili-uso-abitativo-non-locati.md`
> - `aggiornamenti/IMU – Base imponibile e aliquote/imu_base_imponibile_aliquote.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Articoli operativi/i9907756_imu_immobili_strumentali_deducibile.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Articoli operativi/i10046086_piena_deducibilita_imu.md`
> - `aggiornamenti/IMU – Definizione e presupposti/Articoli operativi/i10128098_deducibilita_imu_2022_100.md`

#### 3.9.1 IMU/IRPEF

**Fonte:** Art. 9, c. 9, D.Lgs. 23/2011

| Situazione | IMU | IRPEF |
|------------|-----|-------|
| Immobile non locato, **diverso** comune da abitaz. princ. | ✅ | ❌ No |
| Immobile non locato, **stesso** comune abitaz. princ. | ✅ | ✅ **50%** reddito |
| Immobile locato | ✅ | ✅ 100% (o cedolare) |

**Funzionalità:**
- Alert "Reddito fondiario 50% IRPEF" se stesso comune

#### 3.9.2 Deducibilità IMU

**Fonte:** Art. 1, cc. 772-773, L. 160/2019

**Evoluzione storica:**

| Periodo | Deducibilità |
|---------|--------------|
| 2012 | 0% |
| 2013 | 30% |
| 2014-2018 | 20% |
| 2019 | 50% |
| 2020-2021 | 60% |
| **Dal 2022** | **100%** |

**Immobili ammessi:**
- Strumentali per natura
- Strumentali per destinazione
- Lavoratori autonomi: solo uso **esclusivo**

**Esclusi:**
- Fabbricati uso promiscuo
- Immobili patrimonio
- Immobili merce

**Note:**
- Deduzione per **cassa** (anno pagamento)
- **Indeducibile da IRAP**
- Si applica anche a IMI e IMIS

**Funzionalità:**
- Alert per contribuenti con immobili strumentali
- Info per dichiarazione redditi

---

### Mappatura Checklist → Campi App

**Fonte:** Check List Acconto IMU 2025 (Wolters Kluwer)

#### Step 1: Dati Immobile

| Checklist | Campo App | Tipo |
|-----------|-----------|------|
| Tipo di immobile | `tipoImmobile` | Select |
| Percentuale possesso | `percentualePossesso` | Number (0-100) |
| Mesi di possesso | `mesiPossesso` | Number (1-12) |
| Cat. D privo di rendita | `gruppoD_noRendita` | Boolean |

#### Step 2: Abitazione Principale

| Checklist | Campo App | Tipo |
|-----------|-----------|------|
| Categoria lusso | `categoriaLusso` | Boolean |
| Pertinenze | `pertinenze[]` | Array |
| Coniugi residenza diversa | `coniugiResidenzaDiversa` | Boolean |

#### Step 3: Riduzioni e Agevolazioni

| Checklist | Campo App | Tipo |
|-----------|-----------|------|
| Comodato parenti | `comodatoParenti` | Boolean |
| Canone concordato | `canoneLocazione` | Select |
| Storico/artistico | `interesseStorico` | Boolean |
| Inagibile | `inagibile` | Boolean |
| Occupato abusivamente | `occupatoAbusivamente` | Boolean |

#### Step 4: Terreni

| Checklist | Campo App | Tipo |
|-----------|-----------|------|
| CD/IAP | `coltivatoreDiretto` | Boolean |
| Isole minori | `isolaMinore` | Boolean (auto) |
| Proprietà collettiva | `proprietaCollettiva` | Boolean |
| Comune montano | `comuneMontano` | Select (auto) |

#### Step 5: Versamento

| Checklist | Campo App | Tipo |
|-----------|-----------|------|
| Aliquota | `aliquota` | Number |
| Comune | `codiceComune` | Select |
| Anno imposta | `annoImposta` | Number |
| Importo minimo | `importoMinimo` | Number (default 12) |

#### Validazioni

1. **Pertinenze**: Max 3 (una per C/2, C/6, C/7)
2. **Comodato**: Stesso comune, unico immobile, contratto registrato
3. **Canone concordato**: Riduzione 75% automatica
4. **CD/IAP**: Esenzione totale terreni
5. **Categoria lusso**: Detrazione €200 applicabile

---

## 4. CHANGELOG

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
| 2025-12-10 | Aggiunta sezione 4.29: Adempimenti IMU (scadenze, sanzioni, ravvedimento) |
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
| 2025-12-10 | Espansa sezione 4.29: obbligo/esonero dichiarazione, modalità presentazione, MUI |
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
| 2025-12-11 | **Riorganizzazione documento** - Sezione 2 (analisi Excel) spostata in `docs/EXCEL_2022_ANALISI.md` |
| 2025-12-11 | SPECS.md ridotto da 2170 a 1850 righe (-15%) per migliorare navigabilità |
| 2025-12-11 | **RISTRUTTURAZIONE SEZIONE 3** - Nuova organizzazione per flusso logico calcolo IMU |
| 2025-12-11 | Da 29 sottosezioni disperse → 9 sezioni logiche (Presupposti → Base → Esenzioni → Riduzioni → Aliquote → Calcolo → Regionali → Adempimenti → Rapporti) |
| 2025-12-11 | ENC distribuito nelle sezioni pertinenti (non regime separato) - IMIS/IMI aggiunti come voci complete |
| 2025-12-11 | **Aggiunta mappatura fonti documentali** a tutte le sezioni 3.x (riferimenti a cartella `aggiornamenti/`) |

---

## NOTE

### Domande aperte

*Nessuna domanda aperta - IMIS, IMI, ILIA e IMPI ora documentati in sezione 3.7*

---

*Documento di specifiche tecniche per il progetto Calcolatore IMU*
