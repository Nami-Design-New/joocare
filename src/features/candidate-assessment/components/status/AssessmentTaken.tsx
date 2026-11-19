import { useTranslations } from 'next-intl';
import type { AssessmentDetails } from '../../types/assessment-api.types';
import { splitDuration } from '../../utils/assessment-format';
import AssessmentFactCard from '../AssessmentFactCard';
import AssessmentStatusCard from './AssessmentStatusCard';
import AssessmentStatusIcon from './AssessmentStatusIcon';
import AssessmentStatusLinks from './AssessmentStatusLinks';

type AssessmentTakenProps = {
  assessment: AssessmentDetails;
};

// Each assessment can be taken once; shows when it was submitted.
export default function AssessmentTaken({ assessment }: AssessmentTakenProps) {
  const t = useTranslations('candidatePage.assessment.status.taken');
  const api = useTranslations('candidatePage.assessment.api');

  return (
    <AssessmentStatusCard
      visual={<AssessmentStatusIcon tone="success" />}
      title={t('title')}
      description={api('taken-description', {
        title: assessment.assessment.name,
      })}
      facts={
        <>
          {assessment.submitted_at ? (
            <AssessmentFactCard
              label={t('submitted-on')}
              value={assessment.submitted_at}
            />
          ) : null}
          {assessment.time_taken_seconds != null ? (
            <AssessmentFactCard
              label={t('time-taken')}
              value={t(
                'duration',
                splitDuration(assessment.time_taken_seconds),
              )}
            />
          ) : null}
          <AssessmentFactCard
            label={t('status')}
            value={
              assessment.is_taken_before
                ? assessment.status_label
                : api('submitted')
            }
          />
          {assessment.score != null ? (
            <AssessmentFactCard
              label={api('score')}
              value={String(assessment.score)}
            />
          ) : null}
        </>
      }
      actions={<AssessmentStatusLinks />}
    />
  );
}
