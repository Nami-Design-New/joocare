import { getApplications } from '../../services/applications-service';
import { getAllSavedJobs } from '../../services/saved-jobs-service';
import type { CandidateApplicationsPageProps } from '../../types/candidate-applications.types';
import ApplicationsToolbar from './ApplicationsToolbar';
import CandidateApplicationsList from './CandidateApplicationsList';
import SavedJobsList from './SavedJobsList';

// Candidate "Job Applications": Saved and Applied tabs.
export default async function CandidateJobApplicationsPage({
  locale,
  tab,
  page,
  search,
}: CandidateApplicationsPageProps) {
  return (
    <div className="space-y-6">
      <ApplicationsToolbar tab={tab} search={search} />
      {tab === 'saved' ? (
        <SavedJobsList jobs={await getAllSavedJobs(locale)} />
      ) : (
        <AppliedJobs locale={locale} page={page} search={search} />
      )}
    </div>
  );
}

async function AppliedJobs({
  locale,
  page,
  search,
}: Omit<CandidateApplicationsPageProps, 'tab'>) {
  const applications = await getApplications(page, locale, search);
  return (
    <CandidateApplicationsList
      applications={applications.data}
      currentPage={applications.current_page}
      totalItems={applications.total}
      pageSize={applications.per_page}
      locale={locale}
      search={search}
    />
  );
}
