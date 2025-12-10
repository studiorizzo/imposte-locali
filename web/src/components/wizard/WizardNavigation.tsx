import { Button } from '../ui';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  showPrevious?: boolean;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isNextDisabled = false,
  nextLabel,
  showPrevious = true,
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
      <div>
        {showPrevious && !isFirstStep && (
          <Button variant="outline" onClick={onPrevious}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Indietro
          </Button>
        )}
      </div>

      <div className="text-sm text-gray-500">
        Passo {currentStep + 1} di {totalSteps}
      </div>

      <Button onClick={onNext} disabled={isNextDisabled}>
        {nextLabel || (isLastStep ? 'Calcola IMU' : 'Avanti')}
        {!isLastStep && (
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </Button>
    </div>
  );
}
