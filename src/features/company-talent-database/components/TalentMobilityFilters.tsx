'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import YesNoQuestionCard, {
  type YesNoValue,
} from '@/shared/components/YesNoQuestionCard';
import { COUNTRIES } from '../constants/talent-filters';
import type { TalentFilterValues } from '../types/talent-database.types';
import TalentFilterFields from './TalentFilterFields';

const MOBILITY_QUESTIONS = [
  {
    key: 'relocation',
    countries: 'preferred-countries',
    icon: '/assets/icons/mobility/plane.svg',
  },
  {
    key: 'driving-license',
    countries: 'issuing-countries',
    icon: '/assets/icons/mobility/car.svg',
  },
] as const;

export default function TalentMobilityFilters() {
  const t = useTranslations('companyPage.talent-database');
  const { control } = useFormContext<TalentFilterValues>();
  return (
    <div className="grid grid-cols-1 gap-6 pb-5 lg:grid-cols-2">
      {MOBILITY_QUESTIONS.map(({ key, countries, icon }) => (
        <Controller
          key={key}
          control={control}
          name={key}
          render={({ field }) => (
            <YesNoQuestionCard
              name={key}
              icon={icon}
              title={t(`fields.${key}`)}
              description={t(`${key}-description`)}
              value={field.value as YesNoValue}
              onChange={field.onChange}
              hint={t(`${key}-hint`)}
            >
              <TalentFilterFields
                fields={[
                  {
                    key: countries,
                    kind: 'multi',
                    options: COUNTRIES,
                    placeholder: 'search-countries',
                  },
                ]}
                className="md:grid-cols-1"
              />
            </YesNoQuestionCard>
          )}
        />
      ))}
    </div>
  );
}
