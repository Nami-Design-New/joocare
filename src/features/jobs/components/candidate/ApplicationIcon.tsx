import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

// Icons exported from the Job Applications design (public/assets/job-applications).
export type ApplicationIconName =
  | 'arrow'
  | 'category'
  | 'location'
  | 'salary'
  | 'save'
  | 'saved'
  | 'search'
  | 'share'
  | 'sparkles';

type ApplicationIconProps = {
  name: ApplicationIconName;
  size?: number;
  className?: string;
};

export default function ApplicationIcon({
  name,
  size = 16,
  className,
}: ApplicationIconProps) {
  return (
    <Image
      src={`/assets/job-applications/${name}.png`}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      alt=""
      aria-hidden
      unoptimized
      className={cn('shrink-0', className)}
    />
  );
}
