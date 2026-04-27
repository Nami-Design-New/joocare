import Image from "next/image";
import { JobDetails } from "../../types/jobs.types";
import { getJobSalary } from "../../utils";

export default function JobLocationAndSalaryCard({ job }: { job: JobDetails }) {
  return (
    <div className="card border-border shadow-card flex min-h-36 items-center justify-around lg:justify-between rounded-2xl border-2 bg-white py-8 px-6">
      <div className="flex flex-1  flex-col items-center justify-center gap-2">
        <Image
          src={"/assets/icons/dollar.svg"}
          width={38}
          height={38}
          alt="currancy icon"
        />
        <h4 className="text-foreground text-lg font-semibold">
          Salary {job?.salary_type ? `(${job?.currency?.code})` : ""}
        </h4>
        {job.has_salary ?
          <p className="text-primary text-md font-semibold">{getJobSalary(job)} {job?.salary_type ? `${job?.currency?.code}` : ""}</p>
          : <p className="text-primary text-md font-semibold">Not specified</p>
        }
        <span className="text-muted-foreground text-sm">{job?.salary_type?.title ?? ""}</span>
      </div>
      <div className="bg-muted h-full w-0.5"></div>
      <div className="flex flex-1  flex-col items-center justify-center gap-1">
        <Image
          src={"/assets/icons/map-pin.svg"}
          width={38}
          height={38}
          alt="Location icon"
        />
        <h4 className="text-foreground text-lg font-semibold">Job Location</h4>
        <p className="text-muted-foreground text-md text-center font-semibold">
          {job?.city?.name ?? "-"}
          {job?.city_id === null ? "" : ","}
          <br />
          {job?.country?.name ?? "-"}
        </p>
      </div>
    </div>
  );
}
