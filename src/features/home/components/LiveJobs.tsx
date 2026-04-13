import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";
import JobCard from "./JobCard";
import type { HomeRecentJob } from "../types/home.types";

export const LiveJobs = ({
  title,
  jobs,
}: {
  title: string;
  jobs: HomeRecentJob[];
}) => {
  return (
    <section
      className="bg-white py-10 md:py-20"
      aria-labelledby="recent-jobs-title"
    >
      <div className="layout-shell">
        <div className="layout-content">

          <header className="mb-10 flex items-end justify-between">
            <div className="space-y-4">
              <SectionTitle sectionTitle="Recent Jobs" />
              <h2 id="recent-jobs-title">{title}</h2>
            </div>
            <Button
              variant="outline"
              size="pill"
              hoverStyle="slidehorizontalPrimary"
              className="text-muted-foreground text-md group flex items-center gap-2 border-none font-normal"
            >
              Explore More
              <ArrowRight
                size={28}
                strokeWidth={1.5}
                className="border-muted-foreground text-muted-foreground size-7 -rotate-45 rounded-full border bg-white transition-transform group-hover:rotate-0"
              />
            </Button>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {jobs.map((job) => (
              <JobCard key={job?.id} {...job} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
