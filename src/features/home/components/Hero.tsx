import React from "react";
import HomeFilter from "./HomeFilter";
import PopularSearches from "./PopularSearches";

export default function Hero() {
  return (
    <section className="container mx-auto max-w-7xl flex flex-col items-center justify-center gap-8 px-3 pt-10 pb-10 text-center md:gap-16 md:pt-30 md:pb-20 lg:px-2">
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
        <PopularSearches />
      </div>
    </section>
  );
}
