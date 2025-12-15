import { Card, CardHeader, CardContent, Button } from './ui';
import type { RiepilogoIMU, RisultatoCalcoloImmobile } from '@lib';

interface RiepilogoCalcoloProps {
  riepilogo: RiepilogoIMU;
  onReset: () => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};

const getTipoLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    abitazione_principale: 'Abitazione Principale',
    altro_fabbricato: 'Altro Fabbricato',
    pertinenza: 'Pertinenza Abitazione Principale',
    terreno_agricolo: 'Terreno Agricolo',
    area_fabbricabile: 'Area Fabbricabile',
    fabbricato_rurale: 'Fabbricato Rurale',
  };
  return labels[tipo] || tipo;
};

function DettaglioImmobile({ risultato, index }: { risultato: RisultatoCalcoloImmobile; index: number }) {
  const { immobile } = risultato;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-sm text-gray-500">Immobile #{index + 1}</span>
          <h4 className="font-medium text-gray-900">{getTipoLabel(immobile.tipo)}</h4>
          {immobile.tipo !== 'terreno_agricolo' && immobile.tipo !== 'area_fabbricabile' && (
            <span className="text-sm text-gray-600">Cat. {immobile.categoria}</span>
          )}
        </div>
        {risultato.esente ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Esente
          </span>
        ) : (
          <span className="text-lg font-bold text-primary-600">
            {formatCurrency(risultato.imuTotale)}
          </span>
        )}
      </div>

      {risultato.esente ? (
        <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
          {risultato.motivoEsenzione}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Base Imponibile</span>
            <p className="font-medium">{formatCurrency(risultato.baseImponibileNetta)}</p>
            {risultato.fattoreRiduzione < 1 && (
              <span className="text-xs text-yellow-600">
                (ridotta al {risultato.fattoreRiduzione * 100}%)
              </span>
            )}
          </div>
          <div>
            <span className="text-gray-500">Acconto (16/06)</span>
            <p className="font-medium">{formatCurrency(risultato.imuAcconto)}</p>
          </div>
          <div>
            <span className="text-gray-500">Saldo (16/12)</span>
            <p className="font-medium">{formatCurrency(risultato.imuSaldo)}</p>
          </div>
          <div>
            <span className="text-gray-500">Codice Tributo</span>
            <p className="font-medium">{risultato.codiceTributoComune}</p>
          </div>

          {risultato.detrazione && (
            <div className="col-span-2">
              <span className="text-gray-500">Detrazione applicata</span>
              <p className="font-medium text-green-600">-{formatCurrency(risultato.detrazione)}</p>
            </div>
          )}

          {risultato.quotaStato !== undefined && (
            <>
              <div>
                <span className="text-gray-500">Quota Stato</span>
                <p className="font-medium">{formatCurrency(risultato.quotaStato)}</p>
                <span className="text-xs text-gray-500">Cod. {risultato.codiceTributoStato}</span>
              </div>
              <div>
                <span className="text-gray-500">Quota Comune</span>
                <p className="font-medium">{formatCurrency(risultato.quotaComune || 0)}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function RiepilogoCalcolo({ riepilogo, onReset }: RiepilogoCalcoloProps) {
  return (
    <div className="space-y-6">
      {/* Header riepilogo */}
      <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <CardContent className="py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Riepilogo IMU {riepilogo.anno}</h2>
            <p className="text-primary-100">{riepilogo.contribuente}</p>
            {riepilogo.codiceFiscale && (
              <p className="text-primary-200 text-sm">{riepilogo.codiceFiscale}</p>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <span className="text-primary-100 text-sm">Acconto</span>
              <p className="text-2xl font-bold">{formatCurrency(riepilogo.totaleAcconto)}</p>
              <span className="text-primary-200 text-xs">Scad. {riepilogo.scadenzaAcconto}</span>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <span className="text-primary-100 text-sm">Saldo</span>
              <p className="text-2xl font-bold">{formatCurrency(riepilogo.totaleSaldo)}</p>
              <span className="text-primary-200 text-xs">Scad. {riepilogo.scadenzaSaldo}</span>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <span className="text-primary-100 text-sm">Totale Anno</span>
              <p className="text-3xl font-bold">{formatCurrency(riepilogo.totaleAnnuo)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dettaglio immobili */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Dettaglio per Immobile</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riepilogo.immobili.map((risultato, index) => (
              <DettaglioImmobile
                key={risultato.immobile.id}
                risultato={risultato}
                index={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Riepilogo codici tributo */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Codici Tributo F24</h3>
          <p className="text-sm text-gray-500">Importi da versare per codice tributo</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Codice Tributo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrizione
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(riepilogo.totaliPerCodice)
                  .filter(([, importo]) => importo > 0)
                  .map(([codice, importo]) => (
                    <tr key={codice}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {codice}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {getDescrizioneCodice(codice)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                        {formatCurrency(importo)}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-sm font-medium text-gray-900">
                    Totale
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-primary-600">
                    {formatCurrency(riepilogo.totaleAnnuo)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Azioni */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onReset}>
          Nuovo Calcolo
        </Button>
        <Button onClick={() => window.print()}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Stampa
        </Button>
      </div>
    </div>
  );
}

function getDescrizioneCodice(codice: string): string {
  const descrizioni: Record<string, string> = {
    '3912': 'Abitazione principale e pertinenze',
    '3913': 'Fabbricati rurali strumentali',
    '3914': 'Terreni',
    '3916': 'Aree fabbricabili',
    '3918': 'Altri fabbricati',
    '3925': 'Immobili gruppo D - Stato',
    '3930': 'Immobili gruppo D - Comune',
  };
  return descrizioni[codice] || 'IMU';
}
