import { Badge } from "@/shared/components/ui/badge";
import Image from "next/image";
import { useTranslations } from "next-intl";

export type positionCardProps = {
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
}: positionCardProps) {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-6">
      <Image
        src={logoSrc}
        alt={t("companyPage.postJob.review.companyLogoAlt")}
        width={96}
        height={86}
        className="rounded-2xl w-18 md:w-24 h-18 md:h-22"
      />
      <div>
        <h6 className="text-foreground text-base md:text-2xl font-semibold mb-1">{title}</h6>
        <p className="flex max-sm:flex-col items-start sm:items-center gap-2">
          <span className="text-muted-foreground text-sm md:text-base font-normal">
            {t("companyPage.postJob.review.at")} {company}
          </span>
          <Badge size="sm" className="bg-[#0BA02C] rounded-[3px] font-semibold max-sm:text-[10px]">
            {employmentType}
          </Badge>
        </p>
      </div>
    </div>
  );
}
