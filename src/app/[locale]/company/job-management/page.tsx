import JobFilter from "@/features/jobs/components/JobFilter";
import JobsList from "@/features/jobs/components/JobsList";
import { Button } from "@/shared/components/ui/button";
import { CustomPagination } from "./CustomPagination";

export default function page() {
  return (
    <section className="flex flex-col gap-12">
      <header className="flex w-full items-center justify-between">
        <div className="min-w-52">
          <JobFilter />
        </div>
        <Button variant="default" size="pill" className="min-w-52">
          Post a Job
        </Button>
      </header>
      <JobsList />
      <CustomPagination />
    </section>
  );
}
