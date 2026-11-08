import { Award } from 'lucide-react';
import type { CandidateCvCertification } from '../../types/cv-document.types';
import CvCheckIcon from './CvCheckIcon';
import CvSectionTitle from './CvSectionTitle';

type CvCertificationsProps = {
  title: string;
  certifications: CandidateCvCertification[];
};

export default function CvCertifications({
  title,
  certifications,
}: CvCertificationsProps) {
  return (
    <section className="flex flex-col gap-4">
      <CvSectionTitle icon={Award} title={title} />
      <ul className="flex flex-col gap-2.5">
        {certifications.map((certification) => (
          <li key={certification.id} className="flex items-center gap-2.5">
            <CvCheckIcon />
            <div className="flex flex-col">
              <p className="text-secondary text-sm">{certification.title}</p>
              <p className="text-muted-foreground text-xs">
                {certification.issuer}
              </p>
              <p className="text-gray-45 text-[10px]" dir="ltr">
                {certification.period}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
