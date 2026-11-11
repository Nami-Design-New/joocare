'use client';

import { useAiJobMatch } from '../hooks/useAiJobMatch';
import type { AiJobMatchScenario } from '../types/ai-job-match.types';
import AiJobMatchEmptyState from './AiJobMatchEmptyState';
import JobMatchResults from './JobMatchResults';
import JobPreferencesModal from './preferences/JobPreferencesModal';

type AiJobMatchPageProps = {
  scenario: AiJobMatchScenario;
};

export default function AiJobMatchPage({ scenario }: AiJobMatchPageProps) {
  const match = useAiJobMatch(scenario);

  return (
    <section className="rounded-2xl bg-card p-4 shadow-card md:p-8">
      {match.hasPreferences ? (
        <JobMatchResults
          matches={match.matches}
          totalMatches={match.totalMatches}
          page={match.page}
          pageSize={match.pageSize}
          onPageChange={match.setPage}
          onEditPreferences={match.openPreferences}
        />
      ) : (
        <AiJobMatchEmptyState onSetPreferences={match.openPreferences} />
      )}
      <JobPreferencesModal
        open={match.preferencesOpen}
        mode={match.mode}
        preferences={match.preferences}
        onOpenChange={match.setPreferencesOpen}
        onSave={match.savePreferences}
      />
    </section>
  );
}
