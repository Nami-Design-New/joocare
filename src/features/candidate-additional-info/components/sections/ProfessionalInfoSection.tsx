'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import TagsInputField from '@/shared/components/TagsInputField';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import InfoSection from '../InfoSection';

export default function ProfessionalInfoSection() {
  const t = useTranslations('candidatePage.additional-info');
  const { control } = useFormContext<AdditionalInfoValues>();

  return (
    <InfoSection section="professional">
      <Controller
        name="clinicalPrivileges"
        control={control}
        render={({ field }) => (
          <TagsInputField
            id="clinicalPrivileges"
            label={t('fields.clinical-privileges')}
            placeholder={t('placeholders.privilege')}
            value={field.value}
            onChange={field.onChange}
            hint={t('professional.privileges-hint')}
            inputClassName="bg-card border-border shadow-none"
            buttonClassName="border-secondary h-13 w-35 text-sm font-semibold"
            chipVariant="outline"
            chipClassName="text-primary"
          />
        )}
      />
    </InfoSection>
  );
}
