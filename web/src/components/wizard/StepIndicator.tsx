import type { WizardStep } from '@lib';

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-8 flex justify-center">
      <ol className="flex items-center gap-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);
          const isLastStep = index === steps.length - 1;

          return (
            <li key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(index)}
                disabled={!isClickable}
                className={`
                  group flex flex-col items-center
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                <span
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
                    transition-colors
                    ${isCompleted
                      ? 'bg-primary-600 text-white'
                      : isCurrent
                        ? 'border-2 border-primary-600 bg-white text-primary-600'
                        : 'border-2 border-gray-300 bg-white text-gray-500'
                    }
                    ${isClickable && !isCurrent ? 'group-hover:bg-primary-700' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={`
                    mt-2 text-xs font-medium
                    ${isCurrent ? 'text-primary-600' : 'text-gray-500'}
                  `}
                >
                  {step.title}
                </span>
              </button>
              {!isLastStep && (
                <div
                  className={`h-0.5 w-16 mx-2 ${
                    isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
