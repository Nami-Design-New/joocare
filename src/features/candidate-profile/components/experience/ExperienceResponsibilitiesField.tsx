'use client';

import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  type Control,
  type UseFormRegister,
  useFieldArray,
  useFormState,
} from 'react-hook-form';
import { InputField } from '@/shared/components/InputField';
import { Button } from '@/shared/components/ui/button';
import type { ExperienceModalFormData } from '../../validation/experience-modal-schema';

type ExperienceResponsibilitiesFieldProps = {
  control: Control<ExperienceModalFormData>;
  register: UseFormRegister<ExperienceModalFormData>;
};

export default function ExperienceResponsibilitiesField({
  control,
  register,
}: ExperienceResponsibilitiesFieldProps) {
  const t = useTranslations('candidatePage.profile');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'responsibilities',
  });
  const { errors } = useFormState({ control, name: 'responsibilities' });
  const lastIndex = fields.length - 1;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium">{t('responsibilities')}</span>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-2">
          <InputField
            id={`responsibilities-${index}`}
            aria-label={t('responsibilities')}
            placeholder={t('responsibilities-placeholder')}
            {...register(`responsibilities.${index}.value`)}
            error={errors.responsibilities?.[index]?.value?.message}
          />

          {index === lastIndex ? (
            <Button
              type="button"
              variant="secondary"
              aria-label={t('add-responsibility')}
              onClick={() => append({ value: '' })}
              className="h-13 w-15 shrink-0 rounded-full"
            >
              <Plus className="size-6" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              aria-label={t('remove-responsibility')}
              onClick={() => remove(index)}
              className="bg-muted text-secondary h-13 w-15 shrink-0 rounded-full"
            >
              <Minus className="size-6" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
