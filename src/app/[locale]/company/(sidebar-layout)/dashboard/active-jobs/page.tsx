import DashboardActiveJobsPage from '@/features/company-dashboard/components/DashboardActiveJobsPage';

type ActiveJobsPageProps = { searchParams: Promise<{ preview?: string }> };

export default async function ActiveJobsPage({
  searchParams,
}: ActiveJobsPageProps) {
  const { preview } = await searchParams;
  return <DashboardActiveJobsPage designPreview={preview === 'design'} />;
}
