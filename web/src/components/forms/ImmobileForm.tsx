import { useState, useMemo, useEffect } from 'react';
import { Input, Select, Checkbox, Card, CardHeader, CardContent, CardFooter, Button, Autocomplete } from '../ui';
import type { DatiImmobile, TipoImmobile, CategoriaCatastale, Comune, Prospetto } from '@lib';
import { COEFFICIENTI, ALIQUOTE_BASE_2025, COMUNI } from '@lib';
import { useProspetto } from '../../hooks';

interface ImmobileFormProps {
  onAdd: (immobile: DatiImmobile) => void;
  defaultAliquota?: number;
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

// Categorie filtrate per tipo immobile secondo Allegato A D.M. 6/9/2024
// Abitazione principale tassabile: solo categorie "di lusso" A/1, A/8, A/9
// (le altre categorie A sono esenti se abitazione principale - c. 740 L. 160/2019)
const CATEGORIE_ABITAZIONE_PRINCIPALE_LUSSO = ['A/1', 'A/8', 'A/9'];

// Pertinenze abitazione principale: C/2, C/6, C/7 (max 1 per categoria)
const CATEGORIE_PERTINENZA = ['C/2', 'C/6', 'C/7'];

// Fabbricati gruppo D: D/1-D/9 (quota stato 0,76% + maggiorazione comunale fino a 0,30%)
const CATEGORIE_GRUPPO_D = ['D/1', 'D/2', 'D/3', 'D/4', 'D/5', 'D/6', 'D/7', 'D/8', 'D/9'];

// Fabbricati rurali strumentali: principalmente D/10
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

// Mappa tipo immobile → fattispecie prospetto
const TIPO_TO_FATTISPECIE: Record<TipoImmobile, string> = {
  abitazione_principale: 'abitazione_principale_lusso',
  pertinenza: 'altri_fabbricati', // pertinenze seguono aliquota altri fabbricati
  fabbricato_rurale: 'fabbricati_rurali_strumentali',
  fabbricato_gruppo_d: 'fabbricati_gruppo_d',
  terreno_agricolo: 'terreni_agricoli',
  area_fabbricabile: 'aree_fabbricabili',
  altro_fabbricato: 'altri_fabbricati',
};

// Estrae aliquota dal prospetto
const getAliquotaDaProspetto = (prospetto: Prospetto | null, tipo: TipoImmobile): number | null => {
  if (!prospetto || !tipo) return null;

  const fattispecie = TIPO_TO_FATTISPECIE[tipo];
  if (!fattispecie) return null;

  const aliquotaBase = prospetto.aliquote_base.find(a => a.fattispecie_principale === fattispecie);
  if (!aliquotaBase || typeof aliquotaBase.aliquota !== 'string') return null;

  // Converte "0,58%" → 0.58
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
  aliquotaAcconto: ALIQUOTE_BASE_2025.altriFabbricati,
  aliquotaSaldo: ALIQUOTE_BASE_2025.altriFabbricati,
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

export function ImmobileForm({ onAdd }: ImmobileFormProps) {
  const [immobile, setImmobile] = useState<DatiImmobile>(createEmptyImmobile());
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Hook per caricare prospetto quando si seleziona un comune
  const comuneSelezionato = immobile.comune.codice_catastale ? immobile.comune : null;
  const { prospetto, delibera, loading: loadingProspetto, usaAliquoteMinisteriali } = useProspetto(comuneSelezionato);

  // Memoize comuni options for autocomplete
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
      // Usa aliquota dal prospetto comunale
      setImmobile(prev => ({
        ...prev,
        aliquotaAcconto: aliquotaDaProspetto,
        aliquotaSaldo: aliquotaDaProspetto,
      }));
    } else {
      // Usa aliquota ministeriale
      const aliquotaMinisteriale = getDefaultAliquota(immobile.tipo);
      setImmobile(prev => ({
        ...prev,
        aliquotaAcconto: aliquotaMinisteriale,
        aliquotaSaldo: aliquotaMinisteriale,
      }));
    }
  }, [prospetto, immobile.tipo]);

  const handleComuneChange = (option: (typeof comuniOptions)[number] | null) => {
    if (option) {
      const comune: Comune = {
        comune: option.comune,
        regione: option.regione,
        provincia: option.provincia,
        sigla_provincia: option.sigla_provincia,
        codice_catastale: option.codice_catastale,
        label: option.label,
      };
      setImmobile((prev) => ({ ...prev, comune }));
    } else {
      setImmobile((prev) => ({
        ...prev,
        comune: {
          comune: '',
          regione: '',
          provincia: '',
          sigla_provincia: '',
          codice_catastale: '',
          label: '',
        },
      }));
    }
  };

  const handleChange = <K extends keyof DatiImmobile>(
    field: K,
    value: DatiImmobile[K]
  ) => {
    setImmobile((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-update aliquote and categoria when tipo changes
      if (field === 'tipo') {
        const newTipo = value as TipoImmobile;
        const defaultAliquota = getDefaultAliquota(newTipo);
        updated.aliquotaAcconto = defaultAliquota;
        updated.aliquotaSaldo = defaultAliquota;

        // Reset categoria solo se aveva un valore non valido per il nuovo tipo
        // Mantieni vuoto se era vuoto (per mostrare placeholder)
        if (prev.categoria) {
          const categorieValide = getCategoriePerTipo(newTipo);
          if (!categorieValide.some(opt => opt.value === prev.categoria)) {
            updated.categoria = '' as CategoriaCatastale;
          }
        }
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
    onAdd(immobile);
    setImmobile(createEmptyImmobile());
  };

  const isTerreno = immobile.tipo === 'terreno_agricolo';
  const isArea = immobile.tipo === 'area_fabbricabile';
  const showCategoria = immobile.tipo && !isTerreno && !isArea;

  return (
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
            {/* Comune */}
            <div className="grid grid-cols-1 gap-4">
              <Autocomplete
                label="Comune"
                placeholder="Cerca per codice catastale o nome comune..."
                options={comuniOptions}
                value={immobile.comune.codice_catastale ? comuniOptions.find(c => c.codice_catastale === immobile.comune.codice_catastale) || null : null}
                onChange={handleComuneChange}
                hint="Seleziona il comune dove si trova l'immobile"
                maxResults={15}
              />
              {/* Indicatore fonte aliquote */}
              {comuneSelezionato && (
                <div className="text-sm">
                  {loadingProspetto ? (
                    <span className="text-gray-500">Caricamento aliquote comunali...</span>
                  ) : usaAliquoteMinisteriali ? (
                    <span className="text-amber-600">
                      Aliquote ministeriali (delibera comunale non disponibile)
                    </span>
                  ) : delibera ? (
                    <span className="text-green-600">
                      Delibera n. {delibera.num_delibera} del {delibera.data_delibera} - Anno {delibera.anno_riferimento}
                    </span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Aliquote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Aliquota Acconto (%)"
                type="number"
                value={immobile.aliquotaAcconto}
                onChange={(e) => handleChange('aliquotaAcconto', parseFloat(e.target.value) || 0)}
                min={0}
                max={1.14}
                step={0.01}
                hint="Aliquota anno precedente"
              />
              <Input
                label="Aliquota Saldo (%)"
                type="number"
                value={immobile.aliquotaSaldo}
                onChange={(e) => handleChange('aliquotaSaldo', parseFloat(e.target.value) || 0)}
                min={0}
                max={1.14}
                step={0.01}
                hint="Aliquota anno corrente"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
  );
}
