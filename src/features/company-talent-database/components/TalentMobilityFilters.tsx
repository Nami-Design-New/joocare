'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import YesNoQuestionCard, {
  type YesNoValue,
} from '@/shared/components/YesNoQuestionCard';
import { mobilityQuestions } from '../constants/talent-filters';
import type { TalentFilterValues } from '../types/talent-database.types';
import TalentFilterFields from './TalentFilterFields';

function toYesNo(value: unknown): YesNoValue {
  return value === 'yes' || value === 'no' ? value : '';
}

export default function TalentMobilityFilters() {
  const t = useTranslations('companyPage.talent-database');
  const { control } = useFormContext<TalentFilterValues>();
  return (
    <div className="grid grid-cols-1 gap-4 pb-3 sm:gap-6 sm:pb-5 lg:grid-cols-2">
      {mobilityQuestions.map(({ key, countries, icon }) => (
        <Controller
          key={key}
          control={control}
          name={key}
          defaultValue=""
          render={({ field }) => (
            <YesNoQuestionCard
              name={key}
              icon={icon}
              title={t(`fields.${key}`)}
              description={t(`${key}-description`)}
              value={toYesNo(field.value)}
              onChange={field.onChange}
              hint={t(`${key}-hint`)}
              clearable
            >
              <TalentFilterFields
                fields={countries}
                className="md:grid-cols-1"
              />
            </YesNoQuestionCard>
          )}
        />
      ))}
    </div>
  );
}
