import { useMemo } from 'react';
import { Card, CardHeader, CardContent, Input } from '../ui';
import type { Prospetto, AliquotaPersonalizzata, CategoriaCatastale, FattispeciePrincipale } from '@lib';

interface AliquotePanelProps {
  prospetto: Prospetto | null;
  categoria: CategoriaCatastale | '';
  fattispecie: FattispeciePrincipale | '';
  aliquotaAcconto: number;
  aliquotaSaldo: number;
  onAliquotaAccontoChange: (value: number) => void;
  onAliquotaSaldoChange: (value: number) => void;
  aliquotaPersonalizzataSelezionata: string | null;
  onSelectAliquotaPersonalizzata: (id: string | null) => void;
}

// Campi da mostrare nelle card (esclusi fattispecie_principale e aliquota che sono nell'header)
const CAMPI_CARD: (keyof AliquotaPersonalizzata)[] = [
  'categoria_catastale',
  'requisiti_oggettivi',
  'requisiti_soggettivi',
  'attivita',
  'ateco',
  'dipendenti',
  'collocazione',
  'destinazione_uso',
];

const LABEL_CAMPI: Record<string, string> = {
  categoria_catastale: 'Categoria catastale',
  requisiti_oggettivi: 'Requisiti oggettivi',
  requisiti_soggettivi: 'Requisiti soggettivi',
  attivita: 'Attività',
  ateco: 'Codice ATECO',
  dipendenti: 'Dipendenti',
  collocazione: 'Collocazione',
  destinazione_uso: "Destinazione d'uso",
};

// Genera un ID univoco per l'aliquota personalizzata
function getAliquotaId(aliquota: AliquotaPersonalizzata, index: number): string {
  return `${aliquota.fattispecie_principale}-${aliquota.categoria_catastale || ''}-${index}`;
}

// Estrae l'aliquota come numero
function parseAliquota(aliquota: string): number | null {
  const match = aliquota.match(/(\d+)[,.](\d+)/);
  if (!match) return null;
  return parseFloat(`${match[1]}.${match[2]}`);
}

// Verifica se una categoria corrisponde al pattern
function matchCategoria(pattern: string, categoria: string): boolean {
  const patternUpper = pattern.toUpperCase();
  const categoriaUpper = categoria.toUpperCase();

  // Match esatto o pattern contiene la categoria
  if (patternUpper === categoriaUpper) return true;
  if (patternUpper.includes(categoriaUpper)) return true;

  // Pattern come "A/1, A/8, A/9" - split e verifica
  const patterns = patternUpper.split(/[,;]\s*/);
  return patterns.some(p => p.trim() === categoriaUpper);
}

export function AliquotePanel({
  prospetto,
  categoria,
  fattispecie,
  aliquotaAcconto,
  aliquotaSaldo,
  onAliquotaAccontoChange,
  onAliquotaSaldoChange,
  aliquotaPersonalizzataSelezionata,
  onSelectAliquotaPersonalizzata,
}: AliquotePanelProps) {
  // Filtra aliquote personalizzate per fattispecie e opzionalmente categoria
  const aliquotePersonalizzate = useMemo(() => {
    if (!prospetto || !fattispecie) return [];

    // Per le pertinenze, cerca anche abitazione_principale_lusso (stessa aliquota)
    const fattispcieDaCercare = fattispecie === 'pertinenze' ? 'abitazione_principale_lusso' : fattispecie;

    return prospetto.aliquote_personalizzate.filter((ap) => {
      // 1. Filtro su fattispecie (sempre richiesto)
      if (ap.fattispecie_principale !== fattispcieDaCercare) return false;

      // 2. Filtro su categoria (solo se entrambi valorizzati)
      if (categoria && ap.categoria_catastale) {
        return matchCategoria(ap.categoria_catastale, categoria);
      }

      // 3. Altrimenti mostra (utente senza categoria o aliquota senza categoria)
      return true;
    });
  }, [prospetto, categoria, fattispecie]);

  const showAliquote = fattispecie !== '';

  if (!showAliquote) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Aliquote</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            Seleziona la tipologia immobile per visualizzare le aliquote
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Aliquote</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Campi aliquote */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Aliquota Acconto (%)"
              type="number"
              value={aliquotaAcconto || ''}
              onChange={(e) => onAliquotaAccontoChange(parseFloat(e.target.value) || 0)}
              min={0}
              max={1.14}
              step={0.01}
              hint="Anno precedente"
            />
            <Input
              label="Aliquota Saldo (%)"
              type="number"
              value={aliquotaSaldo || ''}
              onChange={(e) => onAliquotaSaldoChange(parseFloat(e.target.value) || 0)}
              min={0}
              max={1.14}
              step={0.01}
              hint="Anno corrente"
            />
          </div>

          {/* Aliquote differenziate */}
          {aliquotePersonalizzate.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Aliquote differenziate
              </h3>
              <div className="space-y-3">
                {aliquotePersonalizzate.map((ap, index) => {
                  const id = getAliquotaId(ap, index);
                  const isSelected = aliquotaPersonalizzataSelezionata === id;
                  const aliquotaValue = parseAliquota(ap.aliquota);

                  // Raccogli i campi con valore
                  const campiConValore = CAMPI_CARD.filter(
                    (campo) => ap[campo] && ap[campo] !== ''
                  );

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          onSelectAliquotaPersonalizzata(null);
                        } else {
                          onSelectAliquotaPersonalizzata(id);
                          // Aggiorna aliquote con il valore selezionato
                          if (aliquotaValue !== null) {
                            onAliquotaAccontoChange(aliquotaValue);
                            onAliquotaSaldoChange(aliquotaValue);
                          }
                        }
                      }}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {/* Header con fattispecie e aliquota */}
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900 text-sm">
                          {ap.fattispecie_principale}
                        </span>
                        <span
                          className={`text-sm font-semibold px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {ap.aliquota}
                        </span>
                      </div>

                      {/* Bullet list dei campi */}
                      {campiConValore.length > 0 && (
                        <ul className="space-y-1">
                          {campiConValore.map((campo) => (
                            <li
                              key={campo}
                              className="text-xs text-gray-600 flex items-start gap-2"
                            >
                              <span className="text-gray-400 mt-0.5">•</span>
                              <span>
                                <span className="font-medium">{LABEL_CAMPI[campo]}:</span>{' '}
                                {ap[campo]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {aliquotePersonalizzate.length === 0 && prospetto && (
            <p className="text-gray-500 text-sm">
              Nessuna aliquota differenziata per questa tipologia
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
