import Image from "next/image";
import JobOverviewItem from "../JobOverviewItem";
import { JobDetails } from "../../types/jobs.types";

export default function JobEducationAndCertificationsCard({ job }: { job: JobDetails }) {
  return (
    <div className="card border-border shadow-card min-h-36 rounded-2xl border-2 bg-white p-8">
      <h2 className="text-foreground mb-4 text-lg font-semibold">
        Education & Certifications section
      </h2>
      <div className="flex flex-col gap-6">
        <JobOverviewItem
          label="Education Level"
          value={job?.education_levels}
          icon="/assets/icons/exp.svg"
        />
        <div>
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/case.svg"
                width={20}
                height={20}
                alt="icon"
              />
              <p className="text-muted-foreground text-md">
                Mandatory Certifications
              </p>
            </div>
            <div>
              <ul className="mt-2 flex flex-col gap-2">
                {job.mandatory_certifications?.map((item) => (
                  <li className="edu-certificate" key={item?.id}>
                    {item.title ?? item.mandatory_certification?.title ?? "-"}
                  </li>
                ))}
                {job.mandatory_certifications?.length === 0 && (
                  <li className="edu-certificate">-</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <JobOverviewItem
          label="Availability"
          value={job.availability?.title ?? "-"}
          icon="/assets/icons/case.svg"
        />
      </div>{" "}
    </div>
  );
}
