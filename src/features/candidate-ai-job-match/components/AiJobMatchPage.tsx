'use client';

import { useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useAiJobMatch } from '../hooks/useAiJobMatch';
import AiJobMatchEmptyState from './AiJobMatchEmptyState';
import JobMatchResults from './JobMatchResults';
import JobPreferencesModal from './preferences/JobPreferencesModal';

export default function AiJobMatchPage() {
  const t = useTranslations('candidatePage.aiJobMatch');
  const match = useAiJobMatch();

  return (
    <section className="rounded-2xl bg-card p-4 shadow-card md:p-8">
      {match.isLoading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-full max-w-xl" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : match.isError ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-muted-foreground">
            {t('preferences-load-failed')}
          </p>
          <Button size="pill" onClick={match.retry}>
            {t('retry')}
          </Button>
        </div>
      ) : match.hasPreferences ? (
        <div className="flex flex-col gap-6">
          <JobMatchResults
            matches={match.matches}
            onEditPreferences={match.openPreferences}
            isLoading={match.isMatchesLoading}
            isError={match.isMatchesError}
            onRetry={match.retryMatches}
          />
          {!match.isMatchesLoading &&
            !match.isMatchesError &&
            match.matchesPageSize > 0 &&
            match.totalMatches > match.matchesPageSize && (
              <CustomPagination
                currentPage={match.matchesPage}
                totalItems={match.totalMatches}
                pageSize={match.matchesPageSize}
                onPageChange={match.setPage}
                align="start"
                statusPosition="start"
              />
            )}
        </div>
      ) : (
        <AiJobMatchEmptyState onSetPreferences={match.openPreferences} />
      )}
      <JobPreferencesModal
        open={match.preferencesOpen}
        mode={match.mode}
        preferences={match.preferences}
        onOpenChange={match.setPreferencesOpen}
        onSave={match.savePreferences}
        isSaving={match.isSaving}
      />
    </section>
  );
}
