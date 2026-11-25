'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { cn } from '@/shared/lib/utils';
import type {
  TalentFilterField,
  TalentFilterValues,
} from '../types/talent-database.types';
import TalentLookupField from './TalentLookupField';

type TalentFilterFieldsProps = {
  fields: TalentFilterField[];
  className?: string;
};

const INPUT_CLASS_NAME = 'bg-card h-13 rounded-full border-border shadow-none';

export default function TalentFilterFields({
  fields,
  className,
}: TalentFilterFieldsProps) {
  const t = useTranslations('companyPage.talent-database');
  const {
    register,
    formState: { errors },
  } = useFormContext<TalentFilterValues>();
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3',
        className,
      )}
    >
      {fields.map((field) => {
        const { lookup } = field;
        if (lookup) {
          return (
            <TalentLookupField
              key={field.key}
              field={{ ...field, lookup }}
              className={INPUT_CLASS_NAME}
            />
          );
        }
        const error = errors[field.key]?.message;
        return (
          <InputField
            key={field.key}
            id={`talent-${field.key}`}
            label={t(`fields.${field.key}`)}
            placeholder={t(field.placeholder ?? 'choose')}
            type={field.kind === 'number' ? 'number' : 'text'}
            min={field.kind === 'number' ? 0 : undefined}
            error={typeof error === 'string' ? error : undefined}
            className={INPUT_CLASS_NAME}
            {...register(field.key)}
          />
        );
      })}
    </div>
  );
}
