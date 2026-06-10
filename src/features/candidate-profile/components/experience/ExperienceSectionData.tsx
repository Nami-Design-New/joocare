"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { CalendarRange, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { CandidateProfileViewModel } from "../../types/profile.types";
import { ExperienceModal } from "./ExperienceModal";
import ExperienceActions from "./ExperienceActions";

export function ExperienceSectionData({
  profile,
}: {
  profile: CandidateProfileViewModel | null;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const experiences = profile?.experiences ?? [];
  // console.log("experiences"  , experiences);
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 md:text-lg">{t("candidatePage.profile.experience")}</h2>
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
                    <span className="text-primary text-base font-normal md:text-lg">
                      {exp.title}
                    </span>
                    <div className="flex items-center gap-2">
                      {exp.organization && (
                        <span className="text-xs font-semibold md:text-sm">
                          {exp.organization}
                        </span>
                      )}
                      <span className="text-secondary flex items-center gap-1 text-[10px] md:text-xs">
                        <CalendarRange size={16} />
                        {exp.startDateLabel ?? t("candidatePage.profile.start-date")} - {exp.endDateLabel ?? t("candidatePage.profile.present")}
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
                          className="text-muted-foreground flex gap-2 text-xs md:text-sm"
                        >
                          <span className="text-muted-foreground">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-[10px] md:text-xs">
                      {t("candidatePage.profile.no-details")}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-xs text-muted-foreground md:text-sm">{t("candidatePage.profile.no-experience")}</p>
        )}
      </div>

      <ExperienceModal
        label={t("candidatePage.profile.add-experience")}
        open={open}
        onOpenChange={setOpen}
        experience={null}
      />
    </>
  );
}
