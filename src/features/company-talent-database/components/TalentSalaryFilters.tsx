'use client';

import { useTranslations } from 'next-intl';
import TalentFilterFields from './TalentFilterFields';

export default function TalentSalaryFilters() {
  const t = useTranslations('companyPage.talent-database');
  return (
    <div className="space-y-5">
      {['current', 'expected'].map((range) => (
        <fieldset key={range}>
          <legend className="mb-2 font-semibold">{t(`${range}-salary`)}</legend>
          <TalentFilterFields
            fields={[
              { key: `${range}-min`, kind: 'number', placeholder: 'minimum' },
              { key: `${range}-max`, kind: 'number', placeholder: 'maximum' },
              {
                key: `${range}-currency`,
                options: ['usd', 'sar', 'aed', 'egp'],
              },
            ]}
            className="md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_110px]"
          />
        </fieldset>
      ))}
    </div>
  );
}
