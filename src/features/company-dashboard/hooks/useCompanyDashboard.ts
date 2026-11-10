'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import useGetCompanyDashboard from './useGetCompanyDashboard';
import {
  DASHBOARD_DESIGN_PERIOD,
  dashboardDesignStats,
} from '../constants/dashboard-preview';
import type { DashboardPeriodKey, DashboardPeriodOption } from '../index.type';

export function useCompanyDashboard(designPreview: boolean) {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? '';
  const query = useGetCompanyDashboard({
    token,
    accountId: session?.user?.id,
    enabled: !designPreview,
  });
  const [periods, setPeriods] = useState<Record<DashboardPeriodKey, string>>({
    applications: DASHBOARD_DESIGN_PERIOD,
    timeToFill: DASHBOARD_DESIGN_PERIOD,
    reach: DASHBOARD_DESIGN_PERIOD,
    intake: DASHBOARD_DESIGN_PERIOD,
    recruiters: DASHBOARD_DESIGN_PERIOD,
  });
  const periodOptions = useMemo<DashboardPeriodOption[]>(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const date = new Date(Date.UTC(2026, 11 - index, 1));
        return {
          value: date.toISOString().slice(0, 7),
          label: new Intl.DateTimeFormat(locale, {
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(date),
        };
      }),
    [locale],
  );

  function changePeriod(key: DashboardPeriodKey, value: string) {
    setPeriods((current) => ({ ...current, [key]: value }));
  }

  return {
    data: designPreview ? dashboardDesignStats : query.data,
    loading:
      !designPreview &&
      (status === 'loading' || (Boolean(token) && query.isPending)),
    error: !designPreview && query.isError,
    loadError: query.error,
    retry: query.refetch,
    periods,
    periodOptions,
    changePeriod,
    designPreview,
  };
}
