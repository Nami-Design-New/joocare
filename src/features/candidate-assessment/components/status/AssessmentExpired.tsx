import { Clock3 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { ASSESSMENT_LINK_VALIDITY_HOURS } from '../../constants';
import type { CandidateAssessment } from '../../types/candidate-assessment.types';
import { formatAssessmentDateTime } from '../../utils/assessment-format';
import AssessmentFactCard from '../AssessmentFactCard';
import AssessmentStatusCard from './AssessmentStatusCard';
import AssessmentStatusIcon from './AssessmentStatusIcon';
import AssessmentStatusLinks from './AssessmentStatusLinks';

type AssessmentExpiredProps = {
  assessment: CandidateAssessment;
};

// The 72-hour link window is over.
export default function AssessmentExpired({
  assessment,
}: AssessmentExpiredProps) {
  const t = useTranslations('candidatePage.assessment.status.expired');
  const locale = useLocale();

  return (
    <AssessmentStatusCard
      visual={<AssessmentStatusIcon icon={Clock3} tone="warning" />}
      title={t('title')}
      description={t.rich('description', {
        hours: ASSESSMENT_LINK_VALIDITY_HOURS,
        title: () => <bdi>{assessment.title}</bdi>,
      })}
      facts={
        <>
          <AssessmentFactCard
            label={t('sent-on')}
            value={formatAssessmentDateTime(assessment.sentAt, locale)}
          />
          <AssessmentFactCard
            label={t('expired-on')}
            value={formatAssessmentDateTime(assessment.expiresAt, locale)}
          />
        </>
      }
      actions={<AssessmentStatusLinks />}
    />
  );
}
