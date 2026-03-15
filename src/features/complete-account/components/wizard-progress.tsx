import { Fragment } from "react";

interface Props {
  step: number;
  steps: string[];
  className?: string;
}

// const steps = ["Account Setup", "Business Verification", "Company Profile"];

export default function WizardProgress({ step, steps, className }: Props) {
  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        {steps.map((_, index) => (
          <Fragment key={index}>
            <div
              key={index}
              className={`flex h-9 w-9 items-center justify-center rounded-full p-2 text-lg font-semibold ${step >= index ? "bg-primary text-white" : "bg-muted text-disabled"} `}
            >
              {index + 1}
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`w-full flex-1 p-1.5 ${step > index ? "bg-primary" : "bg-muted"}`}
                style={{ marginLeft: "-.05rem", marginRight: "-.05rem" }}
              />
            )}
          </Fragment>
        ))}
      </div>

      <div className="mb-8 flex w-full items-center justify-between">
        {steps.map((label, index) => (
          <span
            key={index}
            className={`text-sm md:text-lg ${step >= index ? "" : "text-disabled"}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
