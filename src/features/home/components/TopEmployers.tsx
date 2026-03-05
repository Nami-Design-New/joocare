import React from "react";
import SectionTitle from "./SectionTitle";
import Image from "next/image";

const employers = [
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
  "/assets/icons/top-empoyers/kbc.svg",
];

export default function TopEmployers() {
  return (
    <section className="bg-white">
      <div className="container mx-auto flex flex-col items-center gap-8 px-3 py-20 text-center lg:px-0">
        <div className="flex max-w-103 flex-col items-center gap-4">
          <SectionTitle sectionTitle="How it works" />

          <h3 className="text-secondary text-[28px] font-semibold">
            Jobs from top employers
          </h3>
        </div>

        <div className="grid w-full grid-cols-2 items-center gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {employers.map((logo, index) => (
            <div
              key={index}
              className="border-border relative h-12 w-full rounded-lg border"
            >
              <Image
                src={logo}
                alt="Employer logo"
                fill
                className="object-contain opacity-70 transition hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
