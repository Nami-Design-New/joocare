import CandidateJobApplicationsPage from '@/features/jobs/components/candidate/CandidateJobApplicationsPage';

type CandidateApplicationsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    tab?: string;
    page?: string;
    search?: string;
  }>;
};

export default async function CandidateApplicationsPage({
  params,
  searchParams,
}: CandidateApplicationsPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const page = Number(query.page);
  return (
    <CandidateJobApplicationsPage
      locale={locale}
      tab={query.tab === 'saved' ? 'saved' : 'applied'}
      page={Number.isInteger(page) && page > 0 ? page : 1}
      search={query.search?.trim() ?? ''}
    />
  );
}
