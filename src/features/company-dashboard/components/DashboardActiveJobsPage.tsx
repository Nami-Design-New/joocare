'use client';

import { useLocale, useTranslations } from 'next-intl';
import {
  activeJobsPreviewRows,
  activeJobsPreviewStats,
} from '../constants/active-jobs-preview';
import ActiveJobsTable from './ActiveJobsTable';
import DashBoardStatsCard from './DashBoardStatsCard';
import DashboardWeeklyActivity from './DashboardWeeklyActivity';

export default function DashboardActiveJobsPage() {
  const t = useTranslations('companyPage.dashboard.active-jobs-page');
  const locale = useLocale();
  const number = new Intl.NumberFormat(locale, { useGrouping: false });

  return (
    <div className="mx-auto space-y-6">
      <section className="space-y-6 rounded-2xl bg-card p-4">
        <h1 className="text-[21px] leading-6.5 font-semibold text-foreground">
          {t('title')}
        </h1>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {activeJobsPreviewStats.map((stat) => (
            <DashBoardStatsCard
              key={stat.key}
              title={t(stat.key)}
              description={t(stat.key)}
              value={'+' + number.format(stat.value)}
              icon={stat.icon}
              compact
            />
          ))}
        </div>
      </section>
      <ActiveJobsTable
        previewJobs={activeJobsPreviewRows}
        title={t('title')}
        showPagination={false}
        centerActions
      />
      <DashboardWeeklyActivity />
    </div>
  );
}
