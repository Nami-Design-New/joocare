import { useTranslations } from 'next-intl';
import { Skeleton } from '@/shared/components/ui/skeleton';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { ChartPieDonut } from './ChartPieDonut';
import DashboardWidgetTitle from './DashboardWidgetTitle';
import type { DashboardCategory } from '../index.type';

type PieChartCardProps = {
  categories: DashboardCategory[];
  isPending: boolean;
};

export default function PieChartCard({
  categories,
  isPending,
}: PieChartCardProps) {
  const t = useTranslations('companyPage.dashboard.design');
  return (
    <section className="bg-card min-h-98 rounded-2xl px-5 py-6">
      <DashboardWidgetTitle
        title={t('category-title')}
        description={t('category-description')}
        className="text-[21px] leading-6.5"
      />
      {isPending ? (
        <Skeleton className="mx-auto mt-16 size-41 rounded-full" />
      ) : categories.some((item) => item.percentage > 0) ? (
        <div className="mt-8">
          <ChartPieDonut categories={categories} />
        </div>
      ) : (
        <EmptyDataState
          titleText={t('no-category-data')}
          className="min-h-64 px-0 py-4 [&_h3]:text-sm [&_img]:max-w-24"
        />
      )}
    </section>
  );
}
