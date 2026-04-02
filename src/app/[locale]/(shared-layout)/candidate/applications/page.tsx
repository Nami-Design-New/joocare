import CandidateJobCard from "@/features/jobs/components/candidate/CandidateJobCard";

export default function CandidateApplicationsPage() {
    return (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 py-4">
            <div className="col-span-1">
                <CandidateJobCard appliedBadge={true} />
            </div>
            <div className="col-span-1">
                <CandidateJobCard appliedBadge={true} />
            </div>

        </section>
    )
}

