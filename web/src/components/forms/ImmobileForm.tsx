import { useState } from 'react';
import { Input, Select, Checkbox, Card, CardHeader, CardContent, CardFooter, Button } from '../ui';
import type { DatiImmobile, TipoImmobile, CategoriaCatastale } from '@lib';
import { COEFFICIENTI, ALIQUOTE_BASE_2025 } from '@lib';

interface ImmobileFormProps {
  onAdd: (immobile: DatiImmobile) => void;
  defaultAliquota?: number;
}

const TIPI_IMMOBILE: { value: TipoImmobile; label: string }[] = [
  { value: 'abitazione_principale', label: 'Abitazione Principale' },
  { value: 'altro_fabbricato', label: 'Altro Fabbricato' },
  { value: 'pertinenza', label: 'Pertinenza' },
  { value: 'terreno_agricolo', label: 'Terreno Agricolo' },
  { value: 'area_fabbricabile', label: 'Area Fabbricabile' },
  { value: 'fabbricato_rurale', label: 'Fabbricato Rurale Strumentale' },
];

const CATEGORIE_OPTIONS = Object.keys(COEFFICIENTI).map((cat) => ({
  value: cat,
  label: cat,
}));

const getDefaultAliquota = (tipo: TipoImmobile): number => {
  switch (tipo) {
    case 'abitazione_principale':
      return ALIQUOTE_BASE_2025.abitazionePrincipale;
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

const createEmptyImmobile = (): DatiImmobile => ({
  id: crypto.randomUUID(),
  tipo: 'altro_fabbricato',
  categoria: 'A/2',
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

  const handleChange = <K extends keyof DatiImmobile>(
    field: K,
    value: DatiImmobile[K]
  ) => {
    setImmobile((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-update aliquote when tipo changes
      if (field === 'tipo') {
        const defaultAliquota = getDefaultAliquota(value as TipoImmobile);
        updated.aliquotaAcconto = defaultAliquota;
        updated.aliquotaSaldo = defaultAliquota;
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
            {/* Tipo e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo Immobile"
                value={immobile.tipo}
                onChange={(e) => handleChange('tipo', e.target.value as TipoImmobile)}
                options={TIPI_IMMOBILE}
              />
              {!isTerreno && !isArea && (
                <Select
                  label="Categoria Catastale"
                  value={immobile.categoria}
                  onChange={(e) => handleChange('categoria', e.target.value as CategoriaCatastale)}
                  options={CATEGORIE_OPTIONS}
                />
              )}
            </div>

            {/* Valori catastali */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {!isTerreno && !isArea && (
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
