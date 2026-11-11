import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import type { CandidateApplicationsTab } from '../../types/candidate-applications.types';
import ApplicationsSearch from './ApplicationsSearch';

type ApplicationsToolbarProps = {
  tab: CandidateApplicationsTab;
  search: string;
};

export default async function ApplicationsToolbar({
  tab,
  search,
}: ApplicationsToolbarProps) {
  const t = await getTranslations('candidatePage.applications');
  return (
    <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
      <nav
        aria-label={t('tabs-label')}
        className="flex w-fit shrink-0 gap-3 rounded-full bg-card p-2 shadow-lg shadow-foreground/5"
      >
        {(['saved', 'applied'] as const).map((item) => (
          <Link
            key={item}
            href={`/candidate/applications?tab=${item}`}
            scroll={false}
            aria-current={item === tab ? 'page' : undefined}
            className={cn(
              'rounded-full px-4 py-2 text-base leading-5.75 transition-colors focus-visible:ring-2 focus-visible:ring-ring sm:px-5 sm:py-2.5 sm:text-lg',
              item === tab
                ? 'bg-application-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t(item)}
          </Link>
        ))}
      </nav>
      {tab === 'applied' && <ApplicationsSearch search={search} />}
    </div>
  );
}
