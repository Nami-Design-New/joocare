'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import YesNoQuestionCard, {
  type YesNoValue,
} from '@/shared/components/YesNoQuestionCard';
import { COUNTRIES } from '../constants/talent-filters';
import type {
  TalentFilterField,
  TalentFilterValues,
} from '../types/talent-database.types';
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

// Stable `fields` per question; TalentFilterFields memoizes its options on it.
const COUNTRY_FIELDS = Object.fromEntries(
  MOBILITY_QUESTIONS.map(({ countries }) => [
    countries,
    [
      {
        key: countries,
        kind: 'multi',
        options: COUNTRIES,
        placeholder: 'search-countries',
      },
    ] as TalentFilterField[],
  ]),
) as Record<(typeof MOBILITY_QUESTIONS)[number]['countries'], TalentFilterField[]>;

export default function TalentMobilityFilters() {
  const t = useTranslations('companyPage.talent-database');
  const { control } = useFormContext<TalentFilterValues>();
  return (
    <div className="grid grid-cols-1 gap-4 pb-3 sm:gap-6 sm:pb-5 lg:grid-cols-2">
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
                fields={COUNTRY_FIELDS[countries]}
                className="md:grid-cols-1"
              />
            </YesNoQuestionCard>
          )}
        />
      ))}
    </div>
  );
}
