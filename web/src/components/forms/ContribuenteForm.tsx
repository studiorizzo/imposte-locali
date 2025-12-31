import { useState, useEffect } from 'react';
import { Input, Select, Card, CardHeader, CardContent } from '../ui';
import type { Contribuente, DatiAnagrafici, DomicilioFiscale, DatiPagamento, SoluzionePagamento } from '@lib';
import { validaCodiceFiscale, validaIBAN, validaCAP, SCADENZE, ANNO_RIFERIMENTO } from '@lib';

interface ContribuenteFormProps {
  data: Contribuente;
  onChange: (data: Contribuente) => void;
}

const SESSO_OPTIONS = [
  { value: 'M', label: 'Maschio' },
  { value: 'F', label: 'Femmina' },
];

const SOLUZIONE_PAGAMENTO_OPTIONS = [
  { value: 'rateizzato', label: 'Rateizzato (Acconto + Saldo)' },
  { value: 'rata_unica', label: 'Rata unica' },
];

const PROVINCE_OPTIONS = [
  { value: 'AG', label: 'AG - Agrigento' },
  { value: 'AL', label: 'AL - Alessandria' },
  { value: 'AN', label: 'AN - Ancona' },
  { value: 'AO', label: 'AO - Aosta' },
  { value: 'AR', label: 'AR - Arezzo' },
  { value: 'AP', label: 'AP - Ascoli Piceno' },
  { value: 'AT', label: 'AT - Asti' },
  { value: 'AV', label: 'AV - Avellino' },
  { value: 'BA', label: 'BA - Bari' },
  { value: 'BT', label: 'BT - Barletta-Andria-Trani' },
  { value: 'BL', label: 'BL - Belluno' },
  { value: 'BN', label: 'BN - Benevento' },
  { value: 'BG', label: 'BG - Bergamo' },
  { value: 'BI', label: 'BI - Biella' },
  { value: 'BO', label: 'BO - Bologna' },
  { value: 'BZ', label: 'BZ - Bolzano' },
  { value: 'BS', label: 'BS - Brescia' },
  { value: 'BR', label: 'BR - Brindisi' },
  { value: 'CA', label: 'CA - Cagliari' },
  { value: 'CL', label: 'CL - Caltanissetta' },
  { value: 'CB', label: 'CB - Campobasso' },
  { value: 'CE', label: 'CE - Caserta' },
  { value: 'CT', label: 'CT - Catania' },
  { value: 'CZ', label: 'CZ - Catanzaro' },
  { value: 'CH', label: 'CH - Chieti' },
  { value: 'CO', label: 'CO - Como' },
  { value: 'CS', label: 'CS - Cosenza' },
  { value: 'CR', label: 'CR - Cremona' },
  { value: 'KR', label: 'KR - Crotone' },
  { value: 'CN', label: 'CN - Cuneo' },
  { value: 'EN', label: 'EN - Enna' },
  { value: 'FM', label: 'FM - Fermo' },
  { value: 'FE', label: 'FE - Ferrara' },
  { value: 'FI', label: 'FI - Firenze' },
  { value: 'FG', label: 'FG - Foggia' },
  { value: 'FC', label: 'FC - Forlì-Cesena' },
  { value: 'FR', label: 'FR - Frosinone' },
  { value: 'GE', label: 'GE - Genova' },
  { value: 'GO', label: 'GO - Gorizia' },
  { value: 'GR', label: 'GR - Grosseto' },
  { value: 'IM', label: 'IM - Imperia' },
  { value: 'IS', label: 'IS - Isernia' },
  { value: 'SP', label: 'SP - La Spezia' },
  { value: 'AQ', label: 'AQ - L\'Aquila' },
  { value: 'LT', label: 'LT - Latina' },
  { value: 'LE', label: 'LE - Lecce' },
  { value: 'LC', label: 'LC - Lecco' },
  { value: 'LI', label: 'LI - Livorno' },
  { value: 'LO', label: 'LO - Lodi' },
  { value: 'LU', label: 'LU - Lucca' },
  { value: 'MC', label: 'MC - Macerata' },
  { value: 'MN', label: 'MN - Mantova' },
  { value: 'MS', label: 'MS - Massa-Carrara' },
  { value: 'MT', label: 'MT - Matera' },
  { value: 'ME', label: 'ME - Messina' },
  { value: 'MI', label: 'MI - Milano' },
  { value: 'MO', label: 'MO - Modena' },
  { value: 'MB', label: 'MB - Monza e Brianza' },
  { value: 'NA', label: 'NA - Napoli' },
  { value: 'NO', label: 'NO - Novara' },
  { value: 'NU', label: 'NU - Nuoro' },
  { value: 'OR', label: 'OR - Oristano' },
  { value: 'PD', label: 'PD - Padova' },
  { value: 'PA', label: 'PA - Palermo' },
  { value: 'PR', label: 'PR - Parma' },
  { value: 'PV', label: 'PV - Pavia' },
  { value: 'PG', label: 'PG - Perugia' },
  { value: 'PU', label: 'PU - Pesaro e Urbino' },
  { value: 'PE', label: 'PE - Pescara' },
  { value: 'PC', label: 'PC - Piacenza' },
  { value: 'PI', label: 'PI - Pisa' },
  { value: 'PT', label: 'PT - Pistoia' },
  { value: 'PN', label: 'PN - Pordenone' },
  { value: 'PZ', label: 'PZ - Potenza' },
  { value: 'PO', label: 'PO - Prato' },
  { value: 'RG', label: 'RG - Ragusa' },
  { value: 'RA', label: 'RA - Ravenna' },
  { value: 'RC', label: 'RC - Reggio Calabria' },
  { value: 'RE', label: 'RE - Reggio Emilia' },
  { value: 'RI', label: 'RI - Rieti' },
  { value: 'RN', label: 'RN - Rimini' },
  { value: 'RM', label: 'RM - Roma' },
  { value: 'RO', label: 'RO - Rovigo' },
  { value: 'SA', label: 'SA - Salerno' },
  { value: 'SS', label: 'SS - Sassari' },
  { value: 'SV', label: 'SV - Savona' },
  { value: 'SI', label: 'SI - Siena' },
  { value: 'SR', label: 'SR - Siracusa' },
  { value: 'SO', label: 'SO - Sondrio' },
  { value: 'SU', label: 'SU - Sud Sardegna' },
  { value: 'TA', label: 'TA - Taranto' },
  { value: 'TE', label: 'TE - Teramo' },
  { value: 'TR', label: 'TR - Terni' },
  { value: 'TO', label: 'TO - Torino' },
  { value: 'TP', label: 'TP - Trapani' },
  { value: 'TN', label: 'TN - Trento' },
  { value: 'TV', label: 'TV - Treviso' },
  { value: 'TS', label: 'TS - Trieste' },
  { value: 'UD', label: 'UD - Udine' },
  { value: 'VA', label: 'VA - Varese' },
  { value: 'VE', label: 'VE - Venezia' },
  { value: 'VB', label: 'VB - Verbano-Cusio-Ossola' },
  { value: 'VC', label: 'VC - Vercelli' },
  { value: 'VR', label: 'VR - Verona' },
  { value: 'VV', label: 'VV - Vibo Valentia' },
  { value: 'VI', label: 'VI - Vicenza' },
  { value: 'VT', label: 'VT - Viterbo' },
];

export function ContribuenteForm({ data, onChange }: ContribuenteFormProps) {
  const [errori, setErrori] = useState<{
    codiceFiscale?: string;
    iban?: string;
    cap?: string;
  }>({});

  // Validazione al blur
  const validaCampo = (campo: 'codiceFiscale' | 'iban' | 'cap', valore: string) => {
    let risultato;
    switch (campo) {
      case 'codiceFiscale':
        risultato = validaCodiceFiscale(valore);
        break;
      case 'iban':
        risultato = validaIBAN(valore);
        break;
      case 'cap':
        risultato = validaCAP(valore);
        break;
    }
    setErrori(prev => ({
      ...prev,
      [campo]: risultato.valido ? undefined : risultato.errore,
    }));
  };

  const handleAnagraficiChange = <K extends keyof DatiAnagrafici>(
    field: K,
    value: DatiAnagrafici[K]
  ) => {
    onChange({
      ...data,
      datiAnagrafici: { ...data.datiAnagrafici, [field]: value },
    });
  };

  const handleDomicilioChange = <K extends keyof DomicilioFiscale>(
    field: K,
    value: DomicilioFiscale[K]
  ) => {
    onChange({
      ...data,
      domicilioFiscale: { ...data.domicilioFiscale, [field]: value },
    });
  };

  const handlePagamentoChange = <K extends keyof DatiPagamento>(
    field: K,
    value: DatiPagamento[K]
  ) => {
    onChange({
      ...data,
      pagamento: { ...data.pagamento, [field]: value },
    });
  };

  // Data scadenza acconto formattata per input date
  const dataScadenzaAcconto = `${ANNO_RIFERIMENTO}-06-16`;

  return (
    <div className="space-y-6">
      {/* Sezione 1: Dati Anagrafici */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Dati Anagrafici</h2>
          <p className="text-sm text-gray-500 mt-1">
            Inserisci i dati anagrafici del contribuente
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Cognome e Nome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Cognome"
                value={data.datiAnagrafici.cognome}
                onChange={(e) => handleAnagraficiChange('cognome', e.target.value)}
                placeholder="Rossi"
                required
              />
              <Input
                label="Nome"
                value={data.datiAnagrafici.nome}
                onChange={(e) => handleAnagraficiChange('nome', e.target.value)}
                placeholder="Mario"
                required
              />
            </div>

            {/* Codice Fiscale e Sesso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Codice Fiscale"
                value={data.datiAnagrafici.codiceFiscale}
                onChange={(e) => handleAnagraficiChange('codiceFiscale', e.target.value.toUpperCase())}
                onBlur={(e) => validaCampo('codiceFiscale', e.target.value)}
                placeholder="RSSMRA80A01H501Z"
                maxLength={16}
                error={errori.codiceFiscale}
              />
              <Select
                label="Sesso"
                value={data.datiAnagrafici.sesso}
                onChange={(e) => handleAnagraficiChange('sesso', e.target.value as 'M' | 'F' | '')}
                options={SESSO_OPTIONS}
                placeholder="Seleziona"
              />
            </div>

            {/* Data di nascita e Luogo di nascita */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Data di Nascita"
                type="date"
                value={data.datiAnagrafici.dataNascita}
                onChange={(e) => handleAnagraficiChange('dataNascita', e.target.value)}
              />
              <Input
                label="Comune di Nascita"
                value={data.datiAnagrafici.comuneNascita}
                onChange={(e) => handleAnagraficiChange('comuneNascita', e.target.value)}
                placeholder="Roma"
              />
              <Select
                label="Provincia di Nascita"
                value={data.datiAnagrafici.provinciaNascita}
                onChange={(e) => handleAnagraficiChange('provinciaNascita', e.target.value)}
                options={PROVINCE_OPTIONS}
                placeholder="Seleziona"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sezione 2: Domicilio Fiscale */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Domicilio Fiscale</h2>
          <p className="text-sm text-gray-500 mt-1">
            Inserisci l'indirizzo del domicilio fiscale
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Indirizzo e Civico */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Input
                  label="Indirizzo"
                  value={data.domicilioFiscale.indirizzo}
                  onChange={(e) => handleDomicilioChange('indirizzo', e.target.value)}
                  placeholder="Via Roma"
                />
              </div>
              <Input
                label="Civico"
                value={data.domicilioFiscale.civico}
                onChange={(e) => handleDomicilioChange('civico', e.target.value)}
                placeholder="1"
              />
            </div>

            {/* Comune, CAP e Provincia */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Comune"
                value={data.domicilioFiscale.comune}
                onChange={(e) => handleDomicilioChange('comune', e.target.value)}
                placeholder="Roma"
              />
              <Input
                label="CAP"
                value={data.domicilioFiscale.cap}
                onChange={(e) => handleDomicilioChange('cap', e.target.value)}
                onBlur={(e) => validaCampo('cap', e.target.value)}
                placeholder="00100"
                maxLength={5}
                error={errori.cap}
              />
              <Select
                label="Provincia"
                value={data.domicilioFiscale.provincia}
                onChange={(e) => handleDomicilioChange('provincia', e.target.value)}
                options={PROVINCE_OPTIONS}
                placeholder="Seleziona"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sezione 3: Pagamento */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Pagamento</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configura le modalità di pagamento
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* IBAN */}
            <Input
              label="IBAN"
              value={data.pagamento.iban}
              onChange={(e) => handlePagamentoChange('iban', e.target.value.toUpperCase().replace(/\s/g, ''))}
              onBlur={(e) => validaCampo('iban', e.target.value)}
              placeholder="IT60X0542811101000000123456"
              maxLength={27}
              error={errori.iban}
            />

            {/* Soluzione pagamento e Data versamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Soluzione di Pagamento"
                value={data.pagamento.soluzionePagamento}
                onChange={(e) => handlePagamentoChange('soluzionePagamento', e.target.value as SoluzionePagamento)}
                options={SOLUZIONE_PAGAMENTO_OPTIONS}
              />
              <Input
                label="Data di Versamento"
                type="date"
                value={data.pagamento.dataVersamento}
                onChange={(e) => handlePagamentoChange('dataVersamento', e.target.value)}
                hint={`Scadenza acconto: ${SCADENZE.acconto}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
