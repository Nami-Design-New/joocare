import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

type AssessmentCardProps = {
  children: ReactNode;
  className?: string;
};

// White bordered surface used by every assessment screen.
export default function AssessmentCard({
  children,
  className,
}: AssessmentCardProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-border bg-card p-5 sm:p-8 lg:p-10',
        className,
      )}
    >
      {children}
    </section>
  );
}
