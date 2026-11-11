import type { ReactNode } from 'react';
import AssessmentCard from '../AssessmentCard';

type AssessmentStatusCardProps = {
  visual: ReactNode;
  title: string;
  description: ReactNode;
  /** Optional fact tiles under the text. */
  facts?: ReactNode;
  actions: ReactNode;
};

// Centered state card when the link can't be used (expired, already taken, paused).
export default function AssessmentStatusCard({
  visual,
  title,
  description,
  facts,
  actions,
}: AssessmentStatusCardProps) {
  return (
    <AssessmentCard className="flex flex-col items-center gap-7 py-10 text-center lg:py-16">
      {visual}
      <div className="flex max-w-187 flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground sm:text-[28px] sm:leading-9">
          {title}
        </h1>
        <p
          suppressHydrationWarning
          className="text-base leading-5 text-muted-foreground"
        >
          {description}
        </p>
      </div>
      {facts ? (
        <div className="grid w-full gap-4 sm:auto-cols-fr sm:grid-flow-col">
          {facts}
        </div>
      ) : null}
      <div className="flex w-full flex-col-reverse justify-center gap-4 sm:w-auto sm:flex-row">
        {actions}
      </div>
    </AssessmentCard>
  );
}
