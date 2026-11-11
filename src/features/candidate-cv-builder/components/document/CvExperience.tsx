import { BriefcaseBusiness } from 'lucide-react';
import type { CandidateCvExperience } from '../../types/cv-document.types';
import CvSectionTitle from './CvSectionTitle';

type CvExperienceProps = {
  title: string;
  experiences: CandidateCvExperience[];
};

export default function CvExperience({
  title,
  experiences,
}: CvExperienceProps) {
  return (
    <section className="flex flex-col gap-4">
      <CvSectionTitle icon={BriefcaseBusiness} title={title} size="lg" />
      <ol className="flex flex-col">
        {experiences.map((experience) => (
          <li key={experience.id} className="grid grid-cols-[96px_1fr] gap-3">
            <span className="pt-0.5 text-[13px] font-semibold text-primary">
              {experience.label}
            </span>
            <div className="relative border-s-2 border-primary/30 ps-5 pb-2">
              <span
                aria-hidden="true"
                className="absolute -start-2 top-1 size-3.5 rounded-full bg-primary"
              />
              <h4 className="text-base font-semibold text-foreground">
                {experience.title}
              </h4>
              {experience.description && (
                <p className="mt-1 text-sm leading-[22px] text-secondary">
                  {experience.description}
                </p>
              )}
              {experience.strengthsTitle && (
                <h5 className="mt-4 text-sm font-semibold text-foreground">
                  {experience.strengthsTitle}
                </h5>
              )}
              <ul className="mt-2 flex list-disc flex-col gap-1 ps-4">
                {experience.strengths.map((strength) => (
                  <li
                    key={strength}
                    className="text-[13px] leading-[18px] text-secondary"
                  >
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
