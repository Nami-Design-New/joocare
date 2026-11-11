'use client';

import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/shared/components/ui/button';
import { useTranslations } from 'next-intl';

const CompleteDetails = () => {
  const t = useTranslations();
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-[#DC26260D] px-4 py-3">
      <h3 className="text-xl font-semibold text-destructive">
        {t('companyPage.sidebar.complete-details-title')}
      </h3>

      <p className="text-base text-muted-foreground">
        {t('companyPage.sidebar.complete-details-description')}
      </p>

      <Link
        href={'/company/complete-account'}
        className={` ${buttonVariants({
          size: 'pill',
          variant: 'destructive',
        })} text-[16px]`}
      >
        {t('companyPage.sidebar.complete-now')}{' '}
      </Link>
    </section>
  );
};

export default CompleteDetails;
