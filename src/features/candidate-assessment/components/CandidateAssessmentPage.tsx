'use client';

import { useCandidateAssessment } from '../hooks/useCandidateAssessment';
import AssessmentLeaveModal from '@/features/company-assessments/components/create/AssessmentLeaveModal';
import { useAssessmentLeaveGuard } from '@/features/company-assessments/hooks/useAssessmentLeaveGuard';
import { CANDIDATE_ASSESSMENT_ROUTES } from '../constants';
import type { CandidateAssessment } from '../types/candidate-assessment.types';
import AssessmentSubmittedModal from './AssessmentSubmittedModal';
import AssessmentIntro from './intro/AssessmentIntro';
import AssessmentQuestionScreen from './questions/AssessmentQuestionScreen';
import AssessmentExpired from './status/AssessmentExpired';
import AssessmentTaken from './status/AssessmentTaken';
import AssessmentUnavailable from './status/AssessmentUnavailable';

type CandidateAssessmentPageProps = {
  assessment: CandidateAssessment;
};

// Candidate's assessment page (72h link validity, time limit, yes/no, single and multi-select questions).
export default function CandidateAssessmentPage({
  assessment,
}: CandidateAssessmentPageProps) {
  const attempt = useCandidateAssessment(assessment);
  const leave = useAssessmentLeaveGuard(
    attempt.hasStarted && !attempt.submission && assessment.state === 'available',
    CANDIDATE_ASSESSMENT_ROUTES.appliedJobs,
    true,
  );

  const renderContent = () => {
    if (assessment.state === 'expired')
      return <AssessmentExpired assessment={assessment} />;
    if (assessment.state === 'unavailable') {
      return <AssessmentUnavailable assessment={assessment} />;
    }
    if (attempt.submission) {
      return (
        <AssessmentTaken
          assessment={assessment}
          submission={attempt.submission}
        />
      );
    }
    if (
      !attempt.hasStarted ||
      !attempt.question ||
      attempt.remainingSeconds === null
    ) {
      return (
        <AssessmentIntro assessment={assessment} onStart={attempt.start} />
      );
    }
    return (
      <AssessmentQuestionScreen
        question={attempt.question}
        questionNumber={attempt.questionNumber}
        total={attempt.total}
        progress={attempt.progress}
        remainingSeconds={attempt.remainingSeconds}
        selectedOptionIds={attempt.selectedOptionIds}
        isLastQuestion={attempt.isLastQuestion}
        onToggleOption={attempt.toggleOption}
        onNext={attempt.next}
      />
    );
  };

  return (
    <>
      {renderContent()}
      <AssessmentLeaveModal
        open={leave.leaveOpen}
        onOpenChange={leave.setLeaveOpen}
        onConfirm={leave.confirmLeave}
        translationNamespace="candidatePage.assessment.leave"
      />
      <AssessmentSubmittedModal
        open={attempt.isSubmittedModalOpen}
        onOpenChange={attempt.setSubmittedModalOpen}
        company={assessment.sentBy}
      />
    </>
  );
}
