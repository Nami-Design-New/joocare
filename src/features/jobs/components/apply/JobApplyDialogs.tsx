'use client';

import LoginAlertModal from '@/shared/components/modals/LoginAlertModal';
import type { JobApplyFlow } from '../../hooks/useJobApplyFlow';
import ApplyNowModal from './ApplyNowModal';
import ApplySubmittedModal from './ApplySubmittedModal';
import ApplyWithQuestionsModal from './ApplyWithQuestionsModal';

type JobApplyDialogsProps = {
  flow: JobApplyFlow;
  jobId: number;
  jobTitle: string;
};

// Every dialog of the apply flow; each one mounts only while open so its state starts fresh.
export default function JobApplyDialogs({
  flow,
  jobId,
  jobTitle,
}: JobApplyDialogsProps) {
  const { dialog, questions, submission, closeDialog, handleApplied } = flow;

  return (
    <>
      <LoginAlertModal
        open={dialog === 'login'}
        onOpenChange={(open) => !open && closeDialog()}
      />

      {dialog === 'apply' && questions.length ? (
        <ApplyWithQuestionsModal
          jobId={jobId}
          jobTitle={jobTitle}
          questions={questions}
          onClose={closeDialog}
          onApplied={handleApplied}
        />
      ) : null}

      {dialog === 'apply' && !questions.length ? (
        <ApplyNowModal
          jobId={jobId}
          onClose={closeDialog}
          onApplied={handleApplied}
        />
      ) : null}

      {dialog === 'submitted' && submission ? (
        <ApplySubmittedModal
          submission={submission}
          candidateEmail={flow.candidateEmail}
          onClose={closeDialog}
        />
      ) : null}
    </>
  );
}
