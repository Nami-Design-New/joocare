import Image from "next/image";
import { JobDetails } from "../types/jobs.types";
import { getJobSalary } from "../utils";
import { getTranslations } from "next-intl/server";

export default async function JobLocationAndSalaryCard({ job }: { job: JobDetails }) {
  const t = await getTranslations();
  return (
    <div className="card border-border shadow-card flex min-h-36 items-start justify-around rounded-2xl border-2 bg-white  py-8 px-2 md:px-4 xl:p-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center p-1 rounded-full border-3 border-primary">
          <Image
            src={"/assets/icons/dollar.svg"}
            width={20}
            height={20}
            alt={t("jobDetailsPage.currency-icon")}
          />
        </div>
        <h4 className="text-foreground text-lg font-semibold">{t("jobDetailsPage.salary")} {job?.salary_type === null ? null : (job?.currency?.code)}</h4>
        <p className="text-primary text-md font-semibold">
          {job.has_salary ? getJobSalary(job, t("jobsPage.not-specified")) : t("jobsPage.not-specified")} </p>
        <span className="text-muted-foreground text-sm">{job.has_salary ? job?.salary_type?.title : ""}</span>
      </div>
      <div className="bg-muted h-full w-0.5"></div>
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="flex items-center justify-center -mt-[3px]">
          <Image
            src={"/assets/icons/map-pin.svg"}
            width={38}
            height={38}
            alt={t("jobDetailsPage.location-icon")}
          />
        </div>
        <h4 className="text-foreground text-lg font-semibold">{t("jobDetailsPage.job-location")}</h4>
        <p className="text-muted-foreground text-sm md:text-base text-center font-semibold">
          {job?.city?.name}{job?.city_id === null ? "" : ","}<br />{job?.country?.name}
        </p>
      </div>
    </div>
  );
}
