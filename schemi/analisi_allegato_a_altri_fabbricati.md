# Analisi Allegato A - Sezione 6: Altri Fabbricati

## Riferimento
Pagine 18-33 dell'Allegato A (protocollo 50585/2025)

## Descrizione Fattispecie
Fabbricati diversi dall'abitazione principale e dai fabbricati appartenenti al gruppo catastale D

## Struttura Generale

```
6. ALTRI FABBRICATI
└── 6.1 Tipologia immobile (SCELTA TRA 8)
    ├── 6.1.1 Abitazione locata o concessa in comodato
    ├── 6.1.2 Abitazione destinata a struttura turistico-ricettiva
    ├── 6.1.3 Abitazione a disposizione
    ├── 6.1.4 Abitazione utilizzata direttamente dal soggetto passivo
    ├── 6.1.5 Immobili di categoria A10, B, C
    ├── 6.1.6 Fabbricati civile abitazione - alloggi sociali/IACP (non assegnati)
    ├── 6.1.7 Alloggi regolarmente assegnati dagli IACP
    └── 6.1.8 Fabbricati divenuti inagibili già destinati ad abitazione principale
```

## Complessità
**MOLTO ALTA** - 8 tipologie, ognuna con condizioni specifiche annidate

---

## 6.1.1 Abitazione Locata o Concessa in Comodato

### Struttura
```
6.1.1 Abitazione locata o concessa in comodato
├── 6.1.1.1 Tipo di contratto (opzioni)
├── 6.1.1.2 Categorie catastali (opzioni)
├── 6.1.1.3 Durata del contratto (on/off + param)
├── 6.1.1.4 Condizioni locatario/comodatario (opzioni)
├── 6.1.1.5 Non titolare di proprietà (on/off)
├── 6.1.1.6 Destinazione d'uso (on/off)
├── 6.1.1.7 Reddito ISEE comodatario (on/off + param)
├── 6.1.1.8 Requisiti del soggetto passivo (on/off + opzioni)
├── 6.1.1.9 Limitatamente ad un solo immobile (on/off)
├── 6.1.1.10 Collocazione immobile (on/off + opzioni)
├── 6.1.1.11 Fabbricati divenuti inagibili (on/off + opzioni)
└── 6.1.1.12 Ulteriori condizioni comma 755 (on/off)
```

### Valori: Tipo di Contratto (6.1.1.1)

| Valore | Descrizione |
|--------|-------------|
| locazione | Locazione |
| locazione_canone_libero | Locazione a canone libero |
| locazione_art2_c1 | Locazione ai sensi dell'art. 2, comma 1, della Legge n. 431/1998 e s.m.i. |
| locazione_art2_c3 | Locazione ai sensi dell'art. 2, commi 3, della Legge n.431/1998 e s.m.i. |
| locazione_art5_c1 | Locazione ai sensi dell'art. 5, comma 1, della Legge n. 431/1998 e s.m.i. |
| locazione_studenti | Locazione a studenti ai sensi dell'art. 5, comma 2, della Legge n. 431/1998 e s.m.i. |
| locazione_art5_c3 | Locazione ai sensi dell'art. 5, comma 3, della Legge n. 431/1998 e s.m.i. |
| locazione_art2_c1_ridotto | Locazione art. 2 c.1 L.431/98 + canone ridotto ex art. 19, c. 1-bis, D.L. n. 133/14 |
| locazione_art2_c3_5_ridotto | Locazione art. 2 c.3 e 5 L.431/98 + canone ridotto ex art. 19, c. 1-bis, D.L. n. 133/14 |
| comodato | Comodato d'uso gratuito (opz: con contratto registrato) |
| locazione_o_comodato | Locazione o comodato d'uso gratuito (opz: con contratto registrato) |
| accordi_territoriali | Accordi/Patti territoriali per particolari esigenze abitative |

### Valori: Categorie Catastali Abitazioni (6.1.1.2)

| Categoria | Descrizione |
|-----------|-------------|
| A/1 | Abitazioni di tipo signorile |
| A/2 | Abitazioni di tipo civile |
| A/3 | Abitazioni di tipo economico |
| A/4 | Abitazioni di tipo popolare |
| A/5 | Abitazioni di tipo ultrapopolare |
| A/6 | Abitazioni di tipo rurale |
| A/7 | Abitazioni in villini |
| A/8 | Abitazioni in ville |
| A/9 | Castelli, palazzi di eminenti pregi artistici o storici |
| A/11 | Abitazioni o alloggi tipici dei luoghi |

### Valori: Condizioni Locatario/Comodatario (6.1.1.4)

| Valore | Descrizione | Parametro |
|--------|-------------|-----------|
| parenti_primo_grado_diversi | Parenti sino al primo grado (ipotesi diverse da art. 1 c.747 lett.c) | - |
| parenti_primo_grado_747c | Parenti sino al primo grado (ipotesi di cui all'art. 1 c.747 lett.c) | - |
| parenti_secondo_grado_retta | Parenti sino al secondo grado (in linea retta) | - |
| parenti_secondo_grado_collaterale | Parenti sino al secondo grado (in linea retta e collaterale) | - |
| parenti_terzo_grado_retta | Parenti sino al terzo grado (in linea retta) | - |
| parenti_terzo_grado_collaterale | Parenti sino al terzo grado (in linea retta e collaterale) | - |
| parenti_qualsiasi | Indipendentemente dal grado di parentela | - |
| invalidita_civile | Soggetto con invalidità civile riconosciuta in percentuale non inferiore al | percentuale |
| studenti | Studenti | - |
| disabilita_104 | Persona con disabilità riconosciuta ai sensi dell'art. 3 c.3 L.104/92 | - |
| nucleo_difficolta | Nucleo familiare in difficoltà economiche (come definite nel regolamento) | - |
| vulnerabilita_sociale | Soggetto in condizioni di vulnerabilità sociale/emergenza abitativa | - |
| onlus_terzo_settore | ONLUS o altri enti del terzo settore | - |
| gestore_casa_famiglia | Soggetto gestore di casa-famiglia o altra struttura assistenza | - |
| gestore_struttura_vittime | Soggetto gestore struttura accoglienza vittime violenza | - |
| affidatari_accoglienza | Soggetti affidatari servizi accoglienza richiedenti asilo | - |

### Valori Comuni: Requisiti Soggetto Passivo

Usati in 6.1.1.8, 6.1.2.6, 6.1.3.5, 6.1.4.2, 6.1.5.6:

| Valore | Descrizione | Parametro |
|--------|-------------|-----------|
| onlus_terzo_settore | Posseduti da ONLUS o enti del terzo settore | - |
| enti_non_commerciali | Posseduti da enti non commerciali | - |
| societa_con_personalita | Posseduti da società o altri soggetti con personalità giuridica | - |
| societa_senza_personalita | Posseduti da società o altri soggetti senza personalità giuridica | - |
| invalidita_civile | Soggetto con invalidità civile riconosciuta in percentuale non inferiore al | percentuale |
| disabilita_104 | Persona con disabilità riconosciuta ai sensi dell'art. 3 c.3 L.104/92 | - |

### Valori Comuni: Collocazione Immobile

Usati in 6.1.1.10, 6.1.2.2, 6.1.3.6, 6.1.5.5:

| Valore | Descrizione | Parametro |
|--------|-------------|-----------|
| centro_storico | Dentro il centro storico | - |
| fuori_centro_storico | Fuori dal centro storico | - |
| zona_specifica | In una zona specificamente indicata dal comune | specifica |
| zona_abbandono | In zone soggette ad alto tasso di abbandono di attività economico-commerciale | specifica |
| zona_non_servita | In zona non servita da servizi pubblici | - |

### Valori Comuni: Fabbricati Inagibili

Usati in 6.1.1.11, 6.1.2.7, 6.1.3.7, 6.1.4.5, 6.1.5.9, 6.1.6.1, 6.1.7.1:

| Valore | Descrizione |
|--------|-------------|
| ipotesi_art1_c747_b | Ipotesi di cui all'art. 1, comma 747, lett. b), della legge n. 160 del 2019 |
| ipotesi_diverse → calamita | A seguito di calamità naturali |
| ipotesi_diverse → cause_diverse | A seguito di cause diverse da calamità naturali |
| ipotesi_diverse → calamita_o_altre | A seguito di calamità naturali o di cause diverse da calamità naturali |

---

## 6.1.2 Abitazione Destinata a Struttura Turistico-Ricettiva

### Struttura
```
6.1.2 Abitazione destinata a struttura turistico-ricettiva
├── 6.1.2.1 Codice ATECO (on/off + livelli)
├── 6.1.2.2 Collocazione immobile (opzioni)
├── 6.1.2.3 Attività condotta in forma imprenditoriale (on/off)
├── 6.1.2.4 In attività da almeno (on/off + param mesi)
├── 6.1.2.5 Limitatamente ad un solo immobile (on/off)
├── 6.1.2.6 Requisiti del soggetto passivo (on/off + opzioni)
├── 6.1.2.7 Fabbricati divenuti inagibili (on/off + opzioni)
└── 6.1.2.8 Ulteriori condizioni comma 755 (on/off)
```

---

## 6.1.3 Abitazione a Disposizione

### Struttura
```
6.1.3 Abitazione a disposizione
├── 6.1.3.1 Definizione di abitazioni a disposizione (opzioni)
├── 6.1.3.2 Categorie catastali (opzioni)
├── 6.1.3.3 Persistenza condizione (on/off + param mesi)
├── 6.1.3.4 Utilizzo/Inutilizzo (opzioni)
├── 6.1.3.5 Requisiti del soggetto passivo (on/off + opzioni)
├── 6.1.3.6 Collocazione immobile (on/off + opzioni)
├── 6.1.3.7 Fabbricati divenuti inagibili (on/off + opzioni)
└── 6.1.3.8 Ulteriori condizioni comma 755 (on/off)
```

### Valori: Definizione di Abitazioni a Disposizione (6.1.3.1)

| Valore | Descrizione | Parametro |
|--------|-------------|-----------|
| non_locate_non_comodato | Abitazioni non locate e non concesse in comodato | - |
| non_locate_o_parzialmente | Abitazioni non locate/comodato + locate/comodato per periodi inferiori all'anno | mesi_max |
| onlus_terzo_settore | Abitazioni non locate e non concesse in comodato di proprietà di ONLUS o di altri enti del terzo settore | - |

### Valori: Utilizzo/Inutilizzo (6.1.3.4)

| Valore | Descrizione | Parametro |
|--------|-------------|-----------|
| privi_arredo | Privi di ogni arredo | - |
| senza_utenze | Sprovvisti di utenze di fornitura attive di acqua, luce e gas | - |
| privi_arredo_senza_utenze | Privi di ogni arredo, sprovvisti di utenze di fornitura attive di acqua, luce e gas | - |
| crisi_aziendale | Inutilizzato a seguito di crisi aziendale | - |
| uso_limitato | Con uso limitato e discontinuo o stagionale, per un utilizzo complessivo non superiore a mesi | mesi |

---

## 6.1.4 Abitazione Utilizzata Direttamente dal Soggetto Passivo

### Struttura
```
6.1.4 Abitazione utilizzata direttamente dal soggetto passivo
├── 6.1.4.1 Categorie catastali (opzioni)
├── 6.1.4.2 Requisiti del soggetto passivo (on/off + opzioni)
├── 6.1.4.3 Destinazione d'uso (on/off + opzioni)
├── 6.1.4.4 Reddito ISEE soggetto passivo (on/off + param)
├── 6.1.4.5 Fabbricati divenuti inagibili (on/off + opzioni)
└── 6.1.4.6 Ulteriori condizioni comma 755 (on/off)
```

### Valori: Destinazione d'Uso (6.1.4.3)

| Valore | Descrizione |
|--------|-------------|
| casa_famiglia | Casa-famiglia o altra struttura destinata all'assistenza, cura e protezione alle persone con necessità di sostegno intensivo e prive di sostegno familiare |
| struttura_vittime | Struttura destinata all'accoglienza e protezione di persone vittime di violenza o che vivono in condizioni di disagio e vulnerabilità sociale |
| accoglienza_asilo | Servizi di accoglienza integrata destinati a richiedenti asilo e titolari di protezione internazionale o umanitaria |

---

## 6.1.5 Immobili di Categoria A10, B, C

### Complessità
**ALTA** - Struttura simile a Fabbricati D con 6 tipi di uso immobile

### Struttura
```
6.1.5 Immobili di categoria A10, B, C
├── 6.1.5.1 Categorie catastali (opzioni)
├── 6.1.5.2 Superficie (on/off + param)
├── 6.1.5.3 Oggetto recupero decoro/energia (on/off)
├── 6.1.5.4 Rendita catastale (on/off + param)
├── 6.1.5.5 Collocazione immobile (opzioni)
├── 6.1.5.6 Requisiti del soggetto passivo (on/off + opzioni)
├── 6.1.5.7 Fabbricati a disposizione o utilizzati (SCELTA TRA 6)
│   ├── 6.1.5.7.1 Immobili a disposizione
│   ├── 6.1.5.7.2 Immobili locati o concessi in comodato
│   ├── 6.1.5.7.3 Immobili locati
│   ├── 6.1.5.7.4 Immobili concessi in comodato
│   ├── 6.1.5.7.5 Immobili utilizzati direttamente dal soggetto passivo
│   └── 6.1.5.7.6 Immobili locati/comodato/utilizzati
├── 6.1.5.8 Limitatamente ad un solo immobile (on/off)
├── 6.1.5.9 Fabbricati divenuti inagibili (on/off + opzioni)
└── 6.1.5.10 Ulteriori condizioni comma 755 (on/off)
```

### Valori: Categorie Catastali A10, B, C (6.1.5.1)

| Categoria | Descrizione |
|-----------|-------------|
| A/10 | Uffici e studi privati |
| B/1 | Collegi e convitti, educandati; ricoveri; orfanotrofi; ospizi; conventi; seminari; caserme |
| B/2 | Case di cura ed ospedali (senza fine di lucro) |
| B/3 | Prigioni e riformatori |
| B/4 | Uffici pubblici |
| B/5 | Scuole e laboratori scientifici |
| B/6 | Biblioteche, pinacoteche, musei, gallerie, accademie che non hanno sede in edifici della categoria A/9 |
| B/7 | Cappelle ed oratori non destinati all'esercizio pubblico del culto |
| B/8 | Magazzini sotterranei per depositi di derrate |
| C/1 | Negozi e botteghe |
| C/2 | Magazzini e locali di deposito |
| C/3 | Laboratori per arti e mestieri |
| C/4 | Fabbricati e locali per esercizi sportivi (senza fine di lucro) |
| C/5 | Stabilimenti balneari e di acque curative (senza fine di lucro) |
| C/6 | Stalle, scuderie, rimesse, autorimesse (senza fine di lucro) |
| C/7 | Tettoie chiuse od aperte |

### Matrice Vincoli per uso_immobile (6.1.5.7)

**IDENTICA a quella di Fabbricati Gruppo D (sezione 3.7)**

| Condizione | 6.1.5.7.1 disp | 6.1.5.7.2 loc+com | 6.1.5.7.3 loc | 6.1.5.7.4 com | 6.1.5.7.5 util | 6.1.5.7.6 tutti |
|------------|:--------------:|:-----------------:|:-------------:|:-------------:|:--------------:|:---------------:|
| persistenza_minima | ✓ | - | - | - | - | - |
| utilizzo_inutilizzo | ✓ | - | - | - | - | - |
| requisiti_soggetto | - | LOC/COM | LOC | COM | UTILIZZATORE | TUTTI |
| destinazione_uso | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| tipologia_attivita | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| codice_ateco | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| numero_dipendenti | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| potenza_impianti | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| contratto_registrato | - | ✓ | **✗** | ✓ | - | ✓ |

**Nota**: stesso vincolo di FAQ 8 - contratto_registrato non in "locati" puri

### Valori Requisiti Soggettivi Locatario/Comodatario (6.1.5.7.2-4)

ESTESI rispetto a Fabbricati D:

| Valore | Descrizione | Parametro |
|--------|-------------|-----------|
| onlus_terzo_settore | ONLUS o altri enti del terzo settore | - |
| persona_fisica_eta | Persona fisica di età non superiore ad anni | anni |
| persona_giuridica_max_mesi | Persona giuridica esercente attività d'impresa da un numero di mesi non superiore a | mesi |
| persona_giuridica_min_mesi | Persona giuridica esercente attività d'impresa da un numero di mesi non inferiore a | mesi |
| gestore_casa_famiglia | Soggetto gestore di casa-famiglia o altra struttura destinata all'assistenza | - |
| gestore_struttura_vittime | Soggetto gestore struttura accoglienza e protezione vittime violenza | - |
| affidatari_accoglienza | Soggetti affidatari servizi accoglienza richiedenti asilo | - |

### Valori Destinazione d'Uso (6.1.5.7.x - esclusi impianti energia)

| Valore | Descrizione | Parametro |
|--------|-------------|-----------|
| attivita_produttiva | Utilizzato per attività produttiva e/o commerciale o per l'esercizio di arti e professioni | - |
| uso_limitato | Con uso limitato e discontinuo o stagionale, per un periodo complessivo inferiore a mesi | mesi |
| scopi_istituzionali | Utilizzati per scopi istituzionali o di pubblica utilità, senza fine di lucro | - |
| non_produttivi_reddito | Immobili non produttivi di reddito fondiario (art. 43 T.U.I.R.) | - |
| bottega_storica | Bottega storica o artigiana | - |
| cig | Azienda che abbia fatto ricorso nell'anno di imposta alla CIG o ad analogo ammortizzatore sociale | - |
| no_azzardo | Privi o che intendono dismettere giochi di azzardo | - |

**NOTA**: In 6.1.5 NON ci sono gli impianti eolici/fotovoltaici/idroelettrici (diverso da Fabbricati D)

---

## 6.1.6 Fabbricati Civile Abitazione - Alloggi Sociali/IACP (Non Assegnati)

### Struttura
```
6.1.6 Fabbricati di civile abitazione destinati ad alloggi sociali o posseduti dagli IACP
      (non adibiti ad abitazione principale per il periodo di espletamento delle attività di assegnazione)
├── Fino a mesi (param)
├── 6.1.6.1 Fabbricati divenuti inagibili (on/off + opzioni)
└── 6.1.6.2 Ulteriori condizioni comma 755 (on/off)
```

**Complessità**: BASSA

---

## 6.1.7 Alloggi Regolarmente Assegnati IACP

### Struttura
```
6.1.7 Alloggi regolarmente assegnati dagli IACP o dagli enti di edilizia residenziale pubblica
├── 6.1.7.1 Fabbricati divenuti inagibili (on/off + opzioni)
└── 6.1.7.2 Ulteriori condizioni comma 755 (on/off)
```

**Complessità**: MOLTO BASSA - Solo 2 condizioni

---

## 6.1.8 Fabbricati Inagibili già Destinati ad Abitazione Principale

### Struttura
```
6.1.8 Fabbricati divenuti inagibili già destinati ad abitazione principale
├── 6.1.8.1 Tipologia fabbricato (opzioni)
├── 6.1.8.2 Fabbricato divenuto inagibile (opzioni)
└── 6.1.8.3 Ulteriori condizioni comma 755 (on/off)
```

### Valori: Tipologia Fabbricato (6.1.8.1)

| Valore | Descrizione |
|--------|-------------|
| cat_diverse_A1_A8_A9 | Fabbricati divenuti inagibili già destinati ad abitazione principale di categoria catastale diversa da A/1, A/8 e A/9 e relative pertinenze |
| cat_A1_A8_A9 | Fabbricati divenuti inagibili già destinati ad abitazione principale di categoria catastale A/1, A/8 e A/9 e relative pertinenze |

### Valori: Fabbricato Divenuto Inagibile (6.1.8.2)

| Valore | Descrizione |
|--------|-------------|
| calamita | A seguito di calamità naturali |
| cause_diverse | A seguito di cause diverse da calamità naturali |
| calamita_o_altre | A seguito di calamità naturali o di cause diverse da calamità naturali |

---

## Riepilogo Complessità per Tipologia

| Tipologia | Complessità | Condizioni Livello 1 | Condizioni Annidate |
|-----------|-------------|---------------------|---------------------|
| 6.1.1 Abitazione locata/comodato | ALTA | 12 | Sì (inagibili) |
| 6.1.2 Struttura turistico-ricettiva | MEDIA | 8 | Sì (inagibili) |
| 6.1.3 Abitazione a disposizione | MEDIA | 8 | Sì (inagibili) |
| 6.1.4 Abitazione utilizzata direttamente | MEDIA | 6 | Sì (inagibili) |
| 6.1.5 Immobili A10, B, C | MOLTO ALTA | 10 + 6 tipi uso | Sì (vincoli come Fabbricati D) |
| 6.1.6 Alloggi sociali/IACP non assegnati | BASSA | 3 | Sì (inagibili) |
| 6.1.7 Alloggi IACP assegnati | MOLTO BASSA | 2 | Sì (inagibili) |
| 6.1.8 Inagibili ex abitazione principale | BASSA | 3 | No |

## Conclusioni

1. **6.1.5 (Immobili A10, B, C)** ha struttura IDENTICA a Fabbricati Gruppo D (sezione 3)
2. **Vincoli FAQ 8** si applicano anche qui: contratto_registrato non in "locati" puri
3. **Destinazione d'uso in 6.1.5** NON include impianti energia (differenza da Fabbricati D)
4. **Requisiti soggettivi** in 6.1.5 ESTESI con gestori strutture sociali
5. **Tipologie 6.1.1-6.1.4** sono specifiche per ABITAZIONI (categoria A)
6. **Tipologie 6.1.6-6.1.8** sono casi speciali con poche condizioni
