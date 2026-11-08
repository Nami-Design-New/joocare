import { Star } from 'lucide-react';
import CvCheckIcon from './CvCheckIcon';
import CvSectionTitle from './CvSectionTitle';

type CvHighlightsProps = {
  title: string;
  highlights: string[];
};

export default function CvHighlights({ title, highlights }: CvHighlightsProps) {
  return (
    <section className="flex flex-col gap-4">
      <CvSectionTitle icon={Star} title={title} />
      <ul className="flex flex-col gap-2.5">
        {highlights.map((highlight) => (
          <li
            key={highlight}
            className="text-secondary flex items-center gap-2.5 text-[15px]"
          >
            <CvCheckIcon />
            {highlight}
          </li>
        ))}
      </ul>
    </section>
  );
}
