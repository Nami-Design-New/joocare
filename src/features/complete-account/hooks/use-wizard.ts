import { useState } from "react";

export function useWizard(totalSteps: number) {
  const [step, setStep] = useState(0);

  const isFirstStep = step === 0;
  const isLastStep = step === totalSteps - 1;

  const next = () => {
    if (!isLastStep) setStep((s) => s + 1);
  };

  const prev = () => {
    if (!isFirstStep) setStep((s) => s - 1);
  };

  return {
    step,
    next,
    prev,
    isFirstStep,
    isLastStep,
  };
}