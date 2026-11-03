'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { FormEvent, ReactNode } from 'react';
import { assessmentSeeds } from '@/features/company-assessments/constants/assessment-data';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { InputField } from '@/shared/components/InputField';
import { SelectInputField } from '@/shared/components/SelectInputField';
import SearchInput from '@/shared/components/SearchInput';
import { Button } from '@/shared/components/ui/button';
import { Link, useRouter } from '@/i18n/navigation';
import useGetCountries from '@/shared/hooks/useGetCountries';
import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import {
  ASSESSMENT_STATUS_FILTERS,
  MEDICAL_LICENSE_VALUES,
  PIPELINE_FILTER_KEYS,
  PIPELINE_FILTER_LABEL_KEYS,
  RECRUITER_FILTER_PREVIEW,
  STARRED_FILTER_VALUE,
} from '../../constants';
import type { PipelineFilterKey } from '../../types/job-candidates.types';
import { getJobCandidatesHref } from '../../utils';
import { useGetCompanyJob } from '../../hooks/useGetCompanyJob';
import useGetApplicationsCandidates from '../../hooks/useGetApplicationsCandidates';
import JobCandidatesHeader from './JobCandidatesHeader';

type PipelineFiltersPageProps = {
  jobId: number;
};

function readDraft(get: (key: string) => string) {
  return Object.fromEntries(
    PIPELINE_FILTER_KEYS.map((key) => [key, get(key)]),
  ) as Record<PipelineFilterKey, string>;
}

export default function PipelineFiltersPage({ jobId }: PipelineFiltersPageProps) {
  const t = useTranslations('companyPage.candidates.filters-page');
  const tOptions = useTranslations('companyPage.talent-database.options');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { get } = useUrlFilters();
  const { data: job } = useGetCompanyJob(jobId);
  const countryQuery = useGetCountries();
  const appliedFilters = useMemo(() => readDraft(get), [get]);
  const { data: candidatesPage } = useGetApplicationsCandidates({
    jobId,
    page: 1,
    filters: appliedFilters,
  });
  const [draft, setDraft] = useState(() => readDraft(get));
  const [starred, setStarred] = useState(
    () => get('starred') === STARRED_FILTER_VALUE,
  );
  const countryOptions = countryQuery.countries.map(
    (country: { id: number; name: string }) => ({
      value: String(country.id),
      label: country.name,
    }),
  );
  const nationalityOptions = ['egyptian', 'saudi', 'emirati', 'qatari'].map(
    (value) => ({ value, label: tOptions(value) }),
  );
  const statusOptions = ASSESSMENT_STATUS_FILTERS.map((value) => ({
    value,
    label: t(`assessment-statuses.${value}`),
  }));
  const assessmentOptions = assessmentSeeds.map((assessment) => ({
    value: assessment.id,
    label: assessment.title,
  }));
  const licenseOptions = MEDICAL_LICENSE_VALUES.map((value) => ({
    value,
    label: t(value === '1' ? 'with-license' : 'without-license'),
  }));
  const recruiterOptions = RECRUITER_FILTER_PREVIEW.map((value) => ({
    value,
    label: value,
  }));
  const updateDraft = (key: PipelineFilterKey, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  function resetAll() {
    setDraft(readDraft(() => ''));
    setStarred(false);
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    [...PIPELINE_FILTER_KEYS, 'country_label', 'nationality_label', 'page'].forEach(
      (key) => params.delete(key),
    );
    PIPELINE_FILTER_KEYS.forEach((key) => {
      const value = draft[key].trim();
      if (value) params.set(key, value);
    });
    if (starred) params.set('starred', STARRED_FILTER_VALUE);
    const selectedCountry = countryOptions.find(
      (option) => option.value === draft.country,
    );
    if (selectedCountry) {
      params.set(PIPELINE_FILTER_LABEL_KEYS.country, selectedCountry.label);
    }
    if (draft.nationality) {
      params.set(
        PIPELINE_FILTER_LABEL_KEYS.nationality,
        tOptions(draft.nationality),
      );
    }
    const query = params.toString();
    router.replace(
      `${getJobCandidatesHref(jobId)}${query ? `?${query}` : ''}`,
      { scroll: false },
    );
  }

  const jobTitle =
    job?.title ?? job?.job_title?.title ?? t('unknown-job');

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <JobCandidatesHeader jobId={jobId} />
      <Link
        href={`${getJobCandidatesHref(jobId)}${searchParams.size ? `?${searchParams.toString()}` : ''}`}
        className="text-primary flex w-fit items-center gap-2 text-sm font-semibold"
      >
        <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
        {t('back')}
      </Link>
      <div>
        <h2 className="text-foreground text-2xl font-semibold">{t('title')}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('description', {
            count: candidatesPage?.total ?? 0,
            job: jobTitle,
          })}
        </p>
      </div>

      <form
        onSubmit={applyFilters}
        className="bg-card flex flex-col gap-7 rounded-3xl p-6 md:p-8"
      >
        <section className="flex flex-col gap-4">
          <h3 className="text-foreground text-base font-semibold">
            {t('candidate-details')}
          </h3>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
            <FilterField label={t('name')}>
              <SearchInput
                id="pipeline-filter-name"
                value={draft.search}
                onChange={(event) => updateDraft('search', event.target.value)}
                placeholder={t('search-name')}
                iconClassName="size-4.5"
                className="border-border bg-card h-13 border ps-11 shadow-none"
              />
            </FilterField>
            <FilterField label={t('email')}>
              <SearchInput
                id="pipeline-filter-email"
                value={draft.email}
                onChange={(event) => updateDraft('email', event.target.value)}
                placeholder={t('search-email')}
                iconClassName="size-4.5"
                className="border-border bg-card h-13 border ps-11 shadow-none"
              />
            </FilterField>
            <SelectInputField
              id="pipeline-filter-country"
              label={t('country')}
              placeholder={t('select-country')}
              options={countryOptions}
              value={draft.country}
              onChange={(value) => updateDraft('country', value)}
              withSearchInput
              searchPlaceholder={t('search-countries')}
              hasNextPage={countryQuery.hasNextPage}
              isFetchingNextPage={countryQuery.isFetchingNextPage}
              onReachEnd={() => countryQuery.fetchNextPage()}
              className="border-border bg-card h-13 border"
            />
            <SelectInputField
              id="pipeline-filter-nationality"
              label={t('nationality')}
              placeholder={t('select-nationality')}
              options={nationalityOptions}
              value={draft.nationality}
              onChange={(value) => updateDraft('nationality', value)}
              className="border-border bg-card h-13 border"
            />
            <SelectInputField
              id="pipeline-filter-license"
              label={t('license-status')}
              placeholder={t('select-license-status')}
              options={licenseOptions}
              value={draft.medical_license}
              onChange={(value) => updateDraft('medical_license', value)}
              className="border-border bg-card h-13 border"
            />
            <SelectInputField
              id="pipeline-filter-recruiter"
              label={t('recruiter')}
              placeholder={t('select-recruiter')}
              options={recruiterOptions}
              value={draft.recruiter}
              onChange={(value) => updateDraft('recruiter', value)}
              className="border-border bg-card h-13 border"
            />
          </div>
          <label className="flex w-fit cursor-pointer items-center gap-3 font-semibold">
            <Checkbox
              checked={starred}
              onCheckedChange={(checked) => setStarred(checked === true)}
              aria-label={t('starred-only')}
              className="size-5 rounded-sm"
            />
            <Star aria-hidden className="text-warning size-4 fill-warning" />
            {t('starred-only')}
          </label>
        </section>

        <section className="flex flex-col gap-4 border-t border-border pt-5">
          <div>
            <h3 className="text-foreground text-base font-semibold">
              {t('ai-match-score')}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('score-description')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ScoreField
              id="pipeline-min-score"
              label={t('min-score')}
              placeholder={t('score-min-placeholder')}
              value={draft.min_score}
              onChange={(value) => updateDraft('min_score', value)}
            />
            <ScoreField
              id="pipeline-max-score"
              label={t('max-score')}
              placeholder={t('score-max-placeholder')}
              value={draft.max_score}
              onChange={(value) => updateDraft('max_score', value)}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4 border-t border-border pt-5">
          <h3 className="text-foreground text-base font-semibold">
            {t('assessment')}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectInputField
              id="pipeline-assessment-status"
              label={t('assessment-status')}
              placeholder={t('all-assessment-statuses')}
              options={statusOptions}
              value={draft.assessment_status}
              onChange={(value) => updateDraft('assessment_status', value)}
              className="border-border bg-card h-13 border"
            />
            <SelectInputField
              id="pipeline-assessment"
              label={t('assessment-name')}
              placeholder={t('all-assessments')}
              options={assessmentOptions}
              value={draft.assessment_id}
              onChange={(value) => updateDraft('assessment_id', value)}
              className="border-border bg-card h-13 border"
            />
            <ScoreField
              id="pipeline-min-assessment-score"
              label={t('min-assessment-score')}
              placeholder={t('assessment-min-placeholder')}
              value={draft.min_assessment_score}
              onChange={(value) => updateDraft('min_assessment_score', value)}
            />
            <ScoreField
              id="pipeline-max-assessment-score"
              label={t('max-assessment-score')}
              placeholder={t('assessment-max-placeholder')}
              value={draft.max_assessment_score}
              onChange={(value) => updateDraft('max_assessment_score', value)}
            />
          </div>
        </section>

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={resetAll}
            className="h-12 rounded-full px-7"
          >
            {t('reset-all')}
          </Button>
          <Button type="submit" className="h-12 rounded-full px-7">
            {t('apply')}
          </Button>
        </div>
      </form>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="px-1 text-sm font-semibold">{label}</span>
      {children}
    </div>
  );
}

function ScoreField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <InputField
      id={id}
      label={label}
      type="number"
      min={0}
      max={100}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="border-border bg-card h-13 border shadow-none"
    />
  );
}
