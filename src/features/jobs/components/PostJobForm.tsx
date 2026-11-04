'use client';

import WizardProgress from '@/features/complete-account/components/wizard-progress';
import AlertModal from '@/shared/components/modals/AlertModal';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { typedZodResolver } from '@/shared/lib/typed-zod-resolver';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import type { Path } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import {
  JobFormData,
  jobFormDefaults,
  jobFormSchema,
  StepIndex,
  stepSchemas,
} from '../validation/job-post-schema';
import { usePostStepOne } from '../hooks/usePostStepOne';
import { usePostStepTwo } from '../hooks/usePostStepTwo';
import { usePostStepThree } from '../hooks/usePostStepThree';
import { useGetCompanyJob } from '../hooks/useGetCompanyJob';
import { useUpdateStepOne } from '../hooks/useUpdateStepOne';
import { useUpdateJob } from '../hooks/useUpdateJob';
import { JobStepOnePayload } from '../types/job-steps.types';
import { JobDetails } from '../types/jobs.types';
import JobPostStepOne from './JobPostStepOne';
import JobPostStepTwo from './JobPostStepTwo';
import JobReviewPanel from './JobReviewPanel';
import { useQueryClient } from '@tanstack/react-query';
import type { Option } from '@/shared/components/SelectInputField';
import { useTranslations } from 'next-intl';
import { OTHER_OPTION_VALUE } from '../constants';
import { categorySeeds } from '@/features/company-assessments/constants/assessment-data';
import { assessmentSeeds } from '@/features/company-assessments/constants/assessment-data';
import PostJobResultModals from './post-job/PostJobResultModals';

// ─── Form mode ──────────────────────────────────────────
// create  → fresh form, step-by-step, saves each step
// complete→ prefilled draft, step-by-step, saves each step
// edit    → prefilled published job, single-step, saves all at once
// ─────────────────────────────────────────────────────────
type FormMode = 'create' | 'complete' | 'edit';
type StepOneOptionKey = 'title' | 'country' | 'city';
type StepOneDisplayOptions = Partial<Record<StepOneOptionKey, Option>>;
type JobPreviewLabels = Partial<{
  title: string;
  employmentType: string;
  salaryType: string;
  currency: string;
  category: string;
  specialty: string;
  roleCategory: string;
  seniorityLevel: string;
  country: string;
  city: string;
  yearsOfExperience: string;
  educationLevel: string[];
  mandatoryCertifications: string[];
  availability: string;
  skills: string[];
}>;

const LAST_STEP = 2;
const CUSTOM_CERTIFICATION_PREFIX = '__custom__:';

function normalizeMandatoryCertificationValue(value: string) {
  return value.startsWith(CUSTOM_CERTIFICATION_PREFIX)
    ? value.slice(CUSTOM_CERTIFICATION_PREFIX.length)
    : Number(value);
}

function getJobFromMutationResponse(response: unknown): JobDetails | null {
  if (!response || typeof response !== 'object') return null;

  const responseRecord = response as { data?: unknown; job?: unknown };

  if (responseRecord.data && typeof responseRecord.data === 'object') {
    const nestedData = responseRecord.data as { job?: unknown; data?: unknown };

    if (nestedData.job && typeof nestedData.job === 'object') {
      return nestedData.job as JobDetails;
    }

    if (nestedData.data && typeof nestedData.data === 'object') {
      const deeperData = nestedData.data as { job?: unknown };
      if (deeperData.job && typeof deeperData.job === 'object') {
        return deeperData.job as JobDetails;
      }
    }
  }

  if (responseRecord.job && typeof responseRecord.job === 'object') {
    return responseRecord.job as JobDetails;
  }

  return null;
}

function toOptionalNumber(value: string | number | null | undefined) {
  if (value === '' || value == null) {
    return undefined;
  }

  const normalizedValue =
    typeof value === 'string' ? value.replace(/,/g, '').trim() : value;
  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function getJobStatus(job: JobDetails) {
  return job.status?.toLowerCase() ?? '';
}

// ─── Map API job → form defaults ────────────────────────
function mapJobToFormData(job: JobDetails): Partial<JobFormData> {
  const hasSalary = Boolean(job.has_salary);
  const customCategoryTitle =
    job.category_title?.trim() || job.category?.title || '';
  const customExperienceTitle =
    job.experience_title?.trim() || job.experience?.title || '';
  const customAvailabilityTitle =
    job.availability_title?.trim() || job.availability?.title || '';

  return {
    title: job.title ? OTHER_OPTION_VALUE : String(job.job_title_id ?? ''),
    otherJobTitle: job.title ?? '',
    category:
      job.category_id == null && customCategoryTitle
        ? OTHER_OPTION_VALUE
        : String(job.category_id ?? ''),
    otherCategoryTitle: job.category_id == null ? customCategoryTitle : '',
    license: job.professional_license ?? '',
    addSalary: hasSalary,
    assessmentEnabled: Boolean(job.assessment),
    assessmentSource: job.assessment
      ? (categorySeeds.find(
          (category) => category.id === String(job.assessment?.category_id),
        )?.source ?? '')
      : '',
    assessmentCategoryId: job.assessment
      ? String(job.assessment.category_id)
      : '',
    assessmentId: job.assessment ? String(job.assessment.id) : '',
    salary: hasSalary
      ? {
          min: toOptionalNumber(job.min_salary),
          max: toOptionalNumber(job.max_salary),
          type: String(job.salary_type_id ?? ''),
          currency: String(job.currency_id ?? ''),
        }
      : { min: undefined, max: undefined, type: '', currency: '' },
    specialty: String(job.specialty_title ?? ''),
    employmentType: String(job.employment_type_id ?? ''),
    roleCategory: String(job.role_category_id ?? ''),
    seniorityLevel: String(job.seniority_level_id ?? ''),
    country: String(job.country_id ?? ''),
    city: String(job.city_id ?? ''),
    yearsOfExperience:
      job.experience_id == null && customExperienceTitle
        ? OTHER_OPTION_VALUE
        : String(job.experience_id ?? ''),
    otherExperienceTitle:
      job.experience_id == null ? customExperienceTitle : '',
    educationLevel: (job.education_levels ?? []).map((item) => String(item.id)),
    mandatoryCertifications: (job.mandatory_certifications ?? [])
      .map((item) => {
        if (item.mandatory_certification_id != null) {
          return String(item.mandatory_certification_id);
        }

        if (item.title?.trim()) {
          return `${CUSTOM_CERTIFICATION_PREFIX}${item.title.trim()}`;
        }

        return null;
      })
      .filter((item): item is string => Boolean(item)),
    availability:
      job.availability_id == null && customAvailabilityTitle
        ? OTHER_OPTION_VALUE
        : String(job.availability_id ?? ''),
    otherAvailabilityTitle:
      job.availability_id == null ? customAvailabilityTitle : '',
    description: job.description ?? '',
    skills: (job.skills ?? []).map((s) => String(s.id)),
    screeningQuestions: job.screening_questions ?? [],
  };
}

export default function PostJobForm() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get('jobId'); // complete mode
  const editIdParam = searchParams.get('editId'); // edit mode

  const mode: FormMode = useMemo(() => {
    if (editIdParam) return 'edit';
    if (jobIdParam) return 'complete';
    return 'create';
  }, [editIdParam, jobIdParam]);

  const existingJobId = editIdParam ?? jobIdParam ?? null;
  const isEditMode = mode === 'edit';

  // ─── Fetch existing job data (complete / edit) ────────
  const { data: existingJob, isLoading: isLoadingJob } =
    useGetCompanyJob(existingJobId);

  // ─── State ─────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(jobIdParam ? 1 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<number | null>(null);
  const [reviewJob, setReviewJob] = useState<JobDetails | null>(null);
  const [formHydrated, setFormHydrated] = useState(false);
  const operationInProgress = useRef(false);
  const [stepOneDisplayOptions, setStepOneDisplayOptions] =
    useState<StepOneDisplayOptions>({});
  const [previewLabels, setPreviewLabels] = useState<JobPreviewLabels>({});

  const { data: session } = useSession();
  const token = session?.accessToken || '';
  const queryClient = useQueryClient();

  const steps = useMemo(
    () => [
      t('companyPage.postJob.steps.jobDetails'),
      t('companyPage.postJob.steps.jobDescriptionRequirements'),
      t('companyPage.postJob.steps.jobPreview'),
    ],
    [t],
  );

  // ─── Mutations ─────────────────────────────────────────
  const { mutateAsync: postStepOne, isPending: isPostingStepOne } =
    usePostStepOne({ token });
  const { mutateAsync: postStepTwo, isPending: isPostingStepTwo } =
    usePostStepTwo({ token });
  const { mutateAsync: postStepThree, isPending: isPostingStepThree } =
    usePostStepThree({ token });
  const { mutateAsync: updateStepOne, isPending: isUpdatingStepOne } =
    useUpdateStepOne({ token });
  const { mutateAsync: updateJob, isPending: isUpdatingJob } = useUpdateJob({
    token,
  });

  // ─── Modals ────────────────────────────────────────────
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [assessmentFitOpen, setAssessmentFitOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  // ─── Form ──────────────────────────────────────────────
  const methods = useForm<JobFormData>({
    resolver: typedZodResolver(jobFormSchema),
    defaultValues: jobFormDefaults,
    mode: 'onChange',
  });

  const { handleSubmit, trigger, getValues, reset, setError, watch } = methods;
  const previewFormData = watch();

  // ─── Hydrate form when existing job arrives ───────────
  useEffect(() => {
    if (existingJob && !formHydrated) {
      const mappedData = mapJobToFormData(existingJob);
      reset({ ...jobFormDefaults, ...mappedData } as JobFormData);
      setReviewJob(existingJob);
      setStepOneDisplayOptions({
        title: existingJob.title
          ? { label: existingJob.title, value: OTHER_OPTION_VALUE }
          : existingJob.job_title
            ? {
                label: existingJob.job_title.title,
                value: String(existingJob.job_title_id ?? ''),
              }
            : undefined,
        country: existingJob.country
          ? {
              label: existingJob.country.name,
              value: String(existingJob.country_id ?? ''),
            }
          : undefined,
        city: existingJob.city
          ? {
              label: existingJob.city.name,
              value: String(existingJob.city_id ?? ''),
            }
          : undefined,
      });
      setPreviewLabels({
        title: existingJob.title ?? existingJob.job_title?.title ?? '',
        employmentType: existingJob.employment_type?.title ?? '',
        salaryType: existingJob.salary_type?.title ?? '',
        currency: existingJob.currency?.code ?? '',
        category:
          existingJob.category_title ?? existingJob.category?.title ?? '',
        specialty:
          existingJob.specialty_title ?? existingJob.specialty?.title ?? '',
        roleCategory: existingJob.role_category?.title ?? '',
        seniorityLevel: existingJob.seniority_level?.title ?? '',
        country: existingJob.country?.name ?? '',
        city: existingJob.city?.name ?? '',
        yearsOfExperience:
          existingJob.experience_title ?? existingJob.experience?.title ?? '',
        educationLevel:
          existingJob.education_levels?.map((item) => item.title) ?? [],
        mandatoryCertifications:
          existingJob.mandatory_certifications?.map(
            (item) => item.title ?? item.mandatory_certification?.title ?? '-',
          ) ?? [],
        availability:
          existingJob.availability_title ??
          existingJob.availability?.title ??
          '',
        skills: existingJob.skills?.map((item) => item.title) ?? [],
      });

      // In complete mode, set the createdJobId so step-by-step flow works
      if (mode === 'complete') {
        setCreatedJobId(existingJob.id);
        const existingJobStatus = getJobStatus(existingJob);
        setCurrentStep(
          existingJobStatus === 'draft' || existingJobStatus === 'open' ? 1 : 0,
        );
      }

      setFormHydrated(true);
    }
  }, [existingJob, formHydrated, mode, reset]);

  const handleStepOneOptionChange = (
    key: StepOneOptionKey,
    option?: Option,
  ) => {
    setStepOneDisplayOptions((current) => ({
      ...current,
      [key]: option,
    }));
  };

  const handlePreviewLabelChange = (
    key: keyof JobPreviewLabels,
    value: string | string[],
  ) => {
    setPreviewLabels((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // ─── Helpers ───────────────────────────────────────────
  const resolveJobId = () => createdJobId ?? reviewJob?.id ?? null;

  const submitStepThreeStatus = async (status: 'draft' | 'open') => {
    const jobId = resolveJobId();
    if (!jobId) {
      throw new Error(
        'Job id is missing. Please complete previous steps first.',
      );
    }

    const stepThreeResponse = await postStepThree({
      jobId,
      payload: { status },
    });

    const nextReviewJob = getJobFromMutationResponse(stepThreeResponse.data);

    if (nextReviewJob) {
      setReviewJob(nextReviewJob);
    }
  };

  const persistStepTwo = async (data: JobFormData) => {
    const jobId = resolveJobId();
    if (!jobId)
      throw new Error('Job id is missing. Please complete step one first.');
    const response = await postStepTwo({
      jobId,
      payload: {
        description: data.description,
        skills: (data.skills ?? []).map(Number),
        screening_questions: data.screeningQuestions,
      },
    });
    const savedJob = getJobFromMutationResponse(response.data);
    if (savedJob) setReviewJob(savedJob);
  };

  const handleSaveDraft = async () => {
    if (operationInProgress.current || isBusy || postSuccess) return;
    operationInProgress.current = true;
    setIsSubmitting(true);
    try {
      const data = getValues();
      const contentChanged = [
        'description',
        'skills',
        'screeningQuestions',
      ].some(
        (field) => methods.getFieldState(field as keyof JobFormData).isDirty,
      );
      if (
        contentChanged ||
        data.description ||
        data.skills.length ||
        data.screeningQuestions.length
      ) {
        await persistStepTwo(data);
      }
      await submitStepThreeStatus('draft');
      setSaveSuccessOpen(true);
      void queryClient.invalidateQueries({ queryKey: ['company-jobs'] });
    } catch {
      // Mutation hooks display errors. Never show success if saving fails.
    } finally {
      operationInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  const buildStepOnePayload = (data: JobFormData): JobStepOnePayload => {
    const hasSalary: JobStepOnePayload['has_salary'] = data.addSalary ? 1 : 0;

    const basePayload: JobStepOnePayload = {
      job_title_id:
        data.title === OTHER_OPTION_VALUE ? undefined : Number(data.title),
      title:
        data.title === OTHER_OPTION_VALUE
          ? (data.otherJobTitle?.trim() ?? '')
          : undefined,
      professional_license: data.license,
      has_salary: hasSalary,
      assessment_id: data.assessmentEnabled ? data.assessmentId : null,
      category_id:
        data.category === OTHER_OPTION_VALUE
          ? undefined
          : Number(data.category),
      category_title:
        data.category === OTHER_OPTION_VALUE
          ? (data.otherCategoryTitle?.trim() ?? '')
          : undefined,
      specialty_title: data.specialty,
      employment_type_id: Number(data.employmentType),
      role_category_id: Number(data.roleCategory),
      seniority_level_id: Number(data.seniorityLevel || 0),
      country_id: Number(data.country),
      city_id: Number(data.city),
      experience_id:
        data.yearsOfExperience === OTHER_OPTION_VALUE
          ? undefined
          : Number(data.yearsOfExperience),
      experience_title:
        data.yearsOfExperience === OTHER_OPTION_VALUE
          ? (data.otherExperienceTitle?.trim() ?? '')
          : undefined,
      mandatory_certifications: (data.mandatoryCertifications ?? []).map(
        normalizeMandatoryCertificationValue,
      ),
      education_levels: (data.educationLevel ?? []).map((item) => Number(item)),
      availability_id:
        data.availability === OTHER_OPTION_VALUE
          ? undefined
          : Number(data.availability),
      availability_title:
        data.availability === OTHER_OPTION_VALUE
          ? (data.otherAvailabilityTitle?.trim() ?? '')
          : undefined,
    };

    if (!data.addSalary) {
      return basePayload;
    }

    return {
      ...basePayload,
      min_salary: toOptionalNumber(data.salary?.min),
      max_salary: toOptionalNumber(data.salary?.max),
      currency_id: toOptionalNumber(data.salary?.currency),
      salary_type_id: toOptionalNumber(data.salary?.type),
    };
  };

  const buildUpdatePayload = (data: JobFormData) => {
    const basePayload = {
      _method: 'put' as const,
      job_title_id:
        data.title === OTHER_OPTION_VALUE ? undefined : Number(data.title),
      title:
        data.title === OTHER_OPTION_VALUE
          ? (data.otherJobTitle?.trim() ?? '')
          : undefined,
      professional_license: data.license,
      has_salary: data.addSalary ? 1 : 0,
      assessment_id: data.assessmentEnabled ? data.assessmentId : null,
      category_id:
        data.category === OTHER_OPTION_VALUE
          ? undefined
          : Number(data.category),
      category_title:
        data.category === OTHER_OPTION_VALUE
          ? (data.otherCategoryTitle?.trim() ?? '')
          : undefined,
      specialty_title: data.specialty,
      employment_type_id: Number(data.employmentType),
      role_category_id: Number(data.roleCategory),
      seniority_level_id: Number(data.seniorityLevel || 0),
      country_id: Number(data.country),
      city_id: Number(data.city),
      experience_id:
        data.yearsOfExperience === OTHER_OPTION_VALUE
          ? undefined
          : Number(data.yearsOfExperience),
      experience_title:
        data.yearsOfExperience === OTHER_OPTION_VALUE
          ? (data.otherExperienceTitle?.trim() ?? '')
          : undefined,
      mandatory_certifications: (data.mandatoryCertifications ?? []).map(
        normalizeMandatoryCertificationValue,
      ),
      education_levels: (data.educationLevel ?? []).map((item) => Number(item)),
      availability_id:
        data.availability === OTHER_OPTION_VALUE
          ? undefined
          : Number(data.availability),
      availability_title:
        data.availability === OTHER_OPTION_VALUE
          ? (data.otherAvailabilityTitle?.trim() ?? '')
          : undefined,
      description: data.description,
      skills: (data.skills ?? []).map((skillId) => Number(skillId)),
      screening_questions: data.screeningQuestions,
      status: 'open',
    };

    if (!data.addSalary) {
      return basePayload;
    }

    return {
      ...basePayload,
      min_salary: toOptionalNumber(data.salary?.min),
      max_salary: toOptionalNumber(data.salary?.max),
      currency_id: toOptionalNumber(data.salary?.currency),
      salary_type_id: toOptionalNumber(data.salary?.type),
    };
  };

  // ─── Step-by-step "Next" ────────────────────────────────
  // Edit mode: validate → advance (no API calls)
  // Create/Complete mode: validate → call step API → advance
  // ──────────────────────────────────────────────────────────
  const runNext = async () => {
    if (
      currentStep >= LAST_STEP ||
      operationInProgress.current ||
      isBusy ||
      postSuccess
    )
      return;
    operationInProgress.current = true;
    setIsSubmitting(true);
    try {
      const fields = Object.keys(stepSchemas[currentStep as StepIndex].shape);
      if (currentStep === 0 && getValues().addSalary) {
        fields.push(
          'salary.min',
          'salary.max',
          'salary.type',
          'salary.currency',
        );
      }
      const valid = await trigger(fields as Parameters<typeof trigger>[0]);
      const result =
        stepSchemas[currentStep as StepIndex].safeParse(getValues());
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          if (path)
            setError(path as Path<JobFormData>, {
              type: 'manual',
              message: issue.message,
            });
        });
      }
      if (!valid || !result.success) return;
      if (isEditMode) {
        if (currentStep === 1) setReviewJob(existingJob ?? null);
      } else if (currentStep === 0) {
        const data = getValues();
        const jobId = resolveJobId();
        if (jobId) {
          const response = await updateStepOne({
            jobId,
            payload: buildStepOnePayload(data),
          });
          const savedJob = getJobFromMutationResponse(response.data);
          if (savedJob) setReviewJob(savedJob);
        } else {
          const response = await postStepOne(buildStepOnePayload(data));
          const savedJob = getJobFromMutationResponse(response.data);
          const id = Number(savedJob?.id);
          if (!id)
            throw new Error(
              'Unable to resolve created job id from step one response.',
            );
          setCreatedJobId(id);
          setReviewJob(savedJob);
        }
      } else {
        await persistStepTwo(getValues());
      }
      setCurrentStep((step) => Math.min(step + 1, LAST_STEP));
    } catch {
      // Mutation hooks display errors; stay on the current step.
    } finally {
      operationInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (operationInProgress.current || isBusy || postSuccess) return;
    const values = getValues();
    const assessmentChanged =
      String(existingJob?.assessment?.id ?? '') !==
      String(values.assessmentId ?? '');
    const selectedAssessment = assessmentSeeds.find(
      (assessment) => assessment.id === values.assessmentId,
    );
    if (
      currentStep === 0 &&
      values.assessmentEnabled &&
      selectedAssessment &&
      (mode !== 'edit' || assessmentChanged)
    ) {
      setAssessmentFitOpen(true);
      return;
    }
    void runNext();
  };

  const handleBack = () => {
    if (operationInProgress.current || isBusy || postSuccess) return;
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  // ─── Final submit for create/complete mode ────────────
  const onSubmitCreateOrComplete: SubmitHandler<JobFormData> = async () => {
    if (
      currentStep !== LAST_STEP ||
      operationInProgress.current ||
      isBusy ||
      postSuccess
    )
      return;
    operationInProgress.current = true;
    setIsSubmitting(true);
    try {
      await submitStepThreeStatus('open');
      setPostSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['company-jobs'] });
    } catch {
      // errors are already handled in mutation onError toast
    } finally {
      operationInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  // ─── Final submit for edit mode ───────────────────────
  const onSubmitEdit: SubmitHandler<JobFormData> = async (data) => {
    if (
      !existingJobId ||
      currentStep !== LAST_STEP ||
      operationInProgress.current ||
      isBusy ||
      postSuccess
    )
      return;
    operationInProgress.current = true;
    setIsSubmitting(true);
    try {
      const payload = buildUpdatePayload(data);
      await updateJob({ jobId: existingJobId, payload });
      setPostSuccess(true);
      queryClient.invalidateQueries({
        queryKey: ['company-job'],
      });
    } catch {
      // errors are already handled in mutation onError toast
    } finally {
      operationInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  // ─── Loading gate test ────────────────────
  if (mode === 'complete' && isLoadingJob) {
    return (
      <section className="h-min-dvh mx-auto max-w-255 py-12">
        <div className="flex h-full items-center justify-center rounded-2xl bg-white p-6">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="h-8 w-8 animate-spin text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <p className="text-muted-foreground">
              {t('companyPage.postJob.loadingJobData')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Pick the right submit handler based on mode
  const onSubmit = isEditMode ? onSubmitEdit : onSubmitCreateOrComplete;

  // Are we loading from any step API?
  const isBusy =
    isPostingStepOne ||
    isPostingStepTwo ||
    isPostingStepThree ||
    isUpdatingStepOne ||
    isUpdatingJob;
  const isStepOneEditLoading =
    isEditMode && currentStep === 0 && (isLoadingJob || !formHydrated);

  // ═══════════════════════════════════════════════════════
  //  UNIFIED WIZARD — same UI for create, complete & edit
  // ═══════════════════════════════════════════════════════
  return (
    <section className={cn('h-min-dvh mx-auto max-w-7xl py-12')}>
      <div className="h-full rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex max-sm:mb-6 max-sm:flex-col sm:gap-6">
          <WizardProgress step={currentStep} steps={steps} />
          {/* Save as Draft — hidden in edit mode */}
          {!isEditMode && currentStep !== 0 && (
            <Button
              variant="outline"
              size="pill"
              hoverStyle="slidePrimary"
              type="button"
              disabled={isSubmitting || isBusy || postSuccess}
              onClick={handleSaveDraft}
            >
              {t('companyPage.postJob.actions.saveAsDraft')}
            </Button>
          )}
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (
                event.target !== event.currentTarget ||
                currentStep !== LAST_STEP
              )
                return;
              void handleSubmit(onSubmit)(event);
            }}
            noValidate
          >
            <div className="min-h-80">
              {currentStep === 0 && (
                <JobPostStepOne
                  isLoading={isStepOneEditLoading}
                  persistedOptions={stepOneDisplayOptions}
                  onPersistOption={handleStepOneOptionChange}
                  onPreviewLabelChange={handlePreviewLabelChange}
                  existingJob={existingJob}
                />
              )}
              {currentStep === 1 && (
                <JobPostStepTwo
                  onPreviewLabelChange={handlePreviewLabelChange}
                  existingJob={existingJob}
                  aiPanelOpen={aiPanelOpen}
                  onAiPanelOpenChange={setAiPanelOpen}
                />
              )}
              {currentStep === 2 && (
                <JobReviewPanel
                  data={previewFormData as JobFormData}
                  job={reviewJob}
                  isEditMode={isEditMode}
                  previewLabels={previewLabels}
                />
              )}
            </div>

            <div className="mt-5 flex w-full items-center justify-center gap-6">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting || isBusy || postSuccess}
                  variant="outline"
                  hoverStyle="slidePrimary"
                  size="pill"
                  className="w-2/6 md:w-1/6"
                >
                  {t('companyPage.postJob.actions.prev')}
                </Button>
              )}

              {currentStep < LAST_STEP ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    isSubmitting ||
                    isBusy ||
                    isStepOneEditLoading ||
                    postSuccess
                  }
                  variant="secondary"
                  hoverStyle="slidePrimary"
                  size="pill"
                  className="w-2/6 md:w-1/6"
                >
                  {isBusy && !isEditMode
                    ? t('common.saving')
                    : t('companyPage.postJob.actions.next')}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleSubmit(onSubmit)()}
                  disabled={
                    isSubmitting ||
                    isBusy ||
                    isStepOneEditLoading ||
                    postSuccess
                  }
                  variant="secondary"
                  size="pill"
                  hoverStyle="slidePrimary"
                  className="w-3/6 md:w-1/6"
                >
                  {isSubmitting ? (
                    <>
                      {isEditMode
                        ? t('common.saving')
                        : t('companyPage.postJob.actions.posting')}
                    </>
                  ) : isEditMode ? (
                    t('companyPage.postJob.actions.saveChanges')
                  ) : (
                    t('companyPage.postJob.actions.confirmPostJob')
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>

      <AlertModal
        open={assessmentFitOpen}
        onOpenChange={setAssessmentFitOpen}
        title={t('companyPage.postJob.assessment.fit-title')}
        description={t('companyPage.postJob.assessment.fit-description', {
          title:
            assessmentSeeds.find(
              (assessment) => assessment.id === getValues('assessmentId'),
            )?.title ?? '',
          count:
            assessmentSeeds.find(
              (assessment) => assessment.id === getValues('assessmentId'),
            )?.questionCount ?? 0,
        })}
        confirmLabel={t('companyPage.postJob.assessment.fit-confirm')}
        cancelLabel={t('companyPage.postJob.assessment.fit-cancel')}
        onConfirm={() => {
          setAssessmentFitOpen(false);
          void runNext();
        }}
        onCancel={() => setAssessmentFitOpen(false)}
        isLoading={isSubmitting}
      />
      <PostJobResultModals
        savedOpen={saveSuccessOpen}
        onSavedOpenChange={setSaveSuccessOpen}
        publishedOpen={postSuccess}
        onPublishedOpenChange={setPostSuccess}
        isEditMode={isEditMode}
        jobId={resolveJobId() ?? existingJobId}
      />
    </section>
  );
}
