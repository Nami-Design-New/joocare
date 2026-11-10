import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

export type AnswerTone = 'brand' | 'neutral' | 'correct' | 'wrong' | 'missing';

const toneClassName: Record<AnswerTone, string> = {
  brand: 'bg-assessment-primary/8 text-assessment-primary',
  neutral: 'bg-foreground/6 text-foreground',
  correct: 'bg-assessment-primary/10 text-assessment-primary',
  wrong: 'bg-destructive/10 text-destructive',
  missing: 'bg-answer-missing/12 text-answer-missing',
};

// Small bold tag of the candidate answers review (question number, requirement, result, totals).
export default function AnswerTag({
  tone,
  children,
}: {
  tone: AnswerTone;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-md px-2.5 py-1 text-[13px] leading-4 font-bold',
        toneClassName[tone],
      )}
    >
      {children}
    </span>
  );
}
