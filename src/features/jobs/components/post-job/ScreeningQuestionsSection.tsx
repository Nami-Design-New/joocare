'use client';

import { FileQuestion, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import { Accordion } from '@/shared/components/ui/accordion';
import {
  CUSTOM_SECTION,
  TEMPLATES_SECTION,
  useScreeningQuestions,
} from '../../hooks/useScreeningQuestions';
import QuestionTemplateChips from './QuestionTemplateChips';
import ScreeningQuestionCard from './ScreeningQuestionCard';
import ScreeningQuestionModal from './ScreeningQuestionModal';
import StepSectionCard from './StepSectionCard';
import TemplateQuestionPreview from './TemplateQuestionPreview';
import Image from 'next/image';

// Grey "Questions" group: Question Templates + Custom Question (Figma 10086:87426).
export default function ScreeningQuestionsSection() {
  const t = useTranslations('companyPage.postJob.questions');
  const tCommon = useTranslations('common');
  const state = useScreeningQuestions();
  const { questions } = state;

  return (
    <section className="bg-muted flex flex-col gap-4 rounded-2xl p-2">
      <h2 className="text-muted-foreground px-1 pt-2 text-xl font-semibold sm:text-[21px]">
        {t('title')}
      </h2>
      <Accordion
        type="multiple"
        value={state.openSections}
        onValueChange={state.setOpenSections}
        className="flex flex-col gap-4"
      >
        <StepSectionCard value={TEMPLATES_SECTION} title={t('templates-title')} mutedBody>
          <div className="flex flex-col gap-5">
            {state.previewTemplate ? (
              <TemplateQuestionPreview
                key={state.previewTemplate.id}
                templateId={state.previewTemplate.id}
                question={state.previewTemplate.question}
                onCancel={() => state.setPreviewTemplateId(null)}
                onAdd={state.addTemplate}
              />
            ) : null}
            <QuestionTemplateChips
              addedIds={state.addedTemplateIds}
              previewId={state.previewTemplateId}
              onSelect={state.setPreviewTemplateId}
            />
          </div>
        </StepSectionCard>

        <StepSectionCard value={CUSTOM_SECTION} title={t('custom-title')} mutedBody>
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-xs">{t('custom-subtitle')}</p>
            {questions.length ? (
              <>
                <p className="text-foreground text-sm font-semibold" aria-live="polite">
                  {t('count', { count: questions.length })}
                </p>
                <div className="flex flex-col gap-3">
                  {questions.map((question, index) => (
                    <ScreeningQuestionCard
                      key={question.id}
                      question={question}
                      number={index + 1}
                      isExpanded={state.expandedId === question.id}
                      isHighlighted={state.highlightedId === question.id}
                      onToggle={() => state.toggleExpanded(question.id)}
                      onDelete={() => state.setDeleteId(question.id)}
                      onSave={state.update}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
                <Image src="/assets/icons/files.svg" alt="" width={120} height={120} />
                <h3 className="text-secondary text-xl font-semibold">{t('empty-title')}</h3>
                <p className="text-muted-foreground max-w-xl">{t('empty-description')}</p>
                <p className="text-muted-foreground">{t('empty-optional')}</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => state.setBuilderOpen(true)}
              className="border-primary text-primary hover:bg-primary-bg flex h-11 w-full items-center justify-center gap-2 rounded-full border border-dashed text-sm font-semibold transition-colors"
            >
              <Plus aria-hidden="true" className="size-4" />
              {t('custom-button')}
            </button>
          </div>
        </StepSectionCard>
      </Accordion>

      <ScreeningQuestionModal
        open={state.builderOpen}
        onOpenChange={state.setBuilderOpen}
        onSubmit={state.addCustom}
      />
      <DeleteModal
        open={state.deleteId !== null}
        onOpenChange={(open) => !open && state.setDeleteId(null)}
        title={t('delete-title')}
        description={t('delete-description')}
        confirmLabel={t('delete-confirm')}
        cancelLabel={tCommon('cancel')}
        onConfirm={state.confirmDelete}
      />
    </section>
  );
}
