import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";
import JobCard from "./JobCard";

export const LiveJobs = () => {
  const jobs = Array(8).fill({
    title: "Registered nurse",
    company: "Reliance Health",
    location: "Cairo, Egypt",
    type: "Full time",
    time: "2 hours", // ISO 8601 duration
  });

  return (
    <section
      className="bg-white py-10 md:py-20"
      aria-labelledby="recent-jobs-title"
    >
      <div className="container mx-auto max-w-7xl px-3 lg:px-2">
        <header className="mb-10 flex items-end justify-between">
          <div className="space-y-4">
            <SectionTitle sectionTitle="Recent Jobs" />
            <h2 id="recent-jobs-title">
              A snapshot of healthcare hiring <br /> in motion
            </h2>
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
          {jobs.map((job, i) => (
            <JobCard key={i} {...job} />
          ))}
        </div>
      </div>
    </section>
  );
};
