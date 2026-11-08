'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import EmptyDataState from '@/shared/components/EmptyDataState';
import type { JobListItem } from '../../types/jobs.types';
import ApplicationJobCard from './ApplicationJobCard';
import ApplicationsPagination from './ApplicationsPagination';

type SavedJobsListProps = { jobs: JobListItem[] };

export default function SavedJobsList({ jobs }: SavedJobsListProps) {
  const t = useTranslations('candidatePage.applications');
  // Unsaved jobs leave the list right away.
  const [removedJobIds, setRemovedJobIds] = useState<number[]>([]);
  const visibleJobs = jobs.filter((job) => !removedJobIds.includes(job.id));

  return (
    <>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {visibleJobs.length ? (
          visibleJobs.map((job) => (
            <ApplicationJobCard
              key={job.id}
              job={job}
              onSavedChange={(saved) => {
                if (!saved) setRemovedJobIds((ids) => [...ids, job.id]);
              }}
            />
          ))
        ) : (
          <EmptyDataState
            titleText={t('no-saved')}
            description={t('no-saved-description')}
            className="col-span-full min-h-64"
          />
        )}
      </section>
      {/* Design only: every saved job loads on one page. */}
      <ApplicationsPagination
        currentPage={1}
        totalItems={visibleJobs.length}
        pageSize={Math.max(1, visibleJobs.length)}
        getHref={() => '/candidate/applications?tab=saved'}
      />
    </>
  );
}
