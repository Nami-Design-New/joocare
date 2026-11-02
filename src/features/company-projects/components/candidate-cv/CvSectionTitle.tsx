import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type CvSectionTitleProps = {
  icon: LucideIcon;
  title: string;
  size?: 'md' | 'lg';
};

export default function CvSectionTitle({
  icon: Icon,
  title,
  size = 'md',
}: CvSectionTitleProps) {
  return (
    <h3
      className={cn(
        'text-foreground flex items-center gap-3 font-semibold',
        size === 'lg' ? 'text-[22px] leading-7' : 'text-xl leading-[26px]',
      )}
    >
      <Icon
        aria-hidden="true"
        className="text-primary size-6 shrink-0"
        strokeWidth={1.5}
      />
      {title}
    </h3>
  );
}
