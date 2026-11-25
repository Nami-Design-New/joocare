'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import TagsInputField from '@/shared/components/TagsInputField';
import { keywordField } from '../constants/talent-filters';
import type { TalentFilterValues } from '../types/talent-database.types';

export default function TalentKeywordFilter() {
  const t = useTranslations('companyPage.talent-database');
  const { control } = useFormContext<TalentFilterValues>();
  return (
    <Controller
      name={keywordField.key}
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <TagsInputField
          id="talent-keywords"
          label={t(`fields.${keywordField.key}`)}
          placeholder={t('keywords-placeholder')}
          value={Array.isArray(field.value) ? field.value : []}
          onChange={field.onChange}
          inputClassName="bg-card"
        />
      )}
    />
  );
}
