'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Accordion } from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { AI_JD_BUILDER_MODE } from '../constants';
import { JobDetails } from '../types/jobs.types';
import { JobFormData } from '../validation/job-post-schema';
import AiJdBuilderPanel from './post-job/ai-builder/AiJdBuilderPanel';
import AiJdBuilderModal from './post-job/AiJdBuilderModal';
import JobSkillsField from './post-job/JobSkillsField';
import ScreeningQuestionsSection from './post-job/ScreeningQuestionsSection';
import StepSectionCard from './post-job/StepSectionCard';

const CustomEditor = dynamic(() => import('./CustomEditor'), { ssr: true });

type JobPostStepTwoProps = {
  onPreviewLabelChange?: (key: 'skills', value: string[]) => void;
  existingJob?: JobDetails | null;
  // AI JD Builder panel is controlled by the wizard so it can widen the layout.
  aiPanelOpen?: boolean;
  onAiPanelOpenChange?: (open: boolean) => void;
};

// Step 2 "Requirements & Content" (Figma 10086:87426).
export default function JobPostStepTwo({
  onPreviewLabelChange,
  existingJob,
  aiPanelOpen = false,
  onAiPanelOpenChange,
}: JobPostStepTwoProps) {
  const t = useTranslations();
  const {
    control,
    formState: { errors },
  } = useFormContext<JobFormData>();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const isPanel = AI_JD_BUILDER_MODE === 'panel';
  const showPanel = isPanel && aiPanelOpen;
  const toggleAiBuilder = (open: boolean) =>
    isPanel ? onAiPanelOpenChange?.(open) : setComingSoonOpen(open);

  const translateError = (message?: string) => {
    if (!message) return undefined;
    try {
      return t(message as never);
    } catch {
      return message;
    }
  };

  return (
    <div
      className={
        showPanel
          ? 'grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_30.8rem]'
          : undefined
      }
    >
      <div className="flex min-w-0 flex-col gap-4">
        <Accordion
          type="multiple"
          defaultValue={['description']}
          className="flex flex-col gap-4"
        >
          <StepSectionCard
            value="description"
            title={t('companyPage.postJob.fields.jobDescription.label')}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="job-editor flex flex-col gap-4">
                  <CustomEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                  {errors.description?.message ? (
                    <p className="text-sm text-destructive">
                      {translateError(errors.description.message)}
                    </p>
                  ) : null}
                  <Button
                    type="button"
                    size="pill"
                    className="mx-auto gap-2"
                    onClick={() => toggleAiBuilder(true)}
                  >
                    <Sparkles aria-hidden="true" className="size-5" />
                    {t('companyPage.postJob.aiBuilder.button')}
                  </Button>
                </div>
              )}
            />
          </StepSectionCard>
          <StepSectionCard
            value="skills"
            title={t('companyPage.postJob.fields.skills.label')}
          >
            <JobSkillsField
              existingJob={existingJob}
              translateError={translateError}
              onLabelsChange={(labels) =>
                onPreviewLabelChange?.('skills', labels)
              }
            />
          </StepSectionCard>
        </Accordion>
        <ScreeningQuestionsSection />
      </div>
      {showPanel ? (
        <AiJdBuilderPanel onClose={() => toggleAiBuilder(false)} />
      ) : null}
      {isPanel ? null : (
        <AiJdBuilderModal
          open={comingSoonOpen}
          onOpenChange={setComingSoonOpen}
        />
      )}
    </div>
  );
}
