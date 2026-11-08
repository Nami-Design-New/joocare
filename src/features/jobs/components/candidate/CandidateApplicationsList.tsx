'use client';

import { useTranslations } from 'next-intl';
import EmptyDataState from '@/shared/components/EmptyDataState';
import type { CandidateApplicationItem } from '../../types/jobs.types';
import { buildCandidateApplicationsPagePath } from '../../utils';
import ApplicationJobCard from './ApplicationJobCard';
import ApplicationsPagination from './ApplicationsPagination';

type CandidateApplicationsListProps = {
  applications: CandidateApplicationItem[];
  currentPage: number;
  totalItems: number;
  pageSize: number;
  locale: string;
  search?: string;
};

export default function CandidateApplicationsList({
  applications,
  currentPage,
  totalItems,
  pageSize,
  locale,
  search = '',
}: CandidateApplicationsListProps) {
  const t = useTranslations('candidatePage.applications');

  return (
    <>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {applications.length > 0 ? (
          applications.map((application) => (
            <ApplicationJobCard
              key={application.id}
              job={application.job}
              application={{
                appliedAt: application.created_at,
                assessment: application.assessment,
              }}
            />
          ))
        ) : (
          <EmptyDataState
            titleText={t(search ? 'no-results' : 'no-applications')}
            description={t(
              search ? 'no-results-description' : 'no-applications-description',
            )}
            className="col-span-full min-h-64"
          />
        )}
      </section>

      <ApplicationsPagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        getHref={(page) =>
          buildCandidateApplicationsPagePath(locale, page, search)
        }
      />
    </>
  );
}
