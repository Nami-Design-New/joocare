'use client';

import { useTranslations } from 'next-intl';
import type { TalentFilterField } from '../types/talent-database.types';
import TalentFilterFields from './TalentFilterFields';

// Module-level so each range keeps the same `fields` reference across
// renders; TalentFilterFields memoizes its select options on it.
const SALARY_RANGES = ['current', 'expected'].map((range) => ({
  range,
  fields: [
    { key: `${range}-min`, kind: 'number', placeholder: 'minimum' },
    { key: `${range}-max`, kind: 'number', placeholder: 'maximum' },
    { key: `${range}-currency`, options: ['usd', 'sar', 'aed', 'egp'] },
  ] as TalentFilterField[],
}));

export default function TalentSalaryFilters() {
  const t = useTranslations('companyPage.talent-database');
  return (
    <div className="space-y-4 sm:space-y-5">
      {SALARY_RANGES.map(({ range, fields }) => (
        <fieldset key={range}>
          <legend className="mb-2 font-semibold">{t(`${range}-salary`)}</legend>
          <TalentFilterFields
            fields={fields}
            className="grid-cols-2 gap-3 sm:gap-5 [&>*:last-child]:col-span-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_110px] md:[&>*:last-child]:col-span-1"
          />
        </fieldset>
      ))}
    </div>
  );
}
