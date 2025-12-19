import { Card, CardContent, Button } from '../ui';
import type { DatiImmobile } from '@lib';
import { COEFFICIENTI, COEFFICIENTE_TERRENI, FATTISPECIE_LABELS, calcolaMesiPossesso } from '@lib';

// Formatta data da YYYY-MM-DD a DD/MM/YYYY
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

interface ListaImmobiliProps {
  immobili: DatiImmobile[];
  onRemove: (id: string) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};

const getFattspecieLabel = (fattispecie: string): string => {
  return FATTISPECIE_LABELS[fattispecie as keyof typeof FATTISPECIE_LABELS] || fattispecie;
};

export function ListaImmobili({ immobili, onRemove }: ListaImmobiliProps) {
  if (immobili.length === 0) {
    return (
      <Card variant="bordered" className="text-center py-12">
        <CardContent>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Nessun immobile inserito</h3>
          <p className="mt-2 text-sm text-gray-500">
            Aggiungi gli immobili per cui vuoi calcolare l'IMU
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Immobili inseriti ({immobili.length})
      </h3>
      {immobili.map((immobile) => {
        const isTerreno = immobile.fattispecie_principale === 'terreni_agricoli';
        const isArea = immobile.fattispecie_principale === 'aree_fabbricabili';
        const coefficiente = isTerreno
          ? COEFFICIENTE_TERRENI
          : COEFFICIENTI[immobile.categoria] || 0;

        return (
          <Card key={immobile.id} variant="bordered" className="relative group">
            <CardContent>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {getFattspecieLabel(immobile.fattispecie_principale)}
                    </span>
                    {!isTerreno && !isArea && (
                      <span className="text-sm text-gray-500">
                        Cat. {immobile.categoria}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">
                        {isTerreno
                          ? 'Reddito Dom.'
                          : isArea
                            ? 'Valore Venale'
                            : 'Rendita Cat.'}
                      </span>
                      <p className="font-medium">
                        {formatCurrency(
                          isTerreno
                            ? immobile.redditoDominicale || 0
                            : isArea
                              ? immobile.valoreVenale || 0
                              : immobile.renditaCatastale || 0
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Possesso</span>
                      <p className="font-medium">{immobile.percentualePossesso}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Periodo</span>
                      <p className="font-medium">
                        {formatDate(immobile.dataInizio)} - {formatDate(immobile.dataFine)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {calcolaMesiPossesso(immobile.dataInizio, immobile.dataFine).mesiTotali} mesi
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Coefficiente</span>
                      <p className="font-medium">{coefficiente}</p>
                    </div>
                  </div>

                  {/* Riduzioni attive */}
                  {Object.entries(immobile.riduzioni).some(([, v]) => v) && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {immobile.riduzioni.storicoArtistico && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                          Storico
                        </span>
                      )}
                      {immobile.riduzioni.inagibileInabitabile && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                          Inagibile
                        </span>
                      )}
                      {immobile.riduzioni.comodatoParenti && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                          Comodato
                        </span>
                      )}
                      {immobile.riduzioni.canoneCorordato && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                          Canone Concordato
                        </span>
                      )}
                      {immobile.riduzioni.pensionatoEstero && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                          Pensionato Estero
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(immobile.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
