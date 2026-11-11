import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type ChoiceCardProps = {
  type: 'checkbox' | 'radio';
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

// A bordered option card with a checkbox or radio control, used for single and multi choice preferences.
export default function ChoiceCard({
  type,
  name,
  value,
  label,
  checked,
  onChange,
}: ChoiceCardProps) {
  return (
    <label
      className={cn(
        'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm transition-colors',
        'has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50',
        checked
          ? 'border-primary bg-primary/10 text-primary'
          : 'text-secondary hover:border-primary/50',
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          'flex size-5 shrink-0 items-center justify-center border border-input',
          type === 'radio' ? 'rounded-full' : 'rounded-[4px]',
          checked && 'border-primary',
          checked &&
            type === 'checkbox' &&
            'bg-primary text-primary-foreground',
        )}
      >
        {checked && type === 'checkbox' && <Check className="size-3.5" />}
        {checked && type === 'radio' && (
          <span className="size-2.5 rounded-full bg-primary" />
        )}
      </span>
      {label}
    </label>
  );
}
