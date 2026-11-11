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
              <p className="text-sm text-secondary">{certification.title}</p>
              <p className="text-xs text-muted-foreground">
                {certification.issuer}
              </p>
              <p className="text-[10px] text-gray-45" dir="ltr">
                {certification.period}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
