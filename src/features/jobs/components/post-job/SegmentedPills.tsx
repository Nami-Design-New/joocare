import { cn } from '@/shared/lib/utils';

type SegmentedPillsProps<T extends string> = {
  name: string;
  label: string;
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
  className?: string;
};

// Equal pills, one selectable (Yes / No, Required / Optional). Selected = green, others grey.
export default function SegmentedPills<T extends string>({
  name,
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedPillsProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'grid grid-cols-2 gap-2 rounded-full bg-foreground/5 p-2',
        className,
      )}
    >
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              'flex h-11 cursor-pointer items-center justify-center rounded-full px-2 text-base transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring',
              checked
                ? 'bg-primary text-primary-foreground'
                : 'bg-foreground/8 text-foreground/65 hover:bg-foreground/12',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
