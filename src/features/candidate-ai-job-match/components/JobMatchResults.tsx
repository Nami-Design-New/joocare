import { useTranslations } from 'next-intl';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { JobMatch } from '../types/ai-job-match.types';
import AiJobMatchHeader from './AiJobMatchHeader';
import JobMatchCard from './JobMatchCard';
import MatchLevelLegend from './MatchLevelLegend';

type JobMatchResultsProps = {
  matches: JobMatch[];
  onEditPreferences: () => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export default function JobMatchResults({
  matches,
  onEditPreferences,
  isLoading,
  isError,
  onRetry,
}: JobMatchResultsProps) {
  const t = useTranslations('candidatePage.aiJobMatch');

  return (
    <div className="flex flex-col gap-6">
      <AiJobMatchHeader
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <Button size="pill" className="h-12" onClick={onEditPreferences}>
            {t('edit-preferences')}
          </Button>
        }
      />
      <MatchLevelLegend />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-muted-foreground">{t('matches-load-failed')}</p>
          <Button size="pill" onClick={onRetry}>
            {t('retry')}
          </Button>
        </div>
      ) : matches.length === 0 ? (
        <EmptyDataState
          titleText={t('no-matches-title')}
          description={t('no-matches-description')}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {matches.map((job) => (
            <li key={job.id}>
              <JobMatchCard job={job} />
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
