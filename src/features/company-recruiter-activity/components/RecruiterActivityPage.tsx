'use client';

import { useLocale, useTranslations } from 'next-intl';
import CountPageHeader from '@/shared/components/common/CountPageHeader';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { ALL_RECRUITERS_VALUE } from '../constants/recruiter-activity-preview-data';
import { useRecruiterActivity } from '../hooks/useRecruiterActivity';
import RecruiterActivityTable from './RecruiterActivityTable';

export default function RecruiterActivityPage() {
  const t = useTranslations('companyPage.recruiter-activity');
  const direction = useLocale() === 'ar' ? 'rtl' : 'ltr';
  const activity = useRecruiterActivity();
  const recruiterOptions = [
    { value: ALL_RECRUITERS_VALUE, label: t('all-recruiters') },
    ...activity.recruiterOptions.map((recruiter) => ({
      value: recruiter.id,
      label: recruiter.name,
    })),
  ];

  return (
    <div className="flex w-full flex-col gap-6 md:gap-11">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CountPageHeader
          count={activity.totalRecruiters}
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
            className="border-border bg-card h-13"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <section className="bg-card rounded-2xl p-4">
          {activity.recruiters.length ? (
            <RecruiterActivityTable
              recruiters={activity.recruiters}
              direction={direction}
            />
          ) : (
            <EmptyDataState
              title={t('empty-title')}
              description={t('empty-description')}
            />
          )}
        </section>

        {activity.filteredCount > 0 && (
          <CustomPagination
            totalItems={activity.filteredCount}
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
