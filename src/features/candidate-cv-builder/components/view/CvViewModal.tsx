'use client';

import { CheckCheck, FileDown, PencilLine, X } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { downloadFile } from '@/shared/lib/download-file';
import { CV_BUILDER_ICONS, CV_BUILDER_SAMPLE_CV_URL } from '../../constants';
import { useCvDocument } from '../../hooks/useCvDocument';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import CandidateCvDocument from '../document/CandidateCvDocument';

type CvViewModalProps = {
  values: CvBuilderValues;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  /** Where "Apply" goes: the job being applied to, or the jobs list. */
  applyHref?: string;
};

const actionClassName = 'h-9.5 gap-2 rounded-full px-6 text-sm font-normal';

// Candidate's own CV view, mounted while open (shared CV document + Download / Edit / Apply).
export default function CvViewModal({
  values,
  onOpenChange,
  onEdit,
  applyHref = '/candidate/build-cv',
}: CvViewModalProps) {
  const t = useTranslations('candidatePage.buildCv.view');
  const cv = useCvDocument(values);

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-card flex max-h-[92dvh] w-[calc(100%-2rem)] max-w-256 flex-col gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-256"
      >
        <div className="bg-body-bg flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-5 sm:px-6 sm:py-8">
          <DialogHeader className="flex-row items-center justify-between gap-4 text-start">
            <DialogTitle className="text-foreground text-2xl font-semibold sm:text-[28px] sm:leading-9">
              {t('title')}
            </DialogTitle>
            <DialogDescription className="sr-only">{cv.name}</DialogDescription>
            <div className="flex items-center gap-4">
              <Image
                src={CV_BUILDER_ICONS.watermark}
                alt=""
                width={46}
                height={48}
                className="pointer-events-none"
              />
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label={t('close')}
                className="text-foreground hover:text-primary rounded-full transition-colors"
              >
                <X aria-hidden className="size-7" strokeWidth={1.5} />
              </button>
            </div>
          </DialogHeader>

          <CandidateCvDocument cv={cv} />

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              onClick={() =>
                downloadFile(CV_BUILDER_SAMPLE_CV_URL, `${cv.name}.pdf`)
              }
              className={`${actionClassName} bg-cv-builder-primary hover:bg-cv-builder-primary/90`}
            >
              <FileDown aria-hidden className="size-4" strokeWidth={1.5} />
              {t('download')}
            </Button>
            <Button
              type="button"
              onClick={onEdit}
              className={`${actionClassName} bg-cv-builder-edit hover:bg-cv-builder-edit/90 text-xs`}
            >
              <PencilLine aria-hidden className="size-4" strokeWidth={1.5} />
              {t('edit')}
            </Button>
            <Button
              asChild
              className={`${actionClassName} bg-secondary hover:bg-secondary/90 text-primary-foreground`}
            >
              <Link href={applyHref}>
                <CheckCheck aria-hidden className="size-4" strokeWidth={1.5} />
                {t('apply')}
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
