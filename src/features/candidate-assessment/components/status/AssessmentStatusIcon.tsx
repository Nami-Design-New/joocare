import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type AssessmentStatusIconProps = {
  icon: LucideIcon;
  tone: 'warning' | 'success';
};

const TONES = {
  warning: 'bg-warning/12 text-warning',
  success: 'bg-assessment-primary/8 text-assessment-primary',
} as const;

// 112px tinted circle with a status icon (expired clock, submitted check).
export default function AssessmentStatusIcon({
  icon: Icon,
  tone,
}: AssessmentStatusIconProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-20 items-center sm:size-28 justify-center rounded-full',
        TONES[tone],
      )}
    >
      <Icon className="size-10 sm:size-14" strokeWidth={2.5} />
    </span>
  );
}
