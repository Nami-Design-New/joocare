import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

type DashboardIconProps = {
  name: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function DashboardIcon({
  name,
  width = 20,
  height = width,
  className,
}: DashboardIconProps) {
  return (
    <Image
      src={'/assets/company-dashboard/' + name + '.png'}
      width={width}
      height={height}
      style={{ width, height }}
      alt=""
      aria-hidden="true"
      unoptimized
      className={cn('shrink-0 object-contain', className)}
    />
  );
}
