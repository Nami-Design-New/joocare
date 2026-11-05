import type { ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SECTION_ICONS } from '../constants';
import type { AdditionalInfoSectionKey } from '../types/additional-info.types';

type InfoSectionProps = {
  section: AdditionalInfoSectionKey;
  children: ReactNode;
};

// A form card: icon, title and description, then the section fields.
export default function InfoSection({ section, children }: InfoSectionProps) {
  const t = useTranslations('candidatePage.additional-info.sections');
  const titleId = `additional-info-${section}`;

  return (
    <section
      aria-labelledby={titleId}
      className="bg-muted flex flex-col gap-5 rounded-xl p-3"
    >
      <header className="flex items-center gap-4 py-6 ps-1">
        <span className="bg-primary/8 flex size-12 shrink-0 items-center justify-center rounded-full">
          <Image
            src={SECTION_ICONS[section]}
            width={24}
            height={24}
            alt=""
            className="size-6"
          />
        </span>
        <div className="flex flex-col gap-0.5">
          <h2 id={titleId} className="text-[21px] leading-[26px] font-semibold">
            {t(`${section}.title`)}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t(`${section}.description`)}
          </p>
        </div>
      </header>
      {children}
    </section>
  );
}
