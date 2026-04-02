"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { CalendarRange, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ExperienceModal } from "./ExperienceModal";
import ExperienceActions from "./ExperienceActions";

interface ExperienceEntry {
  id: string;
  title: string;
  department: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

const initialExperiences: ExperienceEntry[] = [
  {
    id: "exp-1",
    title: "Consultant Interventional",
    department: "Health care",
    startDate: "Jan 2020",
    endDate: "Present",
    bullets: [
      "Supervise cardiology fellowship training program with 12 fellows",
      "Chair of the Cardiac Catheterization Lab quality improvement committee",
    ],
  },
  {
    id: "exp-2",
    title: "Consultant Interventional",
    department: "Health care",
    startDate: "Jan 2020",
    endDate: "Present",
    bullets: [],
  },
];

export function ExperienceSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Experience</h2>
          <Plus
            size={22}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* Accordion */}
        <Accordion
          type="multiple"
          defaultValue={["exp-1"]}
          className="divide-y divide-gray-100"
        >
          {initialExperiences.map((exp) => (
            <AccordionItem key={exp.id} value={exp.id} className="border-none">
              <div className="flex items-start justify-between gap-2">
                {/* Left meta — clicking this area does NOT toggle */}
                <div className="mb-2 flex flex-col gap-0.5 lg:mb-4">
                  <span className="text-primary text-lg font-normal">
                    {exp.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {exp.department}
                    </span>
                    <span className="text-secondary flex items-center gap-1 text-[12px]">
                      <CalendarRange size={16} />
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                </div>

                {/* Right: action buttons + shadcn chevron trigger */}
                <div className="flex items-center gap-1 lg:gap-4">
                  <ExperienceActions />
                  {/* AccordionTrigger scoped to just the chevron */}
                  <AccordionTrigger
                    iconType="arrow"
                    className="[&>svg]:text-muted-foreground flex items-center justify-center rounded-md p-0"
                  />
                </div>
              </div>

              <AccordionContent className="pt-0 pb-4">
                {exp.bullets.length > 0 ? (
                  <ul className="space-y-1.5 pl-1">
                    {exp.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="text-muted-foreground flex gap-2 text-[12px]"
                      >
                        <span className="text-muted-foreground">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-[12px]">
                    No details added yet.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <ExperienceModal
        label="Add Experience"
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
