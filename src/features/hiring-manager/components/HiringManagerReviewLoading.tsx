import { useTranslations } from 'next-intl';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function HiringManagerReviewLoading() {
  const t = useTranslations('companyPage.projects.shared-review');

  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">{t('loading-review')}</span>
      <Skeleton className="h-12 w-full max-w-xs" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((card) => (
          <Skeleton key={card} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
