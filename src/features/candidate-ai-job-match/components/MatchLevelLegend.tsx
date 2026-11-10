import { useFormatter, useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { MATCH_LEVELS } from '../constants';
import { MATCH_LEVEL_STYLES } from '../constants/match-level-styles';

export default function MatchLevelLegend() {
  const t = useTranslations('candidatePage.aiJobMatch');
  const format = useFormatter();

  return (
    <div className="bg-muted/60 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl px-4 py-3 text-sm">
      <span className="text-secondary font-semibold">{t('match-level')}</span>
      <ul className="contents">
        {MATCH_LEVELS.map(({ level, min, max }) => (
          <li key={level} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={cn(
                'size-2.5 rounded-full',
                MATCH_LEVEL_STYLES[level].dot,
              )}
            />
            <span className="text-foreground">{t(`levels.${level}`)}</span>
            <span className="text-muted-foreground">
              {t('level-range', {
                min: format.number(min),
                max: format.number(max),
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
