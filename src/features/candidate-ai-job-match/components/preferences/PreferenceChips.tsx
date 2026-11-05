import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Option } from '@/shared/components/SelectInputField';

type PreferenceChipsProps = {
  items: Option[];
  /** Show the first letter of each item in a small circle (used for companies). */
  withInitial?: boolean;
  onRemove: (value: string) => void;
};

export default function PreferenceChips({
  items,
  withInitial = false,
  onRemove,
}: PreferenceChipsProps) {
  const t = useTranslations('candidatePage.aiJobMatch.preferences');
  if (!items.length) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item.value}
          className="bg-primary/10 text-primary flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"
        >
          {withInitial && (
            <span
              aria-hidden
              className="bg-card flex size-6 items-center justify-center rounded-full text-xs"
            >
              {item.label.charAt(0)}
            </span>
          )}
          {item.label}
          <button
            type="button"
            onClick={() => onRemove(item.value)}
            aria-label={t('remove', { name: item.label })}
            className="rounded-full focus-visible:outline-2"
          >
            <X aria-hidden className="size-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
