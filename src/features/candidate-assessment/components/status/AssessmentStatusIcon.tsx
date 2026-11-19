import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

type AssessmentStatusIconProps = {
  tone: 'warning' | 'success';
};

const TONES = {
  warning: 'bg-warning/12 text-warning',
  success: 'bg-assessment-primary/8 text-assessment-primary',
} as const;

// 112px tinted circle with a status icon (expired clock, submitted check).
export default function AssessmentStatusIcon({
  tone,
}: AssessmentStatusIconProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-20 items-center justify-center rounded-full sm:size-28',
        TONES[tone],
      )}
    >
      <Image
        src={`/assets/candidate-assessment/figma/${tone === 'warning' ? 'expired' : 'taken'}.svg`}
        alt=""
        width={tone === 'warning' ? 56 : 44.8}
        height={tone === 'warning' ? 56 : 44.8}
      />
    </span>
  );
}
