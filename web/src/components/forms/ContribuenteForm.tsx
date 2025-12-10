import { Input, Card, CardHeader, CardContent } from '../ui';
import type { Contribuente } from '../../types';

interface ContribuenteFormProps {
  data: Contribuente;
  onChange: (data: Contribuente) => void;
}

export function ContribuenteForm({ data, onChange }: ContribuenteFormProps) {
  const handleChange = (field: keyof Contribuente, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Dati Contribuente</h2>
        <p className="text-sm text-gray-500 mt-1">
          Inserisci i tuoi dati anagrafici per il calcolo IMU
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome e Cognome"
              value={data.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Mario Rossi"
              required
            />
            <Input
              label="Codice Fiscale"
              value={data.codiceFiscale}
              onChange={(e) => handleChange('codiceFiscale', e.target.value.toUpperCase())}
              placeholder="RSSMRA80A01H501Z"
              maxLength={16}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Anno di Riferimento"
              type="number"
              value={data.anno}
              onChange={(e) => handleChange('anno', parseInt(e.target.value))}
              min={2020}
              max={2030}
            />
            <Input
              label="Codice Comune"
              value={data.codiceComune || ''}
              onChange={(e) => handleChange('codiceComune', e.target.value.toUpperCase())}
              placeholder="H501"
              hint="Codice catastale del comune"
              maxLength={4}
            />
            <Input
              label="Comune"
              value={data.comuneResidenza || ''}
              onChange={(e) => handleChange('comuneResidenza', e.target.value)}
              placeholder="Roma"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
