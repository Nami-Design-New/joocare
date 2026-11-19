'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import AlertModal from '@/shared/components/modals/AlertModal';
import AssessmentLeaveModal from '@/features/company-assessments/components/create/AssessmentLeaveModal';
import { useAssessmentLeaveGuard } from '@/features/company-assessments/hooks/useAssessmentLeaveGuard';
import type { AssessmentDetails } from '../types/assessment-api.types';
import { useCandidateAssessment } from '../hooks/useCandidateAssessment';
import { CANDIDATE_ASSESSMENT_ROUTES } from '../constants';
import { mapAssessmentQuestion } from '../utils/assessment-question-mapper';
import AssessmentSubmittedModal from './AssessmentSubmittedModal';
import AssessmentIntro from './intro/AssessmentIntro';
import AssessmentQuestionScreen from './questions/AssessmentQuestionScreen';
import AssessmentExpired from './status/AssessmentExpired';
import AssessmentTaken from './status/AssessmentTaken';
import AssessmentUnavailable from './status/AssessmentUnavailable';

type CandidateAssessmentContentProps = { details: AssessmentDetails };

export default function CandidateAssessmentContent({
  details,
}: CandidateAssessmentContentProps) {
  const t = useTranslations('candidatePage.assessment.api');
  const unavailableText = useTranslations(
    'candidatePage.assessment.status.unavailable',
  );
  const attempt = useCandidateAssessment(String(details.assessment.id));
  const [unavailableOpen, setUnavailableOpen] = useState(true);
  const submitted = Boolean(
    attempt.attempt?.is_submitted || details.is_taken_before,
  );
  const unavailable = details.is_paused || !details.assessment.is_active;
  const leave = useAssessmentLeaveGuard(
    Boolean(attempt.attempt) && !submitted,
    CANDIDATE_ASSESSMENT_ROUTES.appliedJobs,
    true,
  );
  const question = attempt.question;
  const progress = attempt.attempt?.progress ??
    details.progress ?? { answered: 0, total: 0 };

  return (
    <>
      {submitted ? (
        <AssessmentTaken assessment={details} />
      ) : details.is_expired ? (
        <AssessmentExpired assessment={details} />
      ) : unavailable ? (
        <AssessmentUnavailable />
      ) : question ? (
        <>
          <AssessmentQuestionScreen
            question={mapAssessmentQuestion(question)}
            questionNumber={progress.answered + 1}
            total={progress.total}
            progress={Math.round((progress.answered / progress.total) * 100)}
            remainingSeconds={null}
            timeLimitMinutes={details.assessment.time_limit}
            selectedOptionIds={attempt.selectedIds.map(String)}
            isLastQuestion={Boolean(attempt.attempt?.is_last_question)}
            onToggleOption={attempt.toggleOption}
            onNext={() => void attempt.next()}
            isPending={attempt.isPending}
            attachments={question.has_file ? question.files : []}
          />
          {attempt.hasError ? (
            <Button
              variant="outline"
              disabled={attempt.isPending}
              onClick={() => void attempt.start()}
            >
              {t('recover')}
            </Button>
          ) : null}
        </>
      ) : (
        <AssessmentIntro
          assessment={details}
          isPending={attempt.isPending}
          onStart={() => void attempt.start()}
        />
      )}
      <AssessmentLeaveModal
        open={leave.leaveOpen}
        onOpenChange={leave.setLeaveOpen}
        onConfirm={leave.confirmLeave}
        translationNamespace="candidatePage.assessment.leave"
      />
      <AssessmentSubmittedModal
        open={attempt.submittedModalOpen}
        onOpenChange={attempt.setSubmittedModalOpen}
      />
      <AlertModal
        open={
          unavailable && !submitted && !details.is_expired && unavailableOpen
        }
        onOpenChange={setUnavailableOpen}
        title={unavailableText('title')}
        description={t('unavailable-description')}
        className="max-w-[700px] rounded-3xl"
        visual={
          <Image
            src="/assets/candidate-assessment/figma/paused.png"
            alt=""
            width={200}
            height={200}
          />
        }
        confirmLabel={unavailableText('close')}
        hasCancelButton={false}
        onConfirm={() => setUnavailableOpen(false)}
      />
    </>
  );
}
