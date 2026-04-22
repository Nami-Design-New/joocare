"use client"

import JobFilter from "@/features/jobs/components/JobFilter";
import { Link } from "@/i18n/navigation";
import { CustomPagination } from "@/shared/components/CustomPagination";
import { buttonVariants } from "@/shared/components/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useGetCompanyJobs from "../hooks/useGetCompanyJobs";
import JobCard from "./JobCard";
import JobCardSkeleton from "@/features/shared-company-profile/components/JobCardSkeleton";
import EmptyDataState from "@/shared/components/EmptyDataState";


export default function JobManagementSection() {
    const [page, setPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState("");

    const { data: session } = useSession();
    const token = session?.accessToken as string;

    const {
        data,
        jobs,
        total,
        perPage,
        lastPage,
        isPending,
    } = useGetCompanyJobs({
        token,
        page,
        status: selectedStatus,
    });

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > lastPage) return;
        setPage(newPage);
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        setPage(1);
    };

    const displayedJobs = data?.data ?? jobs ?? [];
    const displayedTotal = data?.total ?? total;
    const displayedPerPage = data?.per_page ?? perPage;

    console.log("data job ", data);

    return (
        <div className="flex flex-col gap-2">
            <header className="flex w-full items-center justify-between gap-2">
                <div className="w-full md:w-52">
                    <JobFilter
                        value={selectedStatus}
                        onStatusChange={handleStatusChange}
                    />
                </div>

                <Link
                    className={` ${buttonVariants({
                        variant: "default",
                        size: "pill",
                    })} md:min-w-52 
                    ${(data as any)?.code === 403 ? "pointer-events-none opacity-50" : ""}`}
                    href="/company/post-job"
                >
                    Post a Job
                </Link>

                {/* <div className="relative group mt-auto order-3">
                    <Link
                        href="/company/post-job"
                        className={`${buttonVariants({ variant: "default", size: "pill" })} 
    hover:bg-primary/70 rounded-full py-6 text-base
    ${companyProfileData?.status !== "approved" ? "pointer-events-none opacity-50" : ""}`}
                    >
                        Post a Job
                    </Link>

                    {companyProfileData?.status !== "approved" && (
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
      whitespace-nowrap rounded bg-black text-white text-xs px-3 py-1 
      opacity-0 group-hover:opacity-100 transition">
                            You can't post a job until your account is approved
                        </span>
                    )}
                </div> */}
            </header>
            <section className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
                {displayedJobs.length > 0 ? (
                    <>
                        {displayedJobs.map((eachJob) => (
                            <JobCard
                                key={eachJob.id}
                                job={eachJob}
                                href={`/jobs/${eachJob?.job_title?.id}`}
                                appliedBadge
                                appliedAtLabel={eachJob.created_at}
                            />
                        ))}

                        {isPending &&
                            Array.from({ length: 2 }).map((_, i) => (
                                <JobCardSkeleton key={`skeleton-${i}`} />
                            ))}
                    </>
                ) : isPending ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <JobCardSkeleton key={`initial-skeleton-${i}`} />
                    ))
                ) : (
                    <div className="border-border text-muted-foreground col-span-full rounded-2xl border border-dashed p-8 text-center">
                        <EmptyDataState />
                    </div>
                )}
            </section>
            {/* <JobsList /> */}
            {displayedJobs.length > 0 && (

                <CustomPagination
                    totalItems={displayedTotal}
                    pageSize={displayedPerPage}
                    currentPage={page}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    )
}
