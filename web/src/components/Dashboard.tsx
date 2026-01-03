import { Card, CardHeader, CardContent, Button } from './ui';
import { ListaImmobili } from './forms/ListaImmobili';
import type { DatiImmobile } from '@lib';
import { ANNO_RIFERIMENTO } from '@lib';

interface DashboardProps {
  immobili: DatiImmobile[];
  onAddImmobile: () => void;
  onRemoveImmobile: (id: string) => void;
  onCalcolaIMU: () => void;
}

export function Dashboard({
  immobili,
  onAddImmobile,
  onRemoveImmobile,
  onCalcolaIMU,
}: DashboardProps) {
  const hasImmobili = immobili.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Calcolo IMU {ANNO_RIFERIMENTO}
        </h1>
        <p className="mt-2 text-gray-600">
          Inserisci i tuoi immobili per calcolare l'IMU dovuta
        </p>
      </div>

      {/* Lista immobili o messaggio vuoto */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">I tuoi immobili</h2>
              <p className="text-sm text-gray-500 mt-1">
                {hasImmobili
                  ? `${immobili.length} immobil${immobili.length === 1 ? 'e' : 'i'} inserit${immobili.length === 1 ? 'o' : 'i'}`
                  : 'Nessun immobile inserito'}
              </p>
            </div>
            <Button onClick={onAddImmobile} variant="primary">
              + Aggiungi immobile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {hasImmobili ? (
            <ListaImmobili
              immobili={immobili}
              onRemove={onRemoveImmobile}
            />
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Inizia aggiungendo un immobile
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Clicca sul pulsante "Aggiungi immobile" per inserire i dati del primo immobile
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pulsante Calcola IMU */}
      {hasImmobili && (
        <div className="flex justify-center">
          <Button
            onClick={onCalcolaIMU}
            variant="primary"
            className="px-8 py-3 text-lg"
          >
            Calcola IMU →
          </Button>
        </div>
      )}
    </div>
  );
}
