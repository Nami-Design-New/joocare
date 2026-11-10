import CompanyDashboardPage from '@/features/company-dashboard/components/CompanyDashboardPage';

type DashboardPageProps = { searchParams: Promise<{ preview?: string }> };

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { preview } = await searchParams;
  return <CompanyDashboardPage designPreview={preview === 'design'} />;
}
