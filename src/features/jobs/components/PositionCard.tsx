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
    <div className="flex items-center gap-6">
      <div className="bg-primary-bg flex h-22 w-24 shrink-0 items-center justify-center rounded-2xl p-2">
        <Image
          src={logoSrc}
          alt={t('companyPage.postJob.review.companyLogoAlt')}
          width={96}
          height={86}
          className="size-full object-contain"
        />
      </div>
      <div>
        <h6 className="text-foreground text-base md:text-2xl font-semibold mb-1">{title}</h6>
        <p className="flex max-sm:flex-col items-start sm:items-center gap-2">
          <span className="text-muted-foreground text-sm md:text-base font-normal">
            {t("companyPage.postJob.review.at")} {company}
          </span>
          <Badge
            size="sm"
            className="bg-job-type rounded-[3px] font-semibold uppercase max-sm:text-[10px]"
          >
            {employmentType}
          </Badge>
        </p>
      </div>
    </div>
  );
}
