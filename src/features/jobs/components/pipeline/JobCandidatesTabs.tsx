import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { JOB_CANDIDATES_TABS } from '../../constants';
import type { JobCandidatesTab } from '../../types/job-candidates.types';
import { getAiTalentMatchHref, getJobCandidatesHref } from '../../utils';

type JobCandidatesTabsProps = {
  jobId: number;
  activeTab: JobCandidatesTab;
};

export default function JobCandidatesTabs({
  jobId,
  activeTab,
}: JobCandidatesTabsProps) {
  const t = useTranslations('companyPage.candidates.tabs');
  const hrefs: Record<JobCandidatesTab, string> = {
    pipeline: getJobCandidatesHref(jobId),
    'ai-match': getAiTalentMatchHref(jobId),
  };

  return (
    <nav
      aria-label={t('label')}
      className="bg-card grid grid-cols-2 gap-2 rounded-full p-2 shadow-xs"
    >
      {JOB_CANDIDATES_TABS.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <Link
            key={tab}
            href={hrefs[tab]}
            replace
            scroll={false}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'rounded-full px-2 py-2.5 text-center text-sm transition-colors sm:px-4 sm:py-3 sm:text-base md:text-lg',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t(tab)}
          </Link>
        );
      })}
    </nav>
  );
}
