import { cn } from '@/shared/lib/utils';

type ApplyStepperProps = {
  steps: string[];
  current: number;
};

// Numbered circles on a progress track with the step names underneath.
export default function ApplyStepper({ steps, current }: ApplyStepperProps) {
  const lastIndex = Math.max(steps.length - 1, 1);
  const fill = `${(current / lastIndex) * 100}%`;

  return (
    <div className="flex flex-col gap-3">
      <div aria-hidden className="relative flex items-center justify-between">
        <span className="absolute inset-x-1 top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-assessment-close">
          <span
            className="absolute inset-y-0 inset-s-0 rounded-full bg-assessment-primary transition-[width] duration-300"
            style={{ width: fill }}
          />
        </span>
        {steps.map((step, index) => (
          <span
            key={step}
            className={cn(
              'relative flex size-9 items-center justify-center rounded-full text-xl font-semibold',
              index <= current
                ? 'bg-assessment-primary text-primary-foreground'
                : 'bg-assessment-close text-foreground/35',
            )}
          >
            {index + 1}
          </span>
        ))}
      </div>
      <ol className="flex justify-between gap-4">
        {steps.map((step, index) => (
          <li
            key={step}
            aria-current={index === current ? 'step' : undefined}
            className={cn(
              'text-base sm:text-lg',
              index <= current ? 'text-foreground' : 'text-foreground/45',
            )}
          >
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
