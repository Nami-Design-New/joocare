import { Link } from "@/i18n/navigation";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import StatCard from "./StatCard";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export const ImpactSection = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {


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
              value="500,000"
              label="Verified Healthcare Professionals"
            />
            <StatCard value="100,000" label="Active Job opportunities" />
            <StatCard value="500" label="Healthcare Specializations Covered" />
            <StatCard value="98%" label="Hiring Success Rate" />
          </div>
        </div>
      </div>
    </section >
  );
};
