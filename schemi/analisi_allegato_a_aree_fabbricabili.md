# Analisi Allegato A - Sezione 5: Aree Fabbricabili

## Riferimento
Pagina 17 dell'Allegato A (protocollo 50585/2025)

## Struttura

```
5. AREE FABBRICABILI
├── 5.1 Tipologia (opzioni)
├── 5.2 Situate in determinate zone (on/off + parametro)
├── 5.3 Di proprietà di ONLUS o enti del terzo settore (on/off)
└── 5.4 Ulteriori condizioni comma 755 (on/off)
```

## Complessità
**BASSA** - Solo 4 condizioni, tutte indipendenti

## Tipi di Campo

| Codice | Nome | Tipo | Dettagli |
|--------|------|------|----------|
| 5.1 | Tipologia | opzioni | Lista di 2 valori |
| 5.2 | Zone specifiche | on/off + param | Richiede specifica testuale |
| 5.3 | ONLUS/terzo settore | on/off | Booleano puro |
| 5.4 | Ulteriori condizioni c.755 | on/off | Booleano puro |

## Valori Condizione: Tipologia (5.1)

| Valore | Descrizione |
|--------|-------------|
| residenziali | Residenziali |
| non_residenziali | Diverse da residenziali |

## Condizione: Zone Specifiche (5.2)

Tipo: on/off + parametro
- Descrizione: "Situate in determinate zone, specificare"
- Parametro: specifica (testo libero)

## Condizione: ONLUS/Terzo Settore (5.3)

Tipo: on/off puro
- Descrizione: "Di proprietà di ONLUS o enti del terzo settore"

## Condizione: Ulteriori Condizioni (5.4)

Tipo: on/off puro
- Descrizione: "Ulteriori condizioni (non rinvenibili tra quelle proposte nella presente schermata) stabilite dal comune, ai sensi dell'art. 1, comma 755, legge n. 160 del 2019, ai fini dell'applicazione dell'aliquota oltre la misura dell'1,06%"

## Note per lo Schema JSON

```json
{
  "fattispecie": "aree_fabbricabili",
  "condizioni": {
    "tipologia": {
      "tipo": "enum",
      "valori": {
        "residenziali": "Residenziali",
        "non_residenziali": "Diverse da residenziali"
      }
    },
    "zona_specifica": {
      "tipo": "parametrico",
      "descrizione": "Situate in determinate zone, specificare",
      "parametro": "specifica"
    },
    "proprieta_onlus_terzo_settore": {
      "tipo": "booleano",
      "descrizione": "Di proprietà di ONLUS o enti del terzo settore"
    },
    "ulteriori_condizioni_comma_755": {
      "tipo": "booleano",
      "descrizione": "Ulteriori condizioni stabilite dal comune ai sensi dell'art. 1, comma 755, legge n. 160 del 2019"
    }
  }
}
```

## Vincoli
- Nessun vincolo tra le condizioni
- Tutte le condizioni sono indipendenti e possono essere combinate liberamente
