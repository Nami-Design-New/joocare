import JobCard from "./JobCard";

export default function JobsList() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="col-span-1">
        <JobCard />
      </div>
      <div className="col-span-1">
        <JobCard />
      </div>
      <div className="col-span-1">
        <JobCard />
      </div>
      <div className="col-span-1">
        <JobCard />
      </div>
    </section>
  );
}
