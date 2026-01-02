import { useMemo, useRef, useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Input } from '../ui';
import type { Prospetto, AliquotaPersonalizzata, CategoriaCatastale, FattispeciePrincipale } from '@lib';

interface AliquotePanelProps {
  prospetto: Prospetto | null;
  categoria: CategoriaCatastale | '';
  fattispecie: FattispeciePrincipale | '';
  aliquotaAcconto: number;
  aliquotaSaldo: number;
  aliquotaBase: number;
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
  aliquotaBase,
  onAliquotaAccontoChange,
  onAliquotaSaldoChange,
  aliquotaPersonalizzataSelezionata,
  onSelectAliquotaPersonalizzata,
}: AliquotePanelProps) {
  // Filtra aliquote personalizzate per fattispecie e opzionalmente categoria
  const aliquotePersonalizzate = useMemo(() => {
    if (!prospetto || !fattispecie) return [];

    // Per le pertinenze, cerca anche abitazione_principale (stessa aliquota)
    const fattispcieDaCercare = fattispecie === 'pertinenze' ? 'abitazione_principale' : fattispecie;

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
            />
            <Input
              label="Aliquota Saldo (%)"
              type="number"
              value={aliquotaSaldo || ''}
              onChange={(e) => onAliquotaSaldoChange(parseFloat(e.target.value) || 0)}
              min={0}
              max={1.14}
              step={0.01}
            />
          </div>

          {/* Aliquote differenziate */}
          {aliquotePersonalizzate.length > 0 && (
            <AliquoteDifferenziateCarousel
              aliquotePersonalizzate={aliquotePersonalizzate}
              aliquotaPersonalizzataSelezionata={aliquotaPersonalizzataSelezionata}
              aliquotaBase={aliquotaBase}
              onSelectAliquotaPersonalizzata={onSelectAliquotaPersonalizzata}
              onAliquotaAccontoChange={onAliquotaAccontoChange}
              onAliquotaSaldoChange={onAliquotaSaldoChange}
            />
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

// Componente carousel per le aliquote differenziate
function AliquoteDifferenziateCarousel({
  aliquotePersonalizzate,
  aliquotaPersonalizzataSelezionata,
  aliquotaBase,
  onSelectAliquotaPersonalizzata,
  onAliquotaAccontoChange,
  onAliquotaSaldoChange,
}: {
  aliquotePersonalizzate: AliquotaPersonalizzata[];
  aliquotaPersonalizzataSelezionata: string | null;
  aliquotaBase: number;
  onSelectAliquotaPersonalizzata: (id: string | null) => void;
  onAliquotaAccontoChange: (value: number) => void;
  onAliquotaSaldoChange: (value: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);
    }
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', updateScrollButtons);
      }
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [aliquotePersonalizzate]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // Calcola scroll amount dinamico basato sulla larghezza della prima card
      const firstCard = scrollRef.current.querySelector('button');
      const cardWidth = firstCard ? firstCard.offsetWidth : 300;
      const scrollAmount = cardWidth + 12; // card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-700">
          Aliquote differenziate ({aliquotePersonalizzate.length})
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-1 rounded ${
              canScrollLeft
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Scorri a sinistra"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-1 rounded ${
              canScrollRight
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Scorri a destra"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
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
                  // Deseleziona e ripristina aliquota base
                  onSelectAliquotaPersonalizzata(null);
                  onAliquotaAccontoChange(aliquotaBase);
                  onAliquotaSaldoChange(aliquotaBase);
                } else {
                  onSelectAliquotaPersonalizzata(id);
                  // Aggiorna aliquote con il valore selezionato
                  if (aliquotaValue !== null) {
                    onAliquotaAccontoChange(aliquotaValue);
                    onAliquotaSaldoChange(aliquotaValue);
                  }
                }
              }}
              className={`flex-shrink-0 w-2/3 min-h-48 text-left p-3 rounded-lg border-2 transition-all flex flex-col ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Header con aliquota - in alto a destra */}
              <div className="flex justify-end">
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

              {/* Contenuto centrato verticalmente */}
              <div className="flex-1 flex items-center">
                {campiConValore.length > 0 && (
                  <ul className="space-y-1">
                    {campiConValore.map((campo) => (
                      <li
                        key={campo}
                        className="text-xs text-gray-600 flex items-start gap-2"
                      >
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>
                          {campo === 'categoria_catastale' ? (
                            <><span className="font-medium">{LABEL_CAMPI[campo]}:</span> {ap[campo]}</>
                          ) : (
                            ap[campo]
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
