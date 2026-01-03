import { useState, useMemo, useEffect } from 'react';
import { Header, Footer } from './components/layout';
import { StepIndicator, WizardNavigation } from './components/wizard';
import { ImmobiliStep } from './components/forms';
import { RiepilogoCalcolo } from './components/RiepilogoCalcolo';
import { calcolaRiepilogoIMU, ANNO_RIFERIMENTO } from '@lib';
import type { DatiImmobile, RiepilogoIMU, WizardStep } from '@lib';
import './index.css';

const WIZARD_STEPS: WizardStep[] = [
  { id: 'immobili', title: 'Immobili' },
  { id: 'riepilogo', title: 'Riepilogo' },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [immobili, setImmobili] = useState<DatiImmobile[]>([]);
  const [riepilogo, setRiepilogo] = useState<RiepilogoIMU | null>(null);

  // Scroll to top quando cambia lo step
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: // Immobili
        return immobili.length > 0;
      default:
        return true;
    }
  }, [currentStep, immobili]);

  const handleNext = () => {
    if (currentStep === WIZARD_STEPS.length - 2) {
      // Calcola riepilogo prima di mostrare l'ultimo step
      const result = calcolaRiepilogoIMU(
        ANNO_RIFERIMENTO,
        '', // Contribuente vuoto per ora
        immobili
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
    setImmobili([]);
    setRiepilogo(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ImmobiliStep
            immobili={immobili}
            onAddImmobile={handleAddImmobile}
            onRemoveImmobile={handleRemoveImmobile}
          />
        );
      case 1:
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
            nextLabel={currentStep === 0 ? 'Calcola IMU' : undefined}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
