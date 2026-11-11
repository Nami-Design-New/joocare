import Image from 'next/image';
import type { AboutImage } from '../types/about.types';
import { ABOUT_FALLBACK_IMAGES } from '../constants';

type AboutImageCollageProps = {
  images: AboutImage[];
  fallbackAlt: string;
};

export default function AboutImageCollage({
  images,
  fallbackAlt,
}: AboutImageCollageProps) {
  const [primaryImage, secondaryImage] = images;

  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[340px] sm:h-[520px] sm:max-w-[520px] xl:max-w-none">
      <div className="absolute end-0 top-0 h-full w-[80%] overflow-hidden rounded-[30px] sm:rounded-[40px]">
        <Image
          src={primaryImage?.image || ABOUT_FALLBACK_IMAGES.primary}
          alt={primaryImage?.alt || fallbackAlt}
          fill
          className="object-cover"
        />
      </div>

      <div className="absolute start-0 top-[29.5%] h-1/2 w-1/2 overflow-hidden rounded-[22px] border-8 border-card shadow-xl sm:rounded-[30px] sm:border-12">
        <Image
          src={secondaryImage?.image || ABOUT_FALLBACK_IMAGES.secondary}
          alt={secondaryImage?.alt || fallbackAlt}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
