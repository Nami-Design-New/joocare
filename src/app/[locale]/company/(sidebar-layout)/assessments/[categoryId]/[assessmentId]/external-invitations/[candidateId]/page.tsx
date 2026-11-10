import CandidateAssessmentPage from '@/features/company-assessments/components/results/CandidateAssessmentPage';

type PageProps = {
  params: Promise<{
    categoryId: string;
    assessmentId: string;
    candidateId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { categoryId, assessmentId, candidateId } = await params;
  return (
    <CandidateAssessmentPage
      categoryId={categoryId}
      assessmentId={assessmentId}
      candidateId={candidateId}
    />
  );
}
