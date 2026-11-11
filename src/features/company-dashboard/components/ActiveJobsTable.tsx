'use client';

import { useTranslations } from 'next-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { useDashboardJobs } from '../hooks/useDashboardJobs';
import ActiveJobRow from './ActiveJobRow';
import DashboardWidgetTitle from './DashboardWidgetTitle';
import type { CompanyJob } from '../index.type';

type ActiveJobsTableProps = {
  designPreview?: boolean;
  previewJobs?: CompanyJob[];
  title?: string;
  showPagination?: boolean;
  centerActions?: boolean;
};

export default function ActiveJobsTable({
  designPreview = false,
  previewJobs,
  title,
  showPagination = true,
  centerActions = false,
}: ActiveJobsTableProps) {
  const t = useTranslations('companyPage.dashboard');
  const jobs = useDashboardJobs(designPreview || previewJobs !== undefined);
  const rows = previewJobs ?? jobs.jobs;
  return (
    <section>
      <div className="space-y-6 rounded-2xl bg-card p-4">
        <DashboardWidgetTitle
          title={title ?? t('design.jobs-title')}
          description={t('design.jobs-description')}
          className="text-[21px] leading-6.5"
        />
        {jobs.error ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4">
            <p className="text-destructive">{t('design.jobs-error')}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void jobs.retry()}
            >
              {t('design.retry')}
            </Button>
          </div>
        ) : !jobs.loading && rows.length === 0 ? (
          <EmptyDataState
            titleText={t('design.no-jobs')}
            description={t('design.no-jobs-description')}
            className="min-h-64"
          />
        ) : (
          <div className="overflow-hidden rounded-t-2xl">
            <Table className="min-w-175 table-fixed text-base">
              <TableHeader>
                <TableRow className="h-13.75 border-border bg-muted">
                  {[
                    t('table.job-title'),
                    t('table.job-views'),
                    t('table.applicants'),
                    t('table.posted-since'),
                  ].map((label, index) => (
                    <TableHead
                      key={label}
                      className={
                        index === 0
                          ? 'w-1/5 px-4 text-start text-base font-semibold'
                          : 'w-1/5 px-4 text-center text-base font-semibold'
                      }
                    >
                      {label}
                    </TableHead>
                  ))}
                  <TableHead className="w-1/5">
                    <span className="sr-only">{t('design.job-actions')}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.loading
                  ? Array.from({ length: 4 }, (_, index) => (
                      <TableRow key={index} className="h-15.75">
                        {Array.from({ length: 5 }, (_, column) => (
                          <TableCell key={column} className="px-4">
                            <Skeleton className="h-5 w-3/4" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : rows.map((job) => (
                      <ActiveJobRow
                        key={job.id}
                        job={job}
                        centerActions={centerActions}
                      />
                    ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      {showPagination && !jobs.loading && jobs.total > 0 && (
        <CustomPagination
          currentPage={jobs.page}
          totalItems={jobs.total}
          pageSize={jobs.pageSize}
          onPageChange={jobs.setPage}
          statusPosition="start"
          align="start"
          tone="strong"
          showLastPage={false}
          visiblePageCount={5}
          className="mt-4 [&_[aria-current=page]]:bg-dashboard-primary"
        />
      )}
    </section>
  );
}
