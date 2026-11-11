import type { ReactNode } from 'react';

type AssessmentFactCardProps = {
  label: string;
  value: ReactNode;
};

// Grey label / value tile ("Time Limit · 45 Minutes", "Email sent on · 20 Sep 2026").
export default function AssessmentFactCard({
  label,
  value,
}: AssessmentFactCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-muted p-3 text-start">
      <span className="text-sm font-semibold text-muted-foreground">
        {label}
      </span>
      {/* Dates are formatted in the viewer's timezone, which can differ from the server's. */}
      <span
        suppressHydrationWarning
        className="text-lg leading-6 font-semibold text-foreground"
      >
        {value}
      </span>
    </div>
  );
}
