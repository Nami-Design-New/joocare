import React from "react";
import SectionTitle from "./SectionTitle";
import Image from "next/image";
import type { HomeEmployer } from "../types/home.types";

export default function TopEmployers({
  title,
  companies,
}: {
  title: string;
  companies: HomeEmployer[];
}) {
  return (
    <section className="bg-white">
      <section className="layout-shell  py-10 text-center md:py-20">
        <section className="layout-content flex flex-col items-center gap-8">

          <div className="flex mx-auto max-w-103 flex-col items-center gap-4">
            <SectionTitle sectionTitle="Top Employers" />

            <h2>{title}</h2>
          </div>

          <div className="grid w-full grid-cols-2 items-center gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {companies.map((company) => (
              <div
                key={company.id}
                className="relative h-12 w-full rounded-lg"
              >
                <Image
                  src={company.image ?? "/assets/icons/top-empoyers/kbc.svg"}
                  alt="Employer logo"
                  fill
                  className="object-contain opacity-70 transition hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}
