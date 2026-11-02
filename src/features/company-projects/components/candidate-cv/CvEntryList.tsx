import { ExternalLink, type LucideIcon } from 'lucide-react';
import type { CandidateCvEntry } from '../../types/candidate-cv.types';
import CvSectionTitle from './CvSectionTitle';

type CvEntryListProps = {
  icon: LucideIcon;
  title: string;
  entries: CandidateCvEntry[];
  linkLabel: (title: string) => string;
};

export default function CvEntryList({
  icon,
  title,
  entries,
  linkLabel,
}: CvEntryListProps) {
  return (
    <section className="flex flex-col gap-3.5 p-1">
      <CvSectionTitle icon={icon} title={title} />
      <ul className="flex flex-col gap-3">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-foreground text-[15px] leading-5 font-medium">
                {entry.title}
              </p>
              <p className="text-muted-foreground text-[13px]">{entry.meta}</p>
            </div>
            {entry.url && (
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={linkLabel(entry.title)}
                className="text-muted-foreground hover:text-primary shrink-0 transition-colors"
              >
                <ExternalLink
                  className="size-[18px] rtl:-scale-x-100"
                  strokeWidth={1.5}
                />
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
