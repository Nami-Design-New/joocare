import { useTranslations } from 'next-intl';
import { ASSESSMENT_LINK_VALIDITY_HOURS } from '../../constants';
import type { AssessmentDetails } from '../../types/assessment-api.types';
import AssessmentFactCard from '../AssessmentFactCard';
import AssessmentStatusCard from './AssessmentStatusCard';
import AssessmentStatusIcon from './AssessmentStatusIcon';
import AssessmentStatusLinks from './AssessmentStatusLinks';

type AssessmentExpiredProps = {
  assessment: AssessmentDetails;
};

// The 72-hour link window is over.
export default function AssessmentExpired({
  assessment,
}: AssessmentExpiredProps) {
  const t = useTranslations('candidatePage.assessment.status.expired');

  return (
    <AssessmentStatusCard
      visual={<AssessmentStatusIcon tone="warning" />}
      title={t('title')}
      description={t.rich('description', {
        hours: ASSESSMENT_LINK_VALIDITY_HOURS,
        title: () => <bdi>{assessment.assessment.name}</bdi>,
      })}
      facts={
        <>
          {assessment.invited_at ? (
            <AssessmentFactCard
              label={t('sent-on')}
              value={assessment.invited_at}
            />
          ) : null}
          {assessment.expires_at ? (
            <AssessmentFactCard
              label={t('expired-on')}
              value={assessment.expires_at}
            />
          ) : null}
        </>
      }
      actions={<AssessmentStatusLinks />}
    />
  );
}
