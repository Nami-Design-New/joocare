import { Button, buttonVariants } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";
import JobCard from "./JobCard";
import type { HomeRecentJob } from "../types/home.types";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export const LiveJobs = ({
  title,
  jobs,
}: {
  title: string;
  jobs: HomeRecentJob[];
}) => {
  const t = useTranslations();
  const locale = useLocale()
  return (
    <section
      className="bg-white py-10 md:py-20"
      aria-labelledby="recent-jobs-title"
    >
      <div className="layout-shell">
        <div className="layout-content">

          <header className="mb-10 flex items-end justify-between">
            <div className="space-y-4">
              <SectionTitle sectionTitle={t('home.recent-jobs')} />
              <h2 id="recent-jobs-title">{title}</h2>
            </div>
            <Link
              href="/jobs"
              className={
                buttonVariants({
                  variant: "outline",
                  size: "pill",
                  hoverStyle: "slidehorizontalPrimary",
                }) +
                " text-muted-foreground text-sm md:text-base group flex items-center gap-2 border-none font-normal"
              }
            >
              {t('home.explore-more')}
              <ArrowRight
                size={28}
                strokeWidth={1.5}
                className={`border-muted-foreground text-muted-foreground size-7 rounded-full border
               bg-white transition-transform  ${locale === 'ar' ? " -rotate-135 group-hover:-rotate-180" : " -rotate-45 group-hover:rotate-0"}`} />
            </Link>
          </header>

          <div className="grid gap-4 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">
            {jobs?.slice(0, 8).map((job) => (
              <JobCard key={job?.id} {...job} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
