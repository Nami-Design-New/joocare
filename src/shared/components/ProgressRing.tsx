import { cn } from '../lib/utils';

type ProgressRingProps = {
  /** 0 – 100. */
  value: number;
  label: string;
  /** Diameter in px. */
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Classes of the percentage text. */
  valueClassName?: string;
  /** Classes of the track / progress circles (stroke color). */
  trackClassName?: string;
  indicatorClassName?: string;
};

// Circular progress with the percentage in the middle.
export default function ProgressRing({
  value,
  label,
  size = 72,
  strokeWidth = 7,
  className,
  valueClassName,
  trackClassName = 'stroke-border',
  indicatorClassName = 'stroke-primary',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{ width: size, height: size }}
      className={cn('relative shrink-0', className)}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="size-full -rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          className={cn(
            'transition-[stroke-dashoffset] rtl:-scale-x-100',
            indicatorClassName,
          )}
          style={{ transformOrigin: 'center' }}
        />
      </svg>
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center text-lg font-semibold',
          valueClassName,
        )}
      >
        {value}%
      </span>
    </div>
  );
}
