import SectionTitle from '@/features/home/components/SectionTitle';
import { cn } from '@/shared/lib/utils';
import type { AboutContentSection } from '../types/about.types';
import AboutImageCollage from './AboutImageCollage';

type AboutImageTextBlockProps = AboutContentSection & {
  eyebrow: string;
  fallbackImageAlt: string;
  reversed?: boolean;
};

export default function AboutImageTextBlock({
  eyebrow,
  title,
  description,
  images,
  fallbackImageAlt,
  reversed = false,
}: AboutImageTextBlockProps) {
  return (
    <div className="grid grid-cols-1 items-center justify-center gap-8 px-0 sm:gap-12 sm:px-6 xl:grid-cols-5 xl:gap-16 xl:px-0">
      <div className={cn('xl:col-span-3', reversed && 'xl:order-2')}>
        <div className="mb-2">
          <SectionTitle sectionTitle={eyebrow} textColor="text-foreground" />
        </div>

        <h2 className="text-secondary my-4 text-2xl leading-tight font-bold sm:my-7 sm:text-4xl xl:text-5xl">
          {title}
        </h2>

        <p className="text-muted-foreground my-4 sm:my-7 max-w-4xl text-start text-sm whitespace-pre-line sm:text-xl xl:text-justify">
          {description}
        </p>
      </div>

      <div className={cn('xl:col-span-2', reversed && 'xl:order-1')}>
        <AboutImageCollage images={images} fallbackAlt={fallbackImageAlt} />
      </div>
    </div>
  );
}
