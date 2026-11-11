import SectionTitle from './SectionTitle';
import { LiquidGlass } from '@liquidglass/react';
import type { HomeWhyModel } from '../types/home.types';
import { useTranslations } from 'next-intl';

export default function Pros({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: HomeWhyModel[];
}) {
  const t = useTranslations();

  return (
    <>
      <SectionTitle
        sectionTitle={t('home.joocare-model')}
        textColor="text-white"
        icon="/assets/icons/section-title-white-icon.svg"
      />
      <h3 className="mt-2 text-base font-semibold text-white md:text-xl">
        {title}
      </h3>
      <p className="text-4 mt-6 mb-10 text-sm text-[#F7FAF7] md:text-base">
        {description}
      </p>
      <ul className="flex flex-col items-start gap-8">
        {items.map((item, index) => (
          <li key={item.id} className="flex gap-7">
            <div className={index < items.length - 1 ? 'relative' : undefined}>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary md:h-12 md:w-12 ${
                  index < items.length - 1
                    ? "after:absolute after:top-10 after:left-1/2 after:z-40 after:h-[calc(100%-8px)] after:w-0.5 after:bg-white after:content-[''] md:after:top-12 md:after:h-[calc(100%-16px)]"
                    : ''
                }`}
              >
                <LiquidGlass
                  borderRadius={9999}
                  blur={0.7}
                  contrast={1}
                  brightness={1.2}
                  saturation={1.2}
                  shadowIntensity={0.3}
                  zIndex={1}
                >
                  {index + 1}
                </LiquidGlass>
              </div>
            </div>
            <div>
              <h4 className="my-2 text-base font-semibold md:text-xl">
                {item.title}
              </h4>
              <p className="text-sm font-normal text-[#F7FAF7] md:text-base">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
