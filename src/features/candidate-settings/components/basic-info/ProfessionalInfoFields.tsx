'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';

import { InputField } from '@/shared/components/InputField';
import {
  SelectInputField,
  type Option,
} from '@/shared/components/SelectInputField';
import useGetCategories from '@/shared/hooks/useGetCategories';
import useGetDomains from '@/shared/hooks/useGetDomains';

import type { BasicInfoLookupItem } from '../../types/basic-info.types';
import type { TSettingBasicInfoSchema } from '../../validation/basic-info-schema';

type ProfessionalInfoFieldsProps = {
  control: Control<TSettingBasicInfoSchema>;
  register: UseFormRegister<TSettingBasicInfoSchema>;
  errors: FieldErrors<TSettingBasicInfoSchema>;
};

function toLookupOptions(items: BasicInfoLookupItem[]): Option[] {
  return items
    .map((item) => ({
      label: String(item.title ?? item.name ?? ''),
      value: String(item.id),
    }))
    .filter((option) => option.label);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : undefined;
}

export default function ProfessionalInfoFields({
  control,
  register,
  errors,
}: ProfessionalInfoFieldsProps) {
  const t = useTranslations('candidateSettingsPage');
  const tAuth = useTranslations('authPage.common');
  const tJobDetails = useTranslations('jobDetailsPage');
  const [domainSearch, setDomainSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  const {
    domains,
    isLoading: isDomainsLoading,
    error: domainsError,
    hasNextPage: hasMoreDomains,
    fetchNextPage: fetchMoreDomains,
    isFetchingNextPage: isFetchingMoreDomains,
  } = useGetDomains(domainSearch);
  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    hasNextPage: hasMoreCategories,
    fetchNextPage: fetchMoreCategories,
    isFetchingNextPage: isFetchingMoreCategories,
  } = useGetCategories(categorySearch);

  const domainOptions = toLookupOptions(domains);
  const categoryOptions = toLookupOptions(categories);

  return (
    <>
      <div className="flex flex-col gap-5 lg:flex-row">
        <InputField
          id="specialty"
          type="text"
          label={tJobDetails('specialty')}
          containerStyles="flex-1 min-w-0"
          placeholder={t('placeholders.specialty')}
          {...register('specialty')}
          error={errors.specialty?.message}
        />
        <InputField
          id="subspecialty"
          type="text"
          label={t('subspecialty')}
          containerStyles="flex-1 min-w-0"
          placeholder={t('placeholders.subspecialty')}
          {...register('subspecialty')}
          error={errors.subspecialty?.message}
        />
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <Controller
          name="domain"
          control={control}
          render={({ field }) => (
            <SelectInputField
              id="domain"
              containerStyles="min-w-0 flex-1"
              label={tAuth('domain')}
              placeholder={t('placeholders.choose')}
              withSearchInput
              searchPlaceholder={t('placeholders.search-domains')}
              {...field}
              error={errors.domain?.message ?? getErrorMessage(domainsError)}
              options={domainOptions}
              disabled={isDomainsLoading}
              onReachEnd={() => fetchMoreDomains()}
              hasNextPage={Boolean(hasMoreDomains)}
              isFetchingNextPage={isFetchingMoreDomains}
              onSearchChange={setDomainSearch}
              allowDeselect
            />
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <SelectInputField
              id="category"
              containerStyles="min-w-0 flex-1"
              label={t('category')}
              placeholder={t('placeholders.choose')}
              withSearchInput
              searchPlaceholder={t('placeholders.search-categories')}
              {...field}
              error={
                errors.category?.message ?? getErrorMessage(categoriesError)
              }
              options={categoryOptions}
              disabled={isCategoriesLoading}
              onReachEnd={() => fetchMoreCategories()}
              hasNextPage={Boolean(hasMoreCategories)}
              isFetchingNextPage={isFetchingMoreCategories}
              onSearchChange={setCategorySearch}
              allowDeselect
            />
          )}
        />
      </div>
    </>
  );
}
