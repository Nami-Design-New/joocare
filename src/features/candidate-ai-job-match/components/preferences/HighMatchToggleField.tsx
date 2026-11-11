'use client';

import { Target } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type Control, Controller } from 'react-hook-form';
import { Switch } from '@/shared/components/ui/switch';
import { HIGH_MATCH_THRESHOLD } from '../../constants';
import type { TJobPreferencesSchema } from '../../validation/job-preferences-schema';

type HighMatchToggleFieldProps = {
  control: Control<TJobPreferencesSchema>;
};

export default function HighMatchToggleField({
  control,
}: HighMatchToggleFieldProps) {
  const t = useTranslations('candidatePage.aiJobMatch.preferences');

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-5">
      <p className="font-semibold text-secondary">{t('match-preference')}</p>
      <Controller
        name="highMatchOnly"
        control={control}
        render={({ field }) => (
          <label
            htmlFor="highMatchOnly"
            className="flex cursor-pointer items-center gap-3"
          >
            <Target aria-hidden className="size-6 shrink-0 text-primary" />
            <span className="flex-1">
              <span className="block font-semibold text-secondary">
                {t('high-match-only')}
              </span>
              <span className="block text-sm text-muted-foreground">
                {t('high-match-description', {
                  threshold: HIGH_MATCH_THRESHOLD,
                })}
              </span>
            </span>
            <Switch
              id="highMatchOnly"
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[size=default]:h-7 data-[size=default]:w-12 [&_[data-slot=switch-thumb]]:size-6"
            />
          </label>
        )}
      />
    </div>
  );
}
