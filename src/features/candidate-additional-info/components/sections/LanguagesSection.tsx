'use client';

import { useTranslations } from 'next-intl';
import { LANGUAGE_SLOTS } from '../../constants';
import {
  useLanguageLookup,
  useProficiencyLookup,
} from '../../hooks/useLookupOptions';
import LookupSelectField from '../fields/LookupSelectField';
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
          <LookupSelectField
            name={`languages.${index}.language`}
            label={t('fields.language')}
            placeholder={t('placeholders.select-language')}
            useLookup={useLanguageLookup}
          />
          <LookupSelectField
            name={`languages.${index}.proficiency`}
            label={t('fields.proficiency')}
            placeholder={t('placeholders.select')}
            useLookup={useProficiencyLookup}
            searchable={false}
          />
        </div>
      ))}
    </InfoSection>
  );
}
