# Analisi Allegato A - Sezione 3: Fabbricati Gruppo D

## Struttura

```
3. FABBRICATI GRUPPO D
├── 3.1 Categoria catastale (opzioni multi-select)
├── 3.2 Superficie (on/off + parametri)
├── 3.3 Oggetto recupero decoro/energia (on/off puro)
├── 3.4 Rendita catastale (on/off + parametro €)
├── 3.5 Collocazione immobile (on/off + opzioni)
├── 3.6 Fabbricati inagibili (on/off + opzioni + sotto-opzioni)
├── 3.7 Fabbricati a disposizione o utilizzati (SCELTA TRA 6)
│   ├── 3.7.1 Immobili a disposizione
│   ├── 3.7.2 Immobili locati o concessi in comodato
│   ├── 3.7.3 Immobili locati
│   ├── 3.7.4 Immobili concessi in comodato
│   ├── 3.7.5 Immobili utilizzati direttamente
│   └── 3.7.6 Immobili locati/comodato/utilizzati
└── 3.8 Ulteriori condizioni comma 755 (on/off puro)
```

## Tipi di campo

| Tipo | Descrizione | Esempio |
|------|-------------|---------|
| `opzioni` | Multi-select da lista | Categoria catastale D/1-D/9 |
| `on/off` | Checkbox semplice | Oggetto recupero decoro |
| `on/off + opzioni` | Checkbox che abilita una lista | Collocazione immobile |
| `on/off + parametro` | Checkbox che abilita input | Superficie (mq), Rendita (€) |

## Condizioni livello principale (3.1-3.6, 3.8)

Si applicano SEMPRE, indipendentemente dalla scelta 3.7.x

| Codice | Nome | Tipo | Valori/Parametri |
|--------|------|------|------------------|
| 3.1 | Categoria catastale | opzioni | D/1, D/2, D/3, D/4, D/5, D/6, D/7, D/8, D/9 |
| 3.2 | Superficie | on/off + param | non_superiore_mq, non_inferiore_mq |
| 3.3 | Oggetto recupero decoro/energia | on/off | - |
| 3.4 | Rendita catastale | on/off + param | valore (€) |
| 3.5 | Collocazione immobile | on/off + opzioni | centro_storico, fuori_centro, zona_specifica*, zona_abbandono*, zona_non_servita |
| 3.6 | Fabbricati inagibili | on/off + opzioni | art1_c747_b, ipotesi_diverse (→ calamita, cause_diverse, calamita_o_altre) |
| 3.8 | Ulteriori condizioni c.755 | on/off | - |

(*) richiede specifica testuale

## Condizioni per tipo uso immobile (3.7.x)

### Matrice vincoli: quali condizioni si applicano a quale tipo

| Condizione | 3.7.1 disp | 3.7.2 loc+com | 3.7.3 loc | 3.7.4 com | 3.7.5 util | 3.7.6 tutti |
|------------|:----------:|:-------------:|:---------:|:---------:|:----------:|:-----------:|
| persistenza_minima | ✓ | - | - | - | - | - |
| requisiti_soggetto | PASSIVO | LOC/COM | LOC | COM | UTILIZZATORE | TUTTI |
| utilizzo_inutilizzo | ✓ | - | - | - | - | - |
| destinazione_uso | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| tipologia_attivita | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| codice_ateco | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| numero_dipendenti | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| potenza_impianti | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| contratto_registrato | - | ✓ | - | ✓ | - | ✓ |

**Nota FAQ 8**: contratto_registrato non in 3.7.3 perché locazione DEVE essere registrata per legge (art.1 c.346 L.311/2004)

### Valori requisiti_soggetto per tipo

**3.7.1 (a disposizione) - Requisiti soggetto PASSIVO:**
- Posseduti da ONLUS o enti del terzo settore
- Posseduti da enti non commerciali
- Posseduti da società con personalità giuridica
- Posseduti da società senza personalità giuridica
- Invalidità civile ≥ X%
- Disabilità L.104/92

**3.7.2, 3.7.3, 3.7.4 (locati/comodato) - Requisiti LOCATARIO/COMODATARIO:**
- ONLUS o altri enti del terzo settore
- Persona giuridica attività impresa ≤ X mesi
- Persona giuridica attività impresa ≥ X mesi
- Persona fisica età ≤ X anni

**3.7.5, 3.7.6 (utilizzati/misto) - Requisiti soggetto passivo UTILIZZATORE:**
- Posseduti da ONLUS o enti del terzo settore
- Posseduti da enti non commerciali
- Posseduti da società con personalità giuridica
- Posseduti da società senza personalità giuridica
- Invalidità civile ≥ X%
- Disabilità L.104/92
- Persona giuridica attività impresa ≤ X mesi
- Persona giuridica attività impresa ≥ X mesi
- Persona fisica età ≤ X anni
- PMI utilizzatore
- **Utilizzatore diretto (tutti)** ← SOLO QUI!

### Valori destinazione_uso (uguali in 3.7.2-3.7.6)

- Attività produttiva/commerciale/arti e professioni
- Uso limitato/discontinuo/stagionale ≤ X mesi
- Scopi istituzionali/pubblica utilità senza lucro
- Non produttivi reddito fondiario (art.43 TUIR)
- Bottega storica o artigiana
- CIG o ammortizzatore sociale
- Privi/dismettere giochi azzardo
- Impianti eolici
- Impianti fotovoltaici
- Impianti eolici e fotovoltaici
- Impianti idroelettrici

### Valori tipologia_attivita (uguali in 3.7.2-3.7.6)

- Attività innovative - Start up
- Ampliato attività/aumentato occupazione
- Imprese green
- Microimprese

### Valori utilizzo_inutilizzo (SOLO 3.7.1)

- Privi di ogni arredo
- Sprovvisti utenze acqua/luce/gas
- Privi arredo + sprovvisti utenze
- Inutilizzato per crisi aziendale
- Uso limitato/discontinuo/stagionale ≤ X mesi

### Valori potenza_impianti (3.7.2-3.7.6)

- Fino a X kW
- Superiore a X kW
- Intervallo da X a Y kW

### Codice ATECO (3.7.2-3.7.6)

Livelli possibili:
- Divisione (2 cifre)
- Gruppo (3 cifre)
- Classe (4 cifre)
- Categoria (5 cifre)
- Sottocategoria (6 cifre)

## Conclusioni per lo schema

1. **Struttura annidata è necessaria** per rispettare i vincoli
2. **Codici numerici (3.7.1, etc.) non servono** nei prospetti appare solo la descrizione
3. **Tipi reali sono pochi**: opzioni, on/off, on/off+opzioni, on/off+parametro
4. **Vincoli principali**:
   - contratto_registrato: solo loc+com, com, tutti (NON loc puro)
   - utilizzatore_tutti: solo util, tutti
   - persistenza_minima, utilizzo_inutilizzo: solo a_disposizione
   - destinazione_uso, tipologia, ateco, dipendenti, potenza: NON in a_disposizione
