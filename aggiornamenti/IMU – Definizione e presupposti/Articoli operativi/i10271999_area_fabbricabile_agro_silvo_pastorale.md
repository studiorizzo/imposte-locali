# IMU e area fabbricabile con utilizzo agro-silvo-pastorale

**Fonte**: Pratica Fiscale e Professionale n. 21 del 25 maggio 2020, pag. 25
**Autori**: Paolo Parisi (Avvocato Tributarista e Docente di Diritto Tributario SNA) e Paola Mazza (Dottore commercialista e pubblicista)

## Sintesi

La Risoluzione MEF 2/DF del 10 marzo 2020 chiarisce che la **finzione giuridica di non edificabilità** delle aree fabbricabili con utilizzo agro-silvo-pastorale da parte di CD/IAP opera nei confronti di **TUTTI i comproprietari** del fondo, non solo per chi riveste la qualifica di coltivatore diretto o imprenditore agricolo professionale.

## Quesito posto al MEF

Viene chiesto se a uno dei comproprietari **non dotato** della qualifica di CD o IAP sia applicabile l'IMU per area edificabile su cui persiste l'utilizzazione agro-silvo-pastorale.

## Risposta MEF (Ris. 2/DF del 10 marzo 2020)

### Principio affermato

La *fictio iuris* della non edificabilità opera nei confronti di **tutti i comproprietari del fondo**, poiché ai fini del calcolo della base imponibile, questa va a **qualificare oggettivamente e univocamente** il bene immobile che costituisce il presupposto impositivo dell'IMU.

### Motivazione

- Prevale il **carattere oggettivo** dell'area
- La persistenza della destinazione del fondo a scopo agricolo è **incompatibile** con la possibilità di sfruttamento edilizio
- Tale incompatibilità, avendo carattere oggettivo, vale per **tutti** i contitolari

## Giurisprudenza di riferimento

### Cass. 30 giugno 2010, n. 15566

> "Ricorrendo tali presupposti, il terreno soggiace all'imposta in relazione al suo valore catastale, dovendosi prescindere dalla sua obiettiva potenzialità edilizia. La considerazione, in questi casi, dell'area come terreno agricolo ha quindi **carattere oggettivo** e, come tale, **si estende a ciascuno dei contitolari dei diritti dominicali**. Ciò in quanto la persistenza della destinazione del fondo a scopo agricolo integra una situazione incompatibile con la possibilità del suo sfruttamento edilizio e tale incompatibilità, avendo carattere oggettivo, vale sia per il comproprietario coltivatore diretto che per gli altri comunisti."

## Schema di sintesi

```
AREA FABBRICABILE con utilizzo agro-silvo-pastorale
        ↓
DESTINAZIONE AGRICOLA DEL FONDO
        ↓
INCOMPATIBILE CON SFRUTTAMENTO EDILIZIO
        ↓
ESENZIONE IMU per terreni posseduti e condotti da CD o IAP
        ↓
SI ESTENDE A TUTTI I CONTITOLARI
```

## Esenzioni IMU terreni agricoli (riepilogo)

| Fattispecie | Esenzione |
|-------------|-----------|
| Terreni in comuni **montani/collinari** (C.M. 9/1993) | ✅ Esenti |
| Terreni posseduti e condotti da **CD/IAP** iscritti previdenza agricola | ✅ Esenti (qualunque ubicazione) |
| Terreni a **proprietà collettiva** indivisibile e inusucapibile | ✅ Esenti |
| Aree fabbricabili con utilizzo agro-silvo-pastorale da CD/IAP | ✅ Considerate terreni agricoli (fictio iuris) |

## Rapporto con L. 160/2019

Il comma 743 dell'art. 1 della L. 160/2019 ha dato veste normativa a un principio di portata generale **già presente** nel regime IMU: gli elementi soggettivi e oggettivi si riferiscono ai titolari della singola quota di possesso.

**Tuttavia**: la fictio iuris di non edificabilità ha carattere **oggettivo** e qualifica il bene immobile in modo univoco per tutti i contitolari.

---

## Nota pratica per l'app

**IMPORTANTE per il calcolatore**:

Quando un'area fabbricabile è condotta da un CD/IAP con utilizzo agro-silvo-pastorale:
1. L'area è considerata **terreno agricolo** (non area fabbricabile)
2. Questa qualificazione vale per **TUTTI** i comproprietari
3. Anche il comproprietario senza qualifica CD/IAP non paga IMU come area fabbricabile

**Implementazione suggerita**:
- Flag "Area fabbricabile con utilizzo agro-silvo-pastorale da CD/IAP"
- Se attivo → base imponibile = valore catastale terreno (non valore venale area)
- L'esenzione/agevolazione si estende a tutti i contitolari

---

**Riferimenti normativi**:
- Art. 1, commi 741, 743, L. 27 dicembre 2019, n. 160
- Art. 1, D.Lgs. 29 marzo 2004, n. 99
- Risoluzione MEF 10 marzo 2020, n. 2/DF
- Circolare MEF 14 giugno 1993, n. 9
- Cass. 30 giugno 2010, n. 15566
