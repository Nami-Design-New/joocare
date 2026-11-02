import { BriefcaseBusiness } from 'lucide-react';
import type { CandidateCvExperience } from '../../types/candidate-cv.types';
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
            <span className="text-primary pt-0.5 text-[13px] font-semibold">
              {experience.label}
            </span>
            <div className="border-primary/30 relative border-s-2 ps-5 pb-2">
              <span
                aria-hidden="true"
                className="bg-primary absolute -start-2 top-1 size-3.5 rounded-full"
              />
              <h4 className="text-foreground text-base font-semibold">
                {experience.title}
              </h4>
              <p className="text-secondary mt-1 text-sm leading-[22px]">
                {experience.description}
              </p>
              <h5 className="text-foreground mt-4 text-sm font-semibold">
                {experience.strengthsTitle}
              </h5>
              <ul className="mt-2 flex list-disc flex-col gap-1 ps-4">
                {experience.strengths.map((strength) => (
                  <li
                    key={strength}
                    className="text-secondary text-[13px] leading-[18px]"
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
