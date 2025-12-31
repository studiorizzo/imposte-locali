import { useState, useMemo } from 'react';
import { Header, Footer } from './components/layout';
import { StepIndicator, WizardNavigation } from './components/wizard';
import { ContribuenteForm, ImmobiliStep } from './components/forms';
import { RiepilogoCalcolo } from './components/RiepilogoCalcolo';
import { calcolaRiepilogoIMU, ANNO_RIFERIMENTO } from '@lib';
import type { Contribuente, DatiImmobile, RiepilogoIMU, WizardStep } from '@lib';
import './index.css';

const WIZARD_STEPS: WizardStep[] = [
  { id: 'contribuente', title: 'Contribuente' },
  { id: 'immobili', title: 'Immobili' },
  { id: 'riepilogo', title: 'Riepilogo' },
];

const initialContribuente: Contribuente = {
  tipologia: 'persona_fisica',
  datiAnagrafici: {
    cognome: '',
    nome: '',
    codiceFiscale: '',
    sesso: '',
    dataNascita: '',
    comuneNascita: '',
    provinciaNascita: '',
  },
  domicilioFiscale: {
    indirizzo: '',
    civico: '',
    comune: '',
    provincia: '',
    cap: '',
  },
  pagamento: {
    iban: '',
    soluzionePagamento: 'rateizzato',
    dataVersamento: '',
  },
};

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [contribuente, setContribuente] = useState<Contribuente>(initialContribuente);
  const [immobili, setImmobili] = useState<DatiImmobile[]>([]);
  const [riepilogo, setRiepilogo] = useState<RiepilogoIMU | null>(null);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: // Contribuente
        return contribuente.datiAnagrafici.cognome.trim().length > 0 &&
               contribuente.datiAnagrafici.nome.trim().length > 0;
      case 1: // Immobili
        return immobili.length > 0;
      default:
        return true;
    }
  }, [currentStep, contribuente, immobili]);

  const handleNext = () => {
    if (currentStep === WIZARD_STEPS.length - 2) {
      // Calcola riepilogo prima di mostrare l'ultimo step
      const nomeCompleto = `${contribuente.datiAnagrafici.cognome} ${contribuente.datiAnagrafici.nome}`.trim();
      const result = calcolaRiepilogoIMU(
        ANNO_RIFERIMENTO,
        nomeCompleto,
        immobili,
        contribuente.datiAnagrafici.codiceFiscale,
        contribuente.tipologia
      );
      setRiepilogo(result);
    }
    setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const handleAddImmobile = (immobile: DatiImmobile) => {
    setImmobili((prev) => [...prev, immobile]);
  };

  const handleRemoveImmobile = (id: string) => {
    setImmobili((prev) => prev.filter((i) => i.id !== id));
  };

  const handleReset = () => {
    setCurrentStep(0);
    setContribuente(initialContribuente);
    setImmobili([]);
    setRiepilogo(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ContribuenteForm
            data={contribuente}
            onChange={setContribuente}
          />
        );
      case 1:
        return (
          <ImmobiliStep
            immobili={immobili}
            onAddImmobile={handleAddImmobile}
            onRemoveImmobile={handleRemoveImmobile}
            tipologiaContribuente={contribuente.tipologia}
          />
        );
      case 2:
        return riepilogo ? (
          <RiepilogoCalcolo riepilogo={riepilogo} onReset={handleReset} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 w-full px-4 py-8">
        <StepIndicator
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <div className="mb-8">{renderStepContent()}</div>

        {currentStep < WIZARD_STEPS.length - 1 && (
          <WizardNavigation
            currentStep={currentStep}
            totalSteps={WIZARD_STEPS.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isNextDisabled={!canProceed}
            nextLabel={currentStep === 1 ? 'Calcola IMU' : undefined}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
