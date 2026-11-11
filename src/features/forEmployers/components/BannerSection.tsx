import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { MoveLeft, MoveRight } from 'lucide-react';
import Image from 'next/image';
import type { BannerSectionProps } from '../types';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function BannerSection({
  title,
  description,
  image,
}: BannerSectionProps) {
  const t = await getTranslations();
  const locale = await getLocale();

  const bannerImage = image ?? {
    id: 'fallback-banner',
    image: '/assets/employers/bannerImg.png',
    alt: t('forEmployersPage.banner-image-alt'),
  };
  // console.log(locale);

  return (
    <section className="relative bg-white">
      <div className="bg-primary-gradient relative mx-auto flex flex-col items-center gap-6 rounded-[50px] px-4 sm:px-6 md:gap-10 lg:gap-16 lg:px-0 lg:py-4 xl:flex-row">
        {/* <div className="absolute top-1/2 -left-20 h-11.5 w-75 -translate-y-1/2 rotate-22 rounded-full bg-primary-bg opacity-80 blur-[200px] sm:-left-40 sm:w-[503px]" />
         */}
        <div className="relative px-4 pt-8 text-center text-white sm:px-6 md:px-16">
          <div className="top-0 left-1/5 hidden h-full w-18 -rotate-45 rounded-full bg-white blur-[120px] sm:absolute sm:block" />
          <h2 className="mb-4 text-[clamp(1.375rem,2.8vw,3rem)] leading-tight font-bold text-white">
            {title}
          </h2>

          <p className="text-[clamp(.75rem,2.8vw,1rem)] leading-relaxed opacity-90">
            {description}
          </p>

          <Link
            href="/auth/employer/register"
            className={cn(
              buttonVariants({
                variant: 'default',
                size: 'pill',
                hoverStyle: 'slideSecondary',
              }),
              'mx-auto mt-6 flex w-full items-center justify-center gap-2 sm:mt-8 sm:w-fit',
            )}
          >
            {t('forEmployersPage.get-started-now')}
            {locale === 'ar' ? (
              <MoveLeft className="mt-0.75" size={16} />
            ) : (
              <MoveRight className="mt-0.75" size={16} />
            )}
          </Link>
        </div>

        <div className="flex w-full items-center justify-center rounded-2xl xl:mt-0 xl:items-start">
          <Image
            src={bannerImage.image}
            alt={bannerImage.alt}
            width={500}
            height={600}
            className={`relative bottom-0 h-75 object-contain sm:h-98 xl:absolute ${locale === 'ar' ? 'xl:-left-12' : 'xl:-right-12'}`}
          />
        </div>
      </div>
    </section>
  );
}
