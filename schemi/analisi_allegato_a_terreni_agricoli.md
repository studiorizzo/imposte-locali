# Analisi Allegato A - Sezione 4: Terreni Agricoli

## Riferimento
Pagina 16 dell'Allegato A (protocollo 50585/2025)

## Struttura

```
4. TERRENI AGRICOLI
├── 4.1 Utilizzo (opzioni)
├── 4.2 Collocazione (opzioni)
└── 4.3 Di proprietà di ONLUS o enti del terzo settore (on/off)
```

## Complessità
**BASSA** - Solo 3 condizioni, tutte indipendenti

## Tipi di Campo

| Codice | Nome | Tipo | Dettagli |
|--------|------|------|----------|
| 4.1 | Utilizzo | opzioni | Lista di 5 valori |
| 4.2 | Collocazione | opzioni | Lista di 2 valori con parametri |
| 4.3 | ONLUS/terzo settore | on/off | Booleano puro |

## Valori Condizione: Utilizzo (4.1)

| Valore | Descrizione | Parametro |
|--------|-------------|-----------|
| coltivati | Coltivati | - |
| non_coltivati | Non coltivati | - |
| coltivati_coltura_specifica | Coltivati e destinati ad alcuni tipi di coltura | tipo_coltura (testo) |
| coltivati_parenti_affini | Coltivati da parenti e affini di coltivatori (entro il terzo grado) | - |
| condotti_cd_iap | Terreni agricoli condotti da CD e IAP e Società agricole (non posseduti) | - |

## Valori Condizione: Collocazione (4.2)

| Valore | Descrizione | Parametro |
|--------|-------------|-----------|
| fogli_catastali | Ricadenti nei fogli catastali n: | fogli (lista numeri) |
| area_specifica | Terreni ricadenti in determinate aree | specifica (testo) |

## Condizione: ONLUS/Terzo Settore (4.3)

Tipo: on/off puro (booleano)
- Descrizione: "Di proprietà di ONLUS o enti del terzo settore"

## Note per lo Schema JSON

```json
{
  "fattispecie": "terreni_agricoli",
  "condizioni": {
    "utilizzo": {
      "tipo": "enum",
      "valori": {
        "coltivati": "Coltivati",
        "non_coltivati": "Non coltivati",
        "coltivati_coltura_specifica": {
          "descrizione": "Coltivati e destinati ad alcuni tipi di coltura",
          "parametro": "tipo_coltura"
        },
        "coltivati_parenti_affini": "Coltivati da parenti e affini di coltivatori (entro il terzo grado)",
        "condotti_cd_iap": "Terreni agricoli condotti da CD e IAP e Società agricole (non posseduti)"
      }
    },
    "collocazione": {
      "tipo": "enum",
      "valori": {
        "fogli_catastali": {
          "descrizione": "Ricadenti nei fogli catastali n:",
          "parametro": "fogli"
        },
        "area_specifica": {
          "descrizione": "Terreni ricadenti in determinate aree",
          "parametro": "specifica"
        }
      }
    },
    "proprieta_onlus_terzo_settore": {
      "tipo": "booleano",
      "descrizione": "Di proprietà di ONLUS o enti del terzo settore"
    }
  }
}
```

## Vincoli
- Nessun vincolo tra le condizioni
- Tutte le condizioni sono indipendenti e possono essere combinate liberamente
