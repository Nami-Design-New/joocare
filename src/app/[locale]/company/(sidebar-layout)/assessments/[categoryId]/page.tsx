import CategoryAssessmentsPage from '@/features/company-assessments/components/assessments/CategoryAssessmentsPage';

export default async function Page({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  return <CategoryAssessmentsPage key={categoryId} categoryId={categoryId} />;
}
