import SectionTitle from "@/features/home/components/SectionTitle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import SimilarJobCard from "./SimilarJobCard";
import { SimilarJob } from "@/features/jobs/services/job-details-service";

export default function SimilarJobsSection({ jobs }: { jobs: SimilarJob[] }) {

  return (
    <section className="py-10 md:py-20">
      <div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <div className="space-y-4">
              <SectionTitle sectionTitle="Similar Jobs" translationKey="similarJobs" />
              <h2>Handpicked for your profile</h2>
            </div>

            {/* Shadcn carousel controls wired to the same Carousel context */}
            <div className="flex gap-4">
              <CarouselPrevious className="border-border text-secondary hover:bg-secondary static h-12 w-12 translate-y-0 rounded-full border transition-all hover:text-white" />
              <CarouselNext className="border-border text-secondary hover:bg-secondary static h-12 w-12 translate-y-0 rounded-full border transition-all hover:text-white" />
            </div>
          </div>

          {/* Cards */}
          <CarouselContent className="-ml-6">
            {jobs.map((job, i) => (
              <CarouselItem key={i} className="pl-6 md:basis-1/2 lg:basis-1/3">
                <SimilarJobCard job={job} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
