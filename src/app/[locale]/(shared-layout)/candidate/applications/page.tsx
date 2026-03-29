import JobCard from "@/features/jobs/components/JobCard";

export default function CandidateApplicationsPage() {
    return (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 py-4">
            <div className="col-span-1">
                <JobCard />
            </div>
            <div className="col-span-1">
                <JobCard />
            </div>

        </section>
    )
}

