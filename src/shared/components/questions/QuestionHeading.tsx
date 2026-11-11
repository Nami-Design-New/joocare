import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

type QuestionHeadingProps = {
  /** Question number shown in the badge ("1", "Q5"). */
  badge: string;
  title: ReactNode;
  id?: string;
  /** Small note after the title, e.g. "(Optional)". */
  note?: string;
  className?: string;
  titleClassName?: string;
};

// Numbered badge + question text (screening questions and assessments).
export default function QuestionHeading({
  badge,
  title,
  id,
  note,
  className,
  titleClassName,
}: QuestionHeadingProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-assessment-primary/4 text-sm font-semibold text-assessment-primary">
        {badge}
      </span>
      <p
        id={id}
        className={cn(
          'text-base leading-5 font-semibold text-foreground',
          titleClassName,
        )}
      >
        <bdi>{title}</bdi>
        {note ? (
          <span className="ms-1.5 text-sm font-normal text-muted-foreground">
            {note}
          </span>
        ) : null}
      </p>
    </div>
  );
}
