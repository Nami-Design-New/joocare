import { useFormatter, useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { MATCH_LEVEL_STYLES } from '../constants/match-level-styles';
import { getMatchLevel } from '../utils/match-level';
import { SPARKLES_MASK_ICON } from '../constants/job-match-icons';

type MatchScoreBadgeProps = {
  score: number;
};

export default function MatchScoreBadge({ score }: MatchScoreBadgeProps) {
  const t = useTranslations('candidatePage.aiJobMatch');
  const format = useFormatter();
  const level = getMatchLevel(score);

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-xl p-1 text-sm leading-[18px] font-semibold',
        MATCH_LEVEL_STYLES[level].soft,
      )}
    >
      <span aria-hidden className={cn('size-4', SPARKLES_MASK_ICON)} />
      <span className="sr-only">{t('match-score')}</span>
      {format.number(score / 100, { style: 'percent' })}
    </span>
  );
}
