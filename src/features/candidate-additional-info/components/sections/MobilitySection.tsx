'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import YesNoQuestionCard from '@/shared/components/YesNoQuestionCard';
import { MOBILITY_ICONS } from '../../constants';
import { useCountryLookup } from '../../hooks/useLookupOptions';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import LookupMultiSelectField from '../fields/LookupMultiSelectField';
import InfoSection from '../InfoSection';

const QUESTIONS = [
  {
    key: 'relocation',
    answer: 'relocation',
    countries: 'preferredCountries',
    icon: MOBILITY_ICONS.relocation,
  },
  {
    key: 'driving',
    answer: 'drivingLicense',
    countries: 'licenseCountries',
    icon: MOBILITY_ICONS.drivingLicense,
  },
] as const;

export default function MobilitySection() {
  const t = useTranslations('candidatePage.additional-info.mobility');
  const { control } = useFormContext<AdditionalInfoValues>();

  return (
    <InfoSection section="mobility">
      <div className="grid grid-cols-1 gap-6 pb-6 md:px-4 lg:grid-cols-2">
        {QUESTIONS.map(({ key, answer, countries, icon }) => (
          <Controller
            key={key}
            name={answer}
            control={control}
            render={({ field }) => (
              <YesNoQuestionCard
                name={answer}
                icon={icon}
                title={t(`${key}-title`)}
                description={t(`${key}-description`)}
                value={field.value}
                onChange={field.onChange}
                hint={t(`${key}-hint`)}
              >
                <LookupMultiSelectField
                  name={countries}
                  label={t(`${key}-countries`)}
                  placeholder={t('search-countries')}
                  useLookup={useCountryLookup}
                  chipVariant="mobility"
                />
              </YesNoQuestionCard>
            )}
          />
        ))}
      </div>
    </InfoSection>
  );
}
