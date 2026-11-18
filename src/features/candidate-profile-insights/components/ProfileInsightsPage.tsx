'use client';

import { useTranslations } from 'next-intl';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import useGetProfileVisits from '../hooks/useGetProfileVisits';
import type { ProfileInsightsQuery } from '../types/profile-insights.types';
import ProfileViewerCard from './ProfileViewerCard';
import ProfileViewersPagination from './ProfileViewersPagination';
import ProfileViewersSearch from './ProfileViewersSearch';

// "Who viewed your profile?": company search, visitor cards and pagination.
export default function ProfileInsightsPage({
  search,
  page,
}: ProfileInsightsQuery) {
  const t = useTranslations('candidatePage.profileInsights');
  const { data, isError, isPending, refetch } = useGetProfileVisits({
    page,
    search,
  });

  return (
    <div className="flex flex-col gap-6">
      <ProfileViewersSearch key={search} search={search} />

      {isError ? (
        <div
          role="alert"
          className="flex flex-col items-start gap-3 rounded-2xl bg-card px-6 py-5"
        >
          <p className="text-sm text-destructive">{t('load-error')}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
          >
            {t('retry')}
          </Button>
        </div>
      ) : isPending || !data ? (
        <div aria-busy="true" className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : data.viewers.length ? (
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-3">
            {data.viewers.map((viewer) => (
              <ProfileViewerCard key={viewer.id} viewer={viewer} />
            ))}
          </ul>
          {data.total > data.pageSize ? (
            <ProfileViewersPagination
              search={search}
              currentPage={data.page}
              totalItems={data.total}
              pageSize={data.pageSize}
            />
          ) : null}
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
