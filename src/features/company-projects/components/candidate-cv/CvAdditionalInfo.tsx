import { Info } from 'lucide-react';
import type { CandidateCvDetail } from '../../types/candidate-cv.types';
import CvSectionTitle from './CvSectionTitle';

type CvAdditionalInfoProps = {
  title: string;
  details: CandidateCvDetail[];
  getLabel: (key: CandidateCvDetail['key']) => string;
};

export default function CvAdditionalInfo({
  title,
  details,
  getLabel,
}: CvAdditionalInfoProps) {
  return (
    <section className="flex flex-col gap-4 p-1">
      <CvSectionTitle icon={Info} title={title} />
      <dl className="flex flex-col gap-3 text-sm">
        {details.map((detail) => (
          <div key={detail.key} className="grid grid-cols-[145px_1fr] gap-3">
            <dt className="text-muted-foreground">{getLabel(detail.key)}</dt>
            <dd className="text-secondary">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
