'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { CarFront, Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { COUNTRIES } from '../constants/talent-filters';
import type { TalentFilterValues } from '../types/talent-database.types';
import TalentFilterFields from './TalentFilterFields';

export default function TalentMobilityFilters() {
  const t = useTranslations('companyPage.talent-database');
  const { control } = useFormContext<TalentFilterValues>();
  return (
    <div className="grid grid-cols-1 gap-6 pb-5 lg:grid-cols-2">
      {(
        [
          { key: 'relocation', countries: 'preferred-countries', Icon: Plane },
          {
            key: 'driving-license',
            countries: 'issuing-countries',
            Icon: CarFront,
          },
        ] as const
      ).map(({ key, countries, Icon }) => (
        <section
          key={key}
          className="bg-card flex flex-col gap-5 rounded-3xl p-5 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <span className="bg-primary/10 text-primary rounded-lg p-2">
              <Icon aria-hidden className="size-6" />
            </span>
            <div>
              <h3 className="font-semibold">{t(`fields.${key}`)}</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {t(`${key}-description`)}
              </p>
            </div>
          </div>
          <Controller
            control={control}
            name={key}
            defaultValue=""
            render={({ field }) => (
              <fieldset className="flex flex-wrap gap-8">
                <legend className="sr-only">{t(`fields.${key}`)}</legend>
                {['yes', 'no'].map((value) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-3 text-sm"
                  >
                    <input
                      type="radio"
                      name={key}
                      value={value}
                      checked={field.value === value}
                      onChange={() => field.onChange(value)}
                      className="accent-primary size-5"
                    />
                    {t(value)}
                  </label>
                ))}
                {field.value && (
                  <button
                    type="button"
                    onClick={() => field.onChange('')}
                    className="text-primary text-sm underline"
                  >
                    {t('clear')}
                  </button>
                )}
              </fieldset>
            )}
          />
          <div className="border-border border-t pt-5">
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
            <p className="text-muted-foreground mt-3 text-sm">
              {t(`${key}-hint`)}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}
