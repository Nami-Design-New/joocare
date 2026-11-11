import { GraduationCap } from 'lucide-react';
import type { CandidateCvEducation } from '../../types/cv-document.types';
import CvSectionTitle from './CvSectionTitle';

type CvEducationProps = {
  title: string;
  educations: CandidateCvEducation[];
  /** Formats the GPA line, e.g. "GPA: 3.8". */
  formatGpa: (gpa: string) => string;
};

export default function CvEducation({
  title,
  educations,
  formatGpa,
}: CvEducationProps) {
  return (
    <section className="flex flex-col gap-3.5 p-1">
      <CvSectionTitle icon={GraduationCap} title={title} />
      <ul className="flex flex-col divide-y divide-border">
        {educations.map((education) => (
          <li
            key={education.id}
            className="flex flex-col py-3 first:pt-0 last:pb-0"
          >
            <p className="text-[15px] font-medium text-foreground">
              {education.degree}
            </p>
            <p className="text-sm text-secondary">{education.institution}</p>
            {education.gpa ? (
              <p className="text-sm text-secondary">
                {formatGpa(education.gpa)}
              </p>
            ) : null}
            <p className="text-xs text-gray-45" dir="ltr">
              {education.period}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
