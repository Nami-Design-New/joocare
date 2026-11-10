import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '../lib/utils';
import type { Option } from './SelectInputField';

const chipVariants = cva('flex items-center rounded-full', {
  variants: {
    variant: {
      /** Tinted chip with no border. */
      soft: 'bg-primary/10 text-primary gap-2 px-3 py-1.5 text-sm font-medium',
      /** Tinted chip with a border, colored by `text-*` (current color). */
      outline:
        'border-current/20 bg-current/8 h-8 gap-1.5 border py-1.5 ps-3 pe-2 text-sm font-medium',
      /** Mobility card chip (relocation / driving license countries). */
      mobility:
        'bg-question-card-chip text-question-card-accent gap-2.5 px-5 py-2.5 text-sm font-semibold',
    },
  },
  defaultVariants: { variant: 'soft' },
});

type RemovableChipsProps = VariantProps<typeof chipVariants> & {
  items: Option[];
  onRemove: (value: string) => void;
  /** Show the first letter of each item in a small circle (used for companies). */
  withInitial?: boolean;
  className?: string;
  chipClassName?: string;
};

// Selected values shown as chips with a remove button.
export default function RemovableChips({
  items,
  onRemove,
  variant = 'soft',
  withInitial = false,
  className,
  chipClassName,
}: RemovableChipsProps) {
  const t = useTranslations('common');
  if (!items.length) return null;

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => (
        <li
          key={item.value}
          className={cn(chipVariants({ variant }), chipClassName)}
        >
          {withInitial && (
            <span
              aria-hidden
              className="bg-card flex size-6 items-center justify-center rounded-full text-xs"
            >
              {item.label.charAt(0)}
            </span>
          )}
          <bdi>{item.label}</bdi>
          <button
            type="button"
            onClick={() => onRemove(item.value)}
            aria-label={t('remove-item', { name: item.label })}
            className="cursor-pointer rounded-full focus-visible:outline-2"
          >
            <X
              aria-hidden
              strokeWidth={variant === 'soft' ? 2 : 2.5}
              className={variant === 'soft' ? 'size-4' : 'size-3.5'}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
