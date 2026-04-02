import JobCard from '@/features/jobs/components/JobCard'

export default function JobsSections() {
    return (
        <div className="rounded-2xl bg-white flex flex-col gap-4 p-4 border mt-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold ">Jobs form Saudi German Hospital </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <JobCard resumeMatch={true} />
                <JobCard resumeMatch={true} />
                <JobCard resumeMatch={true} />
                <JobCard resumeMatch={true} />

            </div>
        </div>

    )
}
