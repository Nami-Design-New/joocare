import Image from "next/image";
import { JobDetails } from "../../types/jobs.types";
import { getJobSalary } from "../../utils";
import { useTranslations } from "next-intl";

export default function JobLocationAndSalaryCard({ job }: { job: JobDetails }) {
  const t = useTranslations();
  return (
    <div className="card border-border shadow-card flex min-h-36 items-center justify-around rounded-2xl border-2 bg-white  py-8 px-4 xl:p-8">
      <div className="flex flex-1  flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center p-1 rounded-full border-3 border-primary">
          <Image
            src={"/assets/icons/dollar.svg"}
            width={20}
            height={20}
            alt={t("jobDetailsPage.currency-icon")}
          />
        </div>
        <h4 className="text-foreground text-lg font-semibold">
          {t("jobDetailsPage.salary")}{" "}
          {job?.salary_type ? `(${job?.currency?.code})` : ""}
        </h4>
        {job.has_salary ?
          <p className="text-primary text-md font-semibold">{getJobSalary(job)} </p>
          : <p className="text-primary text-md font-semibold">{t("jobsPage.not-specified")}</p>
        }
        <span className="text-muted-foreground text-sm">{job?.salary_type?.title ?? ""}</span>
      </div>
      <div className="bg-muted h-full w-0.5"></div>
      <div className="flex flex-1  flex-col items-center justify-center gap-1">
        <div className="flex items-center justify-center mt-3">
          <Image
            src={"/assets/icons/map-pin.svg"}
            width={38}
            height={38}
            alt={t("jobDetailsPage.location-icon")}
          />
        </div>
        <h4 className="text-foreground text-lg font-semibold">{t("jobDetailsPage.job-location")}</h4>
        <p className="text-muted-foreground text-sm md:text-base text-center font-semibold">
          {job?.city?.name ?? "-"}
          {job?.city_id === null ? "" : ","}
          <br />
          {job?.country?.name ?? "-"}
        </p>
      </div>
    </div>
  );
}
