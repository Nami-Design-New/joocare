import { getTranslations } from 'next-intl/server';
import type { AboutContentSection } from '../types/about.types';
import AboutImageTextBlock from './AboutImageTextBlock';

type AboutMissionSectionProps = AboutContentSection;

export default async function AboutMissionSection({
  title,
  description,
  images,
}: AboutMissionSectionProps) {
  const t = await getTranslations('aboutPage');

  return (
    <section className="bg-card py-16 sm:py-20 xl:py-24">
      <AboutImageTextBlock
        eyebrow={t('our-mission')}
        title={title}
        description={description}
        images={images}
        fallbackImageAlt={t('mission-image-alt')}
        reversed
      />
    </section>
  );
}
