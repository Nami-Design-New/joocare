import CandidateAssessmentPage from '@/features/candidate-assessment/components/CandidateAssessmentPage';
import { CANDIDATE_ASSESSMENT_STATES } from '@/features/candidate-assessment/constants';
import { getCandidateAssessmentPreview } from '@/features/candidate-assessment/constants/candidate-assessment-preview-data';
import type { CandidateAssessmentState } from '@/features/candidate-assessment/types/candidate-assessment.types';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ state?: string }>;
};

function isAssessmentState(
  value: string | undefined,
): value is CandidateAssessmentState {
  return CANDIDATE_ASSESSMENT_STATES.some((state) => state === value);
}

// Candidate assessment (login required: under /candidate). Design only: preview data until the
// assessment API is ready (`?state=expired|taken|unavailable` shows the other link states).
export default async function Page({ params, searchParams }: PageProps) {
  const [{ id }, { state }] = await Promise.all([params, searchParams]);
  const assessment = getCandidateAssessmentPreview(
    id,
    isAssessmentState(state) ? state : 'available',
  );

  return (
    <CandidateAssessmentPage key={assessment.state} assessment={assessment} />
  );
}
