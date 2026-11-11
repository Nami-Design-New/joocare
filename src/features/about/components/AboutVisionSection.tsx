import { getTranslations } from 'next-intl/server';
import type { AboutContentSection } from '../types/about.types';
import AboutImageTextBlock from './AboutImageTextBlock';

type AboutVisionSectionProps = AboutContentSection;

export default async function AboutVisionSection({
  title,
  description,
  images,
}: AboutVisionSectionProps) {
  const t = await getTranslations('aboutPage');

  return (
    <section className="my-8 bg-background py-10 sm:my-14 sm:py-16">
      <div className="layout-shell">
        <div className="layout-content">
          <AboutImageTextBlock
            eyebrow={t('our-vision')}
            title={title}
            description={description}
            images={images}
            fallbackImageAlt={t('vision-image-alt')}
          />
        </div>
      </div>
    </section>
  );
}
