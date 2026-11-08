'use client';

import { useTranslations } from 'next-intl';
import { useController } from 'react-hook-form';
import { PhoneInputCode } from '@/shared/components/PhoneInputCode';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import CvTextField from '../fields/CvTextField';
import CvStepCard from '../wizard/CvStepCard';

// Step 2: email, phone and LinkedIn.
export default function ContactInfoStep() {
  const t = useTranslations('candidatePage.buildCv');
  const phone = useController<CvBuilderValues, 'contact.phone'>({
    name: 'contact.phone',
  });

  return (
    <CvStepCard
      title={t('contact.title')}
      description={t('contact.description')}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <CvTextField
          name="contact.email"
          type="email"
          label={t('contact.email')}
          placeholder={t('contact.email-placeholder')}
          autoComplete="email"
        />
        <div className="flex flex-col">
          <label htmlFor="contact-phone" className="mx-1 mb-1 font-semibold">
            {t('contact.phone')}
          </label>
          <PhoneInputCode
            id="contact-phone"
            defaultCountry="SA"
            international
            value={phone.field.value}
            onChange={phone.field.onChange}
            onBlur={phone.field.onBlur}
            error={Boolean(phone.fieldState.error)}
            className="[&_button]:bg-card [&_input]:bg-card"
          />
        </div>
      </div>
      <CvTextField
        name="contact.linkedin"
        type="url"
        label={t('contact.linkedin')}
        hint={t('common.optional')}
        placeholder={t('contact.linkedin-placeholder')}
      />
    </CvStepCard>
  );
}
