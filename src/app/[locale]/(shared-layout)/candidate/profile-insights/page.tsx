import ProfileInsightsPage from '@/features/candidate-profile-insights/components/ProfileInsightsPage';

type PageProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const query = await searchParams;
  const page = Number(query.page);

  return (
    <ProfileInsightsPage
      search={query.search?.trim() ?? ''}
      page={Number.isInteger(page) && page > 0 ? page : 1}
    />
  );
}
