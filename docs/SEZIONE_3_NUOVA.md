# SEZIONE 3 - FUNZIONALITÀ (Ristrutturata)

> Funzionalità del calcolatore IMU, organizzate per flusso logico del calcolo.
>
> **Struttura:** Presupposti → Base Imponibile → Esenzioni → Riduzioni → Aliquote → Calcolo → Imposte Regionali → Adempimenti → Altre Imposte

---

## Indice Sezione 3

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

## 3.1 PRESUPPOSTI

### 3.1.1 Presupposto Soggettivo (Chi Paga)

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

### 3.1.2 Presupposto Oggettivo (Cosa si Tassa)

**Fonte:** Art. 1, c. 740-741, L. 160/2019

**Oggetto dell'imposta:**
- Fabbricati
- Aree fabbricabili
- Terreni agricoli

**Esclusioni oggettive:**
- Fabbricati rurali ad uso strumentale (ubicati in comuni montani/parzialmente montani)
- Terreni agricoli in comuni montani (elenco ISTAT Circ. 9/1993)

### 3.1.3 Casi Particolari Soggettività

#### Leasing Immobiliare

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

#### Trust e Trustee

**Fonte:** Cass. 16550/2019; Cass. 15988/2020

**Principio:**
- Per immobili vincolati in **trust**, il soggetto passivo IMU è il **trustee**
- Il trust è privo di personalità giuridica
- I beni sono trasferiti fiduciariamente al trustee
- Non viola il principio di segregazione patrimoniale

**Funzionalità:**
- Tipologia soggetto "Trust"
- Campo "Trustee" come soggetto passivo

#### Società di Persone

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

#### Altri Casi Particolari

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

## 3.2 BASE IMPONIBILE

### 3.2.1 Fabbricati (Rendita × Coefficiente)

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

#### Fabbricati in Corso di Costruzione/Ristrutturazione

**Fonte:** Art. 1, c. 746, L. 160/2019

Per fabbricati in corso di costruzione, ricostruzione o recupero edilizio:
- **L'IMU si applica sull'area fabbricabile**, non sul fabbricato
- Durata: fino a ultimazione lavori o utilizzo (se anteriore)
- Eccezione: manutenzione ordinaria/straordinaria → IMU sul fabbricato

**Funzionalità:**
- Flag "In costruzione/ristrutturazione"
- Campo data inizio lavori, data fine prevista
- Calcolo IMU su valore area

### 3.2.2 Fabbricati Gruppo D Non Catastati

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

### 3.2.3 Terreni Agricoli

**Fonte:** Art. 1, c. 746, L. 160/2019

**Formula:**
```
Base imponibile = Reddito dominicale × 1,25 × 135
```

### 3.2.4 Aree Fabbricabili

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

### 3.2.5 Pertinenze

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

## 3.3 ESENZIONI

### 3.3.1 Abitazione Principale

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

#### Casa Familiare

**Fonte:** L. 160/2019 art. 1 c. 741 lett. c) n. 4

Include anche coppie **non sposate** con figli:
- La "casa familiare" è definita dal **provvedimento del Giudice**
- Si prescinde dalla proprietà (può essere anche di terzi)
- Non rilevanti residenza e dimora dell'assegnatario

#### Immobili Assimilati (art. 1, c. 741, lett. c)

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

### 3.3.2 Terreni Agricoli

**Fonte:** Art. 1, c. 758, L. 160/2019

**Esenzioni totali:**

| Tipologia | Note |
|-----------|------|
| Terreni posseduti e condotti da **CD/IAP** | Qualunque ubicazione |
| Terreni nelle **isole minori** | Allegato A L. 448/2001 |
| Terreni a **proprietà collettiva** | Indivisibile/inusucapibile |
| Terreni in **zone montane/collinari** | Elenco ISTAT Circ. 9/1993 |

#### CD/IAP Pensionati

**Fonte:** Art. 78-bis L. 126/2020

Si considerano CD/IAP anche i **pensionati** che:
- Continuano a svolgere attività in agricoltura
- Mantengono l'iscrizione nella gestione previdenziale agricola

**Funzionalità:**
- Flag per ciascuna tipologia di esenzione
- Flag "Pensionato con attività agricola"
- Verifica automatica tramite codice catastale comune

### 3.3.3 Fabbricati

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

#### IACP/ERP

**Fonte:** L. 160/2019 art. 1 cc. 749, 754; Circ. MEF 1/DF 2020 par. 3

| Tipo immobile | Trattamento |
|---------------|-------------|
| Alloggi IACP/ERP regolarmente assegnati | Detrazione €200, aliquota ordinaria |
| Alloggi IACP/ERP sfitti | Possibilità azzeramento aliquota |
| Alloggi sociali (D.M. 22/4/2008) | **Esenti** se abitazione principale |

> **ATTENZIONE:** IACP ≠ automaticamente "alloggi sociali". Esenzione solo se conformi a D.M. 22/4/2008.

### 3.3.4 ENC (Enti Non Commerciali)

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

#### ENC Attività Sportive

**Fonte:** Art. 6-bis D.L. 84/2025

Semplificazione per ENC con attività sportive dilettantistiche (D.Lgs. 36/2021).

**Funzionalità:**
- Tipologia soggetto "Ente Non Commerciale"
- Campo "Uso promiscuo" con % superficie
- Campo "Immobile in comodato a ENC collegato"
- Flag "Attività sportiva dilettantistica"

### 3.3.5 Altre Esenzioni

#### Occupazione Abusiva

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

#### Esenzioni Sisma

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

#### Esenzioni Storiche D.Lgs. 504/1992 art. 7

| Lettera | Descrizione |
|---------|-------------|
| a) | Enti pubblici (Stato, Regioni, ecc.) |
| c) | Fabbricati usi culturali (art. 5-bis DPR 601/73) |
| g) | Inagibili recuperati per attività L. 104/92 |
| h) | Terreni montani/collinari |

---

## 3.4 RIDUZIONI

### 3.4.1 Riduzioni Base Imponibile (50%)

**Fonte:** Art. 1, cc. 747-750, L. 160/2019

| Riduzione | Condizioni | Dichiarazione |
|-----------|------------|---------------|
| Storico/artistico | Art. 10 D.Lgs. 42/2004 | Acquisto **e** perdita |
| Inagibile/inabitabile | Perizia o dichiarazione + non utilizzato | Solo **perdita** diritto |
| Comodato parenti 1° grado | Contratto registrato, stesso comune | Sempre |
| Pensionati esteri AIRE | Un solo immobile, non locato | Sempre |

#### Pensionati Esteri/AIRE

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

### 3.4.2 Riduzioni Imposta (25%)

**Fonte:** Art. 1, c. 760, L. 160/2019

| Riduzione | Condizioni |
|-----------|------------|
| Canone concordato | Art. 2 c.3 L. 431/1998 |

**Note:** Riduzione 75% aliquota (= 25% imposta in meno).

---

## 3.5 ALIQUOTE E DETRAZIONI

### 3.5.1 Aliquote Base e Comunali

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

### 3.5.2 Prospetto Aliquote Obbligatorio

**Fonte:** D.M. 7/7/2023; D.M. 6/9/2024; Art. 6, L. 108/2025

**Dal 2025:** Comuni obbligati ad utilizzare il Prospetto ministeriale.

**Proroga 2025 (Art. 6, L. 108/2025):**
- Comuni senza delibera entro 28/02/2025 → possono approvare entro **15/09/2025**
- Delibera senza Prospetto = **non idonea**

**Funzionalità:**
- Possibile integrazione portale MEF
- Alert per scadenza 15/09/2025

### 3.5.3 Detrazioni

| Tipo | Importo | Note |
|------|---------|------|
| Abitazione principale (A/1, A/8, A/9) | **€200** | Proporzionale a mesi/quota |
| Per figli < 26 anni | **€0** | **ABOLITA dal 2014** |
| IACP/ERP regolarmente assegnati | **€200** | |

### 3.5.4 Quote Stato/Comune

| Tipologia | Quota Stato | Quota Comune |
|-----------|-------------|--------------|
| Gruppo D | 0,76% | Eccedenza |
| Tutto il resto | 0% | 100% |

---

## 3.6 CALCOLO

### 3.6.1 Formula Generale

```
IMU = Base imponibile × Aliquota × (Mesi / 12) × (Quota / 100) - Detrazioni
```

**Con riduzioni:**
```
IMU = (Base imponibile × Riduzione%) × Aliquota × (Mesi / 12) × (Quota / 100) - Detrazioni
```

### 3.6.2 Regola del Mese

**Fonte:** Art. 1, c. 761, L. 160/2019

| Situazione | Conteggio |
|------------|-----------|
| Possesso > metà giorni del mese | **Mese intero** |
| Giorno di trasferimento | A carico dell'**acquirente** |
| Giorni possesso uguali | Mese intero all'**acquirente** |

### 3.6.3 Importo Minimo

**Default:** €12 (se comune non delibera diversamente)

### 3.6.4 Arrotondamenti

- Importo da versare: arrotondamento all'euro (€0,49 → €0; €0,50 → €1)

---

## 3.7 IMPOSTE SOSTITUTIVE/REGIONALI

### 3.7.1 IMPI (Piattaforme Marine)

**Fonte:** Art. 38 D.L. 124/2019

**Caratteristiche:**
- Imposta sulle piattaforme marine
- Aliquota fissa (comuni NON possono variare)
- Versamento unica soluzione 16 dicembre

### 3.7.2 ILIA (Friuli Venezia Giulia)

**Fonte:** Art. 1, c. 528, L. 213/2023; L.R. FVG 17/2022

**Dal 2023:** ILIA **sostituisce** IMU e IRPEF/addizionali per immobili non locati in FVG.

**Caratteristiche:**
- Disciplina analoga a IMU nazionale
- Deducibilità come IMU strumentali

**Funzionalità:**
- Rilevamento automatico comune FVG → calcolo ILIA

### 3.7.3 IMIS (Trentino)

**Fonte:** L.P. Trento 14/2014

Imposta immobiliare semplice della Provincia autonoma di Trento.

### 3.7.4 IMI (Alto Adige)

**Fonte:** L.P. Bolzano 3/2014

Imposta municipale immobiliare della Provincia autonoma di Bolzano.

---

## 3.8 ADEMPIMENTI

### 3.8.1 Versamento

**Fonte:** Art. 1, cc. 762-768, L. 160/2019

#### Scadenze

| Scadenza | Adempimento | Note |
|----------|-------------|------|
| **16 giugno** | Acconto (I rata) | Aliquote anno precedente |
| **16 dicembre** | Saldo (II rata) | Aliquote pubblicate entro 28/10 |
| 16 giugno | Unica soluzione | Facoltativa |

**Non residenti:** Unica soluzione entro 16/12 con interessi **3%** sulla I rata.

#### Modalità

- **F24**: ordinario, semplificato, EP
- **Bollettino postale**
- **PagoPA** (non ancora operativo)

#### Codici Tributo

| Codice | Descrizione |
|--------|-------------|
| 3912 | Abitazione principale e pertinenze (A/1, A/8, A/9) |
| 3913 | Fabbricati rurali strumentali |
| 3914 | Terreni |
| 3916 | Aree fabbricabili |
| 3918 | Altri fabbricati |
| 3925 | Fabbricati D - Stato |
| 3930 | Fabbricati D - Comune |

### 3.8.2 Dichiarazione IMU

**Fonte:** Art. 1, c. 769, L. 160/2019; D.M. 24/4/2024

**Termine:** 30 giugno anno successivo

**Efficacia:** Pluriennale (fino a nuova variazione)

#### Obbligo Dichiarativo

**Sussiste per:**
- Immobili con **riduzioni**
- Variazioni **non conoscibili** dal comune
- **Beni merce** (Cass. 32115/2024: a pena decadenza)

**Esonero:**
- Atti con MUI (notai)
- Procedure specifiche regolamento comunale

#### Modalità Presentazione

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

### 3.8.3 Dichiarazione ENC (Annuale)

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

### 3.8.4 Sanzioni e Ravvedimento

**Fonte:** Art. 1, c. 767, L. 160/2019

| Violazione | Sanzione |
|------------|----------|
| Omessa dichiarazione | **100%-200%** (min. €50) |
| Dichiarazione infedele | **50%-100%** maggiore imposta |
| Errori formali | **€50-€250** |
| Omesso/insufficiente versamento | **30%** |

**Ravvedimento operoso:** Applicabile con riduzioni sanzioni in base ai tempi.

#### Cumulo Sanzioni Pluriennali

**Fonte:** Cass. 11432/2022; Art. 12 D.Lgs. 472/1997

Per omesso versamento pluriennale: **regime continuazione attenuata**.
- Sanzione base **aumentata da metà a triplo**
- Obbligatorio (non facoltativo per l'Ente)

### 3.8.5 Termini Decadenza

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

## 3.9 RAPPORTO ALTRE IMPOSTE

### 3.9.1 IMU/IRPEF

**Fonte:** Art. 9, c. 9, D.Lgs. 23/2011

| Situazione | IMU | IRPEF |
|------------|-----|-------|
| Immobile non locato, **diverso** comune da abitaz. princ. | ✅ | ❌ No |
| Immobile non locato, **stesso** comune abitaz. princ. | ✅ | ✅ **50%** reddito |
| Immobile locato | ✅ | ✅ 100% (o cedolare) |

**Funzionalità:**
- Alert "Reddito fondiario 50% IRPEF" se stesso comune

### 3.9.2 Deducibilità IMU

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

## Mappatura Checklist → Campi App

**Fonte:** Check List Acconto IMU 2025 (Wolters Kluwer)

### Step 1: Dati Immobile

| Checklist | Campo App | Tipo |
|-----------|-----------|------|
| Tipo di immobile | `tipoImmobile` | Select |
| Percentuale possesso | `percentualePossesso` | Number (0-100) |
| Mesi di possesso | `mesiPossesso` | Number (1-12) |
| Cat. D privo di rendita | `gruppoD_noRendita` | Boolean |

### Step 2: Abitazione Principale

| Checklist | Campo App | Tipo |
|-----------|-----------|------|
| Categoria lusso | `categoriaLusso` | Boolean |
| Pertinenze | `pertinenze[]` | Array |
| Coniugi residenza diversa | `coniugiResidenzaDiversa` | Boolean |

### Step 3: Riduzioni e Agevolazioni

| Checklist | Campo App | Tipo |
|-----------|-----------|------|
| Comodato parenti | `comodatoParenti` | Boolean |
| Canone concordato | `canoneLocazione` | Select |
| Storico/artistico | `interesseStorico` | Boolean |
| Inagibile | `inagibile` | Boolean |
| Occupato abusivamente | `occupatoAbusivamente` | Boolean |

### Step 4: Terreni

| Checklist | Campo App | Tipo |
|-----------|-----------|------|
| CD/IAP | `coltivatoreDiretto` | Boolean |
| Isole minori | `isolaMinore` | Boolean (auto) |
| Proprietà collettiva | `proprietaCollettiva` | Boolean |
| Comune montano | `comuneMontano` | Select (auto) |

### Step 5: Versamento

| Checklist | Campo App | Tipo |
|-----------|-----------|------|
| Aliquota | `aliquota` | Number |
| Comune | `codiceComune` | Select |
| Anno imposta | `annoImposta` | Number |
| Importo minimo | `importoMinimo` | Number (default 12) |

### Validazioni

1. **Pertinenze**: Max 3 (una per C/2, C/6, C/7)
2. **Comodato**: Stesso comune, unico immobile, contratto registrato
3. **Canone concordato**: Riduzione 75% automatica
4. **CD/IAP**: Esenzione totale terreni
5. **Categoria lusso**: Detrazione €200 applicabile
