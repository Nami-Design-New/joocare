"use client";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAppSelector } from "@/shared/providers/redux/hooks";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import StatCard from "./StatCard";
import { useTranslations } from "next-intl";

export const ImpactSection = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const settings = useAppSelector((state) => state.settings.data);
  const t = useTranslations();

  return (
    <section className="bg-background py-10 md:py-20">
      <div className="layout-shell">

        <div className="layout-content grid gap-12 lg:grid-cols-2 px-1">
          <div className="flex flex-col justify-center">
            <SectionTitle sectionTitle={t('home.proven-hiring-impact')} />
            <h2 className="text-foreground mt-4 mb-8">{title}</h2>
            <p className="text-muted-foreground mb-8 max-w-132 text-sm md:text-xl">{description}</p>
            <Link

              // variant="default"
              // size="pill"
              // hoverStyle="slideSecondary"
              className={cn(buttonVariants({ variant: "default", size: "pill", hoverStyle: "slideSecondary" }), "w-fit gap-2")}
              href={"/auth/candidate/register"}
            >
              <Image
                src="/assets/icons/get-started-button.svg"
                width={18}
                height={18}
                alt=""
              />
              {t('home.lets-get-started')}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              value={settings?.verified_healthcare_professionals}
              label={t('home.verified-healthcare-professionals')}
            />
            <StatCard value={settings?.active_job_opportunities} label={t('home.active-job-opportunities')} />
            <StatCard value={settings?.healthcare_specializations_covered} label={t('home.healthcare-specializations-covered')} />
            <StatCard value={settings?.hiring_success_rate} label={t('home.hiring-success-rate')} percentage="%" plus={false} />
          </div>
        </div>
      </div>
    </section >
  );
};
