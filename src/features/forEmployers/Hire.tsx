import { Button } from "@/shared/components/ui/button";

import Image from "next/image";

export default function Hire() {
  const steps = [
    {
      img: "/assets/employers/company.gif",
      id: 1,
      title: "Create Your Facility Profile",
      desc: "Establish your institutional presence within our domain-oriented ecosystem. By defining your facility’s unique clinical environment and operational standards, you allow our system to strategically align your brand with the industry’s most qualified specialists.",
    },
    {
      img: "/assets/employers/search.gif",

      id: 2,
      title: "Post Your Requirements",
      desc: "Specify your needs using our smart filtration parameters. Our AI-driven engine analyzes your operational demands in real-time, instantly bypassing traditional search hurdles to present a curated shortlist of professionals who match your precise clinical criteria.",
    },
    {
      img: "/assets/employers/artboard.gif",
      id: 3,
      title: "Screen & Hire",
      desc: "Experience the power of intelligent selection. Review comprehensive, pre-verified profiles and engage directly with candidates through our secure liaison channel. Finalize your hiring with total confidence, backed by automated credentialing and transparent validation.",
    },
  ];

  return (
    <section className="bg-[#EEF8F0] py-12 sm:py-20">
      <div className="mx-auto  px-4 sm:px-6">
        <div className="mb-8 lg:w-[50%]">
          <h2 className="text-secondary text-4xl leading-tight font-bold sm:text-5xl">
            Hire Top Medical Talent in 3
            <br /> Simple Steps
          </h2>

          <p className="text-secondary mt-2 text-sm opacity-90 sm:text-base">
            Building Your Medical Team is Easier Than You ThinkBuilding Your
            Medical Team is Easier Than You Think
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <article
              key={s.id}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex h-56 items-center justify-center">
                {/* <StepIllustration step={s.id} /> */}
                <Image src={s.img}
                  alt={s.title}
                  width={200}
                  height={200}
                  className="object-contain" />
              </div>

              <div className="mt-6 flex-1">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F6FFF6] px-3 py-1 text-sm text-[#0B6B0F]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0F7F10]" />
                  Step {s.id}
                </span>

                <h3 className="mt-4 text-lg">{s.title}</h3>

                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {s.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
