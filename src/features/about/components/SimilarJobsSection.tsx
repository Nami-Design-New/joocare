import SectionTitle from '@/features/home/components/SectionTitle';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel';
import SimilarJobCard from './SimilarJobCard';
import { SimilarJob } from '@/features/jobs/types/jobs.types';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function SimilarJobsSection({
  jobs,
}: {
  jobs: SimilarJob[];
}) {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <section className="py-10 md:py-20">
      <div>
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
        >
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <div className="space-y-4">
              <SectionTitle sectionTitle={t('jobDetailsPage.similar-jobs')} />
              <h2 className="max-md:text-sm max-md:leading-5">
                {t('jobDetailsPage.handpicked-for-your-profile')}
              </h2>
            </div>

            {/* Shadcn carousel controls wired to the same Carousel context */}
            <div
              className={`flex gap-4 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              <CarouselPrevious className="static h-12 w-12 translate-y-0 rounded-full border border-border text-secondary transition-all hover:bg-secondary hover:text-white" />
              <CarouselNext className="static h-12 w-12 translate-y-0 rounded-full border border-border text-secondary transition-all hover:bg-secondary hover:text-white" />
            </div>
          </div>

          {/* Cards */}
          <CarouselContent className="-ml-6 items-stretch">
            {jobs.map((job, i) => (
              <CarouselItem
                key={i}
                className="flex pl-6 md:basis-1/2 lg:basis-1/3"
              >
                <div className="h-full w-full">
                  <SimilarJobCard job={job} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
