import Image from 'next/image';
import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

type PipelineToolbarProps = {
  selectedCount: number;
  total: number;
  allTotal: number;
  activeFiltersCount: number;
  filtersHref: string;
  onQuickMessage: () => void;
};

export default function PipelineToolbar({
  selectedCount,
  total,
  allTotal,
  activeFiltersCount,
  filtersHref,
  onQuickMessage,
}: PipelineToolbarProps) {
  const t = useTranslations('companyPage.candidates.pipeline');
  const hasFilters = activeFiltersCount > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button
        type="button"
        size="sm"
        disabled={!selectedCount}
        onClick={onQuickMessage}
        className="h-10 rounded-full px-5"
      >
        <Image
          src="/assets/company-projects/candidate-share.svg"
          alt=""
          width={18}
          height={18}
        />
        {t('quick-message', { count: selectedCount })}
      </Button>
      <div className="flex items-center gap-4">
        <p className="text-lg font-semibold" aria-live="polite">
          {hasFilters
            ? t('filtered-count', { count: total, total: allTotal })
            : t('count', { count: total })}
        </p>
        <Button
          asChild
          variant="outline"
          className={cn(
            'bg-card h-12 gap-2 rounded-full px-5 text-base',
            hasFilters && 'border-primary text-primary',
          )}
        >
          <Link href={filtersHref}>
            <Filter aria-hidden className="size-5" />
            {t('filters')}
            {hasFilters && (
              <span
                aria-label={t('active-filters-count', {
                  count: activeFiltersCount,
                })}
                className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-xs font-semibold"
              >
                {activeFiltersCount}
              </span>
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}
