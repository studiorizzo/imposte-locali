# Regole estrazione prospetto IMU

## Output JSON

```json
{
  "comune": "NOME",
  "id_prospetto": "12345",
  "anno": 2025,
  "delibera": {
    "numero": 41,
    "data": "22/07/2025",
    "organo": "Consiglio comunale"
  },
  "aliquote_base": [],
  "aliquote_personalizzate": [],
  "esenzioni": []
}
```

## aliquote_base

Prime 7 righe a 2 colonne. Ordine fisso da `fattispecie_principali.json`:

1. `abitazione_principale_lusso` → percentuale
2. `assimilazione_anziani_disabili` → booleano (SI=true, NO=false)
3. `fabbricati_rurali_strumentali` → percentuale
4. `fabbricati_gruppo_d` → percentuale
5. `terreni_agricoli` → percentuale
6. `aree_fabbricabili` → percentuale
7. `altri_fabbricati` → percentuale

```json
{"fattispecie_principale": "abitazione_principale_lusso", "aliquota": "0,58%"}
{"fattispecie_principale": "assimilazione_anziani_disabili", "aliquota": true}
```

## aliquote_personalizzate

Righe successive a 2 colonne. Mantieni ordine PDF.

### Colonna 1: fattispecie_principale
Usa id: `fabbricati_gruppo_d`, `terreni_agricoli`, `aree_fabbricabili`, `altri_fabbricati`

### Colonna 2: dettagli
Mappa ogni campo all'id corrispondente in `fattispecie_personalizzate_v2.json`.

**Formato valore**: stringa singola = descrizione + valore + input
```
"Requisiti soggettivi del locatario: Persona giuridica esercente attivita' d'impresa da un numero di mesi non superiore a: 36"
```

**NO array**: ogni campo è sempre una stringa singola, mai array.

### Valori multipli → duplica il record

Se un campo ha più valori, duplica l'intero record (uno per valore):

**categoria_catastale multiple** (es. A/10 e C/3):
```json
{"fattispecie_principale": "altri_fabbricati", "categoria_catastale": "A/10 Uffici e studi privati", ...}
{"fattispecie_principale": "altri_fabbricati", "categoria_catastale": "C/3 Laboratori per arti e mestieri", ...}
```

**requisiti_soggettivi multipli** (se in futuro):
```json
{"fattispecie_principale": "...", "requisiti_soggettivi": "Requisito A", ...}
{"fattispecie_principale": "...", "requisiti_soggettivi": "Requisito B", ...}
```

### Filtri categoria da ESCLUDERE dal JSON

I seguenti pattern sono solo intestazioni/filtri nel PDF. NON vanno riportati nel JSON perché la categoria è già in `categoria_catastale`:

- "Immobili di categoria A10, B, C"
- "Immobili di categoria A10"
- "Immobili di categoria B"
- "Immobili di categoria C"
- "Immobili di categoria A10, B"
- "Immobili di categoria A10, C"
- "Immobili di categoria B, C"

## esenzioni

Array di stringhe. Se assenti: `[]`

## Ignora

- Sezione "Precisazioni" (standard per tutti i prospetti)
