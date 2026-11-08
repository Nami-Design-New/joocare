import { Globe } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { CandidateCvLanguage } from '../../types/cv-document.types';
import CvSectionTitle from './CvSectionTitle';

const LANGUAGE_RATING_MAX = 5;

type CvLanguagesProps = {
  title: string;
  languages: CandidateCvLanguage[];
};

export default function CvLanguages({ title, languages }: CvLanguagesProps) {
  return (
    <section className="flex flex-col gap-4 p-1">
      <CvSectionTitle icon={Globe} title={title} />
      <ul className="flex flex-col gap-3">
        {languages.map((language) => (
          <li
            key={language.id}
            className="grid grid-cols-[96px_auto_1fr] items-center gap-3 text-[15px]"
          >
            <span className="text-foreground">{language.name}</span>
            <span
              className="flex gap-1.5"
              aria-label={`${language.rating}/${LANGUAGE_RATING_MAX}`}
            >
              {Array.from({ length: LANGUAGE_RATING_MAX }, (_, index) => (
                <span
                  key={index}
                  className={cn(
                    'size-3 rounded-full',
                    index < language.rating ? 'bg-primary' : 'bg-muted',
                  )}
                />
              ))}
            </span>
            <span className="text-secondary">{language.level}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
