import { useTranslations } from 'next-intl';
import type { HomePageData } from '../types/home.types';
import AiEngine from './AiEngine';
import WhyModelColumn from './WhyModelColumn';
import WhyTagPill from './WhyTagPill';

type WhyUsProps = HomePageData['whyJoocare'];

export default function WhyUs({
  title,
  legacyModelTitle,
  legacyModelDescription,
  legacyModels,
  joocareModelTitle,
  joocareModelDescription,
  joocareModels,
}: WhyUsProps) {
  const t = useTranslations('home');

  return (
    <section className="bg-why-bg from-why-bg-glow via-why-bg-mid to-why-bg text-why-ink relative isolate overflow-hidden bg-radial-[1200px_780px_at_50%_60%] via-48%">
      <div
        aria-hidden="true"
        className="bg-why-grid pointer-events-none absolute inset-0 -z-10"
      />
      <div className="mx-auto max-w-[1320px] px-4 pt-10 pb-12 md:px-6 md:pt-14 md:pb-16">
        <header className="mx-auto mb-8 max-w-[920px] text-center md:mb-12">
          <WhyTagPill tone="model" variant="eyebrow">
            {t('why-eyebrow')}
          </WhyTagPill>
          <h2 className="text-why-ink mt-4 mb-3.5 text-[clamp(30px,3.6vw,50px)] leading-[1.08] font-semibold tracking-[-.02em] rtl:tracking-normal">
            {title}
          </h2>
          <p className="text-why-ink-muted mx-auto max-w-[800px] text-base leading-relaxed font-light md:text-[16.5px]">
            {t('why-subtitle')}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(520px,640px)_minmax(0,1fr)]">
          <WhyModelColumn
            tone="legacy"
            tag={t('legacy-model')}
            title={legacyModelTitle}
            description={legacyModelDescription}
            items={legacyModels}
          />
          <AiEngine className="order-first w-full max-w-[720px] min-w-0 justify-self-center md:col-span-2 md:mb-3 xl:order-none xl:col-span-1 xl:mb-0 xl:max-w-none" />
          <WhyModelColumn
            tone="model"
            tag={t('joocare-model')}
            title={joocareModelTitle}
            description={joocareModelDescription}
            items={joocareModels}
          />
        </div>
      </div>
    </section>
  );
}
