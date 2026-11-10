import { useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { Button } from '@/shared/components/ui/button';
import type { JobMatch } from '../types/ai-job-match.types';
import AiJobMatchHeader from './AiJobMatchHeader';
import JobMatchCard from './JobMatchCard';
import MatchLevelLegend from './MatchLevelLegend';

type JobMatchResultsProps = {
  matches: JobMatch[];
  totalMatches: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEditPreferences: () => void;
};

export default function JobMatchResults({
  matches,
  totalMatches,
  page,
  pageSize,
  onPageChange,
  onEditPreferences,
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

      {matches.length === 0 ? (
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

      {totalMatches > pageSize && (
        <CustomPagination
          currentPage={page}
          totalItems={totalMatches}
          pageSize={pageSize}
          onPageChange={onPageChange}
          align="start"
          statusPosition="start"
        />
      )}
    </div>
  );
}
