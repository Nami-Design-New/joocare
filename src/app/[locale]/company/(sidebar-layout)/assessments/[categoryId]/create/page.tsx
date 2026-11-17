import CreateAssessmentPage from '@/features/company-assessments/components/create/CreateAssessmentPage';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ assessmentId?: string }>;
}) {
  const [{ categoryId }, { assessmentId }] = await Promise.all([
    params,
    searchParams,
  ]);

  // Keyed by category only: the builder adds `?assessmentId=` after step 1
  // and must keep its state when that happens.
  return (
    <CreateAssessmentPage
      key={categoryId}
      categoryId={categoryId}
      assessmentId={assessmentId}
    />
  );
}
