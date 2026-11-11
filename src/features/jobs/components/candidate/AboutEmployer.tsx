import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import Image from 'next/image';
import { CompanyDetails } from '../../types/jobs.types';
import { getTranslations } from 'next-intl/server';

export default async function AboutEmployer({
  employer,
}: {
  employer: CompanyDetails | null;
}) {
  const t = await getTranslations();
  return (
    <div className="card col-span-2 rounded-2xl bg-white p-4 font-noto-sans text-[#212529] md:p-7">
      <h3 className="mb-4 text-lg font-bold text-foreground max-md:text-base max-md:leading-6 md:text-xl">
        {t('jobDetailsPage.about-the-employer')}
      </h3>
      <div className="flex items-center gap-4 rounded-2xl border border-border p-4">
        <Image
          src={employer?.image ?? '/assets/employer-image.svg'}
          alt={t('jobDetailsPage.employer-profile-card')}
          width={60}
          height={60}
          className="h-13 w-15 rounded-2xl"
        />
        <div>
          <h3 className="text-base font-semibold max-md:text-sm max-md:leading-5 md:text-lg">
            {employer?.name}
          </h3>
          <p className="text-sm text-muted-foreground md:text-base">
            {employer?.domain?.title}
          </p>
        </div>
      </div>
      <p className="py-3 text-start text-sm text-muted-foreground md:text-justify">
        {employer?.bio}
      </p>
      <Link
        href={`/shared-company-profile/${employer?.id}`}
        className={cn(
          `${buttonVariants({ variant: 'outline', size: 'pill', hoverStyle: 'slidePrimary' })}`,
          'mx-auto h-9 w-fit border border-secondary px-5 py-2.5',
        )}
      >
        {t('jobDetailsPage.view-profile')}
      </Link>
    </div>
  );
}
