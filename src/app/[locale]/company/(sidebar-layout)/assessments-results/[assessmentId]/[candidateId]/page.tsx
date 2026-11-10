import CandidateAssessmentPage from '@/features/company-assessments/components/results/CandidateAssessmentPage';

type PageProps = {
  params: Promise<{ assessmentId: string; candidateId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { assessmentId, candidateId } = await params;
  return (
    <CandidateAssessmentPage
      assessmentId={assessmentId}
      candidateId={candidateId}
    />
  );
}
