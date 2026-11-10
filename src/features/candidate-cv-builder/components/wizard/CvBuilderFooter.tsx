'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import type { CvBuilderWizard } from '../../hooks/useCvBuilderWizard';

type CvBuilderFooterProps = {
  wizard: CvBuilderWizard;
};

const buttonClassName = 'h-12.5 w-full font-semibold sm:w-56';

// Wizard actions: Save & Continue Later (or Delete Draft for a draft) / Prev / Next or Preview CV.
export default function CvBuilderFooter({ wizard }: CvBuilderFooterProps) {
  const t = useTranslations('candidatePage.buildCv.wizard');
  const isDraft = wizard.mode === 'draft';

  return (
    <footer className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="button"
        size="pill"
        variant={isDraft ? 'destructive' : 'default'}
        onClick={() => wizard.setModal(isDraft ? 'delete-draft' : 'saved')}
        className={
          isDraft
            ? buttonClassName
            : `${buttonClassName} bg-cv-builder-primary hover:bg-cv-builder-primary/90`
        }
      >
        {t(isDraft ? 'delete-draft' : 'save-later')}
      </Button>

      <div className="flex gap-4 sm:gap-7.5">
        {!wizard.isFirstStep && (
          <Button
            type="button"
            variant="outline"
            size="pill"
            onClick={wizard.prev}
            className={`${buttonClassName} max-sm:flex-1`}
          >
            {t('prev')}
          </Button>
        )}
        <Button
          type="button"
          size="pill"
          onClick={() => void wizard.next()}
          className={`${buttonClassName} bg-secondary hover:bg-secondary/90 max-sm:flex-1`}
        >
          {t(wizard.isLastStep ? 'preview-cv' : 'next')}
        </Button>
      </div>
    </footer>
  );
}
