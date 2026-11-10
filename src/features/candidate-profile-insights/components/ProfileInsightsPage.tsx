import { useTranslations } from 'next-intl';
import EmptyDataState from '@/shared/components/EmptyDataState';
import type { ProfileInsightsQuery } from '../types/profile-insights.types';
import { getProfileViewers } from '../utils/profile-viewers';
import ProfileViewerCard from './ProfileViewerCard';
import ProfileViewersPagination from './ProfileViewersPagination';
import ProfileViewersSearch from './ProfileViewersSearch';

// "Who viewed your profile?": company search, visitor cards and pagination.
export default function ProfileInsightsPage({
  search,
  page,
}: ProfileInsightsQuery) {
  const t = useTranslations('candidatePage.profileInsights');
  const result = getProfileViewers({ search, page });

  return (
    <div className="flex flex-col gap-6">
      <ProfileViewersSearch key={search} search={search} />

      {result.viewers.length ? (
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-3">
            {result.viewers.map((viewer) => (
              <ProfileViewerCard key={viewer.id} viewer={viewer} />
            ))}
          </ul>
          <ProfileViewersPagination
            search={search}
            currentPage={result.page}
            totalItems={result.total}
            pageSize={result.pageSize}
          />
        </div>
      ) : (
        <EmptyDataState
          titleText={search ? t('no-results-title') : t('empty-title')}
          description={
            search
              ? t('no-results-description', { search })
              : t('empty-description')
          }
        />
      )}
    </div>
  );
}
