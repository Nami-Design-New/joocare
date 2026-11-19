import CandidateAssessmentPage from '@/features/candidate-assessment/components/CandidateAssessmentPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CandidateAssessmentPage key={id} assessmentId={id} />;
}
