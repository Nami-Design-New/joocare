import AssessmentResultDetailsPage from '@/features/company-assessments/components/results/AssessmentResultDetailsPage';

type PageProps = {
  params: Promise<{ assessmentId: string; resultId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { assessmentId, resultId } = await params;
  return (
    <AssessmentResultDetailsPage
      key={resultId}
      assessmentId={assessmentId}
      resultId={resultId}
    />
  );
}
