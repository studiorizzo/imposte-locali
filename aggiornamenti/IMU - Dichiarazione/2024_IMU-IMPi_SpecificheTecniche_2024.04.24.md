# Specifiche tecniche per la trasmissione telematica del Modello per la Dichiarazione IMU e IMPi degli Enti Commerciali e delle Persone Fisiche

---

## Sommario

1. [AVVERTENZE GENERALI](#1-avvertenze-generali)
2. [CONTENUTO DELLA FORNITURA](#2-contenuto-della-fornitura)
   - 2.1 [GENERALITÀ](#21-generalità)
   - 2.2 [LA SEQUENZA DEI RECORD](#22-la-sequenza-dei-record)
   - 2.3 [LA STRUTTURA DEI RECORD](#23-la-struttura-dei-record)
   - 2.4 [LA STRUTTURA DEI DATI](#24-la-struttura-dei-dati)
   - 2.5 [REGOLE GENERALI](#25-regole-generali)
     - 2.5.1 [CODICE FISCALE DEL CONTRIBUENTE](#251-codice-fiscale-del-contribuente)
     - 2.5.2 [CODICE CARICA DEL DICHIARANTE](#252-codice-carica-del-dichiarante)
     - 2.5.3 [INFORMAZIONI DI UN IMMOBILE](#253-informazioni-di-un-immobile)
     - 2.5.4 [ALTRI DATI](#254-altri-dati)
   - 2.6 [CONTROLLO SUI DATI PRESENTI NELLA DICHIARAZIONE](#26-controllo-sui-dati-presenti-nella-dichiarazione)
     - 2.6.1 [ISTRUZIONI RELATIVE AL RECORD DI TESTA – RECORD TIPO A](#261-istruzioni-relative-al-record-di-testa--record-tipo-a)
     - 2.6.2 [ISTRUZIONI RELATIVE AL QUADRO "FRONTESPIZIO" – RECORD TIPO B](#262-istruzioni-relative-al-quadro-frontespizio--record-tipo-b)
     - 2.6.3 [ULTERIORI INFORMAZIONI PRESENTI NEL "FRONTESPIZIO" – RECORD TIPO C](#263-ulteriori-informazioni-presenti-nel-frontespizio--record-tipo-c)
     - 2.6.4 [IMU – IMMOBILI - RECORD TIPO D](#264-imu--immobili---record-tipo-d)
     - 2.6.5 [IMPI – PIATTAFORME MARINE E RIGASSIFICATORI - RECORD TIPO E](#265-impi--piattaforme-marine-e-rigassificatori---record-tipo-e)
     - 2.6.6 [ISTRUZIONI RELATIVE AL RECORD TIPO Z - RECORD DI CODA](#266-istruzioni-relative-al-record-tipo-z---record-di-coda)

---

## 1. AVVERTENZE GENERALI

Il contenuto e le caratteristiche della fornitura dei dati relativi alle dichiarazioni IMU-IMPi Enti commerciali e persone fisiche, da trasmettere per ogni anno d'imposta al Dipartimento delle finanze in via telematica, sono contenuti nelle specifiche tecniche di seguito esposte.

Si precisa che una dichiarazione da inviare, i cui dati non rispettino le specifiche tecniche, verrà scartata.

---

## 2. CONTENUTO DELLA FORNITURA

### 2.1 GENERALITÀ

Ciascuna fornitura dei dati in via telematica si compone di una sequenza di record aventi la lunghezza fissa di 1.900 caratteri.

Ciascun record presente nella fornitura è contraddistinto da uno specifico "tipo-record" che ne individua il contenuto e che ne determina l'ordinamento all'interno della fornitura stessa.

I record previsti per la fornitura in via telematica delle dichiarazioni IMU-IMPi Enti commerciali e persone fisiche sono:

- **record di tipo "A"**: contenente informazioni di riepilogo del file da trasmettere, quali l'annualità in cui viene presentata la dichiarazione e alcuni dati che riguardano il soggetto che invia la dichiarazione (un CAF, l'Ente Commerciale o la persona fisica stessa, ecc.);

- **record di tipo "B"**: è il record che contiene i dati del frontespizio del modello, quali ad esempio, il contribuente, l'anno, il Comune cui si riferisce la dichiarazione;

- **record di tipo "C"**: contenente le eventuali ulteriori informazioni, che nel modello di dichiarazione sono contenute nel Frontespizio, relative ai contitolari; ogni record può contenere le informazioni relative fino a un massimo di 4 contitolari; per un numero di contitolari superiore a tale valore, occorre ricorrere a uno o più record della stessa tipologia;

- **record di tipo "D"**: contenente le informazioni relativi agli immobili censiti; ogni record può contenere le informazioni relative fino a un massimo di 2 immobili; per un numero di immobili superiore a tale valore, occorre ricorrere a uno o più record della stessa tipologia;

- **record di tipo "E"**: contenente le informazioni relative alle piattaforme marine e ai rigassificatori (D. L. n. 124 del 2019); ogni record può contenere le informazioni relative fino a un massimo di 5 piattaforme marine e rigassificatori; per un numero di immobili superiore a tale valore, occorre ricorrere a uno o più record della stessa tipologia;

- **record di tipo "Z"**: è il record di coda della fornitura e contiene alcuni dati riepilogativi della fornitura stessa.

### 2.2 LA SEQUENZA DEI RECORD

La sequenza dei record all'interno della fornitura deve rispettare le seguenti regole:

- presenza di un solo record di tipo "A", posizionato come primo record della fornitura;

- per ogni dichiarazione modello IMU-IMPi Enti commerciali e Persone Fisiche, presenza, nell'ordine, di un unico record di tipo "B", di tanti record di tipo "C", "D" ed "E" quanti sono necessari a contenere tutti i dati presenti nella dichiarazione;

- presenza di un solo record di tipo "Z", posizionato come ultimo record della fornitura.

Ai fini del calcolo del numero di record di tipo C, D necessari per il completamento della dichiarazione, si fa presente che tali record sono strutturati per contenere al loro interno i dati relativi a 4 contitolari, 2 immobili. I record di tipo E sono strutturati per contenere al loro interno i dati relativi a 5 piattaforme marine e rigassificatori.

Qualora la dimensione complessiva della dichiarazione da trasmettere ecceda il limite previsto (3 MB compressi), si dovrà procedere alla predisposizione di più forniture.

Nel caso in cui la singola dichiarazione ecceda il limite previsto, è necessario adottare le seguenti modalità operative:

- la dichiarazione deve essere frazionata in più invii esclusivamente ad essa riservati. Al fine di minimizzare il numero di invii necessari a trasmettere l'intera dichiarazione, si deve dimensionare ciascun invio approssimandosi il più possibile al limite dimensionale massimo descritto. Inoltre, tale operazione di frazionamento deve essere effettuata avendo cura di far iniziare ciascun invio con il **progressivo modulo immediatamente successivo al progressivo presente nell'invio precedente**;

- ciascun invio deve contenere i record "A", "B", "C", "D", "E" e "Z";

- ciascun invio deve essere identificato da un "progressivo invio / totale invii di cui si compone la dichiarazione", mediante l'impostazione dei campi 8 e 9 del record "A"; tale progressivo deve essere **univoco e crescente** (con incrementi di una unità) nell'ambito della fornitura relativa alla intera dichiarazione;

- i record di tipo "B" presenti in ogni invio devono avere il medesimo contenuto;

- i dati riepilogativi riportati sul record "Z" devono essere riferiti al singolo invio e non all'intera dichiarazione.

Si fa presente che le dichiarazioni correttamente acquisite ed archiviate a sistema e disponibili agli Enti presentano i record "A" e "Z" rinominati rispettivamente in "0" e "9".

La dichiarazione ha carattere annuale. Una singola dichiarazione (anche se trasmessa attraverso più forniture) deve riferirsi alle proprietà immobiliari (o alle porzioni di esse) che insistono sul territorio di un singolo comune. Si dovranno pertanto trasmettere un numero di dichiarazioni pari al numero dei comuni nei confronti dei quali sussiste per quell'anno l'obbligo di dichiarazione.

Nel caso in cui si debba ritrasmettere, per un determinato comune e per un'annualità data, una dichiarazione già inviata, causa integrazione o rettifica dei dati precedentemente trasmessi, occorre ritrasmettere la dichiarazione integralmente.

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

### 2.3 LA STRUTTURA DEI RECORD

I record contengono unicamente campi posizionali, ovvero campi la cui posizione all'interno del record è fissa. La posizione, la lunghezza ed il formato di tali campi sono esposti in dettaglio nelle specifiche di seguito riportate.

In coda ai record di ciascun tipo sono riportati 3 caratteri di controllo, così come descritto in dettaglio nelle specifiche che seguono.

### 2.4 LA STRUTTURA DEI DATI

I campi dei record possono assumere struttura numerica o alfanumerica e per ciascuno di essi è indicato, nelle specifiche che seguono, il simbolo NU o AN rispettivamente. Nel caso di campi destinati a contenere alcuni dati particolari (ad esempio date, ecc.), nella colonna "Formato" è indicato il particolare formato da utilizzare.

L'allineamento e la formattazione dei campi posizionali sono descritti nella tabella che segue.

| Sigla formato | Descrizione | Formattazione | Allineamento | Esempio di allineamento |
|---------------|-------------|---------------|--------------|-------------------------|
| AN | Campo alfanumerico | Spazio | Sinistra | 'STRINGA　　' |
| CF | Codice fiscale (16 caratteri) / Codice fiscale numerico (11 caratteri) | ========== / Spazio | ========== / Sinistra con 5 spazi a destra | 'RSSGNN60R30H501U' / '02876990587　　　　' |
| CN | Codice fiscale numerico (11 caratteri) | Zero | | '02876990587' |
| DT | Data nel formato GGMMAAAA | Zero | | '05051998' |
| NU | Campo numerico | Zero | Destra con zeri non significativi a sinistra | '001234' |
| PN | Sigla delle province italiane, sigla delle ex province italiane di Fiume (FU), Pola (PL), Zara (ZA) e sigla "EE" per i paesi esteri (ad esempio provincia di nascita). | Spazio | | 'BO' |
| PR | Sigla delle province italiane e sigla "EE" per i paesi esteri (ad esempio provincia del domicilio fiscale). | Spazio | | 'BO' |
| CB | Casella barrata. Se la casella è barrata vale 1 altrimenti vale 0. | Zero | | '1' |

> **ATTENZIONE:** costituisce motivo di scarto della dichiarazione un allineamento dei campi ovvero una formattazione difforme da quello previsto nella precedente tabella.

### 2.5 REGOLE GENERALI

#### 2.5.1 CODICE FISCALE DEL CONTRIBUENTE

Il codice fiscale del contribuente, presente sulla prima facciata del frontespizio della dichiarazione IMU-IMPi Enti commerciali e Persone Fisiche, è l'identificativo del soggetto per cui la dichiarazione è presentata e va riportato in duplica su ogni record che costituisce la dichiarazione stessa nel campo "Codice fiscale del soggetto dichiarante".

I Codici Fiscali e le Partite IVA riportati nelle dichiarazioni modello IMU - Enti non commerciali devono essere formalmente corretti.

Si precisa che, in sede di accoglimento delle dichiarazioni trasmesse in via telematica, costituirà oggetto di scarto della dichiarazione stessa l'indicazione di un codice fiscale o di una partita IVA del contribuente che, anche se formalmente corretto, non risulti registrato presso l'Anagrafe Tributaria (campo 2 del record "B").

#### 2.5.2 CODICE CARICA DEL DICHIARANTE

Il campo "Codice carica del dichiarante" del Record B dovrà essere valorizzato indicando uno dei valori presenti nella seguente tabella.

| Codice carica | Descrizione |
|---------------|-------------|
| 1 | Rappresentante legale, negoziale o di fatto, socio amministratore |
| 2 | Rappresentante di minore, inabilitato o interdetto, amministratore di sostegno, ovvero curatore dell'eredità giacente, amministratore di eredità devoluta sotto condizione sospensiva o in favore di nascituro non ancora concepito |
| 3 | Curatore fallimentare |
| 4 | Commissario liquidatore (liquidazione coatta amministrativa ovvero amministrazione straordinaria) |
| 5 | Custode giudiziario (custodia giudiziaria), ovvero amministratore giudiziario in qualità di rappresentante dei beni sequestrati ovvero commissario giudiziale (amministrazione controllata) |
| 6 | Rappresentante fiscale di soggetto non residente |
| 7 | Erede |
| 8 | Liquidatore (liquidazione volontaria) |
| 9 | Soggetto tenuto a presentare la dichiarazione per conto del soggetto estinto a seguito di operazioni straordinarie o altre trasformazioni sostanziali soggettive (cessionario d'azienda, società beneficiaria, incorporante, conferitaria, ecc.); ovvero, rappresentante della società beneficiaria (scissione) o della società risultante dalla fusione o incorporazione |
| 10 | Soggetto esercente l'attività tutoria del minore o interdetto in relazione alla funzione istituzionale rivestita |
| 11 | Liquidatore (liquidazione volontaria di ditta individuale - periodo ante messa in liquidazione) |
| 12 | Amministratore di condominio |

#### 2.5.3 INFORMAZIONI DI UN IMMOBILE

Il campo "Progressivo immobile" identifica in maniera univoca ogni immobile oggetto di dichiarazione e va sempre impostato partendo da 1. In particolare, i campi interessati sono:

**Record D:**
- campo 7 – 39: Progressivo immobile", identificativo univoco dell'immobile.

Nel caso in cui per uno stesso immobile si siano verificate più variazioni nel corso dello stesso periodo d'imposta, va opportunamente impostato il campo "Indicatore di continuità". In particolare:

**Record D:**
- campo 8 - 40 "Indicatore di continuità", se presente, indica che l'immobile fa riferimento ad un'anagrafica precedentemente definita contraddistinta da uno specifico Progressivo immobile. Vale 0 o 1 e non può essere indicato per il primo immobile del primo record C o per immobili che presentano un progressivo maggiore al numero d'ordine.

#### 2.5.4 ALTRI DATI

Gli importi contenuti nelle dichiarazioni devono essere riportati, così come previsto sul modello di dichiarazione, in unità di euro, arrotondando l'importo per eccesso se la frazione decimale è uguale o superiore a cinquanta centesimi di euro, per difetto se inferiore a detto limite.

Tutti i caratteri alfabetici devono essere impostati in maiuscolo.

I valori percentuali contenuti nelle dichiarazioni devono essere riportati indicando separatamente la parte intera dalla parte decimale a meno della virgola (ad es. la percentuale o il rapporto percentuale pari a 35,51% deve essere inserito su due distinti campi, 35 nella parte intera e 51 nella parte decimale, entrambi i valori devono essere preceduti e seguiti da tanti zeri non significativi quanti necessari a completare la lunghezza del campo).

### 2.6 CONTROLLO SUI DATI PRESENTI NELLA DICHIARAZIONE

La dichiarazione viene scartata in presenza di dati che non risultano conformi alle indicazioni inserite nei tracciati di seguito riportati. **Si consiglia, comunque, per approfondimenti, maggiori chiarimenti e quesiti a carattere normativo di fare riferimento alle Istruzioni per la compilazione della dichiarazione allegate al modello cartaceo.**

All'interno dei diagnostici mostrati all'utente al termine della fase di controllo della dichiarazione, su Desktop Telematico, verranno evidenziati dei messaggi non bloccanti nel caso in cui si riscontrino delle anomalie e/o incongruenze sui seguenti punti:

- Superamento per il campo "valore immobile" di importi ritenuti oggettivamente esorbitanti. In questo caso verrà mostrato, al termine del controllo, un diagnostico di avvertimento, non bloccante, in modo da informare l'utente sull'eventuale anomalia.

Se la dichiarazione non presenta errori bloccanti, verrà prodotto il cosiddetto "file controllato" e l'utente comunque potrà procedere, se lo ritiene opportuno, con la firma e l'invio tramite Desktop Telematico.

Si precisa che, in sede di accoglimento delle dichiarazioni trasmesse in via telematica, costituirà oggetto di scarto della dichiarazione stessa l'indicazione di un codice Stato estero non presente nell'archivio "Comuni e Stati esteri" dell'Agenzia delle Entrate (si veda, a tal proposito, quanto riportato nella descrizione di dettaglio dei Quadri di cui si compone la dichiarazione).

---

#### 2.6.1 ISTRUZIONI RELATIVE AL RECORD DI TESTA – RECORD TIPO A

**RECORD DI TIPO "A": RECORD DI TESTA**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Impostare ad 'A' |
| 2 | Filler | 2 | 14 | AN | |
| 3 | Codice fornitura | 16 | 5 | AN | Impostare a "TAT00" |
| 4 | Tipo fornitore | 21 | 2 | AN | Assume i valori: **01** - Soggetti che inviano le proprie dichiarazioni. **10** - C.A.F. dipendenti e pensionati; C.A.F. imprese; Società ed enti di cui all'art.3, comma 2 del DPR 322/98 (se tale società appartiene a un gruppo può trasmettere la propria dichiarazione e quelle delle aziende del gruppo); Altri intermediari di cui all'art.3. comma 3 lett a), b), c) ed e) del DPR 322/98; Società degli Ordini di cui all'art. 3 Decr. Dir. 18/2/99; Soggetto che trasmette le dichiarazioni per le quali l'impegno a trasmettere è stato assunto da un professionista deceduto. |
| 5 | Codice fiscale fornitore | 23 | 16 | CF | Il campo è obbligatorio. Se la sezione Intermediario (campi da 46 a 50 del record B) è presente, il campo deve essere uguale al codice fiscale dell'intermediario (campo 46 del record B). In caso di assenza della sezione Intermediario: se la sezione dichiarante (campi da 30 a 45 del record B) è presente, il campo deve essere uguale al codice fiscale del dichiarante (campo 30 del record B); se la sezione dichiarante (campi da 30 a 45 del record B) è assente, il campo deve essere uguale al codice fiscale del contribuente (campo 2 del record B). |
| 6 | Tipologia dichiarazione | 39 | 1 | AN | Valori ammessi: **N** – Nuova; **S** – Sostitutiva; **M** – Multipla. |
| 7 | Filler | 40 | 482 | AN | *Spazio non utilizzato* |
| 8 | Progressivo dell'invio telematico | 522 | 4 | NU | Tale progressivo deve essere univoco e crescente (con incrementi di una unità) nell'ambito della fornitura relativa alla intera dichiarazione. Deve essere minore o uguale al campo 9. |
| 9 | Numero totale degli invii telematici | 526 | 4 | NU | Deve essere maggiore o uguale a 1. |
| 10 | Filler | 530 | 1168 | AN | *Spazio non disponibile* |
| 11 | Spazio riservato al Servizio Telematico | 1698 | 200 | AN | |
| 12 | Filler | 1898 | 1 | AN | Impostare al valore "A". |
| 13 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' ed 'LF'). |

---

#### 2.6.2 ISTRUZIONI RELATIVE AL QUADRO "FRONTESPIZIO" – RECORD TIPO B

**RECORD DI TIPO "B": Frontespizio**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Vale "B". |
| 2 | Codice fiscale o partita IVA del soggetto dichiarante | 2 | 16 | CF | Dato obbligatorio. Il codice fiscale o la partita IVA deve essere formalmente corretto e registrato in Anagrafe tributaria. La non registrazione comporta lo scarto della dichiarazione in fase di accettazione. |
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
| 10 | Codice fiscale o partita IVA | 152 | 16 | AN | Dato obbligatorio. Deve essere uguale al campo 2. |
| 11 | Telefono - Prefisso | 168 | 4 | AN | Il dato deve essere numerico. |
| 12 | Telefono - Numero | 172 | 8 | AN | Il dato deve essere numerico. |
| 13 | Indirizzo di posta elettronica del contribuente | 180 | 50 | AN | |
| 14 | Cognome del contribuente o Ragione sociale | 230 | 24 | AN | Il dato è obbligatorio. |
| 15 | Nome del contribuente | 254 | 20 | AN | |
| 16 | Data di nascita del contribuente | 274 | 8 | DT | |
| 17 | Sesso del contribuente | 282 | 1 | AN | Può valere 'M' o 'F'. |
| 18 | Comune o stato estero di nascita del contribuente | 283 | 40 | AN | |
| 19 | Sigla della provincia di nascita del contribuente -"EE" per stato estero | 323 | 2 | PN | Le persone non nate in Italia devono utilizzare la sigla "EE". |
| 20 | Filler | 325 | 3 | AN | |
| 21 | Indirizzo del domicilio fiscale - sede legale | 328 | 35 | AN | Dato obbligatorio. |
| 22 | Numero civico del domicilio fiscale – sede legale | 363 | 5 | AN | Dato obbligatorio. In assenza vale "SNC". |
| 23 | Scala del domicilio fiscale- sede legale | 368 | 5 | AN | |
| 24 | Piano del domicilio fiscale- sede legale | 373 | 5 | AN | |
| 25 | Interno del domicilio fiscale - sede legale | 378 | 5 | AN | |
| 26 | C.A.P. del domicilio fiscale- sede legale | 383 | 5 | AN | |
| 27 | Comune o stato estero del domicilio fiscale - sede legale | 388 | 100 | AN | Dato obbligatorio. |
| 28 | Provincia (sigla) del domicilio fiscale - sede legale - "EE" per stato estero | 488 | 2 | PR | Dato obbligatorio. Le persone non residenti in Italia devono utilizzare la sigla "EE". |
| 29 | Codice Stato estero del domicilio fiscale - sede legale | 490 | 3 | NU | Lo Stato estero deve essere uno di quelli presenti nell'archivio "Comuni e Stati esteri", consultabile sul sito dell'Agenzia delle Entrate (Stati soppressi e non soppressi): devono essere riportati i tre caratteri numerici che seguono la lettera "Z". Dato obbligatorio nel caso in cui nel precedente campo si è indicata la sigla "EE". |

**Dati relativi al dichiarante (compilare se diverso dal contribuente)**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 30 | Codice fiscale del dichiarante | 493 | 16 | CF | Il dato è obbligatorio. |
| 31 | Codice carica del dichiarante | 509 | 2 | AN | Il dato è obbligatorio. Nel caso in cui il dichiarante sia diverso dal contribuente indicare uno dei codici indicati nel paragrafo 2.5.2 |
| 32 | Cognome del dichiarante o Ragione sociale | 511 | 24 | AN | Il dato è obbligatorio. |
| 33 | Nome del dichiarante | 535 | 20 | AN | |
| 34 | Telefono del dichiarante: prefisso | 555 | 4 | AN | Il dato deve essere numerico. |
| 35 | Telefono del dichiarante: numero | 559 | 8 | AN | Il dato deve essere numerico. |
| 36 | Indirizzo di posta elettronica del dichiarante | 567 | 50 | AN | |
| 37 | Indirizzo del domicilio fiscale | 617 | 35 | AN | Dato obbligatorio. |
| 38 | Numero civico del domicilio fiscale | 652 | 5 | AN | Dato obbligatorio. In assenza vale "SNC". |
| 39 | Scala del domicilio fiscale | 657 | 5 | AN | |
| 40 | Piano del domicilio fiscale | 662 | 5 | AN | |
| 41 | Interno del domicilio fiscale | 667 | 5 | AN | |
| 42 | C.A.P. del domicilio fiscale | 672 | 5 | AN | |
| 43 | Comune o Stato estero del domicilio fiscale | 677 | 100 | AN | Dato obbligatorio. |
| 44 | Provincia (sigla) del domicilio fiscale - "EE" per stato estero | 777 | 2 | PR | Dato obbligatorio. Le persone non residenti in Italia devono utilizzare la sigla "EE". |
| 45 | Codice Stato estero del domicilio fiscale | 779 | 3 | NU | Lo Stato estero deve essere uno di quelli presenti nell'archivio "Comuni e Stati esteri", consultabile sul sito dell'Agenzia delle Entrate (Stati soppressi e non soppressi): devono essere riportati i tre caratteri numerici che seguono la lettera "Z". Dato obbligatorio nel caso in cui nel precedente campo si è indicata la sigla "EE". |
| 46 | Codice fiscale dell'intermediario | 782 | 16 | CF | Dato obbligatorio se il campo 4 del record A è uguale a 10. Dato obbligatorio se il campo 5 del record A è diverso dal campo 2 e dal campo 30 del record B. |
| 47 | Numero di iscrizione all'albo dei C.A.F. | 798 | 5 | NU | |
| 48 | Impegno a trasmettere in via telematica la dichiarazione | 803 | 1 | NU | Vale 1. |
| 49 | Data dell'impegno | 804 | 8 | DT | Dato obbligatorio se compilato un altro Dato nella sezione. |
| 50 | Firma dell'intermediario | 812 | 1 | CB | Dato obbligatorio se compilato un altro Dato nella sezione. |

**Spazio non disponibile**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 51 | Filler | 813 | 42 | AN | |
| 52 | Filler | 855 | 1043 | AN | |

**Ultimi tre caratteri di controllo**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 53 | Filler | 1898 | 1 | AN | Impostare al valore "A" |
| 54 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' ed 'LF') |

---

#### 2.6.3 ULTERIORI INFORMAZIONI PRESENTI NEL "FRONTESPIZIO" – RECORD TIPO C

**RECORD DI TIPO "C": Frontespizio - Ulteriori informazioni**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Vale "C". |
| 2 | Codice fiscale o partita IVA del soggetto dichiarante | 2 | 16 | CF | Dato obbligatorio. Il codice fiscale o la partita IVA deve essere formalmente corretto e registrato in Anagrafe tributaria. La non registrazione comporta lo scarto della dichiarazione in fase di accettazione. |
| 3 | Progressivo modulo | 18 | 8 | NU | Impostare ad 1 per il primo modulo di ogni quadro compilato, incrementando tale valore di una unità per ogni ulteriore modulo. |
| 4 | Filler | 26 | 48 | AN | |
| 5 | Identificativo del produttore del software (codice fiscale) | 74 | 16 | AN | |

**Dati della Dichiarazione - Contitolari (compilare solo in caso di dichiarazione congiunta)**

**Contitolare 1:**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 6 | Numero d'ordine | 90 | 4 | NU | Indicare il numero d'ordine utilizzato per il quadro descrittivo dell'immobile cui si riferisce la contitolarità. |
| 7 | Cognome e Nome del Contitolare - Denominazione o Ragione sociale | 94 | 50 | AN | Dato obbligatorio. |
| 8 | Comune o stato estero di nascita del Contitolare | 144 | 40 | AN | |
| 9 | Sigla della provincia di nascita del Contitolare - "EE" per stato estero | 184 | 2 | PN | Le persone non nate in Italia devono utilizzare la sigla "EE". |
| 10 | Filler | 186 | 3 | AN | |
| 11 | Codice fiscale del Contitolare | 189 | 16 | CF | Il dato è obbligatorio. |
| 12 | Data di nascita del Contitolare | 205 | 8 | DT | |
| 13 | Sesso del Contitolare | 213 | 1 | AN | Può valere 'M' o 'F'. |
| 14 | Indirizzo del domicilio fiscale | 214 | 35 | AN | Dato obbligatorio. |
| 15 | Numero civico del domicilio fiscale | 249 | 5 | AN | Dato obbligatorio. In assenza vale "SNC". |
| 16 | Scala del domicilio fiscale | 254 | 5 | AN | |
| 17 | Piano del domicilio fiscale | 259 | 5 | AN | |
| 18 | Interno del domicilio fiscale | 264 | 5 | AN | |
| 19 | C.A.P. del domicilio fiscale | 269 | 5 | AN | |
| 20 | Comune o Stato estero del domicilio fiscale | 274 | 100 | AN | Dato obbligatorio. |
| 21 | Provincia (sigla) del domicilio fiscale - "EE" per stato estero | 374 | 2 | PR | Dato obbligatorio. Le persone non residenti in Italia devono utilizzare la sigla "EE". |
| 22 | Codice Stato estero del domicilio fiscale | 376 | 3 | NU | Lo Stato estero deve essere uno di quelli presenti nell'archivio "Comuni e Stati esteri", consultabile sul sito dell'Agenzia delle Entrate (Stati soppressi e non soppressi): devono essere riportati i tre caratteri numerici che seguono la lettera "Z". Dato obbligatorio nel caso in cui nel precedente campo si è indicata la sigla "EE". |
| 23 | Percentuale di possesso - parte intera | 379 | 3 | NU | Il dato è obbligatorio. |
| 24 | Percentuale di possesso - parte decimale | 382 | 2 | NU | Il dato è obbligatorio. |
| 25 | Detrazione per abitazione principale | 384 | 9 | NU | |
| 26 | Firma del Contitolare | 393 | 1 | CB | Dato obbligatorio. |

**Contitolare 2:**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 27 | Numero d'ordine | 394 | 4 | NU | Indicare il numero d'ordine utilizzato per il quadro descrittivo dell'immobile cui si riferisce la contitolarità. |
| 28 | Cognome e Nome del Contitolare - Denominazione o Ragione sociale | 398 | 50 | AN | Dato obbligatorio. |
| 29 | Comune o stato estero di nascita del Contitolare | 448 | 40 | AN | |
| 30 | Sigla della provincia di nascita del Contitolare - "EE" per stato estero | 488 | 2 | PN | Le persone non nate in Italia devono utilizzare la sigla "EE". |
| 31 | Filler | 490 | 3 | AN | |
| 32 | Codice fiscale del Contitolare | 493 | 16 | CF | Il dato è obbligatorio. |
| 33 | Data di nascita del Contitolare | 509 | 8 | DT | |
| 34 | Sesso del Contitolare | 517 | 1 | AN | Può valere 'M' o 'F'. |
| 35 | Indirizzo del domicilio fiscale | 518 | 35 | AN | Dato obbligatorio. |
| 36 | Numero civico del domicilio fiscale | 553 | 5 | AN | Dato obbligatorio. In assenza vale "SNC". |
| 37 | Scala del domicilio fiscale | 558 | 5 | AN | |
| 38 | Piano del domicilio fiscale | 563 | 5 | AN | |
| 39 | Interno del domicilio fiscale | 568 | 5 | AN | |
| 40 | C.A.P. del domicilio fiscale | 573 | 5 | AN | |
| 41 | Comune o Stato estero del domicilio fiscale | 578 | 100 | AN | Dato obbligatorio. |
| 42 | Provincia (sigla) del domicilio fiscale - "EE" per stato estero | 678 | 2 | PR | Dato obbligatorio. Le persone non residenti in Italia devono utilizzare la sigla "EE". |
| 43 | Codice Stato estero del domicilio fiscale | 680 | 3 | NU | Lo Stato estero deve essere uno di quelli presenti nell'archivio "Comuni e Stati esteri", consultabile sul sito dell'Agenzia delle Entrate (Stati soppressi e non soppressi): devono essere riportati i tre caratteri numerici che seguono la lettera "Z". Dato obbligatorio nel caso in cui nel precedente campo si è indicata la sigla "EE". |
| 44 | Percentuale di possesso - parte intera | 683 | 3 | NU | Il dato è obbligatorio. |
| 45 | Percentuale di possesso - parte decimale | 686 | 2 | NU | Il dato è obbligatorio. |
| 46 | Detrazione per abitazione principale | 688 | 9 | NU | |
| 47 | Firma del Contitolare | 697 | 1 | CB | Dato obbligatorio. |

**Contitolare 3:**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 48 | Numero d'ordine | 698 | 4 | NU | Indicare il numero d'ordine utilizzato per il quadro descrittivo dell'immobile cui si riferisce la contitolarità. |
| 49 | Cognome e Nome del Contitolare - Denominazione o Ragione sociale | 702 | 50 | AN | Dato obbligatorio. |
| 50 | Comune o stato estero di nascita del Contitolare | 752 | 40 | AN | |
| 51 | Sigla della provincia di nascita del Contitolare - "EE" per stato estero | 792 | 2 | PN | Le persone non nate in Italia devono utilizzare la sigla "EE". |
| 52 | Filler | 794 | 3 | AN | |
| 53 | Codice fiscale del Contitolare | 797 | 16 | CF | Il dato è obbligatorio. |
| 54 | Data di nascita del Contitolare | 813 | 8 | DT | |
| 55 | Sesso del Contitolare | 821 | 1 | AN | Può valere 'M' o 'F'. |
| 56 | Indirizzo del domicilio fiscale | 822 | 35 | AN | Dato obbligatorio. |
| 57 | Numero civico del domicilio fiscale | 857 | 5 | AN | Dato obbligatorio. In assenza vale "SNC". |
| 58 | Scala del domicilio fiscale | 862 | 5 | AN | |
| 59 | Piano del domicilio fiscale | 867 | 5 | AN | |
| 60 | Interno del domicilio fiscale | 872 | 5 | AN | |
| 61 | C.A.P. del domicilio fiscale | 877 | 5 | AN | |
| 62 | Comune o Stato estero del domicilio fiscale | 882 | 100 | AN | Dato obbligatorio. |
| 63 | Provincia (sigla) del domicilio fiscale - "EE" per stato estero | 982 | 2 | PR | Dato obbligatorio. Le persone non residenti in Italia devono utilizzare la sigla "EE". |
| 64 | Codice Stato estero del domicilio fiscale | 984 | 3 | NU | Lo Stato estero deve essere uno di quelli presenti nell'archivio "Comuni e Stati esteri", consultabile sul sito dell'Agenzia delle Entrate (Stati soppressi e non soppressi): devono essere riportati i tre caratteri numerici che seguono la lettera "Z". Dato obbligatorio nel caso in cui nel precedente campo si è indicata la sigla "EE". |
| 65 | Percentuale di possesso, parte intera | 987 | 3 | NU | Il dato è obbligatorio. |
| 66 | Percentuale di possesso, parte decimale | 990 | 2 | NU | Il dato è obbligatorio. |
| 67 | Detrazione per abitazione principale | 992 | 9 | NU | |
| 68 | Firma del Contitolare | 1001 | 1 | CB | Dato obbligatorio. |

**Contitolare 4:**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 69 | Numero d'ordine | 1002 | 4 | NU | Indicare il numero d'ordine utilizzato per il quadro descrittivo dell'immobile cui si riferisce la contitolarità. |
| 70 | Cognome e Nome del Contitolare - Denominazione o Ragione sociale | 1006 | 50 | AN | Dato obbligatorio. |
| 71 | Comune o stato estero di nascita del Contitolare | 1056 | 40 | AN | |
| 72 | Sigla della provincia di nascita del Contitolare - "EE" per stato estero | 1096 | 2 | PN | Le persone non nate in Italia devono utilizzare la sigla "EE". |
| 73 | Filler | 1098 | 3 | AN | |
| 74 | Codice fiscale del Contitolare | 1101 | 16 | CF | Il dato è obbligatorio. |
| 75 | Data di nascita del Contitolare | 1117 | 8 | DT | |
| 76 | Sesso del Contitolare | 1125 | 1 | AN | Può valere 'M' o 'F'. |
| 77 | Indirizzo del domicilio fiscale | 1126 | 35 | AN | Dato obbligatorio. |
| 78 | Numero civico del domicilio fiscale | 1161 | 5 | AN | Dato obbligatorio. In assenza vale "SNC". |
| 79 | Scala del domicilio fiscale | 1166 | 5 | AN | |
| 80 | Piano del domicilio fiscale | 1171 | 5 | AN | |
| 81 | Interno del domicilio fiscale | 1176 | 5 | AN | |
| 82 | C.A.P. del domicilio fiscale | 1181 | 5 | AN | |
| 83 | Comune o Stato estero del domicilio fiscale | 1186 | 100 | AN | Dato obbligatorio. |
| 84 | Provincia (sigla) del domicilio fiscale - "EE" per stato estero | 1286 | 2 | PR | Dato obbligatorio. Le persone non residenti in Italia devono utilizzare la sigla "EE". |
| 85 | Codice Stato estero del domicilio fiscale | 1288 | 3 | NU | Lo Stato estero deve essere uno di quelli presenti nell'archivio "Comuni e Stati esteri", consultabile sul sito dell'Agenzia delle Entrate (Stati soppressi e non soppressi): devono essere riportati i tre caratteri numerici che seguono la lettera "Z". Dato obbligatorio nel caso in cui nel precedente campo si è indicata la sigla "EE". |
| 86 | Percentuale di possesso, parte intera | 1291 | 3 | NU | Il dato è obbligatorio. |
| 87 | Percentuale di possesso, parte decimale | 1294 | 2 | NU | Il dato è obbligatorio. |
| 88 | Detrazione per abitazione principale | 1296 | 9 | NU | |
| 89 | Firma del Contitolare | 1305 | 1 | CB | Dato obbligatorio. |

**Spazio non disponibile**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 90 | Filler | 1306 | 538 | AN | |
| 91 | Filler | 1844 | 20 | AN | |
| 92 | Filler | 1864 | 34 | AN | |

**Ultimi tre caratteri di controllo del record**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 93 | Filler | 1898 | 1 | AN | Impostare al valore "A". |
| 94 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' ed 'LF'). |

---

#### 2.6.4 IMU – IMMOBILI - RECORD TIPO D

**RECORD DI TIPO "D": IMU – Immobili**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Vale "D". |
| 2 | Codice fiscale o partita IVA del soggetto dichiarante | 2 | 16 | CF | Dato obbligatorio. Il codice fiscale o la partita IVA deve essere formalmente corretto e registrato in Anagrafe tributaria. La non registrazione comporta lo scarto della dichiarazione in fase di accettazione. |
| 3 | Progressivo modulo | 18 | 8 | NU | Impostare ad 1 per il primo modulo di ogni quadro compilato, incrementando tale valore di una unità per ogni ulteriore modulo. |
| 4 | Filler | 26 | 48 | AN | |
| 5 | Identificativo del produttore del software (codice fiscale) | 74 | 16 | AN | |

**Immobili (1)**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 6 | Numero d'ordine | 90 | 4 | NU | Il dato è obbligatorio. Numero d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Parte da 1 nel caso in cui la dichiarazione sia riferita ad immobili soggetti ad IMU, altrimenti vale 0. |
| 7 | Progressivo immobile | 94 | 4 | NU | Il dato è obbligatorio. Progressivo d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Parte da 1 nel caso in cui la dichiarazione sia riferita ad immobili soggetti ad IMU, altrimenti vale 0. |
| 8 | Indicatore di continuità | 98 | 1 | NU | Se presente indica che l'immobile/terreno fa riferimento ad un'anagrafica precedentemente definita. Vale 0 o 1 e non può essere indicato per il primo immobile/terreno in assoluto o per immobili/terreni che presentano un progressivo maggiore o uguale al numero d'ordine. |
| 9 | Caratteristiche | 99 | 3 | AN | Il dato è obbligatorio. Indicare: **1** Per terreno; **2** Per area fabbricabile; **3** Per fabbricato il cui valore è determinato sulla base della rendita catastale; **4** Per fabbricato con valore determinato sulla base delle scritture contabili; **5** Per abitazione principale; **6** Per pertinenza; **7** Per beni merce. |
| 10 | Indirizzo | 102 | 100 | AN | Il dato è obbligatorio. Indicare l'esatta ubicazione dell'immobile descritto e cioè la località, la via o la piazza, il numero civico, la scala, il piano e l'interno. |
| 11 | T/U | 202 | 1 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare T se l'immobile è censito nel catasto terreni, U se nel catasto urbano. |
| 12 | Codice Catastale Immobile/Terreno | 203 | 5 | AN | Riportare, se presente, il corrispondente (per Quadro e numero d'ordine) codice catastale indicato nel campo Annotazioni del Record D. |
| 13 | Sezione | 208 | 3 | AN | Va indicata la sezione ove esistente. |
| 14 | Foglio | 211 | 4 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". |
| 15 | Particella | 215 | 10 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". |
| 16 | Subalterno | 225 | 4 | AN | Va indicato il subalterno ove esistente. |
| 17 | Categoria/Qualità | 229 | 25 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Va indicata la categoria per i fabbricati e la qualità per i terreni (es. seminativo, vigneto, ecc.). |
| 18 | Classe | 254 | 10 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare la classe dei fabbricati o la classe di redditività delle singole particelle di terreno. |
| 19 | N. Protocollo | 264 | 20 | AN | Il dato è obbligatorio se è presente il campo successivo. Da utilizzare in mancanza dei dati catastali. |
| 20 | Anno | 284 | 4 | NU | Il dato è obbligatorio se è presente il campo precedente. Da utilizzare in mancanza dei dati catastali. |
| 21 | Valore | 288 | 15 | NU | Il dato è obbligatorio. |
| 22 | Percentuale di possesso, parte intera | 303 | 3 | NU | Il dato è obbligatorio. |
| 23 | Percentuale di possesso, parte decimale | 306 | 2 | NU | Il dato è obbligatorio. |
| 24 | Detrazione per l'abitazione principale | 308 | 9 | NU | |
| 25 | Equiparazione a abitazione principale | 317 | 1 | AN | Indicare: **1** – Alloggio sociale; **2** – Alloggio di servizio; |
| 26 | Riduzioni | 318 | 1 | AN | Indicare: **0** - Nessuna riduzione; **1** - Per immobile storico o artistico; **2** - Immobile inagibile/inabitabile; **3** - Immobile in comodato; **4** - Immobile posseduto da soggetto non residente nel territorio dello Stato, titolare di pensione maturata in regime di convenzione internazionale con l'Italia; **5** - Altre riduzioni. |
| 27 | Esenzione | 319 | 1 | NU | Il dato è obbligatorio. Indicare: **0** – Nessuna esenzione; **1** – Esenzione per immobili non utilizzabili né disponibili; **2** – Esenzione quadro temporaneo Aiuti di Stato; **3** – Altre esenzioni. |
| 28 | Acquisto | 320 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 29 | Cessione | 321 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 30 | Altro | 322 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 31 | Altro Descrizione | 323 | 100 | AN | Descrizione a testo libero. Il dato è obbligatorio se la casella precedente vale 1. |
| 32 | Inizio/Termine del possesso o variazione d'imposta | 423 | 8 | DT | Dato obbligatorio se è stato compilato un campo tra i campi Acquisto, Cessione, Altro e Inizio/Termine dell'agevolazione |
| 33 | Dati immobile – Inizio/Termine dell'agevolazione | 431 | 1 | AN | Indicare: **I** – Inizio; **T** – Termine; |
| 34 | Agenzia delle Entrate di | 432 | 24 | AN | Da compilare, in alternativa al campo successivo, se è presente il campo "Acquisto" o "Cessione". |
| 35 | Estremi del titolo | 456 | 24 | AN | Da compilare, in alternativa al campo precedente, se è presente il campo "Acquisto" o "Cessione". |
| 36 | Dati immobile - Non utilizzabili / Non disponibili - Tipo | 480 | 1 | AN | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. Indicare: **1** - Per art. 614, secondo comma, c.p. Violazione di domicilio o art.633, c.p. Invasione di terreni o edifici; **2** - Per occupazione abusiva per la quale sia stata presentata denuncia o iniziata azione giudiziaria penale. |
| 37 | Dati immobile - Non utilizzabili / Non disponibili - Autorità | 481 | 100 | AN | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. |
| 38 | Dati immobile - Non utilizzabili / Non disponibili – Data denuncia / provvedimento | 581 | 8 | DT | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. |

**Immobili (2)**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 39 | Numero d'ordine | 589 | 4 | NU | Il dato è obbligatorio. Numero d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Da valorizzare nel caso in cui la dichiarazione sia riferita ad immobili soggetti ad IMU. Indicare un numero successivo rispetto a quello indicato per l'immobile precedente. |
| 40 | Progressivo immobile | 593 | 4 | NU | Il dato è obbligatorio. Progressivo d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Da valorizzare nel caso in cui la dichiarazione sia riferita ad immobili soggetti ad IMU. |
| 41 | Indicatore di continuità | 597 | 1 | NU | Se presente indica che l'immobile/terreno fa riferimento ad un'anagrafica precedentemente definita. Vale 0 o 1 e non può essere indicato per il primo immobile/terreno in assoluto o per immobili/terreni che presentano un progressivo maggiore o uguale al numero d'ordine. |
| 42 | Caratteristiche | 598 | 3 | AN | Il dato è obbligatorio. Indicare: **1** Per terreno; **2** Per area fabbricabile; **3** Per fabbricato il cui valore è determinato sulla base della rendita catastale; **4** Per fabbricato con valore determinato sulla base delle scritture contabili; **5** Per abitazione principale; **6** Per pertinenza; **7** Per beni merce. |
| 43 | Indirizzo | 601 | 100 | AN | Il dato è obbligatorio. Indicare l'esatta ubicazione dell'immobile descritto e cioè la località, la via o la piazza, il numero civico, la scala, il piano e l'interno. |
| 44 | T/U | 701 | 1 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare T se l'immobile è censito nel catasto terreni, U se nel catasto urbano. |
| 45 | Codice Catastale Immobile/Terreno | 702 | 5 | AN | Riportare, se presente, il corrispondente (per Quadro e numero d'ordine) codice catastale indicato nel campo Annotazioni del Record D. |
| 46 | Sezione | 707 | 3 | AN | Va indicata la sezione ove esistente. |
| 47 | Foglio | 710 | 4 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". |
| 48 | Particella | 714 | 10 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". |
| 49 | Subalterno | 724 | 4 | AN | Va indicato il subalterno ove esistente. |
| 50 | Categoria/Qualità | 728 | 25 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Va indicata la categoria per i fabbricati e la qualità per i terreni (es. seminativo, vigneto, ecc.). |
| 51 | Classe | 753 | 10 | AN | Il dato è obbligatorio se è presente almeno un dato nei campi da "T/U" a "Classe". Indicare la classe dei fabbricati o la classe di redditività delle singole particelle di terreno. |
| 52 | N. Protocollo | 763 | 20 | AN | Il dato è obbligatorio se è presente il campo successivo. Da utilizzare in mancanza dei dati catastali. |
| 53 | Anno | 783 | 4 | NU | Il dato è obbligatorio se è presente il campo precedente. Da utilizzare in mancanza dei dati catastali. |
| 54 | Valore | 787 | 15 | NU | Il dato è obbligatorio. |
| 55 | Percentuale di possesso, parte intera | 802 | 3 | NU | Il dato è obbligatorio. |
| 56 | Percentuale di possesso, parte decimale | 805 | 2 | NU | Il dato è obbligatorio. |
| 57 | Detrazione per l'abitazione principale | 807 | 9 | NU | |
| 58 | Equiparazione a abitazione principale | 816 | 1 | AN | Indicare: **1** – Alloggio sociale; **2** – Alloggio di servizio; |
| 59 | Riduzioni | 817 | 1 | AN | Indicare: **0** - Nessuna riduzione; **1** - Per immobile storico o artistico; **2** - Immobile inagibile/inabitabile; **3** - Immobile in comodato; **4** - Immobile posseduto da soggetto non residente nel territorio dello Stato, titolare di pensione maturata in regime di convenzione internazionale con l'Italia; **5** - Altre riduzioni. |
| 60 | Esenzione | 818 | 1 | NU | Il dato è obbligatorio. Indicare: **0** – Nessuna esenzione; **1** – Esenzione per immobili non utilizzabili né disponibili; **2** – Esenzione quadro temporaneo Aiuti di Stato; **3** – Altre esenzioni. |
| 61 | Acquisto | 819 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 62 | Cessione | 820 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 63 | Altro | 821 | 1 | CB | Il dato è obbligatorio. Se la casella è barrata vale 1. Altrimenti vale 0. |
| 64 | Altro Descrizione | 822 | 100 | AN | Descrizione a testo libero. Il dato è obbligatorio se la casella precedente vale 1. |
| 65 | Inizio/Termine del possesso o variazione d'imposta | 922 | 8 | DT | Dato obbligatorio se è stato compilato un campo tra i campi Acquisto, Cessione, Altro e Inizio/Termine dell'agevolazione |
| 66 | Dati immobile – Inizio/Termine dell'agevolazione | 930 | 1 | AN | Indicare: **I** – Inizio; **T** – Termine; |
| 67 | Agenzia delle Entrate di | 931 | 24 | AN | Da compilare, in alternativa al campo successivo, se è presente il campo "Acquisto" o "Cessione". |
| 68 | Estremi del titolo | 955 | 24 | AN | Da compilare, in alternativa al campo precedente, se è presente il campo "Acquisto" o "Cessione". |
| 69 | Dati immobile - Non utilizzabili / Non disponibili - Tipo | 979 | 1 | AN | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. Indicare: **1** - Per art. 614, secondo comma, c.p. Violazione di domicilio o art.633, c.p. Invasione di terreni o edifici; **2** - Per occupazione abusiva per la quale sia stata presentata denuncia o iniziata azione giudiziaria penale. |
| 70 | Dati immobile - Non utilizzabili / Non disponibili - Autorità | 980 | 100 | AN | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. |
| 71 | Dati immobile - Non utilizzabili / Non disponibili – Data denuncia / provvedimento | 1080 | 8 | DT | Dato obbligatorio se il campo "Esenzione" è valorizzato a "1". In caso contrario non deve essere compilato. |

**Annotazioni**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 72 | Annotazioni | 1088 | 500 | AN | |
| 73 | Data | 1588 | 8 | DT | Dato obbligatorio |
| 74 | Firma del dichiarante | 1596 | 1 | CB | Dato obbligatorio |
| 75 | Filler | 1597 | 301 | AN | |

**Ultimi tre caratteri di controllo del record**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 76 | Filler | 1898 | 1 | AN | Impostare al valore "A" |
| 77 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' ed 'LF') |

---

#### 2.6.5 IMPI – PIATTAFORME MARINE E RIGASSIFICATORI - RECORD TIPO E

**RECORD DI TIPO "E": IMPi – Piattaforme marine e rigassificatori**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Vale "E". |
| 2 | Codice fiscale o partita IVA del soggetto dichiarante | 2 | 16 | CF | Dato obbligatorio. Il codice fiscale o la partita IVA deve essere formalmente corretto e registrato in Anagrafe tributaria. La non registrazione comporta lo scarto della dichiarazione in fase di accettazione. |
| 3 | Progressivo modulo | 18 | 8 | NU | Impostare ad 1 per il primo modulo di ogni quadro compilato, incrementando tale valore di una unità per ogni ulteriore modulo. |
| 4 | Filler | 26 | 48 | AN | |
| 5 | Identificativo del produttore del software (codice fiscale) | 74 | 16 | AN | |

**Piattaforma o rigassificatore (1)**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 6 | Numero d'ordine | 90 | 4 | NU | Numero d'ordine della piattaforma o rigassificatore con riferimento all'intera fornitura. Parte da 1 nel caso in cui la dichiarazione sia riferita a piattaforme marine o rigassificatori soggetti ad IMPi, altrimenti vale 0. |
| 7 | Progressivo piattaforma o rigassificatore | 94 | 4 | NU | Il dato è obbligatorio. Progressivo d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Parte da 1 nel caso in cui la dichiarazione sia riferita a piattaforme marine o rigassificatori soggetti ad IMPi, altrimenti vale 0. |
| 8 | Caratteristiche | 98 | 2 | AN | Indicare: **1** Per piattaforma marina; **2** Per terminale di rigassificazione del gas naturale |
| 9 | Denominazione del manufatto | 100 | 100 | AN | Riportare la denominazione contenuta nel decreto di cui al comma 4 dell'art. 38 del D. L. n. 124 del 2019 |
| 10 | Valore | 200 | 15 | NU | Il dato è obbligatorio. |
| 11 | Percentuale di possesso, parte intera | 215 | 3 | NU | Il dato è obbligatorio. |
| 12 | Percentuale di possesso, parte decimale | 218 | 2 | NU | Il dato è obbligatorio. |
| 13 | Data di cessazione della funzione del manufatto | 220 | 8 | DT | Indicare la data di cessazione della funzione del manufatto. Per le piattaforme marine si veda la Risoluzione n. 8/DF del 16 dicembre 2020 |

**Piattaforma o rigassificatore (2)**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 14 | Numero d'ordine | 228 | 4 | NU | Il dato è obbligatorio. Numero d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Da valorizzare nel caso in cui la dichiarazione sia riferita a piattaforme marine o rigassificatori soggetti ad IMPi. Indicare un numero successivo rispetto a quello indicato per la piattaforma o rigassificatore precedente. |
| 15 | Progressivo piattaforma o rigassificatore | 232 | 4 | NU | Il dato è obbligatorio. Progressivo d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Da valorizzare nel caso in cui la dichiarazione sia riferita a piattaforme marine o rigassificatori soggetti ad IMPi. |
| 16 | Caratteristiche | 236 | 2 | AN | Indicare: **1** Per piattaforma marina; **2** Per terminale di rigassificazione del gas naturale |
| 17 | Denominazione del manufatto | 238 | 100 | AN | Riportare la denominazione contenuta nel decreto di cui al comma 4 dell'art. 38 del D. L. n. 124 del 2019 |
| 18 | Valore | 338 | 15 | NU | Il dato è obbligatorio. |
| 19 | Percentuale di possesso, parte intera | 353 | 3 | NU | Il dato è obbligatorio. |
| 20 | Percentuale di possesso, parte decimale | 356 | 2 | NU | Il dato è obbligatorio. |
| 21 | Data di cessazione della funzione del manufatto | 358 | 8 | DT | Indicare la data di cessazione della funzione del manufatto. Per le piattaforme marine si veda la Risoluzione n. 8/DF del 16 dicembre 2020 |

**Piattaforma o rigassificatore (3)**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 22 | Numero d'ordine | 366 | 4 | NU | Il dato è obbligatorio. Numero d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Da valorizzare nel caso in cui la dichiarazione sia riferita a piattaforme marine o rigassificatori soggetti ad IMPi. Indicare un numero successivo rispetto a quello indicato per la piattaforma o rigassificatore precedente. |
| 23 | Progressivo piattaforma o rigassificatore | 370 | 4 | NU | Il dato è obbligatorio. Progressivo d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Da valorizzare nel caso in cui la dichiarazione sia riferita a piattaforme marine o rigassificatori soggetti ad IMPi. |
| 24 | Caratteristiche | 374 | 2 | AN | Indicare: **1** Per piattaforma marina; **2** Per terminale di rigassificazione del gas naturale |
| 25 | Denominazione del manufatto | 376 | 100 | AN | Riportare la denominazione contenuta nel decreto di cui al comma 4 dell'art. 38 del D. L. n. 124 del 2019 |
| 26 | Valore | 476 | 15 | NU | Il dato è obbligatorio. |
| 27 | Percentuale di possesso, parte intera | 491 | 3 | NU | Il dato è obbligatorio. |
| 28 | Percentuale di possesso, parte decimale | 494 | 2 | NU | Il dato è obbligatorio. |
| 29 | Data di cessazione della funzione del manufatto | 496 | 8 | DT | Indicare la data di cessazione della funzione del manufatto. Per le piattaforme marine si veda la Risoluzione n. 8/DF del 16 dicembre 2020 |

**Piattaforma o rigassificatore (4)**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 30 | Numero d'ordine | 504 | 4 | NU | Il dato è obbligatorio. Numero d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Da valorizzare nel caso in cui la dichiarazione sia riferita a piattaforme marine o rigassificatori soggetti ad IMPi. Indicare un numero successivo rispetto a quello indicato per la piattaforma o rigassificatore precedente. |
| 31 | Progressivo piattaforma o rigassificatore | 508 | 4 | NU | Il dato è obbligatorio. Progressivo d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Da valorizzare nel caso in cui la dichiarazione sia riferita a piattaforme marine o rigassificatori soggetti ad IMPi. |
| 32 | Caratteristiche | 512 | 2 | AN | Indicare: **1** Per piattaforma marina; **2** Per terminale di rigassificazione del gas naturale |
| 33 | Denominazione del manufatto | 514 | 100 | AN | Riportare la denominazione contenuta nel decreto di cui al comma 4 dell'art. 38 del D. L. n. 124 del 2019 |
| 34 | Valore | 614 | 15 | NU | Il dato è obbligatorio. |
| 35 | Percentuale di possesso, parte intera | 629 | 3 | NU | Il dato è obbligatorio. |
| 36 | Percentuale di possesso, parte decimale | 632 | 2 | NU | Il dato è obbligatorio. |
| 37 | Data di cessazione della funzione del manufatto | 634 | 8 | DT | Indicare la data di cessazione della funzione del manufatto. Per le piattaforme marine si veda la Risoluzione n. 8/DF del 16 dicembre 2020 |

**Piattaforma o rigassificatore (5)**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 38 | Numero d'ordine | 642 | 4 | NU | Il dato è obbligatorio. Numero d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Da valorizzare nel caso in cui la dichiarazione sia riferita a piattaforme marine o rigassificatori soggetti ad IMPi. Indicare un numero successivo rispetto a quello indicato per la piattaforma o rigassificatore precedente. |
| 39 | Progressivo piattaforma o rigassificatore | 646 | 4 | NU | Il dato è obbligatorio. Progressivo d'ordine dell'immobile/terreno con riferimento all'intera fornitura. Da valorizzare nel caso in cui la dichiarazione sia riferita a piattaforme marine o rigassificatori soggetti ad IMPi. |
| 40 | Caratteristiche | 650 | 2 | AN | Indicare: **1** Per piattaforma marina; **2** Per terminale di rigassificazione del gas naturale |
| 41 | Denominazione del manufatto | 652 | 100 | AN | Riportare la denominazione contenuta nel decreto di cui al comma 4 dell'art. 38 del D. L. n. 124 del 2019 |
| 42 | Valore | 752 | 15 | NU | Il dato è obbligatorio. |
| 43 | Percentuale di possesso, parte intera | 767 | 3 | NU | Il dato è obbligatorio. |
| 44 | Percentuale di possesso, parte decimale | 770 | 2 | NU | Il dato è obbligatorio. |
| 45 | Data di cessazione della funzione del manufatto | 772 | 8 | DT | Indicare la data di cessazione della funzione del manufatto. Per le piattaforme marine si veda la Risoluzione n. 8/DF del 16 dicembre 2020 |

**Annotazioni**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 46 | Annotazioni | 780 | 500 | AN | |
| 47 | Data | 1280 | 8 | DT | Dato obbligatorio. |
| 48 | Firma del dichiarante | 1288 | 1 | CB | Dato obbligatorio. |
| 49 | Filler | 1289 | 609 | AN | |

**Ultimi tre caratteri di controllo del record**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 50 | Filler | 1898 | 1 | AN | Impostare al valore "A". |
| 51 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' ed 'LF'). |

---

#### 2.6.6 ISTRUZIONI RELATIVE AL RECORD TIPO Z - RECORD DI CODA

**RECORD DI TIPO "Z": RECORD DI CODA**

| Campo | Descrizione | Posizione | Lunghezza | Formato | Controlli bloccanti / Valori ammessi |
|-------|-------------|-----------|-----------|---------|--------------------------------------|
| 1 | Tipo record | 1 | 1 | AN | Impostare a 'Z'. |
| 2 | Numero record di tipo 'B' | 2 | 9 | NU | Impostare a 1. |
| 3 | Numero record di tipo 'C' | 11 | 9 | NU | Impostare il numero di record contenuti nel presente invio: valore minimo consentito 1. |
| 4 | Numero record di tipo 'D' | 20 | 9 | NU | Impostare il numero di record contenuti nel presente invio: valore minimo consentito 1. |
| 5 | Numero record di tipo 'E' | 29 | 9 | NU | Impostare il numero di record contenuti nel presente invio: valore minimo consentito 1. |
| 6 | Filler | 38 | 1860 | AN | *Spazio non utilizzato* |
| 7 | Filler | 1898 | 1 | AN | Vale sempre "A". |
| 8 | Filler | 1899 | 2 | AN | Impostare i valori esadecimali '0D' e '0A' (caratteri ASCII 'CR' e 'LF'). |
