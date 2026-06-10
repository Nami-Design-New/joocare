import { Badge } from "@/shared/components/ui/badge";
import Image from "next/image";
import { JobDetails } from "../../types/jobs.types";
import CandidateJobDetailsCardActions from "./CandidateJobDetailsCardActions";
import { getTranslations } from "next-intl/server";

export default async function JobDetailsHeader({ job }: { job: JobDetails }) {
  const t = await getTranslations();

  return (
    <section className="flex flex-col lg:items-center justify-between rounded-2xl bg-white p-4 lg:flex-row">
      <div className="flex items-center gap-2 lg:gap-6">
        <Image
          src={job?.company?.image ?? "/assets/new-logo-dot.svg"}
          alt={t("jobDetailsPage.company-logo")}
          width={96}
          height={86}
          className="rounded-2xl w-18 h-18 md:w-24 md:h-22"
        />
        <div>
          <h6 className="text-foreground flex items-center gap-4 text-base font-semibold md:text-2xl">
            <span>
              {job?.title === null ? job?.job_title?.title : job?.title}
            </span>
            {/* <span className="bg-accent text-primary flex items-center gap-1 rounded-[12px] p-2 text-sm font-semibold">
              <Sparkles size={16} /> 90 %
            </span> */}
          </h6>
          <div className="flex items-start lg:items-center gap-2 mt-2 max-sm:flex-col">
            <div className="text-muted-foreground text-sm font-normal md:text-base">
              <span>{t("jobDetailsPage.at")} {job?.company?.domain?.title} </span>
            </div>
            <Badge size="sm" className="rounded-[3px] bg-[#0BA02C] font-semibold max-sm:text-[10px]">
              {job?.employment_type?.title}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm">{job?.current_status?.updated_at}</p>
        </div>
      </div>

      <CandidateJobDetailsCardActions
        jobId={job?.id}
        initialIsSaved={job?.is_saved}
        isApplied={job?.is_applied}
      />
    </section>
  );
}
