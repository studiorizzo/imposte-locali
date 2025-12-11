# Specifiche tecniche per la trasmissione telematica del Modello per la Dichiarazione IMU degli Enti non Commerciali

---

## Sommario

| Sezione | Titolo | Pagina |
|---------|--------|--------|
| 1 | AVVERTENZE GENERALI | 3 |
| 2 | CONTENUTO DELLA FORNITURA | 4 |
| 2.1 | Generalità | 4 |
| 2.2 | La sequenza dei record | 4 |
| 2.3 | La struttura dei record | 6 |
| 2.4 | La struttura dei dati | 7 |
| 2.5 | Regole generali | 8 |
| 2.5.1 | Codice fiscale del contribuente | 8 |
| 2.5.2 | Codice carica del dichiarante | 8 |
| 2.5.3 | Informazioni di un immobile | 9 |
| 2.5.4 | Altri dati | 10 |
| 2.6 | Controllo sui dati presenti nella dichiarazione | 10 |
| 2.6.1 | Istruzioni relative al record di testa – Record tipo A | 12 |
| 2.6.2 | Istruzioni relative al quadro "Frontespizio" – Record tipo B | 14 |
| 2.6.3 | Istruzioni relative al quadro "A" – Record tipo C | 18 |
| 2.6.4 | Istruzioni relative al quadro "B" – Record tipo D | 25 |
| 2.6.5 | Istruzioni relative ai quadri "C" e "D" – Record tipo E | 33 |
| 2.6.6 | Istruzioni relative al record tipo Z - Record di coda | 35 |

---

## 1. AVVERTENZE GENERALI

Il contenuto e le caratteristiche della fornitura dei dati relativi alle dichiarazioni IMU - Enti non commerciali, da trasmettere per ogni anno d'imposta al Dipartimento delle finanze in via telematica, sono contenuti nelle specifiche tecniche di seguito esposte.

Si precisa che una dichiarazione da inviare, i cui dati non rispettino le specifiche tecniche, verrà scartata.

---

## 2. CONTENUTO DELLA FORNITURA

### 2.1 Generalità

Ciascuna fornitura dei dati in via telematica si compone di una sequenza di record aventi la lunghezza fissa di **1.900 caratteri**.

Ciascun record presente nella fornitura è contraddistinto da uno specifico "tipo-record" che ne individua il contenuto e che ne determina l'ordinamento all'interno della fornitura stessa.

I record previsti per la fornitura in via telematica delle dichiarazioni IMU - Enti non commerciali sono:

- **record di tipo "A"**: è il record di testa della fornitura e contiene i dati identificativi della fornitura e del soggetto responsabile dell'invio telematico (fornitore);
- **record di tipo "B"**: è il record che contiene i dati del frontespizio del modello;
- **record di tipo "C"**: è il record che contiene i dati relativi al quadro A;
- **record di tipo "D"**: è il record che contiene i dati relativi al quadro B;
- **record di tipo "E"**: è il record che contiene i dati relativi ai quadri C e D;
- **record di tipo "Z"**: è il record di coda della fornitura e contiene alcuni dati riepilogativi della fornitura stessa.

### 2.2 La sequenza dei record

La sequenza dei record all'interno della fornitura deve rispettare le seguenti regole:

- presenza di un solo record di tipo "A", posizionato come primo record della fornitura;
- per ogni dichiarazione modello IMU - Enti non commerciali presenza nell'ordine, di un unico record di tipo "B", di tanti record di tipo "C", "D" quanti sono necessari a contenere tutti i dati presenti nella dichiarazione e di un unico record di tipo "E";
- presenza di un solo record di tipo "Z", posizionato come ultimo record della fornitura.

Ai fini del calcolo del numero di record di tipo C (Quadro A), D (Quadro B) necessari per il completamento della dichiarazione, si fa presente che tali record sono strutturati per contenere al loro interno i dati relativi a **2 immobili** (Quadro A) e a **1 immobile** (Quadro B).

Qualora la dimensione complessiva della dichiarazione da trasmettere ecceda il limite previsto (**3 MB compressi**), si dovrà procedere alla predisposizione di più forniture.

Nel caso in cui la singola dichiarazione ecceda il limite previsto, è necessario adottare le seguenti modalità operative:

- la dichiarazione deve essere frazionata in più invii esclusivamente ad essa riservati. Al fine di minimizzare il numero di invii necessari a trasmettere l'intera dichiarazione, si deve dimensionare ciascun invio approssimandosi il più possibile al limite dimensionale massimo descritto. Inoltre, tale operazione di frazionamento deve essere effettuata avendo cura di far iniziare ciascun invio con il **progressivo modulo immediatamente successivo al progressivo presente nell'invio precedente**;
- ciascun invio deve contenere i record "A", "B", "C", "D", "E" e "Z";
- ciascun invio deve essere identificato da un "progressivo invio / totale invii di cui si compone la dichiarazione", mediante l'impostazione dei campi 8 e 9 del record "A"; tale progressivo deve essere **univoco e crescente** (con incrementi di una unità) nell'ambito della fornitura relativa alla intera dichiarazione;
- i record di tipo "B" presenti in ogni invio devono avere il medesimo contenuto;
- i record di tipo "E" presenti in ogni invio devono avere il medesimo contenuto;
- i dati riepilogativi riportati sul record "Z" devono essere riferiti al singolo invio e non all'intera dichiarazione.

La dichiarazione ha carattere annuale. Si fa inoltre presente che una singola dichiarazione (anche se trasmessa attraverso più forniture) deve riferirsi alle proprietà immobiliari (o alle porzioni di esse) che insistono sul territorio di un **singolo comune**. Si dovranno pertanto trasmettere un numero di dichiarazioni pari al numero dei comuni nei confronti dei quali sussiste per quell'anno l'obbligo di dichiarazione.

Nel caso in cui si debba ritrasmettere, per un determinato comune e per un'annualità data, una dichiarazione già inviata, causa integrazione o rettifica dei dati precedentemente trasmessi, occorre **ritrasmettere la dichiarazione integralmente**.

Al fine di individuare correttamente la tipologia di invio della dichiarazione (nuova dichiarazione, dichiarazione sostitutiva ecc.), nell'ambito di uno stesso anno di imposta, codice catastale e codice fiscale del contribuente, occorre valorizzare il campo denominato "Tipologia dichiarazione" nel modo seguente:

- **N** – Nuova dichiarazione;
- **S** – Dichiarazione sostitutiva;
- **M** – nel caso in cui si tratti di una dichiarazione divisa in invii multipli.

#### Nuova dichiarazione

In caso di una nuova dichiarazione il campo deve assumere il valore "N". Verrà introdotto un controllo che, nel caso in cui si dovesse riscontrare la presenza a sistema di una precedente dichiarazione, per lo stesso anno di imposta, codice catastale e codice fiscale del contribuente, determinerà la produzione di una ricevuta di scarto della dichiarazione oggetto dell'invio.

#### Dichiarazione sostitutiva

Nel caso in cui si debba effettuare una nuova trasmissione, causa integrazione o rettifica dei dati precedentemente trasmessi (in entrambi i casi va infatti ritrasmessa l'intera dichiarazione), per lo stesso anno di imposta, codice catastale e codice fiscale del contribuente, di una dichiarazione precedente, è necessario indicare, nel nuovo campo, il valore "S". Tale dichiarazione sostituirà integralmente quella precedentemente inviata.

Verrà introdotto un controllo che verificherà, in caso di dichiarazione sostitutiva, la presenza di una precedente dichiarazione per lo stesso anno di imposta, codice catastale e codice fiscale del contribuente. In caso di esito negativo del controllo verrà prodotta una ricevuta di scarto dell'intera dichiarazione.

#### Dichiarazione multipla

Se la dichiarazione oggetto di invio necessita di invii multipli, in quanto non è possibile rappresentare integralmente la propria posizione su un'unica fornitura, è necessario procedere a più invii. A fronte di un primo invio, che ricalcherà nell'impostazione ("N" o "S" a seconda dei casi) e nei controlli del campo quanto sopra specificato, gli invii successivi dovranno valorizzare il campo con il valore "M" in tutti i casi.

### 2.3 La struttura dei record

I record contengono unicamente campi posizionali, ovvero campi la cui posizione all'interno del record è fissa. La posizione, la lunghezza ed il formato di tali campi sono esposti in dettaglio nelle specifiche di seguito riportate.

In coda ai record di ciascun tipo sono riportati 3 caratteri di controllo, così come descritto in dettaglio nelle specifiche che seguono.

### 2.4 La struttura dei dati

I campi dei record possono assumere struttura numerica o alfanumerica e per ciascuno di essi è indicato, nelle specifiche che seguono, il simbolo NU o AN rispettivamente. Nel caso di campi destinati a contenere alcuni dati particolari (ad esempio date, ecc.), nella colonna "Formato" è indicato il particolare formato da utilizzare.

L'allineamento e la formattazione dei campi posizionali sono descritti nella tabella che segue.

| Sigla formato | Descrizione | Formattazione | Allineamento | Esempio |
|---------------|-------------|---------------|--------------|---------|
| AN | Campo alfanumerico | Spazio | Sinistra | 'STRINGA ' |
| CF | Codice fiscale (16 caratteri) / Codice fiscale numerico (11 caratteri) | ========== / Spazio | ========== / Sinistra con 5 spazi a destra | 'RSSGNN60R30H501U' / '02876990587 ' |
| CN | Codice fiscale numerico (11 caratteri) | Zero | | '02876990587' |
| DT | Data nel formato GGMMAAAA | Zero | | '05051998' |
| NU | Campo numerico | Zero | Destra con zeri non significativi a sinistra | '001234' |
| PN | Sigla delle province italiane, sigla delle ex province italiane di Fiume (FU), Pola (PL), Zara (ZA) e sigla "EE" per i paesi esteri | Spazio | | 'BO' |
| PR | Sigla delle province italiane e sigla "EE" per i paesi esteri | Spazio | | 'BO' |
| CB | Casella barrata. Se la casella è barrata vale 1 altrimenti vale 0 | Zero | | '1' |

> **ATTENZIONE**: costituisce motivo di scarto della dichiarazione un allineamento dei campi ovvero una formattazione difforme da quello previsto nella precedente tabella.

### 2.5 Regole generali

#### 2.5.1 Codice fiscale del contribuente

Il codice fiscale del contribuente, presente sulla prima facciata del frontespizio della dichiarazione IMU - Enti non commerciali, è l'identificativo del soggetto per cui la dichiarazione è presentata e va riportato in duplica su ogni record che costituisce la dichiarazione stessa nel campo "Codice fiscale del soggetto dichiarante".

I Codici Fiscali e le Partite IVA riportati nelle dichiarazioni modello IMU - Enti non commerciali devono essere formalmente corretti.

Si precisa che in sede di accoglimento delle dichiarazioni trasmesse in via telematica, costituirà oggetto di scarto della dichiarazione stessa l'indicazione di un codice fiscale del contribuente che, anche se formalmente corretto, non risulti registrato presso l'Anagrafe Tributaria (campo 2 del record "B").

Il codice fiscale del rappresentante riportato nel campo 24 del record B ed il codice fiscale dell'intermediario che assume l'impegno alla trasmissione telematica riportato nel campo 46 del record B devono essere registrati in Anagrafe Tributaria; la non registrazione comporta lo scarto della dichiarazione in fase di accettazione senza possibilità di conferma della stessa.

Il codice fiscale del rappresentante in Anagrafe Tributaria deve risultare attribuito ad una persona fisica.

#### 2.5.2 Codice carica del dichiarante

Il campo "Codice carica del dichiarante" del Record B dovrà essere valorizzato indicando uno dei valori presenti nella seguente tabella.

| Codice carica | Descrizione |
|---------------|-------------|
| 1 | Rappresentante legale, negoziale o di fatto, socio amministratore |
| 2 | Rappresentante di minore, inabilitato o interdetto, amministratore di sostegno, ovvero curatore dell'eredità giacente, amministratore di eredità devoluta sotto condizione sospensiva o in favore di nascituro non ancora concepito |
| 3 | Curatore fallimentare / curatore della liquidazione giudiziale |
| 4 | Commissario liquidatore (liquidazione coatta amministrativa ovvero amministrazione straordinaria) |
| 5 | Custode giudiziario (custodia giudiziaria), ovvero amministratore giudiziario in qualità di rappresentante dei beni sequestrati ovvero commissario giudiziale (amministrazione controllata) |
| 6 | Rappresentante fiscale di soggetto non residente |
| 7 | Erede |
| 8 | Liquidatore (liquidazione volontaria) |
| 9 | Soggetto tenuto a presentare la dichiarazione per conto del soggetto estinto a seguito di operazioni straordinarie o altre trasformazioni sostanziali soggettive (cessionario d'azienda, società beneficiaria, incorporante, conferitaria, ecc.); ovvero, rappresentante della società beneficiaria (scissione) o della società risultante dalla fusione o incorporazione |
| 10 | Soggetto esercente l'attività tutoria del minore o interdetto in relazione alla funzione istituzionale rivestita |
| 11 | Liquidatore (liquidazione volontaria di ditta individuale - periodo ante messa in liquidazione) |
| 12 | Amministratore di condominio |

#### 2.5.3 Informazioni di un immobile

Il campo "Progressivo immobile" identifica in maniera univoca ogni immobile oggetto di dichiarazione e va sempre impostato partendo da 1. In particolare i campi interessati sono:

**Record C:**
- campo 7 – 38: "Dati immobile - Progressivo immobile" identificativo univoco dell'immobile.

**Record D:**
- campo 7: "Dati immobile - Progressivo immobile" identificativo univoco dell'immobile.

Nel caso in cui per uno stesso immobile si siano verificate più variazioni nel corso dello stesso periodo d'imposta, va opportunamente impostato il campo "Indicatore di continuità". In particolare:

**Record C:**
- campo 8 - 39: "Indicatore di continuità", se presente, indica che l'immobile fa riferimento ad un'anagrafica precedentemente definita contraddistinta da uno specifico Progressivo immobile. Vale 0 o 1 e non può essere indicato per il primo immobile del primo record C o per immobili che presentano un progressivo maggiore al numero d'ordine.

**Record D:**
- campo 8: "Indicatore di continuità", se presente, indica che l'immobile fa riferimento ad un'anagrafica precedentemente definita contraddistinta da uno specifico Progressivo immobile. Vale 0 o 1 e non può essere indicato per il primo immobile del primo record D o per immobili che presentano un progressivo maggiore al numero d'ordine.

#### 2.5.4 Altri dati

Gli importi contenuti nelle dichiarazioni devono essere riportati, così come previsto sul modello di dichiarazione, in unità di euro, arrotondando l'importo per eccesso se la frazione decimale è uguale o superiore a cinquanta centesimi di euro, per difetto se inferiore a detto limite. Fanno eccezione a questa regola i seguenti campi:

- **Quadro B – Sezione attività didattica**: "Corrispettivo medio percepito dall'ente non commerciale"; "Costo medio per studente pubblicato sul sito internet del ministero competente"; valori di cui ai righi e), f), j) e k);
- **Quadro B – Sezione altre attività**: "Corrispettivo medio percepito dall'ente non commerciale"; "Corrispettivo medio previsto per analoghe attività svolte con modalità commerciali nello stesso ambito territoriale"; valore di cui al rigo e);

che vanno espressi in **centesimi a meno della virgola** (ad es. il valore € 100,00 deve essere inserito come 10000 preceduto da tanti zeri non significativi quanti necessari a completare la lunghezza del campo).

Tutti i caratteri alfabetici devono essere impostati in **maiuscolo**.

I valori percentuali contenuti nelle dichiarazioni devono essere riportati indicando separatamente la parte intera dalla parte decimale a meno della virgola (ad es. la percentuale o il rapporto percentuale pari a 35,51% deve essere inserito su due distinti campi, 35 nella parte intera e 51 nella parte decimale, entrambi i valori devono essere preceduti e seguiti da tanti zeri non significativi quanti necessari a completare la lunghezza del campo).

Sono effettuati anche i seguenti controlli:

- L'obbligatorietà dell'indicazione della tipologia di attività didattica, nel caso in cui il relativo "Valore complessivo da assoggettare a IMU" – lettera k del secondo riquadro – sia stato compilato;
- L'obbligatorietà dell'indicazione di almeno una tipologia di attività diversa da quella didattica, nel caso in cui il relativo "Valore da considerare ai fini dell'applicazione IMU ai sensi dell'art. 5 del Regolamento" - lettera e del terzo riquadro – sia stato compilato;
- Se uno o entrambi i campi di cui ai punti precedenti (lettera k del secondo riquadro / lettera e del terzo riquadro) sono maggiori di zero il campo "Esenzione" deve essere valorizzato a 0, cioè non indica esenzione totale. Al contrario, se entrambi i 2 campi di cui sopra sono uguali a zero, il campo "Esenzione" non può essere valorizzato a 0, cioè indica esenzione totale.

### 2.6 Controllo sui dati presenti nella dichiarazione

La dichiarazione viene scartata in presenza di dati che non risultano conformi alle indicazioni inserite nei tracciati di seguito riportati. Si consiglia, comunque, per approfondimenti, maggiori chiarimenti e quesiti a carattere normativo di fare riferimento alle Istruzioni per la compilazione della dichiarazione allegate al modello cartaceo.

All'interno dei diagnostici mostrati all'utente al termine della fase di controllo della dichiarazione, su Desktop Telematico, verranno evidenziati dei messaggi non bloccanti nel caso in cui si riscontrino delle anomalie e/o incongruenze sui seguenti punti:

- Mancata coerenza dei campi contenuti all'interno delle sezioni "attività didattica" e/o "altre attività". Nel caso in cui gli importi e/o le percentuali indicate non siano coerenti con quanto suggerito nelle istruzioni e nel modello di dichiarazione in termini di calcolo, verrà mostrato, al termine del controllo, un diagnostico di avvertimento, non bloccante, in modo da informare l'utente sull'eventuale incongruenza;
- Superamento per il campo "valore immobile" di importi ritenuti oggettivamente esorbitanti. In questo caso verrà mostrato, al termine del controllo, un diagnostico di avvertimento, non bloccante, in modo da informare l'utente sull'eventuale anomalia.

Se la dichiarazione non presenta errori bloccanti, verrà prodotto il cosiddetto "file controllato" e l'utente comunque potrà procedere, se lo ritiene opportuno, con la firma e l'invio tramite Desktop Telematico.

Si precisa che, in sede di accoglimento delle dichiarazioni trasmesse in via telematica, costituirà oggetto di scarto della dichiarazione stessa l'indicazione di un codice Stato estero non presente nell'archivio "Comuni e Stati esteri" dell'Agenzia delle Entrate (si veda, a tal proposito, quanto riportato nella descrizione di dettaglio dei Quadri di cui si compone la dichiarazione).

---

#### 2.6.1 Istruzioni relative al record di testa – Record tipo A

**RECORD DI TIPO "A": RECORD DI TESTA**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Impostare ad 'A'. |
| 2 | Filler | 2 | 14 | AN | |
| 3 | Codice fornitura | 16 | 5 | AN | Impostare a "TAS00". |
| 4 | Tipo fornitore | 21 | 2 | AN | Assume i valori: 01 - Soggetti che inviano le proprie dichiarazioni. 10 - C.A.F. dipendenti e pensionati; C.A.F. imprese; Società ed enti di cui all'art.3, comma 2 del DPR 322/98 (se tale società appartiene a un gruppo può trasmettere la propria dichiarazione e quelle delle aziende del gruppo); Altri intermediari di cui all'art.3. comma 3 lett a), b), c) ed e) del DPR 322/98; Società degli Ordini di cui all'art. 3 Decr. Dir. 18/2/99; Soggetto che trasmette le dichiarazioni per le quali l'impegno a trasmettere è stato assunto da un professionista deceduto. |
| 5 | Codice fiscale fornitore | 23 | 16 | CF | Il campo è obbligatorio. Se la sezione Intermediario (campi da 46 a 49 del record B) è presente, il campo deve essere uguale al codice fiscale dell'intermediario (campo 46 del record B). Se la sezione Intermediario (campi da 46 a 49 del record B) è assente, il campo deve essere uguale al codice fiscale del contribuente (campo 2 del record B). |
| 6 | Tipologia dichiarazione | 39 | 1 | AN | Valori ammessi: N – Nuova; S – Sostitutiva; M – Multipla. |
| 7 | Filler | 40 | 482 | AN | Spazio non utilizzato |

**Dichiarazione su più invii**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 8 | Progressivo dell'invio telematico | 522 | 4 | NU | Tale progressivo deve essere univoco e crescente (con incrementi di una unità) nell'ambito della fornitura relativa alla intera dichiarazione. Deve essere minore o uguale al campo 9. |
| 9 | Numero totale degli invii telematici | 526 | 4 | NU | Deve essere maggiore o uguale a 1. |
| 10 | Filler | 530 | 1168 | AN | Spazio non disponibile |
| 11 | Spazio riservato al Servizio Telematico | 1698 | 200 | AN | |

**Ultimi tre caratteri di controllo del record**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 12 | Filler | 1898 | 1 | AN | Impostare al valore "A". |
| 13 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' ed 'LF'). |

---

#### 2.6.2 Istruzioni relative al quadro "Frontespizio" – Record tipo B

**RECORD DI TIPO "B": Frontespizio**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Vale "B" |
| 2 | Codice fiscale del soggetto dichiarante | 2 | 16 | CF | Dato obbligatorio. Il codice fiscale deve essere formalmente corretto e registrato in Anagrafe tributaria. La non registrazione comporta lo scarto della dichiarazione in fase di accettazione. |
| 3 | Progressivo modulo | 18 | 8 | NU | Vale 1. |
| 4 | Filler | 26 | 48 | AN | |
| 5 | Identificativo del produttore del software (codice fiscale) | 74 | 16 | AN | |

**Dati della Dichiarazione**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 6 | Anno della dichiarazione | 90 | 4 | NU | Dato obbligatorio. Impostare l'anno in formato aaaa. |
| 7 | Periodo d'imposta | 94 | 4 | NU | Dato obbligatorio. Impostare l'anno in formato aaaa. |
| 8 | Codice catastale comune | 98 | 4 | AN | Dato obbligatorio. Deve essere uno di quelli presenti nella tabella "Codici catastali comunali", consultabile sul sito dell'Agenzia delle Entrate: esempio: per Roma, impostare il codice H501. |
| 9 | Denominazione comune | 102 | 50 | AN | Dato obbligatorio. |

**Dati del Contribuente**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 10 | Denominazione | 152 | 60 | AN | Dato obbligatorio. |
| 11 | Codice fiscale | 212 | 16 | AN | Dato obbligatorio. Deve essere uguale al campo 2. |
| 12 | Telefono - Prefisso | 228 | 4 | AN | Il dato deve essere numerico. |
| 13 | Telefono - Numero | 232 | 8 | AN | Il dato deve essere numerico. |
| 14 | Indirizzo di posta elettronica | 240 | 50 | AN | |
| 15 | Indirizzo del domicilio fiscale | 290 | 35 | AN | Dato obbligatorio. |
| 16 | Numero civico del domicilio fiscale | 325 | 5 | AN | Dato obbligatorio. In assenza vale "SNC". |
| 17 | Scala del domicilio fiscale | 330 | 5 | AN | |
| 18 | Piano del domicilio fiscale | 335 | 5 | AN | |
| 19 | Interno del domicilio fiscale | 340 | 5 | AN | |
| 20 | C.A.P. del domicilio fiscale | 345 | 5 | AN | |
| 21 | Comune del domicilio fiscale - Località estera | 350 | 100 | AN | Dato obbligatorio. Le persone non residenti in Italia devono indicare la località e lo Stato estero di residenza. |
| 22 | Provincia (sigla) del domicilio fiscale - "EE" per stato estero | 450 | 2 | PR | Dato obbligatorio. Le persone non residenti in Italia devono utilizzare la sigla "EE". |
| 23 | Codice Stato estero | 452 | 3 | NU | Lo Stato estero deve essere uno di quelli presenti nell'archivio "Comuni e Stati esteri", consultabile sul sito dell'Agenzia delle Entrate (Stati soppressi e non soppressi): devono essere riportati i tre caratteri numerici che seguono la lettera "Z". Dato obbligatorio, nel caso in cui nel precedente campo si è indicata la sigla "EE". |

**Dati relativi al rappresentante firmatario della dichiarazione**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 24 | Codice fiscale del rappresentante | 455 | 16 | CF | Il dato è obbligatorio. |
| 25 | Codice Carica del rappresentante | 471 | 2 | AN | Il dato è obbligatorio. Nel caso in cui il dichiarante sia diverso dal contribuente indicare uno dei codici indicati nel paragrafo 2.5.2. |
| 26 | Cognome del rappresentante | 473 | 24 | AN | Il dato è obbligatorio. |
| 27 | Nome del rappresentante | 497 | 20 | AN | Il dato è obbligatorio. |
| 28 | Sesso del rappresentante | 517 | 1 | AN | Vale 'M' o 'F'. Il dato è obbligatorio. |
| 29 | Data di nascita del rappresentante | 518 | 8 | DT | Il dato è obbligatorio. |
| 30 | Comune o stato estero di nascita del rappresentante | 526 | 40 | AN | Il dato è obbligatorio. |
| 31 | Sigla della provincia di nascita del rappresentante - "EE" per stato estero | 566 | 2 | PN | Il dato è obbligatorio. |
| 32 | Residenza all'estero | 568 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Il dato è obbligatorio. |
| 33 | Codice Stato estero di residenza | 569 | 3 | NU | Lo Stato estero deve essere uno di quelli presenti nell'archivio "Comuni e Stati esteri". Dato obbligatorio, nel caso in cui il campo "Residenza all'estero" vale 1. |
| 34 | Stato federato provincia contea di residenza | 572 | 24 | AN | |
| 35 | Località di residenza estera | 596 | 24 | AN | Dato obbligatorio, nel caso in cui il campo "Residenza all'estero" vale 1. |
| 36 | Indirizzo Estero | 620 | 35 | AN | Dato obbligatorio, nel caso in cui il campo "Residenza all'estero" vale 1. |
| 37 | Telefono del rappresentante: prefisso | 655 | 4 | AN | Il dato deve essere numerico. |
| 38 | Telefono del rappresentante: numero | 659 | 8 | AN | Il dato deve essere numerico. |
| 39 | Codice fiscale società o ente dichiarante | 667 | 11 | CN | Il dato deve essere numerico. |

**Firma**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 40 | Numero immobili presenti nel quadro A | 678 | 9 | NU | Dato obbligatorio. Si riferisce all'intera dichiarazione. |
| 41 | Numero d'ordine presenti nel quadro A | 687 | 9 | NU | Dato obbligatorio. Si riferisce all'intera dichiarazione. |
| 42 | Numero immobili presenti nel quadro B | 696 | 9 | NU | Dato obbligatorio. Si riferisce all'intera dichiarazione. |
| 43 | Indicatore di compilazione del quadro C | 705 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Si riferisce all'intera dichiarazione. |
| 44 | Indicatore di compilazione del quadro D | 706 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Si riferisce all'intera dichiarazione. |
| 45 | Firma del dichiarante | 707 | 1 | CB | Dato obbligatorio. |

**Impegno alla trasmissione telematica**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 46 | Codice fiscale dell'intermediario | 708 | 16 | CF | Dato obbligatorio se il campo 4 del record A è uguale a 10. Dato obbligatorio se il campo 5 del record A è diverso dal campo 2 del record B. |
| 47 | Numero di iscrizione all'albo dei C.A.F. | 724 | 5 | NU | |
| 48 | Data dell'impegno | 729 | 8 | DT | Dato obbligatorio se compilato un altro dato nella sezione. |
| 49 | Firma dell'intermediario | 737 | 1 | CB | Dato obbligatorio se compilato un altro dato nella sezione. |

**Spazio non disponibile**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 50 | Filler | 738 | 1106 | AN | |
| 51 | Spazio riservato al Servizio Telematico | 1844 | 20 | AN | |
| 52 | Filler | 1864 | 34 | AN | |

**Ultimi tre caratteri di controllo**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 53 | Filler | 1898 | 1 | AN | Impostare al valore "A" |
| 54 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' ed 'LF'). |

---

#### 2.6.3 Istruzioni relative al quadro "A" – Record tipo C

**RECORD DI TIPO "C": Quadro A**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Vale "C". |
| 2 | Codice fiscale del soggetto dichiarante | 2 | 16 | CF | Impostare sempre. |
| 3 | Progressivo modulo | 18 | 8 | NU | Impostare ad 1 per il primo modulo di ogni quadro compilato, incrementando tale valore di una unità per ogni ulteriore modulo. |
| 4 | Filler | 26 | 48 | AN | |
| 5 | Identificativo del produttore del software (codice fiscale) | 74 | 16 | AN | |

**Immobili totalmente imponibili o esenti (1)**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 6 | Dati immobile - Numero d'ordine | 90 | 4 | NU | Il dato è obbligatorio. Numero d'ordine dell'immobile all'interno del Quadro A con riferimento all'intera fornitura. Parte da 1. |
| 7 | Dati immobile - Progressivo immobile | 94 | 4 | NU | Il dato è obbligatorio. Progressivo d'ordine dell'immobile all'interno del Quadro A con riferimento all'intera fornitura. Parte da 1. |
| 8 | Dati immobile - Indicatore di continuità | 98 | 1 | NU | Il dato è obbligatorio. Se presente indica che l'immobile fa riferimento ad un'anagrafica precedentemente definita. Vale 0 o 1 e non può essere indicato per il primo immobile del primo record C o per immobili che presentano un progressivo maggiore al numero d'ordine. |
| 9 | Dati immobile - Caratteristiche | 99 | 1 | AN | Il dato è obbligatorio. Indicare il numero: 1, se si tratta di un terreno; 2, se si tratta di un'area fabbricabile; 3, se si tratta di un fabbricato il cui valore è determinato sulla base della rendita catastale; 4, se si tratta di un fabbricato il cui valore è determinato sulla base delle scritture contabili. |
| 10 | Dati immobile - Indirizzo | 100 | 100 | AN | Il dato è obbligatorio. Indicare l'esatta ubicazione dell'immobile descritto e cioè la località, la via o la piazza, il numero civico, la scala, il piano e l'interno. |
| 11 | Dati immobile - T/U | 200 | 1 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare T se l'immobile è censito nel catasto terreni, U se nel catasto urbano. |
| 12 | Dati immobile - Codice Catastale Immobile/Terreno | 201 | 5 | AN | Riportare, se presente, il corrispondente (per Quadro e numero d'ordine) codice catastale indicato nel campo Annotazioni del Record C. |
| 13 | Dati immobile - Sezione | 206 | 3 | AN | |
| 14 | Dati immobile - Foglio | 209 | 4 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". |
| 15 | Dati immobile - Particella | 213 | 10 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". |
| 16 | Dati immobile - Subalterno | 223 | 4 | AN | |
| 17 | Dati immobile - Categoria/Qualità | 227 | 25 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare la categoria per i fabbricati e la qualità per i terreni. |
| 18 | Dati immobile - Classe | 252 | 10 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare la classe dei fabbricati o la classe di redditività delle singole particelle di terreno. |
| 19 | Dati immobile - N. Protocollo | 262 | 20 | AN | Il dato è obbligatorio se è presente il campo successivo. Da utilizzare in mancanza dei dati catastali. |
| 20 | Dati immobile - Anno | 282 | 4 | AN | Il dato è obbligatorio se è presente il campo precedente. Da utilizzare in mancanza dei dati catastali. |
| 21 | Dati immobile - Valore | 286 | 15 | NU | Il dato è obbligatorio. |
| 22 | Dati immobile - Percentuale di possesso - parte intera | 301 | 3 | NU | Il dato è obbligatorio. |
| 23 | Dati immobile - Percentuale di possesso - parte decimale | 304 | 2 | NU | Il dato è obbligatorio. |
| 24 | Dati immobile - Riduzioni | 306 | 1 | NU | Il dato è obbligatorio. Indicare: 0 – Nessuna riduzione; 1 – Immobile storico o artistico; 2 – Immobile inagibile/inabitabile; 3 – Altre riduzioni. |
| 25 | Dati immobile - Esenzione | 307 | 1 | NU | Il dato è obbligatorio. Indicare: 0 – Nessuna esenzione; 1 – Esenzione per immobili non utilizzabili né disponibili; 2 – Esenzione quadro temporaneo Aiuti di Stato; 3 – Altre esenzioni. Da compilare seguendo le indicazioni descritte nel paragrafo 2.5.4. |
| 26 | Dati immobile - Acquisto | 308 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 27 | Dati immobile - Cessione | 309 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 28 | Dati immobile - Altro | 310 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 29 | Dati immobile - Altro Descrizione | 311 | 100 | AN | Descrizione a testo libero. Il dato è obbligatorio se la casella precedente vale 1. |
| 30 | Dati immobile - Inizio/Termine del possesso o variazione d'imposta | 411 | 8 | DT | Dato obbligatorio se è stato compilato un campo tra i campi Acquisto, Cessione, Altro e Inizio/Termine dell'agevolazione |
| 31 | Dati immobile – Inizio/Termine dell'agevolazione | 419 | 1 | AN | Indicare: I – Inizio; T – Termine; |
| 32 | Dati immobile - Agenzia delle Entrate di | 420 | 24 | AN | Da compilare, in alternativa al campo successivo, se è presente il campo "Acquisto" o "Cessione". |
| 33 | Dati immobile - Estremi del titolo | 444 | 24 | AN | Da compilare, in alternativa al campo precedente, se è presente il campo "Acquisto" o "Cessione". |
| 34 | Dati immobile - Non utilizzabili / Non disponibili - Tipo | 468 | 1 | AN | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. Indicare: 1 - Per art. 614, secondo comma, c.p. Violazione di domicilio o art.633, c.p. Invasione di terreni o edifici; 2 - Per occupazione abusiva per la quale sia stata presentata denuncia o iniziata azione giudiziaria penale. |
| 35 | Dati immobile - Non utilizzabili / Non disponibili - Autorità | 469 | 100 | AN | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. |
| 36 | Dati immobile - Non utilizzabili / Non disponibili – Data denuncia / provvedimento | 569 | 8 | DT | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. |

**Immobili totalmente imponibili o esenti (2)**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 37 | Dati immobile - Numero d'ordine | 577 | 4 | NU | Il dato è obbligatorio. Numero d'ordine dell'immobile all'interno del Quadro A con riferimento all'intera fornitura. Parte da 1. |
| 38 | Dati immobile - Progressivo immobile | 581 | 4 | NU | Il dato è obbligatorio. Progressivo d'ordine dell'immobile all'interno del Quadro A con riferimento all'intera fornitura. Parte da 1. |
| 39 | Dati immobile - Indicatore di continuità | 585 | 1 | NU | Il dato è obbligatorio. Se presente indica che l'immobile fa riferimento ad un'anagrafica precedentemente definita. Vale 0 o 1 e non può essere indicato per il primo immobile del primo record C o per immobili che presentano un progressivo maggiore al numero d'ordine. |
| 40 | Dati immobile - Caratteristiche | 586 | 1 | AN | Il dato è obbligatorio. Indicare il numero: 1, se si tratta di un terreno; 2, se si tratta di un'area fabbricabile; 3, se si tratta di un fabbricato il cui valore è determinato sulla base della rendita catastale; 4, se si tratta di un fabbricato il cui valore è determinato sulla base delle scritture contabili. |
| 41 | Dati immobile - Indirizzo | 587 | 100 | AN | Il dato è obbligatorio. Indicare l'esatta ubicazione dell'immobile descritto e cioè la località, la via o la piazza, il numero civico, la scala, il piano e l'interno. |
| 42 | Dati immobile - T/U | 687 | 1 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare T se l'immobile è censito nel catasto terreni, U se nel catasto urbano. |
| 43 | Dati immobile - Codice Catastale Immobile/Terreno | 688 | 5 | AN | Riportare, se presente, il corrispondente (per Quadro e numero d'ordine) codice catastale indicato nel campo Annotazioni del Record C. |
| 44 | Dati immobile - Sezione | 693 | 3 | AN | |
| 45 | Dati immobile - Foglio | 696 | 4 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". |
| 46 | Dati immobile - Particella | 700 | 10 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". |
| 47 | Dati immobile - Subalterno | 710 | 4 | AN | |
| 48 | Dati immobile - Categoria/Qualità | 714 | 25 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare la categoria per i fabbricati e la qualità per i terreni. |
| 49 | Dati immobile - Classe | 739 | 10 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare la classe dei fabbricati o la classe di redditività delle singole particelle di terreno. |
| 50 | Dati immobile - N. Protocollo | 749 | 20 | AN | Il dato è obbligatorio se è presente il campo successivo. Da utilizzare in mancanza dei dati catastali. |
| 51 | Dati immobile - Anno | 769 | 4 | AN | Il dato è obbligatorio se è presente il campo precedente. Da utilizzare in mancanza dei dati catastali. |
| 52 | Dati immobile - Valore | 773 | 15 | NU | Il dato è obbligatorio. |
| 53 | Dati immobile - Percentuale di possesso - parte intera | 788 | 3 | NU | Il dato è obbligatorio. |
| 54 | Dati immobile - Percentuale di possesso - parte decimale | 791 | 2 | NU | Il dato è obbligatorio. |
| 55 | Dati immobile - Riduzioni | 793 | 1 | NU | Il dato è obbligatorio. Indicare: 0 – Nessuna riduzione; 1 – Immobile storico o artistico; 2 – Immobile inagibile/inabitabile; 3 – Altre riduzioni. |
| 56 | Dati immobile - Esenzione | 794 | 1 | NU | Il dato è obbligatorio. Indicare: 0 – Nessuna esenzione; 1 – Esenzione per immobili non utilizzabili né disponibili; 2 – Esenzione quadro temporaneo Aiuti di Stato; 3 – Altre esenzioni. Da compilare seguendo le indicazioni descritte nel paragrafo 2.5.4. |
| 57 | Dati immobile - Acquisto | 795 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 58 | Dati immobile - Cessione | 796 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 59 | Dati immobile - Altro | 797 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 60 | Dati immobile - Altro Descrizione | 798 | 100 | AN | Descrizione a testo libero. Il dato è obbligatorio se la casella precedente vale 1. |
| 61 | Dati immobile - Inizio/Termine del possesso o variazione d'imposta | 898 | 8 | DT | Dato obbligatorio se è stato compilato un campo tra i campi Acquisto, Cessione, Altro e Inizio/Termine dell'agevolazione |
| 62 | Dati immobile – Inizio/Termine dell'agevolazione | 906 | 1 | AN | Indicare: I – Inizio; T – Termine; |
| 63 | Dati immobile - Agenzia delle Entrate di | 907 | 24 | AN | Da compilare, in alternativa al campo successivo, se è presente il campo "Acquisto" o "Cessione". |
| 64 | Dati immobile - Estremi del titolo | 931 | 24 | AN | Da compilare, in alternativa al campo precedente, se è presente il campo "Acquisto" o "Cessione". |
| 65 | Dati immobile - Non utilizzabili / Non disponibili - Tipo | 955 | 1 | AN | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. Indicare: 1 - Per art. 614, secondo comma, c.p. Violazione di domicilio o art.633, c.p. Invasione di terreni o edifici; 2 - Per occupazione abusiva per la quale sia stata presentata denuncia o iniziata azione giudiziaria penale. |
| 66 | Dati immobile - Non utilizzabili / Non disponibili - Autorità | 956 | 100 | AN | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. |
| 67 | Dati immobile - Non utilizzabili / Non disponibili – Data denuncia / provvedimento | 1056 | 8 | DT | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. |

**Annotazioni**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 68 | Annotazioni | 1064 | 500 | AN | |
| 69 | Filler | 1564 | 334 | AN | |

**Ultimi tre caratteri di controllo del record**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 70 | Filler | 1898 | 1 | AN | Impostare al valore "A" |
| 71 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' ed 'LF'). |

---

#### 2.6.4 Istruzioni relative al quadro "B" – Record tipo D

**RECORD DI TIPO "D": Quadro B**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Vale "D". |
| 2 | Codice fiscale del soggetto dichiarante | 2 | 16 | CF | Impostare sempre. |
| 3 | Progressivo modulo | 18 | 8 | NU | Impostare ad 1 per il primo modulo di ogni quadro compilato, incrementando tale valore di una unità per ogni ulteriore modulo. |
| 4 | Filler | 26 | 48 | AN | |
| 5 | Identificativo del produttore del software (codice fiscale) | 74 | 16 | AN | |

**IMMOBILI PARZIALMENTE IMPONIBILI O TOTALMENTE ESENTI (1) - Dati catastali (1)**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 6 | Dati immobile - Numero d'ordine | 90 | 4 | NU | Il dato è obbligatorio. Numero d'ordine dell'immobile all'interno del Quadro B con riferimento all'intera fornitura. Parte da 1. |
| 7 | Dati immobile - Progressivo immobile | 94 | 4 | NU | Il dato è obbligatorio. Progressivo d'ordine dell'immobile all'interno del Quadro B con riferimento all'intera fornitura. Parte da 1. |
| 8 | Dati immobile - Indicatore di continuità | 98 | 1 | NU | Se presente indica che l'immobile fa riferimento ad un'anagrafica precedentemente definita. Vale 0 o 1 e non può essere indicato per il primo immobile del primo record C o per immobili che presentano un progressivo maggiore al numero d'ordine. |
| 9 | Dati immobile - Tipologia attività svolta: attività assistenziali | 99 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Almeno un campo del tipo "Tipologia attività svolta" deve valere 1. |
| 10 | Dati immobile - Tipologia attività svolta: attività previdenziali | 100 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Almeno un campo del tipo "Tipologia attività svolta" deve valere 1. |
| 11 | Dati immobile - Tipologia attività svolta: attività sanitarie | 101 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Almeno un campo del tipo "Tipologia attività svolta" deve valere 1. |
| 12 | Dati immobile - Tipologia attività svolta: attività didattiche | 102 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Almeno un campo del tipo "Tipologia attività svolta" deve valere 1. |
| 13 | Dati immobile - Tipologia attività svolta: attività ricettive | 103 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Almeno un campo del tipo "Tipologia attività svolta" deve valere 1. |
| 14 | Dati immobile - Tipologia attività svolta: attività culturali | 104 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Almeno un campo del tipo "Tipologia attività svolta" deve valere 1. |
| 15 | Dati immobile - Tipologia attività svolta: attività ricreative | 105 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Almeno un campo del tipo "Tipologia attività svolta" deve valere 1. |
| 16 | Dati immobile - Tipologia attività svolta: attività sportive | 106 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Almeno un campo del tipo "Tipologia attività svolta" deve valere 1. |
| 17 | Dati immobile - Tipologia attività svolta: attività di religione e di culto | 107 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Almeno un campo del tipo "Tipologia attività svolta" deve valere 1. |
| 18 | Dati immobile - Tipologia attività svolta: attività di ricerca scientifica | 108 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Almeno un campo del tipo "Tipologia attività svolta" deve valere 1. |
| 19 | Dati immobile - Caratteristiche | 109 | 1 | AN | Il dato è obbligatorio. Indicare il numero: 1, se si tratta di un terreno; 2, se si tratta di un'area fabbricabile; 3, se si tratta di un fabbricato il cui valore è determinato sulla base della rendita catastale; 4, se si tratta di un fabbricato classificabile nel gruppo catastale D, non iscritto in catasto, ovvero iscritto, ma senza attribuzione di rendita, interamente appartenente ad impresa, distintamente contabilizzato. |
| 20 | Dati immobile - Indirizzo | 110 | 100 | AN | Il dato è obbligatorio. Indicare l'esatta ubicazione dell'immobile descritto e cioè la località, la via o la piazza, il numero civico, la scala, il piano e l'interno. |
| 21 | Dati immobile - T/U | 210 | 1 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare T se l'immobile è censito nel catasto terreni, U se nel catasto urbano. |
| 22 | Dati immobile - Codice Catastale Immobile/Terreno | 211 | 5 | AN | Riportare, se presente, il corrispondente (per Quadro e numero d'ordine) codice catastale indicato nel campo Annotazioni del Record C. |
| 23 | Dati immobile - Sezione | 216 | 3 | AN | |
| 24 | Dati immobile - Foglio | 219 | 4 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". |
| 25 | Dati immobile - Particella | 223 | 10 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". |
| 26 | Dati immobile - Subalterno | 233 | 4 | AN | |
| 27 | Dati immobile - Categoria/Qualità | 237 | 25 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare la categoria per i fabbricati e la qualità per i terreni. |
| 28 | Dati immobile - Classe | 262 | 10 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare la classe dei fabbricati o la classe di redditività delle singole particelle di terreno. |
| 29 | Dati immobile - N. Protocollo | 272 | 20 | AN | Il dato è obbligatorio se è presente il campo successivo. Da utilizzare in mancanza dei dati catastali. |
| 30 | Dati immobile - Anno | 292 | 4 | AN | Il dato è obbligatorio se è presente il campo precedente. Da utilizzare in mancanza dei dati catastali. |
| 31 | Dati immobile - Valore | 296 | 15 | NU | Il dato è obbligatorio. |
| 32 | Dati immobile - Percentuale di possesso - parte intera | 311 | 3 | NU | Il dato è obbligatorio. |
| 33 | Dati immobile - Percentuale di possesso - parte decimale | 314 | 2 | NU | Il dato è obbligatorio. |
| 34 | Dati immobile - Riduzioni | 316 | 1 | NU | Il dato è obbligatorio. Indicare: 0 – Nessuna riduzione; 1 – Immobile storico o artistico; 2 – Immobile inagibile/inabitabile; 3 – Altre riduzioni. |
| 35 | Dati immobile - Esenzione | 317 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Da compilare seguendo le indicazioni descritte nel paragrafo 2.5.4. |
| 36 | Dati immobile - Acquisto | 318 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. |
| 37 | Dati immobile - Cessione | 319 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. |
| 38 | Dati immobile - Altro | 320 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. |
| 39 | Dati immobile - Altro Descrizione | 321 | 100 | AN | Descrizione a testo libero. Il dato è obbligatorio se la casella precedente vale 1. |
| 40 | Dati immobile - Inizio/Termine del possesso o variazione d'imposta | 421 | 8 | DT | Dato obbligatorio se è stato compilato un campo tra i campi Acquisto, Cessione, Altro e Inizio/Termine dell'agevolazione |
| 41 | Dati immobile – Inizio/Termine dell'agevolazione | 429 | 1 | AN | Indicare: I – Inizio; T – Termine; |
| 42 | Dati immobile - Agenzia delle Entrate di | 430 | 24 | AN | Da compilare, in alternativa al campo successivo, se è presente il campo "Acquisto" o "Cessione". |
| 43 | Dati immobile - Estremi del titolo | 454 | 24 | AN | Da compilare, in alternativa al campo precedente, se è presente il campo "Acquisto" o "Cessione". |
| 44 | Dati immobile – Comodato / immobili strutturali - Tipo | 478 | 1 | AN | Indicare: 1 – per comodato; 2 – per immobili strutturali. |
| 45 | Dati immobile – Comodato / immobili strutturali - Comodatario | 479 | 100 | AN | Dato obbligatorio se il campo "Comodato / immobili strutturali - Tipo" è valorizzato a 1. In caso contrario non deve essere compilato. |

**Attività didattica (1): da compilare se il campo 12 vale 1**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 46 | Cm (Corrispettivo medio percepito dall'ente non commerciale) | 579 | 9 | NU | Campo obbligatorio da esprimersi in centesimi. |
| 47 | Cms (Costo medio per studente pubblicato sul sito internet del ministero competente) | 588 | 9 | NU | Campo obbligatorio da esprimersi in centesimi. |
| 48 | Rapporto percentuale superficie per attività commerciali/superficie totale dell'immobile. Parte intera | 597 | 3 | NU | |
| 49 | Rapporto percentuale superficie per attività commerciali/superficie totale dell'immobile. Parte decimale | 600 | 2 | NU | |
| 50 | Rapporto percentuale superficie per attività commerciali/superficie totale dell'immobile per giorni di utilizzo/365. Parte Intera | 602 | 3 | NU | |
| 51 | Rapporto percentuale superficie per attività commerciali/superficie totale dell'immobile per giorni di utilizzo/365. Parte decimale | 605 | 2 | NU | |
| 52 | Rapporto percentuale numero soggetti a modalità commerciali/numero totale soggetti. Parte intera | 607 | 3 | NU | |
| 53 | Rapporto percentuale numero soggetti a modalità commerciali/numero totale soggetti. Parte decimale | 610 | 2 | NU | |
| 54 | Rapporto percentuale numero soggetti a modalità commerciali/numero totale soggetti per giorni di utilizzo/365. Parte Intera | 612 | 3 | NU | |
| 55 | Rapporto percentuale numero soggetti a modalità commerciali/numero totale soggetti per giorni di utilizzo/365. Parte decimale | 615 | 2 | NU | |
| 56 | Rapporto percentuale giorni utilizzo con modalità commerciali/365 giorni. Parte intera | 617 | 3 | NU | |
| 57 | Rapporto percentuale giorni utilizzo con modalità commerciali/365 giorni. Parte decimale | 620 | 2 | NU | |
| 58 | Percentuale di imponibilità. Parte intera | 622 | 3 | NU | Sommare le percentuali di imponibilità di cui ai campi precedenti, fino a un massimo del 99,99%. Se il risultato eccede il 99,99%, l'immobile, essendo totalmente imponibile, va riportato nel Quadro A. |
| 59 | Percentuale di imponibilità. Parte decimale | 625 | 2 | NU | |
| 60 | Valore da considerare ai fini dell'applicazione IMU ai sensi dell'art. 5 del Regolamento | 627 | 12 | NU | Base imponibile x (Percentuale di imponibilità/100). Campo da esprimersi in centesimi. |
| 61 | Valore da considerare ai fini dell'applicazione/esenzione IMU ai sensi della lett. c) del comma 3 dell'art. 4 del Regolamento | 639 | 12 | NU | Base imponibile - campo precedente. Campo da esprimersi in centesimi. |
| 62 | Caso Cm<Cms | 651 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Barrare in alternativa al campo seguente: uno dei due campi deve valere 1. NOTA: Nel caso in cui nell'immobile venga svolta esclusivamente attività didattica con modalità non commerciali, dovrà essere contestualmente barrato il campo "Esenzioni: in tal caso non risulteranno neanche compilati i 16 campi precedenti a "Caso Cm<Cms" |
| 63 | Caso Cm>=Cms | 652 | 1 | CB | Se la casella è barrata vale 1. Altrimenti vale 0. Barrare in alternativa al campo precedente: uno dei due campi deve valere 1. |
| 64 | Rapporto percentuale Cms/Cm. Parte intera | 653 | 3 | NU | Da compilare solo se Cm>=Cms |
| 65 | Rapporto percentuale Cms/Cm. Parte decimale | 656 | 2 | NU | |
| 66 | Valore parziale da assoggettare a IMU | 658 | 12 | NU | Da compilare solo se Cm>=Cms. Deve essere = campo "Valore da considerare ai fini dell'applicazione/esenzione IMU" x (1 - campo "Rapporto percentuale Cms/Cm"/100). Campo da esprimersi in centesimi. |
| 67 | Valore complessivo da assoggettare a IMU | 670 | 12 | NU | Da compilare solo se Cm>=Cms. Deve essere = campo "Valore da considerare ai fini dell'applicazione IMU" + "Valore parziale da assoggettare a IMU". Campo da esprimersi in centesimi. |

**Altre attività (1): da compilare se almeno uno dei campi da 9 a 18 (con l'esclusione di 12) vale 1**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 68 | Cenc (Corrispettivo medio percepito dall'ente non commerciale) | 682 | 9 | NU | Campo obbligatorio da esprimersi in centesimi. |
| 69 | Cm (Corrispettivo medio previsto per analoghe attività svolte con modalità commerciali nello stesso ambito territoriale) | 691 | 9 | NU | Campo obbligatorio da esprimersi in centesimi. |
| 70 | Rapporto percentuale superficie per attività commerciali/superficie totale dell'immobile. Parte intera | 700 | 3 | NU | |
| 71 | Rapporto percentuale superficie per attività commerciali/superficie totale dell'immobile. Parte decimale | 703 | 2 | NU | |
| 72 | Rapporto percentuale superficie per attività commerciali/superficie totale dell'immobile per giorni di utilizzo/365. Parte intera | 705 | 3 | NU | |
| 73 | Rapporto percentuale superficie per attività commerciali/superficie totale dell'immobile per giorni di utilizzo/365. Parte decimale | 708 | 2 | NU | |
| 74 | Rapporto percentuale numero soggetti a modalità commerciali/numero totale soggetti. Parte intera | 710 | 3 | NU | |
| 75 | Rapporto percentuale numero soggetti a modalità commerciali/numero totale soggetti. Parte decimale | 713 | 2 | NU | |
| 76 | Rapporto percentuale numero soggetti a modalità commerciali/numero totale soggetti per giorni di utilizzo/365. Parte intera | 715 | 3 | NU | |
| 77 | Rapporto percentuale numero soggetti a modalità commerciali/numero totale soggetti per giorni di utilizzo/365. Parte decimale | 718 | 2 | NU | |
| 78 | Rapporto percentuale giorni utilizzo con modalità commerciali/365 giorni. Parte intera | 720 | 3 | NU | |
| 79 | Rapporto percentuale giorni utilizzo con modalità commerciali/365 giorni. Parte decimale | 723 | 2 | NU | |
| 80 | Percentuale di imponibilità. Parte intera | 725 | 3 | NU | Sommare le percentuali di imponibilità di cui ai campi precedenti, fino a un massimo del 99,99%. Se il risultato eccede il 99,99%, l'immobile, essendo totalmente imponibile, va riportato nel Quadro A. |
| 81 | Percentuale di imponibilità. Parte decimale | 728 | 2 | NU | |
| 82 | Valore da considerare ai fini dell'applicazione IMU ai sensi dell'art. 5 del Regolamento | 730 | 12 | NU | Base imponibile x (Percentuale di imponibilità/100). Campo da esprimersi in centesimi. |

**Annotazioni**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 83 | Annotazioni | 742 | 500 | AN | |
| 84 | Filler | 1242 | 656 | AN | |

**Ultimi tre caratteri di controllo del record**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 85 | Filler | 1898 | 1 | AN | Impostare al valore "A" |
| 86 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' ed 'LF'). |

---

#### 2.6.5 Istruzioni relative ai quadri "C" e "D" – Record tipo E

**RECORD DI TIPO "E": Quadri C e D**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Vale "E". |
| 2 | Codice fiscale del soggetto dichiarante | 2 | 16 | CF | Impostare sempre. |
| 3 | Progressivo modulo | 18 | 8 | NU | Vale 1. |
| 4 | Filler | 26 | 48 | AN | |
| 5 | Identificativo del produttore del software (codice fiscale) | 74 | 16 | AN | |

**QUADRO C - Determinazione dell'IMU**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 6 | IMU dovuta | 90 | 12 | NU | Riportare l'ammontare complessivo dell'imposta calcolata in base ai valori risultanti dalla compilazione dei Quadri A e B. Nel caso in cui siano stati compilati più quadri A ovvero più quadri B (su una o più forniture), si dovrà indicare il totale dell'IMU risultante dagli stessi. |
| 7 | Eccedenza IMU risultante dalla precedente dichiarazione | 102 | 12 | NU | Riportare l'eccedenza di imposta per la quale non è stato chiesto il rimborso nella precedente dichiarazione. |
| 8 | Eccedenza IMU risultante dalla precedente dichiarazione compensata nel mod. F24 | 114 | 12 | NU | Parte dell'eccedenza dell'imposta risultante dalla precedente dichiarazione, già riportata nel rigo precedente, che è stata utilizzata in compensazione nel modello F24. |
| 9 | Rate IMU versate | 126 | 12 | NU | Riportare la somma delle rate versate (considerando eventuali versamenti integrativi). |
| 10 | IMU a debito | 138 | 12 | NU | Se positivo, riportare il risultato derivante da campo 6 - campo 7 + campo 8 - campo 9. |
| 11 | IMU a credito | 150 | 12 | NU | Se negativo, riportare a meno del segno meno, il risultato derivante da campo 6 - campo 7 + campo 8 - campo 9. |

**QUADRO D - Compensazioni e rimborsi**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 12 | IMU a credito risultante dalla presente dichiarazione | 162 | 12 | NU | Riportare il valore del campo 11. |
| 13 | Credito IMU di cui si chiede il rimborso | 174 | 12 | NU | La somma dei campi 13 e 14 non deve eccedere il campo 12. |
| 14 | Credito IMU da utilizzare in compensazione | 186 | 12 | NU | La somma dei campi 13 e 14 non deve eccedere il campo 12. |

**Spazio non disponibile**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 15 | Filler | 198 | 1700 | AN | |

**Ultimi tre caratteri di controllo del record**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 16 | Filler | 1898 | 1 | AN | Impostare al valore "A" |
| 17 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' ed 'LF'). |

---

#### 2.6.6 Istruzioni relative al record tipo Z - Record di coda

**RECORD DI TIPO "Z": RECORD DI CODA**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Impostare a 'Z'. |
| 2 | Numero record di tipo 'B' | 2 | 9 | NU | Impostare a 1. |
| 3 | Numero record di tipo 'C' | 11 | 9 | NU | Impostare il numero di record contenuti nel presente invio: valore minimo consentito 1. |
| 4 | Numero record di tipo 'D' | 20 | 9 | NU | Impostare il numero di record contenuti nel presente invio: valore minimo consentito 1. |

**Spazio non utilizzato**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 5 | Filler | 29 | 1869 | AN | |

**Ultimi tre caratteri di controllo del record**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 6 | Filler | 1898 | 1 | AN | Vale sempre "A" |
| 7 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' e 'LF'). |

