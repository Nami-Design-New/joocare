import { getTranslations } from 'next-intl/server';
import type { AboutContentSection } from '../types/about.types';
import AboutImageTextBlock from './AboutImageTextBlock';

type AboutCommitmentSectionProps = AboutContentSection;

export default async function AboutCommitmentSection({
  title,
  description,
  images,
}: AboutCommitmentSectionProps) {
  const t = await getTranslations('aboutPage');

  return (
    <section className="bg-card py-16 sm:py-20 xl:py-24">
      <div className="layout-shell">
        <div className="layout-content">
          <AboutImageTextBlock
            eyebrow={t('our-commitment')}
            title={title}
            description={description}
            images={images}
            fallbackImageAlt={t('commitment-image-alt')}
          />
        </div>
      </div>
    </section>
  );
}
