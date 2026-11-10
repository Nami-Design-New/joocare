import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { CANDIDATE_ASSESSMENT_ROUTES } from '../../constants';

// "Browse Jobs" + "Go to Applied Jobs" actions of the expired / taken states.
export default function AssessmentStatusLinks() {
  const t = useTranslations('candidatePage.assessment.status');

  return (
    <>
      <Button
        asChild
        variant="outline"
        size="pill"
        className="border-assessment-primary text-assessment-primary hover:text-assessment-primary h-12.5 px-8"
      >
        <Link href={CANDIDATE_ASSESSMENT_ROUTES.jobs}>{t('browse-jobs')}</Link>
      </Button>
      <Button
        asChild
        size="pill"
        className="bg-assessment-primary hover:bg-assessment-primary/90 gap-3"
      >
        <Link href={CANDIDATE_ASSESSMENT_ROUTES.appliedJobs}>
          {t('go-to-applied-jobs')}
          <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
        </Link>
      </Button>
    </>
  );
}
