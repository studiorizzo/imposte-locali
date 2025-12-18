import { useState, useMemo, useEffect } from 'react';
import { Input, Select, Checkbox, Card, CardHeader, CardContent, CardFooter, Button, Autocomplete } from '../ui';
import { AliquotePanel } from './AliquotePanel';
import { ListaImmobili } from './ListaImmobili';
import type { DatiImmobile, TipoImmobile, CategoriaCatastale, Comune, Prospetto } from '@lib';
import { COEFFICIENTI, ALIQUOTE_BASE_2025, COMUNI } from '@lib';
import { useProspetto } from '../../hooks';

interface ImmobiliStepProps {
  immobili: DatiImmobile[];
  onAddImmobile: (immobile: DatiImmobile) => void;
  onRemoveImmobile: (id: string) => void;
}

const TIPI_IMMOBILE: { value: TipoImmobile; label: string }[] = [
  { value: 'abitazione_principale', label: 'Abitazione Principale' },
  { value: 'pertinenza', label: 'Pertinenza Abitazione Principale' },
  { value: 'fabbricato_rurale', label: 'Fabbricato Rurale Strumentale' },
  { value: 'fabbricato_gruppo_d', label: 'Fabbricato Gruppo D' },
  { value: 'terreno_agricolo', label: 'Terreno Agricolo' },
  { value: 'area_fabbricabile', label: 'Area Fabbricabile' },
  { value: 'altro_fabbricato', label: 'Altro Fabbricato' },
];

const CATEGORIE_OPTIONS = Object.keys(COEFFICIENTI).map((cat) => ({
  value: cat,
  label: cat,
}));

const CATEGORIE_ABITAZIONE_PRINCIPALE_LUSSO = ['A/1', 'A/8', 'A/9'];
const CATEGORIE_PERTINENZA = ['C/2', 'C/6', 'C/7'];
const CATEGORIE_GRUPPO_D = ['D/1', 'D/2', 'D/3', 'D/4', 'D/5', 'D/6', 'D/7', 'D/8', 'D/9'];
const CATEGORIE_FABBRICATO_RURALE = ['D/10'];

const getCategoriePerTipo = (tipo: TipoImmobile) => {
  switch (tipo) {
    case 'abitazione_principale':
      return CATEGORIE_OPTIONS.filter(opt => CATEGORIE_ABITAZIONE_PRINCIPALE_LUSSO.includes(opt.value));
    case 'pertinenza':
      return CATEGORIE_OPTIONS.filter(opt => CATEGORIE_PERTINENZA.includes(opt.value));
    case 'fabbricato_gruppo_d':
      return CATEGORIE_OPTIONS.filter(opt => CATEGORIE_GRUPPO_D.includes(opt.value));
    case 'fabbricato_rurale':
      return CATEGORIE_OPTIONS.filter(opt => CATEGORIE_FABBRICATO_RURALE.includes(opt.value));
    default:
      return CATEGORIE_OPTIONS;
  }
};

const getDefaultAliquota = (tipo: TipoImmobile): number => {
  switch (tipo) {
    case 'abitazione_principale':
      return ALIQUOTE_BASE_2025.abitazionePrincipale;
    case 'fabbricato_gruppo_d':
      return ALIQUOTE_BASE_2025.gruppoD;
    case 'fabbricato_rurale':
      return ALIQUOTE_BASE_2025.fabbricatiRurali;
    case 'terreno_agricolo':
      return ALIQUOTE_BASE_2025.terreniAgricoli;
    case 'area_fabbricabile':
      return ALIQUOTE_BASE_2025.areeFabbricabili;
    default:
      return ALIQUOTE_BASE_2025.altriFabbricati;
  }
};

const TIPO_TO_FATTISPECIE: Record<TipoImmobile, string> = {
  abitazione_principale: 'abitazione_principale_lusso',
  pertinenza: 'altri_fabbricati',
  fabbricato_rurale: 'fabbricati_rurali_strumentali',
  fabbricato_gruppo_d: 'fabbricati_gruppo_d',
  terreno_agricolo: 'terreni_agricoli',
  area_fabbricabile: 'aree_fabbricabili',
  altro_fabbricato: 'altri_fabbricati',
};

const getAliquotaDaProspetto = (prospetto: Prospetto | null, tipo: TipoImmobile): number | null => {
  if (!prospetto || !tipo) return null;

  const fattispecie = TIPO_TO_FATTISPECIE[tipo];
  if (!fattispecie) return null;

  const aliquotaBase = prospetto.aliquote_base.find(a => a.fattispecie_principale === fattispecie);
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
  tipo: '' as TipoImmobile,
  categoria: '' as CategoriaCatastale,
  renditaCatastale: 0,
  percentualePossesso: 100,
  mesiPrimoSemestre: 6,
  mesiSecondoSemestre: 6,
  aliquotaAcconto: 0,
  aliquotaSaldo: 0,
  riduzioni: {
    storicoArtistico: false,
    inagibileInabitabile: false,
    comodatoParenti: false,
    canoneCorordato: false,
    pensionatoEstero: false,
  },
  esenzioni: {
    abitazionePrincipale: false,
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

  // Aggiorna aliquote quando prospetto cambia o tipo immobile cambia
  useEffect(() => {
    if (!immobile.tipo) return;

    const aliquotaDaProspetto = getAliquotaDaProspetto(prospetto, immobile.tipo);

    if (aliquotaDaProspetto !== null) {
      setImmobile(prev => ({
        ...prev,
        aliquotaAcconto: aliquotaDaProspetto,
        aliquotaSaldo: aliquotaDaProspetto,
      }));
    } else {
      const aliquotaMinisteriale = getDefaultAliquota(immobile.tipo);
      setImmobile(prev => ({
        ...prev,
        aliquotaAcconto: aliquotaMinisteriale,
        aliquotaSaldo: aliquotaMinisteriale,
      }));
    }
    // Reset aliquota personalizzata selezionata
    setAliquotaPersonalizzataSelezionata(null);
  }, [prospetto, immobile.tipo]);

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

      if (field === 'tipo') {
        const newTipo = value as TipoImmobile;
        const defaultAliquota = getDefaultAliquota(newTipo);
        updated.aliquotaAcconto = defaultAliquota;
        updated.aliquotaSaldo = defaultAliquota;

        if (prev.categoria) {
          const categorieValide = getCategoriePerTipo(newTipo);
          if (!categorieValide.some(opt => opt.value === prev.categoria)) {
            updated.categoria = '' as CategoriaCatastale;
          }
        }
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
    onAddImmobile(immobile);
    setImmobile(createEmptyImmobile());
    setAliquotaPersonalizzataSelezionata(null);
  };

  const isTerreno = immobile.tipo === 'terreno_agricolo';
  const isArea = immobile.tipo === 'area_fabbricabile';
  const showCategoria = immobile.tipo && !isTerreno && !isArea;

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

                {/* Tipo e Categoria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Tipologia"
                    placeholder="Seleziona tipologia"
                    value={immobile.tipo}
                    onChange={(e) => handleChange('tipo', e.target.value as TipoImmobile)}
                    options={TIPI_IMMOBILE}
                  />
                  {showCategoria && (
                    <Select
                      label="Categoria Catastale"
                      placeholder="Seleziona categoria"
                      value={immobile.categoria}
                      onChange={(e) => handleChange('categoria', e.target.value as CategoriaCatastale)}
                      options={getCategoriePerTipo(immobile.tipo)}
                    />
                  )}
                </div>

                {/* Valori catastali */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showCategoria && (
                    <Input
                      label="Rendita Catastale (€)"
                      type="number"
                      value={immobile.renditaCatastale || ''}
                      onChange={(e) => handleChange('renditaCatastale', parseFloat(e.target.value) || 0)}
                      min={0}
                      step={0.01}
                      hint="Rendita non rivalutata"
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

                {/* Mesi di possesso */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Mesi 1° Semestre"
                    type="number"
                    value={immobile.mesiPrimoSemestre}
                    onChange={(e) => handleChange('mesiPrimoSemestre', parseInt(e.target.value) || 0)}
                    min={0}
                    max={6}
                    hint="Gennaio - Giugno"
                  />
                  <Input
                    label="Mesi 2° Semestre"
                    type="number"
                    value={immobile.mesiSecondoSemestre}
                    onChange={(e) => handleChange('mesiSecondoSemestre', parseInt(e.target.value) || 0)}
                    min={0}
                    max={6}
                    hint="Luglio - Dicembre"
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
                          label="Immobile storico/artistico"
                          description="Art. 13, c. 3, D.L. 201/2011"
                          checked={immobile.riduzioni.storicoArtistico}
                          onChange={(e) => handleRiduzioneChange('storicoArtistico', e.target.checked)}
                        />
                        <Checkbox
                          label="Inagibile/Inabitabile"
                          description="Dichiarato non utilizzabile"
                          checked={immobile.riduzioni.inagibileInabitabile}
                          onChange={(e) => handleRiduzioneChange('inagibileInabitabile', e.target.checked)}
                        />
                        <Checkbox
                          label="Comodato a parenti"
                          description="Uso gratuito a parenti 1° grado"
                          checked={immobile.riduzioni.comodatoParenti}
                          onChange={(e) => handleRiduzioneChange('comodatoParenti', e.target.checked)}
                        />
                        <Checkbox
                          label="Pensionato estero"
                          description="Pensionato residente all'estero"
                          checked={immobile.riduzioni.pensionatoEstero}
                          onChange={(e) => handleRiduzioneChange('pensionatoEstero', e.target.checked)}
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
          tipo={immobile.tipo}
          aliquotaAcconto={immobile.aliquotaAcconto}
          aliquotaSaldo={immobile.aliquotaSaldo}
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
    </div>
  );
}
