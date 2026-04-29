import HomeFilter from "./HomeFilter";
import { PopularSearchesItem } from "./PopularSearches";
import PopularSearchesInteractive from "./PopularSearchesInteractive";

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
    <section className="layout-shell pt-10 pb-10 text-center md:gap-16 md:pt-30 md:pb-20 bg-body-bg">
      <section className="layout-content flex flex-col items-center justify-center gap-y-8">

        <div className="mx-auto max-w-3xl">
          <h1 className="text-secondary mb-9 leading-[1.3] font-bold">
            {title}
            <span className="text-primary"> {subtitle} </span>
          </h1>
          <p className="text-muted-foreground text-md font-normal md:text-xl">{description}</p>
        </div>

        <div className=" min-w-full flex flex-col items-center gap-12 md:gap-18">
          <HomeFilter />
          <PopularSearchesInteractive
            items={searches}
            variant="hero"
            maxVisible={5}
            currentPage={popularSearchesCurrentPage}
            lastPage={popularSearchesLastPage}
          />
        </div>
      </section>
    </section>
  );
}
