import { SimilarJob } from "@/features/jobs/types/jobs.types";
import { getJobSalary } from "@/features/jobs/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import {
  Briefcase,
  DollarSign,
  LocationEdit,
  Sparkles,
  Timer
} from "lucide-react";
import Image from "next/image";

export default function SimilarJobCard({ job }: { job: SimilarJob }) {


  return (
    <Card className="gap-2 hover:border-primary hover:border">
      <CardHeader className="flex gap-2">
        <Image
          width={52}
          height={46}
          src={job?.company?.image ?? "/assets/comp-logo.svg"}
          alt="company logo"
        />
        <div className="flex grow flex-col gap-1">
          <p className="text-foreground text-md font-normal">{job?.title === null ? job?.job_title?.title : job?.title}</p>
          <p className="text-foreground text-md font-normal">{job?.company?.name}</p>
          {/* <time className="text-muted-foreground font normal text-xs">
            {job.created_at}
          </time> */}
        </div>
        {/* <span className="bg-accent text-primary flex items-center gap-1 rounded-[12px] p-2 text-sm font-semibold">
          <Sparkles size={16} /> 90 %
        </span> */}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <ul className="items-cente flex gap-2">
            <li className="text-secondary flex items-center gap-1 text-sm font-normal">
              <LocationEdit size={14} color="var(--muted-foreground)" />
              {job?.city?.name ? `${job?.city?.name} ,` : ""}{job?.country?.name}
            </li>
            <li className="text-secondary flex items-center gap-1 text-sm font-normal">
              <Briefcase size={14} color="var(--muted-foreground)" />
              {job?.category?.title}{" "}
            </li>
            <li className="text-secondary flex items-center gap-1 text-sm font-normal">
              <DollarSign size={14} color="var(--muted-foreground)" />
              {getJobSalary(job)}
            </li>
          </ul>
          <ul className="items-cente flex gap-2">
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {job?.experience?.title}
            </li>
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {job?.employment_type?.title}
            </li>
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {job?.specialty?.title}
            </li>
          </ul>
          <div className="text-muted-foreground line-clamp-1">
            {job?.description}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-foreground flex items-center gap-1 text-sm">
          <Timer size={16} /> {job?.created_at}
        </p>
      </CardFooter>
    </Card>
  );
}
