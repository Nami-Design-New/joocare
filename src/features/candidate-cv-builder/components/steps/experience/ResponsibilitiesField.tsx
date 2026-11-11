'use client';

import { Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFieldArray } from 'react-hook-form';
import type { CvBuilderValues } from '../../../types/cv-builder.types';
import CvTextField from '../../fields/CvTextField';
import CvAddButton from '../../wizard/CvAddButton';

type ResponsibilitiesFieldProps = {
  experienceIndex: number;
};

// One input per responsibility: "+" adds a line, "−" removes the others.
export default function ResponsibilitiesField({
  experienceIndex,
}: ResponsibilitiesFieldProps) {
  const t = useTranslations('candidatePage.buildCv.experience');
  const { fields, append, remove } = useFieldArray<
    CvBuilderValues,
    `experience.items.${number}.responsibilities`
  >({ name: `experience.items.${experienceIndex}.responsibilities` });
  const lastIndex = fields.length - 1;

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mx-1 mb-1 font-semibold">
        {t('responsibilities')}
      </legend>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-3">
          <CvTextField
            name={`experience.items.${experienceIndex}.responsibilities.${index}.value`}
            aria-label={t('responsibilities')}
            placeholder={t('responsibilities-placeholder')}
          />
          {index === lastIndex ? (
            <CvAddButton
              variant="dark"
              label={t('add-responsibility')}
              onClick={() => append({ value: '' })}
            />
          ) : (
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={t('remove-responsibility')}
              className="flex size-13 shrink-0 items-center justify-center rounded-full bg-muted text-secondary"
            >
              <Minus aria-hidden className="size-6" strokeWidth={1.5} />
            </button>
          )}
        </div>
      ))}
    </fieldset>
  );
}
