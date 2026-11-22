'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useGetCompanyDashboard from './useGetCompanyDashboard';
import useGetJobsByAdmin from './useGetJobsByAdmin';
import {
  DASHBOARD_DESIGN_PERIOD,
  dashboardDesignRecruiters,
  dashboardDesignStats,
} from '../constants/dashboard-preview';
import { currentDashboardMonth } from '../utils/dashboard-format';
import type {
  CompanyDashboard,
  DashboardMonths,
  DashboardPeriodKey,
} from '../index.type';

const MONTH_BLOCKS = {
  applications: 'total_applications',
  duration: 'job_duration',
  cvDownloads: 'cv_downloads',
  visits: 'user_visits',
} as const satisfies Record<keyof DashboardMonths, keyof CompanyDashboard>;

export function useCompanyDashboard(designPreview: boolean) {
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? '';
  const accountId = session?.user?.id;
  const [periods, setPeriods] = useState<Record<DashboardPeriodKey, string>>(
    () => {
      const month = designPreview
        ? DASHBOARD_DESIGN_PERIOD
        : currentDashboardMonth();
      return {
        applications: month,
        duration: month,
        cvDownloads: month,
        visits: month,
        recruiters: month,
      };
    },
  );
  const query = useGetCompanyDashboard({
    token,
    accountId,
    months: {
      applications: periods.applications,
      duration: periods.duration,
      cvDownloads: periods.cvDownloads,
      visits: periods.visits,
    },
    enabled: !designPreview,
  });
  const recruitersQuery = useGetJobsByAdmin({
    token,
    accountId,
    month: periods.recruiters,
    enabled: !designPreview,
  });
  const sessionLoading = status === 'loading';
  const data = designPreview ? dashboardDesignStats : query.data;
  const loading =
    !designPreview && (sessionLoading || (Boolean(token) && query.isPending));

  function changePeriod(key: DashboardPeriodKey, value: string) {
    setPeriods((current) => ({ ...current, [key]: value }));
  }

  // While a new month loads, the previous response stays on screen, so only
  // the card whose month no longer matches the response shows a skeleton.
  function isPeriodPending(key: keyof DashboardMonths) {
    if (loading) return true;
    if (designPreview || !data || !query.isFetching) return false;
    return data[MONTH_BLOCKS[key]].filter_month !== periods[key];
  }

  return {
    data,
    loading,
    error: !designPreview && query.isError,
    loadError: query.error,
    retry: query.refetch,
    periods,
    changePeriod,
    isPeriodPending,
    recruiters: {
      data: designPreview ? dashboardDesignRecruiters : recruitersQuery.data,
      loading:
        !designPreview &&
        (sessionLoading ||
          (Boolean(token) &&
            (recruitersQuery.isPending || recruitersQuery.isPlaceholderData))),
      error: !designPreview && recruitersQuery.isError,
      retry: recruitersQuery.refetch,
    },
  };
}
