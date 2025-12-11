# Ristrutturazione SPECS.md - Documento di Lavoro

> Documento per pianificare la riorganizzazione di SPECS.md basata sull'analisi dei documenti in `aggiornamenti/`
>
> **Aggiornato:** 2025-12-11 - Analisi completata su 93 file

---

## Nuova Struttura Sezione 3 - FUNZIONALITÀ

```
3.1 PRESUPPOSTI
    3.1.1 Presupposto soggettivo (chi paga)
    3.1.2 Presupposto oggettivo (cosa si tassa)
    3.1.3 Casi particolari

3.2 BASE IMPONIBILE
    3.2.1 Fabbricati (rendita × coefficiente)
    3.2.2 Fabbricati gruppo D non catastati
    3.2.3 Terreni agricoli
    3.2.4 Aree fabbricabili
    3.2.5 Pertinenze

3.3 ESENZIONI
    3.3.1 Abitazione principale
    3.3.2 Terreni agricoli
    3.3.3 Fabbricati
    3.3.4 ENC (attività non commerciali)
    3.3.5 Altre esenzioni

3.4 RIDUZIONI
    3.4.1 Riduzioni base imponibile (50%)
    3.4.2 Riduzioni imposta (25%)

3.5 ALIQUOTE E DETRAZIONI
    3.5.1 Aliquote base e comunali
    3.5.2 Prospetto aliquote obbligatorio
    3.5.3 Detrazioni
    3.5.4 Quote Stato/Comune

3.6 CALCOLO
    3.6.1 Formula generale
    3.6.2 Regola del mese
    3.6.3 Importo minimo
    3.6.4 Arrotondamenti

3.7 IMPOSTE SOSTITUTIVE/REGIONALI
    3.7.1 IMPI (piattaforme marine)
    3.7.2 ILIA (Friuli VG)
    3.7.3 IMIS (Trentino)
    3.7.4 IMI (Alto Adige)

3.8 ADEMPIMENTI
    3.8.1 Versamento (scadenze, F24, codici tributo)
    3.8.2 Dichiarazione IMU (obbligo, esonero, modalità)
    3.8.3 Dichiarazione ENC (annuale)
    3.8.4 Sanzioni e ravvedimento
    3.8.5 Termini decadenza

3.9 RAPPORTO ALTRE IMPOSTE
    3.9.1 IMU/IRPEF
    3.9.2 Deducibilità IMU
```

---

## Copertura Sezioni per Fonte Documentale

| Sezione | Copertura | File principali |
|---------|-----------|-----------------|
| **3.1 PRESUPPOSTI** | ✅ Completa | presupposto-soggettivo-imu.md, presupposto-oggettivo-imu.md, trustee-soggetto-passivo-imu.md |
| **3.2 BASE IMPONIBILE** | ✅ Completa | imu_base_imponibile_aliquote.md, imu-fabbricati.md, imu-area-fabbricabile.md |
| **3.3 ESENZIONI** | ✅ Completa (26 file) | dossier_imu_2025.md, imu-terreni-agricoli.md, decreto-legislativo-504-1992-art-7.md |
| **3.4 RIDUZIONI** | ✅ Completa | imu_base_imponibile_aliquote.md, imu-versamento-acconto.md |
| **3.5 ALIQUOTE** | ✅ Completa | imu_base_imponibile_aliquote.md, articolo_ipsoa_imu_2025.md |
| **3.6 CALCOLO** | ✅ Completa | checklist_acconto_imu_2025.md, imu-versamento-acconto.md |
| **3.7 IMPOSTE SOST.** | ⚠️ Parziale | i10188722_IMPI_piattaforme_marine.md, novita_imu_bilancio_2024.md |
| **3.8 ADEMPIMENTI** | ✅ Completa (13 file) | imu_dichiarazione.md, IMU_IMPi_Istruzioni.md, specifiche tecniche |
| **3.9 ALTRE IMPOSTE** | ✅ Completa (7 file) | imu-beni-immobili-uso-abitativo-non-locati.md, deducibilità IMU |

---

## Analisi Documenti per Cartella

### File root aggiornamenti/

| File | Sezioni | Contenuto principale |
|------|---------|---------------------|
| dossier_imu_2025.md | 3.1, 3.3, 3.5, 3.7, 3.8 | Termini, dichiarazioni, esenzioni, ILIA, prospetto aliquote 2025 |
| articolo_ipsoa_imu_2025.md | 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8 | Guida completa IMU 2025 con tabelle coefficienti |

### IMU - Dichiarazione/ (6 file)

| File | Sezioni | Contenuto principale |
|------|---------|---------------------|
| imu_dichiarazione.md | 3.1, 3.8 | Obbligo dichiarazione, soggetti, modalità, sanzioni |
| decreto_mef_24042024.md | 3.1, 3.3, 3.7, 3.8 | Modelli IMU/IMPi e ENC, esenzione occupazione abusiva |
| IMU_IMPi_Istruzioni.md | 3.1-3.8 | Istruzioni complete compilazione, riduzioni, esenzioni |
| IMU_ENC_Istr.md | 3.1, 3.2, 3.3, 3.8 | ENC: requisiti, rapporto proporzionale, dichiarazione annuale |
| Specifiche tecniche (2) | 3.8 | Record types, formati, limiti, controlli telematici |

### IMU – Base imponibile e aliquote/ (4 file)

| File | Sezioni | Contenuto principale |
|------|---------|---------------------|
| imu_base_imponibile_aliquote.md | 3.2, 3.4, 3.5, 3.6, 3.9 | Base imponibile, coefficienti, aliquote, riduzioni, deducibilità |
| novita_imu_bilancio_2024.md | 3.1, 3.3, 3.7, 3.8 | Comodato ENC, ILIA FVG, esenzioni sisma |
| checklist_acconto_imu_2024.md | 3.1-3.8 | Checklist operativa con caselle controllo |
| checklist_acconto_imu_2025.md | 3.1-3.8 | Checklist 2025, documenti necessari, ravvedimento |

### IMU – Definizione e presupposti/ (21 file principali)

| Sottocartella | File | Sezioni | Contenuto |
|---------------|------|---------|-----------|
| Root | presupposto-soggettivo-imu.md | 3.1 | Soggetti passivi, trust, leasing, contitolarità |
| Root | presupposto-oggettivo-imu.md | 3.1, 3.3, 3.9 | Abitazione principale, pertinenze, rapporto IRPEF |
| Root | ambito-applicazione.md | 3.1, 3.7 | Definizione IMU, autonomie speciali |
| Adempimenti/ | imu-dichiarazione.md | 3.8 | Dichiarazione generale |
| Adempimenti/ | imu-dichiarazione-enc.md | 3.1, 3.3, 3.8 | Dichiarazione ENC, modello, sanzioni |
| Adempimenti/ | imu-versamento-acconto.md | 3.2-3.6, 3.8 | Acconto 16/6, F24, ravvedimento |
| Adempimenti/ | imu-versamento-saldo.md | 3.2, 3.5, 3.6, 3.8 | Saldo 16/12, compensazione, rimborsi |
| Approfondimenti/ | imu-abitazioni-coniugi.md | 3.1, 3.3 | Corte Cost. 209/2022, coniugi, immobili contigui |
| Approfondimenti/ | imu-area-fabbricabile.md | 3.1, 3.2, 3.3 | Valore venale, CDU, pertinenze, contitolarità |
| Approfondimenti/ | imu-fabbricati.md | 3.1, 3.2, 3.3, 3.4 | Fabbricati in costruzione, rurali, gruppo D-E |
| Approfondimenti/ | imu-pertinenze.md | 3.1, 3.3 | C/2, C/6, C/7, graffatura, art. 817 c.c. |
| Approfondimenti/ | imu-terreni-agricoli.md | 3.1, 3.3, 3.5 | CD/IAP, isole, montani, collettivi |
| Casi particolari/ | imu-beni-non-locati.md | 3.9 | IMU/IRPEF 50% stesso comune |
| Casi particolari/ | trustee-soggetto-passivo.md | 3.1 | Cass. 16550/2019, 15988/2020 |
| Riferimenti/ | circolare-mef-1-df-2020.md | 3.1, 3.2, 3.3, 3.7, 3.8 | Chiarimenti MEF, IMPI, leasing |
| Riferimenti/ | decreto-legislativo-504-1992-art-7.md | 3.3 | Esenzioni storiche ICI/IMU |
| Riferimenti/ | art-1-comma-758.md | 3.3 | Esenzioni terreni agricoli |

### IMU – Definizione e presupposti/Articoli operativi/ (63 file)

**Distribuzione per sezione:**
| Sezione | N. File | Argomenti principali |
|---------|---------|---------------------|
| 3.3 ESENZIONI | 26 | Coniugi, occupazione abusiva, sisma, turismo, ENC |
| 3.8 ADEMPIMENTI | 13 | Dichiarazioni, accertamenti, sanzioni, termini decadenza |
| 3.9 ALTRE IMPOSTE | 7 | Deducibilità IMU (20%→40%→50%→60%→100%) |
| 3.2 BASE IMPONIBILE | 7 | Ruralità D/10, diritti edificatori, stabilimenti balneari |
| 3.1 PRESUPPOSTI | 4 | Leasing, trustee, donazione usufrutto |
| 3.7 IMPOSTE SOST. | 1 | IMPI piattaforme marine |

---

## 🅿️ PARCHEGGIO

### Nuove funzionalità da valutare

| Descrizione | Fonte | Priorità |
|-------------|-------|----------|
| **Corte Cost. 209/2022** - Coniugi: eliminato limite nucleo familiare | imu-esenzione-abitazione-principale-coniugi-corte-cost-209-2022.md | Alta |
| **Corte Cost. 60/2024** - Esenzione occupazione abusiva retroattiva | imu-immobili-occupati-abusivamente-corte-cost-60-2024.md | Alta |
| **Conflitto leasing** - Locatore vs Locatario dopo risoluzione | i10046120 vs i10092430 | Media |
| **Cass. SS.UU. 23902/2020** - Diritti edificatori compensativi | i10447756_tassazione_diritti_edificatori | Bassa |
| **Art. 78-bis D.L. 104/2020** - CD/IAP pensionati interpretazione autentica | i10512502_IMU_agricoltura | Media |
| **Specchi acqua porti turistici** | i9937070 | Bassa |
| **Stabilimenti balneari precari** - Cass. 7769/2023 | imu-stabilimenti-balneari-precari | Bassa |
| **Coefficienti ministeriali annuali** - Tabella 1991-2025 per gruppo D | imu_base_imponibile_aliquote.md | Media |
| **PagoPA** - Versamento (non ancora operativo) | articolo_ipsoa_imu_2025.md | Bassa |
| **Onere prova dimora** - Cass. 2747/2023 (su Comune) | imu-esenzione-coniugi-onere-prova | Media |

### Aggiornamenti Sezione 1 (Fonti)

| Documento mancante | Posizione |
|--------------------|-----------|
| Specifiche tecniche IMU/IMPi 2024 | IMU - Dichiarazione/ |
| Specifiche tecniche ENC 2024 | IMU - Dichiarazione/ |
| Checklist acconto 2024/2025 | IMU – Base imponibile/Strumenti utili/ |
| Novità Bilancio 2024 | IMU – Base imponibile/Articoli operativi/ |

### Aggiornamenti Sezione 2 (Normativa)

| Contenuto | Correzione/Integrazione |
|-----------|------------------------|
| Corte Cost. 209/2022 | Aggiungere in Giurisprudenza |
| Corte Cost. 60/2024 | Aggiungere in Giurisprudenza |
| Cass. 2747/2023 | Onere prova dimora su Comune |
| Cass. 7769/2023 | Stabilimenti balneari precari |
| D.M. 8/3/2024 | Coefficienti gruppo D |
| Art. 78-bis D.L. 104/2020 | CD/IAP pensionati |

### Da classificare

| Contenuto | Fonte | Note |
|-----------|-------|------|
| TARSU/TARI | i10292300, i10385428, i10526445 | Non direttamente IMU, rimuovere? |
| Tregua fiscale 2023 | tregua-fiscale-tributi-locali-2023 | Storico, mantenere per riferimento |
| Esenzioni COVID 2020-2021 | vari articoli operativi | Storiche, spostare in archivio? |
| Matrimonio annullato Chiesa | i10420044 | Caso molto specifico |

---

## Mappatura Sezioni Attuali → Nuova Struttura

| Attuale | Contenuto | Nuova Sez. | Note |
|---------|-----------|------------|------|
| 3.1 | Occupazione abusiva | 3.3.5 Esenzioni | + Corte Cost. 60/2024 |
| 3.2 | Abitazione principale | 3.3.1 Esenzioni | + Corte Cost. 209/2022 |
| 3.3 | Casa familiare | 3.3.1 Esenzioni | |
| 3.4 | Pertinenze fiscali | 3.2.5 Base imponibile | |
| 3.5 | Leasing | 3.1.3 Presupposti | + conflitto giurisprudenziale |
| 3.6 | IACP/ERP | 3.3.3 Esenzioni | |
| 3.7 | Terreni agricoli | 3.3.2 Esenzioni | |
| 3.8 | Esenzioni D.Lgs. 504 | 3.3.5 Esenzioni | |
| 3.9 | Pensionati esteri | 3.4.1 Riduzioni | |
| 3.10 | Alert dichiarazione | 3.8.2 Adempimenti | |
| 3.11 | Aliquote | 3.5.1 Aliquote | |
| 3.12 | IMPI | 3.7.1 Imposte sost. | |
| 3.13 | Prospetto aliquote | 3.5.2 Aliquote | |
| 3.14 | ENC regime | **Distribuito** | 3.1.1 (soggetto), 3.3.4 (esenzioni), 3.8.3 (dichiarazione) |
| 3.15 | ENC sportive | 3.3.4 Esenzioni | |
| 3.16 | Trust/Trustee | 3.1.3 Presupposti | |
| 3.17 | IMU/IRPEF | 3.9.1 Altre imposte | |
| 3.18 | Coniugi | 3.3.1 Esenzioni | + immobili contigui |
| 3.19 | CD/IAP pensionati | 3.3.2 Esenzioni | + art. 78-bis |
| 3.20 | Contitolarità | 3.1.1 Presupposti | |
| 3.21 | Fabbricati costruzione | 3.2.1 Base imponibile | |
| 3.22 | Soggetti particolari | 3.1.3 Presupposti | |
| 3.23 | Deducibilità | 3.9.2 Altre imposte | evoluzione storica 20%→100% |
| 3.24 | Valutazione aree | 3.2.4 Base imponibile | |
| 3.25 | Sisma | 3.3.5 Esenzioni | |
| 3.26 | ILIA | 3.7.2 Imposte sost. | |
| 3.27 | Checklist | 3.8 Adempimenti | riferimento UI |
| 3.28 | Adempimenti | 3.8 Adempimenti | ampliare con specifiche tecniche |
| 3.29 | Società persone | 3.1.3 Presupposti | |

---

## Giurisprudenza Rilevante Emersa

| Pronuncia | Argomento | Sezione |
|-----------|-----------|---------|
| **Corte Cost. 209/2022** | Abolizione limite nucleo familiare abitazione principale | 3.3.1 |
| **Corte Cost. 60/2024** | Esenzione occupazione abusiva retroattiva | 3.3.5 |
| **Corte Cost. 49/2025** | Conferma 209/2022 | 3.3.1 |
| **Cass. 9620/2025** | Coniugi entrambi esenti anche stesso comune | 3.3.1 |
| **Cass. 34813/2022** | Unità contigue = unica abitazione | 3.3.1 |
| **Cass. 16550/2019, 15988/2020** | Trustee soggetto passivo | 3.1.3 |
| **Cass. 13793/2019 vs 19166/2019** | Conflitto leasing (locatore vs locatario) | 3.1.3 |
| **Cass. SS.UU. 23902/2020** | Diritti edificatori non imponibili | 3.2.4 |
| **Cass. 2747/2023** | Onere prova dimora su Comune | 3.3.1 |
| **Cass. 7769/2023** | Stabilimenti balneari precari | 3.2.1 |
| **Cass. 37385/2022, 32115/2024** | Decadenza benefici se omessa dichiarazione | 3.8.2 |

---

## Prossimi Passi

1. ☐ Rivedere parcheggio con utente
2. ☐ Decidere su contenuti TARSU/COVID (archiviare?)
3. ☐ Applicare nuova struttura a SPECS.md sezione 3
4. ☐ Aggiornare sezione 1 (Fonti) con documenti mancanti
5. ☐ Aggiornare sezione 2 (Normativa) con giurisprudenza
6. ☐ Commit e push

---

*Documento di lavoro - Aggiornato: 2025-12-11*
