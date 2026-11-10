import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { CHAT_ASSET_PATH } from '../constants';

type ChatIconProps = {
  name: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function ChatIcon({
  name,
  width = 20,
  height = width,
  className,
}: ChatIconProps) {
  return (
    <Image
      src={`${CHAT_ASSET_PATH}/${name}.png`}
      width={width}
      height={height}
      alt=""
      style={{ width, height }}
      aria-hidden="true"
      className={cn('shrink-0 object-contain', className)}
      unoptimized
    />
  );
}
