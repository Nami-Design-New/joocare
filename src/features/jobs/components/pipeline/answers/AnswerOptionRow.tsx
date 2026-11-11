import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

type AnswerOptionRowProps = {
  text: string;
  isMulti: boolean;
  isSelected: boolean;
  isCorrect: boolean;
};

// One read-only option: green when it's the correct answer, red when the candidate picked a wrong one.
export default function AnswerOptionRow({
  text,
  isMulti,
  isSelected,
  isCorrect,
}: AnswerOptionRowProps) {
  const t = useTranslations('companyPage.candidates.answers');
  const isWrongPick = isSelected && !isCorrect;
  const pillTone = isWrongPick
    ? 'bg-destructive/12 text-destructive'
    : 'bg-assessment-primary/12 text-assessment-primary';

  return (
    <li
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3 text-sm',
        isWrongPick &&
          'border-destructive/45 bg-destructive/8 font-medium text-destructive',
        isCorrect &&
          (isSelected
            ? 'border-assessment-primary/45 bg-assessment-primary/8 font-medium text-assessment-primary'
            : 'border-assessment-primary/45 bg-assessment-primary/4 font-medium text-assessment-primary'),
        !isSelected && !isCorrect && 'border-border bg-card text-foreground',
      )}
    >
      <AnswerIndicator
        isMulti={isMulti}
        isSelected={isSelected}
        isWrong={isWrongPick}
      />
      <span className="min-w-0 flex-1">
        <bdi>{text}</bdi>
      </span>
      {isSelected ? (
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-semibold',
            pillTone,
          )}
        >
          {t('candidate-answer')}
        </span>
      ) : null}
      {isCorrect ? (
        <span className="rounded-full bg-assessment-primary/12 px-2 py-0.5 text-xs font-semibold text-assessment-primary">
          {t('correct-answer')}
        </span>
      ) : null}
    </li>
  );
}

function AnswerIndicator({
  isMulti,
  isSelected,
  isWrong,
}: {
  isMulti: boolean;
  isSelected: boolean;
  isWrong: boolean;
}) {
  const fill = isWrong ? 'bg-destructive' : 'bg-assessment-primary';
  const border = isWrong ? 'border-destructive' : 'border-assessment-primary';

  if (isMulti) {
    return (
      <span
        aria-hidden
        className={cn(
          'flex size-4.5 shrink-0 items-center justify-center rounded-[4px] border',
          isSelected
            ? cn(fill, border, 'text-primary-foreground')
            : 'border-foreground/30 bg-card',
        )}
      >
        {isSelected ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        'flex size-4.5 shrink-0 items-center justify-center rounded-full border bg-card',
        isSelected ? border : 'border-foreground/30',
      )}
    >
      {isSelected ? <span className={cn(fill, 'size-2 rounded-full')} /> : null}
    </span>
  );
}
