'use client';

import { useTranslations } from 'next-intl';
import { INDUSTRY_OPTIONS } from '../../constants/additional-info-preview-data';
import {
  useAvailabilityLookup,
  useCountryLookup,
  useJobTitleLookup,
} from '../../hooks/useLookupOptions';
import JobSearchStatusField from '../fields/JobSearchStatusField';
import LookupMultiSelectField from '../fields/LookupMultiSelectField';
import LookupSelectField from '../fields/LookupSelectField';
import InfoSection from '../InfoSection';

export default function CareerPreferencesSection() {
  const t = useTranslations('candidatePage.additional-info');

  return (
    <InfoSection section="career">
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
        <LookupMultiSelectField
          name="designations"
          label={t('fields.designations')}
          placeholder={t('placeholders.search-titles')}
          useLookup={useJobTitleLookup}
        />
        <LookupMultiSelectField
          name="workLocations"
          label={t('fields.work-locations')}
          placeholder={t('placeholders.search-countries')}
          useLookup={useCountryLookup}
        />
        <LookupMultiSelectField
          name="industries"
          label={t('fields.industries')}
          placeholder={t('placeholders.search-industries')}
          options={INDUSTRY_OPTIONS}
        />
      </div>
      <LookupSelectField
        name="noticePeriod"
        label={t('fields.notice-period')}
        placeholder={t('placeholders.select')}
        useLookup={useAvailabilityLookup}
      />
      <JobSearchStatusField />
    </InfoSection>
  );
}
