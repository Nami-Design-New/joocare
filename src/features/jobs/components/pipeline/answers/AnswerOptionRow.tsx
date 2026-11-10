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
          'bg-destructive/8 border-destructive/45 text-destructive font-medium',
        isCorrect &&
          (isSelected
            ? 'bg-assessment-primary/8 border-assessment-primary/45 text-assessment-primary font-medium'
            : 'bg-assessment-primary/4 border-assessment-primary/45 text-assessment-primary font-medium'),
        !isSelected && !isCorrect && 'bg-card border-border text-foreground',
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
        <span className="bg-assessment-primary/12 text-assessment-primary rounded-full px-2 py-0.5 text-xs font-semibold">
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
        'bg-card flex size-4.5 shrink-0 items-center justify-center rounded-full border',
        isSelected ? border : 'border-foreground/30',
      )}
    >
      {isSelected ? <span className={cn(fill, 'size-2 rounded-full')} /> : null}
    </span>
  );
}
