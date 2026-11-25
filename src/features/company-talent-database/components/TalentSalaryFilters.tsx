'use client';

import { useTranslations } from 'next-intl';
import { salaryRanges } from '../constants/talent-filters';
import TalentFilterFields from './TalentFilterFields';

export default function TalentSalaryFilters() {
  const t = useTranslations('companyPage.talent-database');
  return (
    <div className="space-y-4 sm:space-y-5">
      {salaryRanges.map(({ range, fields }) => (
        <fieldset key={range}>
          <legend className="mb-2 font-semibold">{t(`${range}-salary`)}</legend>
          <TalentFilterFields
            fields={fields}
            className="grid-cols-2 gap-3 sm:gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_110px] [&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-1"
          />
        </fieldset>
      ))}
    </div>
  );
}
