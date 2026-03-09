interface Step {
  number: number;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center relative">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${
                    currentStep === step.number
                      ? "bg-brand-primary text-white ring-4 ring-brand-primary/20 scale-110"
                      : currentStep > step.number
                        ? "bg-brand-primary text-white"
                        : "bg-slate-200 text-slate-500"
                  }
                `}
              >
                {currentStep > step.number ? (
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>
                ) : (
                  step.number
                )}
              </div>

              {/* Step Title */}
              <div className="mt-2 text-center">
                <p
                  className={`
                    text-xs font-semibold
                    ${
                      currentStep >= step.number
                        ? "text-slate-800"
                        : "text-slate-400"
                    }
                  `}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-[10px] text-slate-400 mt-0.5 hidden md:block">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 md:mx-4">
                <div
                  className={`
                    h-full transition-all
                    ${
                      currentStep > step.number
                        ? "bg-brand-primary"
                        : "bg-slate-200"
                    }
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
