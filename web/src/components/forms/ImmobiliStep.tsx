import { useState, useMemo, useEffect } from 'react';
import { Input, Select, Checkbox, Card, CardHeader, CardContent, CardFooter, Button, Autocomplete, Modal } from '../ui';
import { AliquotePanel } from './AliquotePanel';
import { ListaImmobili } from './ListaImmobili';
import type { DatiImmobile, FattispeciePrincipale, CategoriaCatastale, Comune, Prospetto } from '@lib';
import { COEFFICIENTI, ALIQUOTE_MINISTERO, CATEGORIE_PER_FATTISPECIE, FATTISPECIE_LABELS, COMUNI, DATA_INIZIO_DEFAULT, DATA_FINE_DEFAULT, verificaUnicita } from '@lib';
import { useProspetto } from '../../hooks';

interface ImmobiliStepProps {
  immobili: DatiImmobile[];
  onAddImmobile: (immobile: DatiImmobile) => void;
  onRemoveImmobile: (id: string) => void;
}

// Lista fattispecie per il select
const FATTISPECIE_OPTIONS: { value: FattispeciePrincipale; label: string }[] = [
  { value: 'abitazione_principale_lusso', label: FATTISPECIE_LABELS.abitazione_principale_lusso },
  { value: 'pertinenze', label: FATTISPECIE_LABELS.pertinenze },
  { value: 'fabbricati_rurali_strumentali', label: FATTISPECIE_LABELS.fabbricati_rurali_strumentali },
  { value: 'fabbricati_gruppo_d', label: FATTISPECIE_LABELS.fabbricati_gruppo_d },
  { value: 'terreni_agricoli', label: FATTISPECIE_LABELS.terreni_agricoli },
  { value: 'aree_fabbricabili', label: FATTISPECIE_LABELS.aree_fabbricabili },
  { value: 'altri_fabbricati', label: FATTISPECIE_LABELS.altri_fabbricati },
];

const CATEGORIE_OPTIONS = Object.keys(COEFFICIENTI).map((cat) => ({
  value: cat,
  label: cat,
}));

// Restituisce le categorie valide per una fattispecie
const getCategoriePerFattispecie = (fattispecie: FattispeciePrincipale) => {
  const categorie = CATEGORIE_PER_FATTISPECIE[fattispecie];
  if (categorie === null) {
    // altri_fabbricati accetta tutte le categorie
    return CATEGORIE_OPTIONS;
  }
  return CATEGORIE_OPTIONS.filter(opt => categorie.includes(opt.value as CategoriaCatastale));
};

// Restituisce l'aliquota ministeriale per una fattispecie
const getDefaultAliquota = (fattispecie: FattispeciePrincipale): number => {
  return ALIQUOTE_MINISTERO[fattispecie];
};

// Cerca l'aliquota nel prospetto comunale per una fattispecie
const getAliquotaDaProspetto = (prospetto: Prospetto | null, fattispecie: FattispeciePrincipale): number | null => {
  if (!prospetto || !fattispecie) return null;

  // Per le pertinenze, cerca abitazione_principale_lusso (stessa aliquota)
  const fattispcieDaCercare = fattispecie === 'pertinenze' ? 'abitazione_principale_lusso' : fattispecie;

  const aliquotaBase = prospetto.aliquote_base.find(a => a.fattispecie_principale === fattispcieDaCercare);
  if (!aliquotaBase || typeof aliquotaBase.aliquota !== 'string') return null;

  const match = aliquotaBase.aliquota.match(/(\d+)[,.](\d+)/);
  if (!match) return null;

  return parseFloat(`${match[1]}.${match[2]}`);
};

const createEmptyImmobile = (): DatiImmobile => ({
  id: crypto.randomUUID(),
  comune: {
    comune: '',
    regione: '',
    provincia: '',
    sigla_provincia: '',
    codice_catastale: '',
    label: '',
  },
  fattispecie_principale: '' as FattispeciePrincipale,
  categoria: '' as CategoriaCatastale,
  renditaCatastale: 0,
  percentualePossesso: 100,
  dataInizio: DATA_INIZIO_DEFAULT,
  dataFine: DATA_FINE_DEFAULT,
  aliquotaAcconto: 0,
  aliquotaSaldo: 0,
  riduzioni: {
    storicoArtistico: false,
    inagibileInabitabile: false,
    comodatoParenti: false,
    canoneCorordato: false,
  },
  esenzioni: {
    terrenoCdIap: false,
    beneMerce: false,
    occupatoAbusivamente: false,
    collabente: false,
  },
});

export function ImmobiliStep({ immobili, onAddImmobile, onRemoveImmobile }: ImmobiliStepProps) {
  const [immobile, setImmobile] = useState<DatiImmobile>(createEmptyImmobile());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aliquotaPersonalizzataSelezionata, setAliquotaPersonalizzataSelezionata] = useState<string | null>(null);
  const [erroreUnicita, setErroreUnicita] = useState<string | null>(null);

  // Hook per caricare prospetto
  const comuneSelezionato = immobile.comune.codice_catastale ? immobile.comune : null;
  const { prospetto, delibera, loading: loadingProspetto, usaAliquoteMinisteriali } = useProspetto(comuneSelezionato);

  // Comuni options
  const comuniOptions = useMemo(() =>
    COMUNI.map(c => ({
      value: c.codice_catastale,
      label: c.label,
      comune: c.comune,
      regione: c.regione,
      provincia: c.provincia,
      sigla_provincia: c.sigla_provincia,
      codice_catastale: c.codice_catastale,
    })),
    []
  );

  // Calcola aliquota base (da prospetto o ministeriale)
  const aliquotaBase = useMemo(() => {
    if (!immobile.fattispecie_principale) return 0;
    const aliquotaDaProspetto = getAliquotaDaProspetto(prospetto, immobile.fattispecie_principale);
    return aliquotaDaProspetto !== null ? aliquotaDaProspetto : getDefaultAliquota(immobile.fattispecie_principale);
  }, [prospetto, immobile.fattispecie_principale]);

  // Aggiorna aliquote quando prospetto cambia (dopo caricamento asincrono)
  useEffect(() => {
    if (!immobile.fattispecie_principale || !prospetto) return;

    // Prospetto appena caricato: aggiorna le aliquote
    const aliquotaDaProspetto = getAliquotaDaProspetto(prospetto, immobile.fattispecie_principale);
    if (aliquotaDaProspetto !== null) {
      setImmobile(prev => ({
        ...prev,
        aliquotaAcconto: aliquotaDaProspetto,
        aliquotaSaldo: aliquotaDaProspetto,
      }));
      setAliquotaPersonalizzataSelezionata(null);
    }
  }, [prospetto]);

  const handleComuneChange = (option: (typeof comuniOptions)[number] | null) => {
    const emptyImmobile = createEmptyImmobile();

    if (option) {
      const comune: Comune = {
        comune: option.comune,
        regione: option.regione,
        provincia: option.provincia,
        sigla_provincia: option.sigla_provincia,
        codice_catastale: option.codice_catastale,
        label: option.label,
      };
      setImmobile({ ...emptyImmobile, comune });
    } else {
      setImmobile(emptyImmobile);
    }
    setAliquotaPersonalizzataSelezionata(null);
  };

  const handleChange = <K extends keyof DatiImmobile>(
    field: K,
    value: DatiImmobile[K]
  ) => {
    setImmobile((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === 'fattispecie_principale') {
        const newFattispecie = value as FattispeciePrincipale;
        // Usa aliquota dal prospetto se disponibile, altrimenti ministeriale
        const aliquotaDaProspetto = getAliquotaDaProspetto(prospetto, newFattispecie);
        const aliquota = aliquotaDaProspetto !== null ? aliquotaDaProspetto : getDefaultAliquota(newFattispecie);
        updated.aliquotaAcconto = aliquota;
        updated.aliquotaSaldo = aliquota;

        if (prev.categoria) {
          const categorieValide = getCategoriePerFattispecie(newFattispecie);
          if (!categorieValide.some(opt => opt.value === prev.categoria)) {
            updated.categoria = '' as CategoriaCatastale;
          }
        }

        // Reset aliquota personalizzata quando cambia fattispecie
        setAliquotaPersonalizzataSelezionata(null);
      }

      // Reset aliquota personalizzata se cambia categoria
      if (field === 'categoria') {
        setAliquotaPersonalizzataSelezionata(null);
      }

      return updated;
    });
  };

  const handleRiduzioneChange = (key: keyof DatiImmobile['riduzioni'], value: boolean) => {
    setImmobile((prev) => ({
      ...prev,
      riduzioni: { ...prev.riduzioni, [key]: value },
    }));
  };

  const handleEsenzioneChange = (key: keyof DatiImmobile['esenzioni'], value: boolean) => {
    setImmobile((prev) => ({
      ...prev,
      esenzioni: { ...prev.esenzioni, [key]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica campi obbligatori
    const richiedeRendita = immobile.fattispecie_principale &&
      immobile.fattispecie_principale !== 'terreni_agricoli' &&
      immobile.fattispecie_principale !== 'aree_fabbricabili';

    if (richiedeRendita && !immobile.renditaCatastale) {
      setErroreUnicita('Rendita catastale non rivalutata campo richiesto.');
      return;
    }

    // Verifica regole di unicità
    const { valido, errore } = verificaUnicita(
      immobile.fattispecie_principale,
      immobile.categoria,
      immobile.dataInizio,
      immobile.dataFine,
      immobili
    );

    if (!valido) {
      setErroreUnicita(errore || null);
      return; // Blocca l'inserimento
    }

    setErroreUnicita(null);
    onAddImmobile(immobile);

    // Reset form mantenendo il comune
    const nuovoImmobile = createEmptyImmobile();
    nuovoImmobile.comune = immobile.comune;
    setImmobile(nuovoImmobile);
    setAliquotaPersonalizzataSelezionata(null);
  };

  const isTerreno = immobile.fattispecie_principale === 'terreni_agricoli';
  const isArea = immobile.fattispecie_principale === 'aree_fabbricabili';
  const isAbitazionePrincipale = immobile.fattispecie_principale === 'abitazione_principale_lusso';
  const showCategoria = immobile.fattispecie_principale && !isTerreno && !isArea;
  // Flag fabbricato: non visibili per terreni e aree
  const showFlagFabbricato = immobile.fattispecie_principale && !isTerreno && !isArea;
  // Flag inagibile: non visibile per abitazione principale
  const showFlagInagibile = !isAbitazionePrincipale;

  return (
    <div className="space-y-6">
      {/* Layout a due colonne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonna sinistra: Form Immobile */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Aggiungi Immobile</h2>
              <p className="text-sm text-gray-500 mt-1">
                Inserisci i dati catastali dell'immobile
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Comune e fonte aliquote */}
                <div className="space-y-2">
                  <Autocomplete
                    label="Comune"
                    placeholder="Cerca per codice catastale o nome comune..."
                    options={comuniOptions}
                    value={immobile.comune.codice_catastale ? comuniOptions.find(c => c.codice_catastale === immobile.comune.codice_catastale) || null : null}
                    onChange={handleComuneChange}
                    maxResults={15}
                  />
                  {/* Indicatore fonte aliquote */}
                  {comuneSelezionato && (
                    <div className="text-sm">
                      {loadingProspetto ? (
                        <span className="text-gray-500">Caricamento...</span>
                      ) : usaAliquoteMinisteriali ? (
                        <span className="text-amber-600">Aliquote ministeriali</span>
                      ) : delibera ? (
                        <a
                          href={delibera.link_prospetto}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 inline-flex items-center gap-1"
                        >
                          Aliquote comunali - Anno {delibera.anno_riferimento}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Fattispecie e Categoria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Tipologia"
                    placeholder="Seleziona tipologia"
                    value={immobile.fattispecie_principale}
                    onChange={(e) => handleChange('fattispecie_principale', e.target.value as FattispeciePrincipale)}
                    options={FATTISPECIE_OPTIONS}
                  />
                  {showCategoria && (
                    <Select
                      label="Categoria Catastale"
                      placeholder="Seleziona categoria"
                      value={immobile.categoria}
                      onChange={(e) => handleChange('categoria', e.target.value as CategoriaCatastale)}
                      options={getCategoriePerFattispecie(immobile.fattispecie_principale)}
                    />
                  )}
                </div>

                {/* Flag fabbricato - visibili solo per fabbricati */}
                {showFlagFabbricato && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Checkbox
                      label="Fabbricato storico/artistico"
                      description="Art. 13, c. 3, D.L. 201/2011"
                      checked={immobile.riduzioni.storicoArtistico}
                      onChange={(e) => handleRiduzioneChange('storicoArtistico', e.target.checked)}
                    />
                    {showFlagInagibile && (
                      <Checkbox
                        label="Fabbricato inagibile/inabitabile"
                        description="Dichiarato non utilizzabile"
                        checked={immobile.riduzioni.inagibileInabitabile}
                        onChange={(e) => handleRiduzioneChange('inagibileInabitabile', e.target.checked)}
                      />
                    )}
                  </div>
                )}

                {/* Valori catastali */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showCategoria && (
                    <Input
                      label="Rendita catastale non rivalutata"
                      type="number"
                      value={immobile.renditaCatastale || ''}
                      onChange={(e) => handleChange('renditaCatastale', parseFloat(e.target.value) || 0)}
                      min={0}
                      step={0.01}
                    />
                  )}
                  {isTerreno && (
                    <Input
                      label="Reddito Dominicale (€)"
                      type="number"
                      value={immobile.redditoDominicale || ''}
                      onChange={(e) => handleChange('redditoDominicale', parseFloat(e.target.value) || 0)}
                      min={0}
                      step={0.01}
                    />
                  )}
                  {isArea && (
                    <Input
                      label="Valore Venale (€)"
                      type="number"
                      value={immobile.valoreVenale || ''}
                      onChange={(e) => handleChange('valoreVenale', parseFloat(e.target.value) || 0)}
                      min={0}
                      step={1}
                      hint="Valore di mercato al 1° gennaio"
                    />
                  )}
                  <Input
                    label="% Possesso"
                    type="number"
                    value={immobile.percentualePossesso}
                    onChange={(e) => handleChange('percentualePossesso', parseFloat(e.target.value) || 0)}
                    min={0}
                    max={100}
                    step={0.01}
                  />
                </div>

                {/* Periodo di possesso */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Data Inizio Possesso"
                    type="date"
                    value={immobile.dataInizio}
                    onChange={(e) => handleChange('dataInizio', e.target.value)}
                  />
                  <Input
                    label="Data Fine Possesso"
                    type="date"
                    value={immobile.dataFine}
                    onChange={(e) => handleChange('dataFine', e.target.value)}
                  />
                </div>

                {/* Toggle avanzate */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:text-primary-700"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Riduzioni ed Esenzioni
                </button>

                {showAdvanced && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    {/* Riduzioni */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Riduzioni (50% base imponibile)</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <Checkbox
                          label="Comodato a parenti"
                          description="Uso gratuito a parenti 1° grado"
                          checked={immobile.riduzioni.comodatoParenti}
                          onChange={(e) => handleRiduzioneChange('comodatoParenti', e.target.checked)}
                        />
                      </div>
                    </div>

                    {/* Riduzione Canone */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Riduzioni Aliquota (25%)</h4>
                      <Checkbox
                        label="Canone concordato"
                        description="Locazione a canone concordato (L. 431/1998)"
                        checked={immobile.riduzioni.canoneCorordato}
                        onChange={(e) => handleRiduzioneChange('canoneCorordato', e.target.checked)}
                      />
                    </div>

                    {/* Esenzioni */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Esenzioni</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {isTerreno && (
                          <Checkbox
                            label="Terreno CD/IAP"
                            description="Coltivatore diretto o IAP"
                            checked={immobile.esenzioni.terrenoCdIap}
                            onChange={(e) => handleEsenzioneChange('terrenoCdIap', e.target.checked)}
                          />
                        )}
                        <Checkbox
                          label="Bene merce"
                          description="Impresa costruzione (dal 2022)"
                          checked={immobile.esenzioni.beneMerce}
                          onChange={(e) => handleEsenzioneChange('beneMerce', e.target.checked)}
                        />
                        <Checkbox
                          label="Occupato abusivamente"
                          description="Con denuncia (dal 2023)"
                          checked={immobile.esenzioni.occupatoAbusivamente}
                          onChange={(e) => handleEsenzioneChange('occupatoAbusivamente', e.target.checked)}
                        />
                        <Checkbox
                          label="Fabbricato collabente"
                          description="Categoria F/2"
                          checked={immobile.esenzioni.collabente}
                          onChange={(e) => handleEsenzioneChange('collabente', e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end">
                <Button type="submit">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Aggiungi Immobile
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Colonna destra: Aliquote */}
        <AliquotePanel
          prospetto={prospetto}
          categoria={immobile.categoria}
          fattispecie={immobile.fattispecie_principale}
          aliquotaAcconto={immobile.aliquotaAcconto}
          aliquotaSaldo={immobile.aliquotaSaldo}
          aliquotaBase={aliquotaBase}
          onAliquotaAccontoChange={(value) => setImmobile(prev => ({ ...prev, aliquotaAcconto: value }))}
          onAliquotaSaldoChange={(value) => setImmobile(prev => ({ ...prev, aliquotaSaldo: value }))}
          aliquotaPersonalizzataSelezionata={aliquotaPersonalizzataSelezionata}
          onSelectAliquotaPersonalizzata={setAliquotaPersonalizzataSelezionata}
        />
      </div>

      {/* Lista immobili */}
      <ListaImmobili
        immobili={immobili}
        onRemove={onRemoveImmobile}
      />

      {/* Modal errore unicità */}
      <Modal
        aperto={!!erroreUnicita}
        onChiudi={() => setErroreUnicita(null)}
        titolo="Errore"
      >
        {erroreUnicita}
      </Modal>
    </div>
  );
}
