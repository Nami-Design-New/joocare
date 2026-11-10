'use client';

import { useTranslations } from 'next-intl';
import { LANGUAGE_SLOTS, PROFICIENCY_LEVELS } from '../../constants';
import { LANGUAGE_OPTIONS } from '../../constants/additional-info-preview-data';
import FormSelectField from '../fields/FormSelectField';
import OptionsSelectField from '../fields/OptionsSelectField';
import InfoSection from '../InfoSection';

const SLOTS = Array.from({ length: LANGUAGE_SLOTS }, (_, index) => index);

export default function LanguagesSection() {
  const t = useTranslations('candidatePage.additional-info');

  return (
    <InfoSection section="languages">
      {SLOTS.map((index) => (
        <div
          key={index}
          className="grid grid-cols-1 items-start gap-5 md:grid-cols-2"
        >
          <FormSelectField
            name={`languages.${index}.language`}
            label={t('fields.language')}
            placeholder={t('placeholders.select-language')}
            options={LANGUAGE_OPTIONS}
          />
          <OptionsSelectField
            name={`languages.${index}.proficiency`}
            label={t('fields.proficiency')}
            placeholder={t('placeholders.select')}
            options={PROFICIENCY_LEVELS}
          />
        </div>
      ))}
    </InfoSection>
  );
}
