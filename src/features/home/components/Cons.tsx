import { Search } from "lucide-react";
import React from "react";
import SectionTitle from "./SectionTitle";

export default function Cons() {
  return (
    <div className="">
      <SectionTitle sectionTitle="The Legacy Model" />
      <h3 className="text-secondary mt-2 text-xl font-semibold">
        A Volume-Driven Approach to Healthcare Recruitment
      </h3>
      <p className="text-4 text-muted-foreground mt-6 mb-10">
        Traditional recruitment was not designed to address the complexities of
        modern healthcare; it relies on static CVs and generic filters, creating
        friction for both employers and medical professionals.
      </p>
      <ul className="flex flex-col items-start gap-8">
        <li className="flex gap-7">
          <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <Search className="text-white" />
          </div>
          <div>
            <h4 className="mb-2 text-xl font-semibold">
              Misunderstands Clinical Complexity
            </h4>
            <p className="text-muted-foreground font-normal">
              General screening cannot accurately assess the specialty, scope of
              practice, or true clinical depth.
            </p>
          </div>
        </li>
        <li className="flex gap-7">
          <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <Search className="text-white" />
          </div>
          <div>
            <h4 className="mb-2 text-xl font-semibold">
              Creates Operational Friction{" "}
            </h4>
            <p className="text-muted-foreground font-normal">
              The large volume of CVs, manual screening, and slow response times
              lead to delays.
            </p>
          </div>
        </li>
        <li className="flex gap-7">
          <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <Search className="text-white" />
          </div>
          <div>
            <h4 className="mb-2 text-xl font-semibold">
              Produces Risky Hiring Outcomes{" "}
            </h4>
            <p className="text-muted-foreground font-normal">
              Talent is matched based on job titles rather than capabilities,
              resulting in misalignment and employee turnover.
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}
