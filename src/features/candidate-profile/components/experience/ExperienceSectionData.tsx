'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { CalendarRange, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { CandidateProfileViewModel } from '../../types/profile.types';
import { ExperienceModal } from './ExperienceModal';
import ExperienceActions from './ExperienceActions';

export function ExperienceSectionData({
  profile,
  readOnly = false,
}: {
  profile: CandidateProfileViewModel | null;
  readOnly?: boolean;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const experiences = profile?.experiences ?? [];
  // console.log("experiences"  , experiences);
  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base leading-6.5 font-semibold text-foreground md:text-lg">
            {t('candidatePage.profile.experience')}
          </h2>
          {!readOnly && (
            <Plus
              size={22}
              className="cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          )}
        </div>

        {experiences.length > 0 ? (
          <Accordion
            type="multiple"
            defaultValue={[experiences[0].id]}
            className="divide-y divide-border"
          >
            {experiences.map((exp) => (
              <AccordionItem
                key={exp.id}
                value={exp.id}
                className="flex flex-col gap-5.5 border-none p-3"
              >
                <div className="flex items-start justify-between gap-5.5">
                  <div className="flex flex-col gap-2">
                    <span className="text-base font-normal text-primary md:text-lg">
                      {exp.title}
                    </span>
                    <div className="flex items-center gap-2">
                      {exp.organization && (
                        <span className="text-xs font-semibold md:text-sm">
                          {exp.organization}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-secondary md:text-xs">
                        <CalendarRange size={16} />
                        {exp.startDateLabel ??
                          t('candidatePage.profile.start-date')}{' '}
                        -{' '}
                        {exp.endDateLabel ?? t('candidatePage.profile.present')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 lg:gap-4">
                    {!readOnly && <ExperienceActions experience={exp} />}
                    <AccordionTrigger
                      iconType="arrow"
                      className="flex items-center justify-center rounded-md p-0 [&>svg]:text-muted-foreground"
                    />
                  </div>
                </div>

                <AccordionContent className="pt-0 pb-0">
                  {exp.bullets.length > 0 ? (
                    <ul className="flex flex-col gap-3 ps-1">
                      {exp.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-xs text-muted-foreground md:text-sm"
                        >
                          <span className="text-muted-foreground">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[10px] text-muted-foreground md:text-xs">
                      {t('candidatePage.profile.no-details')}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-xs text-muted-foreground md:text-sm">
            {t('candidatePage.profile.no-experience')}
          </p>
        )}
      </div>

      {!readOnly && (
        <ExperienceModal
          label={t('candidatePage.profile.add-experience')}
          open={open}
          onOpenChange={setOpen}
          experience={null}
        />
      )}
    </>
  );
}
