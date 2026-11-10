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
        className="bg-card shadow-foreground/5 flex w-fit shrink-0 gap-3 rounded-full p-2 shadow-lg"
      >
        {(['saved', 'applied'] as const).map((item) => (
          <Link
            key={item}
            href={`/candidate/applications?tab=${item}`}
            scroll={false}
            aria-current={item === tab ? 'page' : undefined}
            className={cn(
              'focus-visible:ring-ring rounded-full px-4 py-2 text-base leading-5.75 sm:px-5 sm:py-2.5 sm:text-lg transition-colors focus-visible:ring-2',
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
