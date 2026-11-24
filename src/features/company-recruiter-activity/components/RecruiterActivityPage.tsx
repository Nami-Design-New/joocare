'use client';

import { useLocale, useTranslations } from 'next-intl';
import CountPageHeader from '@/shared/components/common/CountPageHeader';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import RouteErrorFallback from '@/shared/components/RouteErrorFallback';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  ALL_RECRUITERS_VALUE,
  RECRUITER_ACTIVITY_SKELETON_ROWS,
} from '../constants';
import { useRecruiterActivity } from '../hooks/useRecruiterActivity';
import RecruiterActivityTable from './RecruiterActivityTable';

export default function RecruiterActivityPage() {
  const t = useTranslations('companyPage.recruiter-activity');
  const direction = useLocale() === 'ar' ? 'rtl' : 'ltr';
  const activity = useRecruiterActivity();
  const recruiterOptions = [
    { value: ALL_RECRUITERS_VALUE, label: t('all-recruiters') },
    ...activity.recruiterOptions.map((recruiter) => ({
      value: String(recruiter.id),
      label: recruiter.name,
    })),
  ];

  if (activity.isError) {
    return (
      <RouteErrorFallback
        error={activity.error ?? new Error(t('error-description'))}
        reset={activity.retry}
        title={t('error-title')}
        description={t('error-description')}
        retryLabel={t('retry')}
      />
    );
  }

  const renderTable = () => {
    if (activity.isLoading) {
      return (
        <div className="flex flex-col gap-2">
          {Array.from(
            { length: RECRUITER_ACTIVITY_SKELETON_ROWS },
            (_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ),
          )}
        </div>
      );
    }
    if (!activity.recruiters.length) {
      return (
        <EmptyDataState
          title="companyPage.recruiter-activity.empty-title"
          description={t('empty-description')}
        />
      );
    }
    return (
      <RecruiterActivityTable
        recruiters={activity.recruiters}
        direction={direction}
      />
    );
  };

  return (
    <div className="flex w-full flex-col gap-6 md:gap-11">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CountPageHeader
          count={activity.recruiterOptions.length || activity.total}
          title={t('title')}
          className="w-auto"
        />
        <div className="w-full md:w-80">
          <SelectInputField
            id="recruiter-activity-filter"
            aria-label={t('recruiter-filter')}
            options={recruiterOptions}
            value={activity.recruiter}
            onChange={activity.updateRecruiter}
            placeholder={t('recruiter-filter')}
            className="h-13 border-border bg-card"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <section className="rounded-2xl bg-card p-4">{renderTable()}</section>

        {activity.total > activity.pageSize && (
          <CustomPagination
            totalItems={activity.total}
            pageSize={activity.pageSize}
            currentPage={activity.page}
            onPageChange={activity.setPage}
            statusPosition="start"
            className="md:justify-start"
          />
        )}
      </div>
    </div>
  );
}
