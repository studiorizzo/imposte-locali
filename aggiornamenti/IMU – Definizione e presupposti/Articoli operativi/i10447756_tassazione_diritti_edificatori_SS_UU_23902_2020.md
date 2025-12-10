# La tassazione ICI/IMU dei diritti edificatori tra novità giurisprudenziali e dubbi interpretativi

**Fonte**: il fisco 5/2021, pag. 448
**Autore**: Barbara Ianniello (Avvocato in Grosseto)

## Sintesi

L'articolo analizza la tassazione ICI/IMU dei diritti edificatori alla luce della sentenza delle Sezioni Unite n. 23902/2020, che ha escluso l'imponibilità del terreno da cui origina il diritto edificatorio compensativo.

## Tipologie di diritti edificatori

### 1. Diritti edificatori perequativi

**Definizione**: Ripartizione equitativa della capacità volumetrica su vari terreni, con possibilità di sfruttarla su suolo diverso da quello di origine.

**Meccanismo**:
- Assegnazione di un indice perequativo alle aree di un comparto
- Il privato partecipa ai vantaggi del piano assolvendo gli oneri previsti
- La volumetria resta riferita alla proprietà dell'area

**Tassazione ICI/IMU**: **SÌ** - La potenzialità edificatoria data dall'indice perequativo è tassabile (Cass. 15693/2017, 15700/2017, 27575/2018)

### 2. Diritti edificatori compensativi

**Definizione**: Diritti riconosciuti ai proprietari di suoli su cui è stato apposto vincolo di inedificabilità o esproprio.

**Meccanismo** (metafora aviatoria):
- **Area di "decollo"**: Terreno con vincolo → assegnazione credito edilizio
- **Fase di "volo"**: Area di atterraggio non ancora individuata, ma diritto edificatorio già circolabile
- **Area di "atterraggio"**: Individuazione terreno per esercizio concreto della capacità edificatoria

**Tassazione ICI/IMU**: **NO** - Manca inerenza al suolo nella fase di volo (Cass. SS.UU. 23902/2020)

### 3. Diritti edificatori premiali

**Definizione**: Nascono come scambio sinallagmatico per prestazioni eseguite (es. requisiti energetici, sismici).

**Caratteristica**: Creazione di **nuova volumetria**, slegata da quella previgente.

## Cass. SS.UU. 29 ottobre 2020, n. 23902

### Principio di diritto

> Il terreno da cui origina il diritto edificatorio **compensativo** non è imponibile ai fini ICI come area edificabile, in quanto manca un legame di inerenza in senso giuridico con il suolo.

### Motivazione

| Elemento | Perequazione | Compensazione |
|----------|--------------|---------------|
| Volumetria | Riferita alla proprietà dell'area | Del tutto distaccata dal suolo di origine |
| Connessione fondiaria | Presente | Assente nella fase di "volo" |
| Inerenza reale | Sì | No (fino a localizzazione area atterraggio) |

### Rilievi della Corte

- L'ICI/IMU è imposta radicata su **sostrato reale**: fabbricati, aree fabbricabili, terreni agricoli
- La compensazione urbanistica è un'**indennità ripristinatoria** in "moneta volumetrica"
- Il diritto edificatorio compensativo circola autonomamente, disancorato dal suolo
- Non si può creare in via interpretativa una fattispecie impositiva diversa (art. 23 Cost.)

## Nozione di edificabilità ai fini ICI/IMU

**Principio consolidato** (D.L. 203/2005, art. 11-quaterdecies, c. 16; D.L. 223/2006, art. 36, c. 2):
- Rileva l'edificabilità **potenziale** del terreno
- Sufficiente inserimento nel PRG anche solo adottato
- Indipendentemente da approvazione regionale o strumenti attuativi

**Cass. SS.UU. 2550/2006**: L'inizio del procedimento di trasformazione urbanistica fa lievitare il valore venale.

## Disciplina civilistica

**Art. 2643, c. 1, n. 2-bis, c.c.** (obbligo di trascrizione):
> "I contratti che trasferiscono, costituiscono o modificano i diritti edificatori comunque denominati, previsti da normative statali o regionali, ovvero da strumenti di pianificazione territoriale"

La norma:
- Riconosce circolazione svincolata dall'area
- Non chiarisce la natura giuridica (bene immateriale? diritto reale? interesse legittimo pretensivo?)

## Implicazioni fiscali collaterali

### Imposta di registro

| Qualificazione diritto | Aliquota |
|------------------------|----------|
| Diritto reale immobiliare | Art. 1 Tariffa DPR 131/1986 (proporzionale) |
| Bene immateriale / chance | 3% (art. 2 Tariffa) |

### Cessione di cubatura

Questione diversa dai diritti edificatori: trasferimento tra privati di capacità edificatoria verso area determinata (non necessariamente contigua ma di destinazione omogenea). Rimessa alle SS.UU. con ord. interlocutoria 19152/2020.

---

## Nota per l'app

**RILEVANTE PER AREE FABBRICABILI**

**Cass. SS.UU. 23902/2020 - Principio per l'app**:

```
AREA CON DIRITTI EDIFICATORI
    ↓
Tipo di diritto?
    ├── PEREQUATIVO → IMU dovuta (indice perequativo = edificabilità)
    └── COMPENSATIVO →
         ↓
         Fase del procedimento?
         ├── Area di "decollo" (prima del vincolo) → Valutare edificabilità PRG
         ├── Fase di "volo" (area ceduta/vincolata) → IMU NON dovuta
         └── Area di "atterraggio" (assegnata) → IMU dovuta sul nuovo terreno
```

**Suggerimento implementativo**:
- Per aree soggette a compensazione urbanistica: verificare se è stata ceduta/vincolata
- Se il diritto edificatorio è stato "sganciato" → area non più tassabile come edificabile
- L'area di atterraggio è invece tassabile quando assegnata

---

**Riferimenti normativi e giurisprudenziali**:
- Art. 2643, comma 1, n. 2-bis, c.c.
- D.Lgs. 30 dicembre 1992, n. 504, art. 2, c. 1, lett. b)
- D.L. 30 settembre 2005, n. 203, art. 11-quaterdecies, c. 16
- D.L. 4 luglio 2006, n. 223, art. 36, c. 2
- **Cass. civ., SS.UU., 29 ottobre 2020, n. 23902**
- Cass. civ., SS.UU., 28 settembre 2006, n. 2550
- Cass. civ., ord. 23 giugno 2017, nn. 15693 e 15700
- Circolare Agenzia Entrate 17 giugno 2015, n. 24/E
