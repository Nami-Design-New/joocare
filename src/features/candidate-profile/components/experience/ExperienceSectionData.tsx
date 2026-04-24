"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { CalendarRange, Plus } from "lucide-react";
import { useState } from "react";
import type { CandidateProfileViewModel } from "../../types/profile.types";
import { ExperienceModal } from "./ExperienceModal";
import ExperienceActions from "./ExperienceActions";

export function ExperienceSectionData({
  profile,
}: {
  profile: CandidateProfileViewModel | null;
}) {
  const [open, setOpen] = useState(false);
  const experiences = profile?.experiences ?? [];
  // console.log("experiences", experiences);
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Experience</h2>
          <Plus
            size={22}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>

        {experiences.length > 0 ? (
          <Accordion
            type="multiple"
            defaultValue={[experiences[0].id]}
            className="divide-y divide-gray-100"
          >
            {experiences.map((exp) => (
              <AccordionItem key={exp.id} value={exp.id} className="border-none">
                <div className="flex items-start justify-between gap-2">
                  <div className="mb-2 flex flex-col gap-0.5 lg:mb-4">
                    <span className="text-primary text-lg font-normal">
                      {exp.title}
                    </span>
                    <div className="flex items-center gap-2">
                      {exp.organization && (
                        <span className="text-sm font-semibold">
                          {exp.organization}
                        </span>
                      )}
                      <span className="text-secondary flex items-center gap-1 text-[12px]">
                        <CalendarRange size={16} />
                        {exp.startDateLabel ?? "Start date"} - {exp.endDateLabel ?? "Present"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 lg:gap-4">
                    <ExperienceActions experience={exp} />
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
                          className="text-muted-foreground flex gap-2 text-[14px]"
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
        ) : (
          <p className="text-sm text-muted-foreground">No experience added yet.</p>
        )}
      </div>

      <ExperienceModal
        label="Add Experience"
        open={open}
        onOpenChange={setOpen}
        experience={null}
      />
    </>
  );
}
