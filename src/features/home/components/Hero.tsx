import HomeFilter from "./HomeFilter";
import { PopularSearchesItem } from "./PopularSearches";
import PopularSearchesInteractive from "./PopularSearchesInteractive";

const POPULAR_SEARCHES: PopularSearchesItem[] = [
  { id: "1", label: "Plastic Surgeon" },
  { id: "2", label: "Dermatologist" },
  { id: "3", label: "Dermatologist" },
  { id: "4", label: "Dermatologist" },
  { id: "5", label: "Dermatologist" },
  { id: "6", label: "Dermatologist" },
  { id: "7", label: "Dermatologist" },
  { id: "8", label: "Dermatologist" },
  { id: "9", label: "Dermatologist" },
  { id: "10", label: "Dermatologist" },
  { id: "11", label: "Dermatologist" },
  { id: "12", label: "Dermatologist" },
  { id: "13", label: "Dermatologist" },
  { id: "14", label: "Dermatologist" },
  { id: "15", label: "Dermatologist" },
  { id: "16", label: "Dermatologist" },
  { id: "17", label: "Dermatologist" },
  { id: "18", label: "Dermatologist" },
  { id: "19", label: "Dermatologist" },
  { id: "20", label: "Dermatologist" },
  // ...
];

export default function Hero() {
  return (
    <section className="container mx-auto flex flex-col items-center justify-center gap-8 px-3 pt-10 pb-10 text-center md:gap-16 md:pt-30 md:pb-20 lg:px-25">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-secondary mb-9 leading-[1.3] font-bold">
          An Integrated Talent Platform for Healthcare and Life Sciences,
          <span className="text-primary"> Powered by AI </span>
        </h1>
        <p className="text-muted-foreground text-md font-normal md:text-xl">
          Joocare enables healthcare and life sciences organizations to attract,
          evaluate, and hire qualified talent, while enabling professionals to
          access verified career opportunities through AI-enabled recruitment
          services
        </p>
      </div>
      <div className="flex flex-col items-center gap-12 px-3 md:gap-18">
        <HomeFilter />
        <PopularSearchesInteractive
          items={POPULAR_SEARCHES}
          variant="hero"
          maxVisible={10}
        />
      </div>
    </section>
  );
}
