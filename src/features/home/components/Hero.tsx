import { Suspense } from 'react';
import HomeFilter from './HomeFilter';
import { PopularSearchesItem } from './PopularSearches';
import PopularSearchesInteractive from './PopularSearchesInteractive';

function PopularSearchesSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="flex w-full flex-col items-center gap-3 lg:flex-row lg:items-start lg:justify-between"
    >
      <div className="h-7 w-40 animate-pulse rounded-md bg-muted" />
      <div className="flex flex-wrap justify-center gap-2 lg:flex-1 lg:justify-start">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-10 w-28 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>
      <div className="hidden h-10 w-28 animate-pulse rounded-full bg-muted lg:block" />
    </section>
  );
}

type HeroProps = {
  title: string;
  subtitle: string;
  description: string;
  searches: PopularSearchesItem[];
  popularSearchesCurrentPage: number;
  popularSearchesLastPage: number;
};

export default function Hero({
  title,
  subtitle,
  description,
  searches,
  popularSearchesCurrentPage,
  popularSearchesLastPage,
}: HeroProps) {
  return (
    <section className="layout-shell bg-body-bg pt-10 pb-10 text-center md:gap-16 md:pt-30 md:pb-20">
      <section className="layout-content flex flex-col items-center justify-center gap-y-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-9 leading-[1.3] font-bold text-secondary">
            {title}
            <span className="text-primary"> {subtitle} </span>
          </h1>
          <p className="text-sm font-normal text-muted-foreground md:text-xl">
            {description}
          </p>
        </div>

        <div className="flex min-w-full flex-col items-center gap-12 md:gap-18">
          <HomeFilter />
          <Suspense fallback={<PopularSearchesSkeleton />}>
            <PopularSearchesInteractive
              items={searches}
              variant="hero"
              maxVisible={5}
              currentPage={popularSearchesCurrentPage}
              lastPage={popularSearchesLastPage}
            />
          </Suspense>
        </div>
      </section>
    </section>
  );
}
