// ─── Sub-components ──────────────────────────────────────────────────────────
import { cn } from '@/shared/lib/utils';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { AccordionSection } from '../../types/index.types';

interface AccordionProps {
  section: AccordionSection;
  isOpen: boolean;
  selected: string[];
  onToggle: () => void;
  onCheck: (value: string, checked: boolean) => void;
}

export default function FilterAccordion({
  section,
  isOpen,
  selected,
  onToggle,
  onCheck,
}: AccordionProps) {
  return (
    <div className="border-border border-b last:border-none">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="hover:text-primary flex w-full items-center justify-between py-3.5 text-left transition-colors"
      >
        <span
          className={cn(
            'text-sm font-semibold transition-colors',
            isOpen ? 'text-secondary' : 'text-foreground/80',
          )}
        >
          {section.label}
        </span>
        {isOpen ? (
          <ChevronUp className="text-muted-foreground h-4 w-4 shrink-0" />
        ) : (
          <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
        )}
      </button>

      {/* Options */}
      {isOpen && (
        <div className="flex flex-col gap-2.5 pb-4">
          {section.helperText ? (
            <p className="text-muted-foreground text-xs">
              {section.helperText}
            </p>
          ) : null}
          {section.options.map((option) => {
            const id = `${section.key}-${option.value}`;
            const checked = selected.includes(option.value);
            return (
              <label
                key={option.value}
                htmlFor={id}
                className={cn(
                  'flex items-center gap-2.5',
                  section.disabled
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer',
                )}
              >
                <input
                  id={id}
                  name={section.name}
                  type={section.type ?? 'checkbox'}
                  value={option.value}
                  checked={checked}
                  disabled={section.disabled}
                  onChange={(event) =>
                    onCheck(option.value, event.target.checked)
                  }
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-[2px] border transition-colors',
                    checked
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-transparent bg-[#E5E7EB] text-white',
                  )}
                >
                  <Check className="h-3.5 w-3.5 stroke-[5px]" />
                </span>
                <span className="text-foreground/75 text-sm font-normal select-none">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
