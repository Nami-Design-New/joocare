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
          className="rounded-2xl w-24 h-22"
        />
        <div>
          <h6 className="text-foreground flex items-center gap-4 text-2xl font-semibold">
            <span className="max-md:text-[16px]">
              {job?.title === null ? job?.job_title?.title : job?.title}
            </span>
            {/* <span className="bg-accent text-primary flex items-center gap-1 rounded-[12px] p-2 text-sm font-semibold">
              <Sparkles size={16} /> 90 %
            </span> */}
          </h6>
          <div className="flex items-center gap-2 mt-2">
            <div className="text-muted-foreground text-lg font-normal">
              <span>{t("jobDetailsPage.at")} {job?.company?.domain?.title} </span>
            </div>
            <Badge size="md" className="rounded-[3px] bg-[#0BA02C] font-semibold">
              {job?.employment_type?.title}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{job?.current_status?.updated_at}</p>
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
