import CreateAssessmentPage from '@/features/company-assessments/components/create/CreateAssessmentPage';

export default async function Page({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  return <CreateAssessmentPage key={categoryId} categoryId={categoryId} />;
}
