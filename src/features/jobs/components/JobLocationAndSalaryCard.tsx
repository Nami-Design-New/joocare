import Image from "next/image";
import { JobDetails } from "../types/jobs.types";
import { getJobSalary } from "../utils";

export default function JobLocationAndSalaryCard({ job }: { job: JobDetails }) {
  return (
    <div className="card border-border shadow-card flex min-h-36 items-center justify-between rounded-2xl border-2 bg-white p-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <Image
          src={"/assets/icons/dollar.svg"}
          width={38}
          height={38}
          alt="currancy icon"
        />
        <h4 className="text-foreground text-lg font-semibold">Salary {job?.salary_type === null ? null : (job?.currency?.code)}</h4>
        <p className="text-primary text-md font-semibold">{getJobSalary(job)}</p>
        <span className="text-muted-foreground text-sm">{job?.salary_type?.title}</span>
      </div>
      <div className="bg-muted h-full w-0.5"></div>
      <div className="flex flex-col items-center justify-center gap-1">
        <Image
          src={"/assets/icons/map-pin.svg"}
          width={38}
          height={38}
          alt="Location icon"
        />
        <h4 className="text-foreground text-lg font-semibold">Job Location</h4>
        <p className="text-muted-foreground text-md text-center font-semibold">
          {job?.city?.name}{job?.city_id === null ? "" : ","}<br />{job?.country?.name}
        </p>
      </div>
    </div>
  );
}
