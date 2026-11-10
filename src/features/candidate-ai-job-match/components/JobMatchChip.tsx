import { cn } from '@/shared/lib/utils';
import { CHECK_CIRCLE_MASK_ICON } from '../constants/job-match-icons';

type JobMatchChipProps = {
  label: string;
  /** Tinted classes for the match level chip; omit for a plain highlight chip. */
  toneClassName?: string;
  /** Check icon color for the match level chip. */
  iconClassName?: string;
};

export default function JobMatchChip({
  label,
  toneClassName,
  iconClassName,
}: JobMatchChipProps) {
  return (
    <li
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs leading-[15px]',
        toneClassName ?? 'border-border bg-foreground/3 text-secondary',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'size-3.5',
          CHECK_CIRCLE_MASK_ICON,
          iconClassName ?? 'text-match-check',
        )}
      />
      {label}
    </li>
  );
}
