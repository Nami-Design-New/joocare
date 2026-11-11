'use client';

import { useState, type ComponentProps } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '../lib/utils';
import { InputField } from './InputField';
import RemovableChips from './RemovableChips';
import { Button } from './ui/button';

type TagsInputFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
  inputClassName?: string;
  buttonClassName?: string;
  chipVariant?: ComponentProps<typeof RemovableChips>['variant'];
  chipClassName?: string;
};

// Free-text tags: type a value (or several, comma separated), press Enter or "Add".
export default function TagsInputField({
  id,
  label,
  placeholder,
  value,
  onChange,
  hint,
  inputClassName,
  buttonClassName,
  chipVariant,
  chipClassName,
}: TagsInputFieldProps) {
  const t = useTranslations('common');
  const [input, setInput] = useState('');

  function addTags() {
    const additions = input
      .split(/[,،]/)
      .map((item) => item.trim())
      .filter(Boolean);
    onChange([...new Set([...value, ...additions])]);
    setInput('');
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-4">
        <InputField
          id={id}
          label={label}
          placeholder={placeholder}
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addTags();
            }
          }}
          className={cn('h-13 rounded-full', inputClassName)}
        />
        <Button
          type="button"
          variant="outline"
          size="pill"
          disabled={!input.trim()}
          onClick={addTags}
          className={buttonClassName}
        >
          <Plus aria-hidden className="size-4" />
          {t('add')}
        </Button>
      </div>
      <RemovableChips
        variant={chipVariant}
        chipClassName={chipClassName}
        items={value.map((item) => ({ value: item, label: item }))}
        onRemove={(item) => onChange(value.filter((tag) => tag !== item))}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
