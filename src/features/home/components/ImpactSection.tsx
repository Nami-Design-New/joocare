import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { settingService } from "@/shared/services/settings-services";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import StatCard from "./StatCard";

export const ImpactSection = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const settings = await settingService()

  return (
    <section className="bg-background py-10 md:py-20">
      <div className="layout-shell">

        <div className="layout-content grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <SectionTitle sectionTitle="Proven Hiring Impact" />
            <h2 className="text-foreground mt-4 mb-8">{title}</h2>
            <p className="text-muted-foreground mb-8 max-w-132 text-xl">{description}</p>
            <Link

              // variant="default"
              // size="pill"
              // hoverStyle="slideSecondary"
              className={cn(buttonVariants({ variant: "default", size: "pill", hoverStyle: "slideSecondary" }), "w-fit gap-2")}
              href={"/auth/candidate/register"}
            >
              <Image
                src="/assets/icons/get-started-button.svg"
                width={20}
                height={20}
                alt=""
              />
              Let&apos;s get started
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              value={settings?.verified_healthcare_professionals}
              label="Verified Healthcare Professionals"
            />
            <StatCard value={settings?.active_job_opportunities} label="Active Job opportunities" />
            <StatCard value={settings?.healthcare_specializations_covered} label="Healthcare Specializations Covered" />
            <StatCard value={settings?.hiring_success_rate} label="Hiring Success Rate" percentage="%" />
          </div>
        </div>
      </div>
    </section >
  );
};
