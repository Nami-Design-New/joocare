'use client';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { Button } from '@/shared/components/ui/button';
import type { TalentFilterValues } from '../types/talent-database.types';

export default function TalentKeywordFilter() {
  const t = useTranslations('companyPage.talent-database');
  const { control } = useFormContext<TalentFilterValues>();
  const [input, setInput] = useState('');
  return (
    <Controller
      name="keywords"
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        const values = Array.isArray(field.value) ? field.value : [];
        function addKeywords() {
          const additions = input
            .split(/[,،]/)
            .map((value) => value.trim())
            .filter(Boolean);
          field.onChange([...new Set([...values, ...additions])]);
          setInput('');
        }
        return (
          <div className="space-y-2">
            <div className="flex items-end gap-3">
              <InputField
                id="talent-keywords"
                label={t('fields.keywords')}
                placeholder={t('keywords-placeholder')}
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addKeywords();
                  }
                }}
                className="bg-card h-13 rounded-full"
              />
              <Button
                type="button"
                variant="outline"
                size="pill"
                disabled={!input.trim()}
                onClick={addKeywords}
              >
                <Plus aria-hidden className="size-4" />
                {t('add')}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => (
                <span
                  key={value}
                  className="bg-primary/10 text-primary flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                >
                  <bdi>{value}</bdi>
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(values.filter((item) => item !== value))
                    }
                    aria-label={t('remove-keyword', { keyword: value })}
                    className="rounded focus-visible:outline-2"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
