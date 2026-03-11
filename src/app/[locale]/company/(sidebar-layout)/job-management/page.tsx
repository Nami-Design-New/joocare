import JobFilter from "@/features/jobs/components/JobFilter";
import JobsList from "@/features/jobs/components/JobsList";
import JobsPaginationSection from "@/features/jobs/components/JobsPaginationSection";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";

export default function Page() {
  return (
    <section className="flex flex-col gap-12">
      <header className="flex w-full items-center justify-between">
        <div className="min-w-52">
          <JobFilter />
        </div>

        <Link
          className={` ${buttonVariants({
            variant: "default",
            size: "pill",
          })} min-w-52`}
          href="/company/post-job"
        >
          Post a Job
        </Link>
      </header>

      <JobsList />

      <JobsPaginationSection />
    </section>
  );
}
