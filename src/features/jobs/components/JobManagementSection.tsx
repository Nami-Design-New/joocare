import JobFilter from "@/features/jobs/components/JobFilter";
import JobsList from "@/features/jobs/components/JobsList";
import JobsPaginationSection from "@/features/jobs/components/JobsPaginationSection";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { CandidateApplicationItem } from "../types/jobs.types";
import JobCard from "./JobCard";
import { CustomPagination } from "@/shared/components/CustomPagination";

type JobManagementProps = {
    jobData: CandidateApplicationItem[];
    currentPage: number;
    totalItems: number;
    pageSize: number;
    locale: string;
};

export default function JobManagementSection({
    jobData,
    currentPage,
    totalItems,
    pageSize,
    locale,
}: JobManagementProps) {

    console.log("jobd ata", jobData);

    return (
        <div className="flex flex-col gpa-2">
            <header className="flex w-full items-center justify-between gap-2">
                <div className="w-full md:w-52">
                    <JobFilter />
                </div>

                <Link
                    className={` ${buttonVariants({
                        variant: "default",
                        size: "pill",
                    })} md:min-w-52`}
                    href="/company/post-job"
                >
                    Post a Job
                </Link>
            </header>
            <section className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
                {jobData.length > 0 ? (
                    jobData.map((eachJob) => (
                        <JobCard
                            key={eachJob.id}
                            job={eachJob}
                            href={`/jobs/${eachJob.job_title.id}`}
                            appliedBadge
                            appliedAtLabel={eachJob.created_at}
                        />
                    ))
                ) : (
                    <div className="border-border text-muted-foreground col-span-full rounded-2xl border border-dashed p-8 text-center">
                        No job Data found.
                    </div>
                )}
            </section>
            {/* <JobsList /> */}

            <JobsPaginationSection />
            {/* <CustomPagination
                totalItems={totalItems}
                pageSize={pageSize}
                currentPage={currentPage}
            /> */}
        </div>
    )
}
