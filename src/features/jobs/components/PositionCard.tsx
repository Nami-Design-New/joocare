import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/components/ui/badge';

export type PositionCardProps = {
  logoSrc: string;
  title: string;
  company: string;
  employmentType: string;
};

export default function PositionCard({
  logoSrc,
  company,
  title,
  employmentType,
}: PositionCardProps) {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-3 sm:gap-6">
      <div className="flex h-16 w-18 shrink-0 items-center justify-center rounded-2xl bg-primary-bg p-2 sm:h-22 sm:w-24">
        <Image
          src={logoSrc}
          alt={t('companyPage.postJob.review.companyLogoAlt')}
          width={96}
          height={86}
          className="size-full object-contain"
        />
      </div>
      <div>
        <h6 className="mb-1 text-base font-semibold text-foreground md:text-2xl">
          {title}
        </h6>
        <p className="flex items-start gap-2 max-sm:flex-col sm:items-center">
          <span className="text-sm font-normal text-muted-foreground md:text-base">
            {t('companyPage.postJob.review.at')} {company}
          </span>
          <Badge
            size="sm"
            className="rounded-[3px] bg-job-type font-semibold uppercase max-sm:text-[10px]"
          >
            {employmentType}
          </Badge>
        </p>
      </div>
    </div>
  );
}
