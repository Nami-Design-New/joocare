import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ATS_COMING_SOON_FEATURES } from '../../constants';

// What the upcoming analysis will offer (four icons with a title and a line each).
export default function AtsComingSoonFeatures() {
  const t = useTranslations('candidatePage.cvMatchAts.coming-soon.features');

  return (
    <ul className="grid grid-cols-2 gap-y-4 py-1 sm:grid-cols-4">
      {ATS_COMING_SOON_FEATURES.map(({ key, icon }) => (
        <li key={key} className="flex flex-col items-center gap-1.5 px-2">
          <span className="mb-1 flex size-15 items-center justify-center rounded-full bg-ats-icon-surface">
            <Image src={icon} alt="" width={28} height={28} />
          </span>
          <h3 className="text-[15px] font-semibold text-secondary">
            {t(`${key}.title`)}
          </h3>
          <p className="text-sm leading-5 text-muted-foreground">
            {t(`${key}.description`)}
          </p>
        </li>
      ))}
    </ul>
  );
}
