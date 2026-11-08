import { CircleCheckBig } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type {
  CandidateAssessment,
  CandidateAssessmentSubmission,
} from '../../types/candidate-assessment.types';
import {
  formatAssessmentDateTime,
  splitDuration,
} from '../../utils/assessment-format';
import AssessmentFactCard from '../AssessmentFactCard';
import AssessmentStatusCard from './AssessmentStatusCard';
import AssessmentStatusIcon from './AssessmentStatusIcon';
import AssessmentStatusLinks from './AssessmentStatusLinks';

type AssessmentTakenProps = {
  assessment: CandidateAssessment;
  submission: CandidateAssessmentSubmission;
};

// Each assessment can be taken once; shows when it was submitted.
export default function AssessmentTaken({
  assessment,
  submission,
}: AssessmentTakenProps) {
  const t = useTranslations('candidatePage.assessment.status.taken');
  const locale = useLocale();
  const submittedAt = formatAssessmentDateTime(submission.submittedAt, locale);

  return (
    <AssessmentStatusCard
      visual={<AssessmentStatusIcon icon={CircleCheckBig} tone="success" />}
      title={t('title')}
      description={t.rich('description', {
        date: submittedAt,
        title: () => <bdi>{assessment.title}</bdi>,
        company: () => <bdi>{assessment.sentBy}</bdi>,
      })}
      facts={
        <>
          <AssessmentFactCard label={t('submitted-on')} value={submittedAt} />
          <AssessmentFactCard
            label={t('time-taken')}
            value={t('duration', splitDuration(submission.durationSeconds))}
          />
          <AssessmentFactCard label={t('status')} value={t('under-review')} />
        </>
      }
      actions={<AssessmentStatusLinks />}
    />
  );
}
